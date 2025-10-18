import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';

const execAsync = promisify(exec);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields for new exact generator
    const requiredFields = ['donor_name', 'amount', 'donation_id', 'donation_date'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Prepare certificate data for new exact generator
    const certificateData = {
      donor_name: body.donor_name,
      amount: body.amount,
      donation_id: body.donation_id,
      donation_date: body.donation_date,
      reason_text: body.reason_text || "for their valued contribution"
    };

    // Generate filename
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    const filename = `certificate_${certificateData.donation_id}_${timestamp}.pdf`;

    // Get paths - Next.js runs from app/, certificates are in the same directory
    const projectRoot = process.cwd();
    const certScript = path.join(projectRoot, 'certificates', 'lib', 'certificate_generator.py');
    const htmlTemplate = path.join(projectRoot, 'certificates', 'templates', 'donation_certificate_temple_v18.html');
    const outputPath = path.join(projectRoot, 'certificates', 'output', filename);


    // Build Python command for new exact generator
    const pythonCmd = `python3 "${certScript}" \
      --html "${htmlTemplate}" \
      --out "${outputPath}" \
      --name "${certificateData.donor_name}" \
      --amount "${certificateData.amount}" \
      --id "${certificateData.donation_id}" \
      --date "${certificateData.donation_date}" \
      --reason "${certificateData.reason_text}"`;

    try {
      // Execute Python certificate generation
      const { stdout, stderr } = await execAsync(pythonCmd);

      if (stderr && !stderr.includes('✅')) {
        console.error('Certificate generation stderr:', stderr);
      }

      // Check if file was created
      const fs = require('fs');
      if (!fs.existsSync(outputPath)) {
        throw new Error('Certificate file was not generated');
      }

      // Return success response with download URL
      return NextResponse.json({
        success: true,
        filename: filename,
        download_url: `/api/certificates/download/${filename}`,
        message: 'Certificate generated successfully'
      });

    } catch (pythonError) {
      console.error('Python certificate generation error:', pythonError);
      return NextResponse.json(
        {
          error: 'Certificate generation failed',
          details: pythonError instanceof Error ? pythonError.message : 'Python script error'
        },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Certificate generation error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  // Health check endpoint
  try {
    const projectRoot = process.cwd();
    const certScript = path.join(projectRoot, 'certificates', 'lib', 'certificate_generator.py');
    const templateDir = path.join(projectRoot, 'certificates', 'templates');

    // Check if required files exist
    const fs = require('fs');
    if (!fs.existsSync(certScript)) {
      return NextResponse.json(
        {
          status: 'unhealthy',
          service: 'certificate-api',
          error: 'Certificate generator script not found'
        },
        { status: 503 }
      );
    }

    if (!fs.existsSync(templateDir)) {
      return NextResponse.json(
        {
          status: 'unhealthy',
          service: 'certificate-api',
          error: 'Certificate templates directory not found'
        },
        { status: 503 }
      );
    }

    return NextResponse.json({
      status: 'healthy',
      service: 'certificate-api',
      message: 'Certificate generation service is ready'
    });

  } catch (error) {
    return NextResponse.json(
      {
        status: 'unhealthy',
        service: 'certificate-api',
        error: error instanceof Error ? error.message : 'Health check failed'
      },
      { status: 503 }
    );
  }
}
