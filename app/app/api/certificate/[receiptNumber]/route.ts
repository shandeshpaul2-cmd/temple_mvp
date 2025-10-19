import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET(
  request: NextRequest,
  { params }: { params: { receiptNumber: string } }
) {
  try {
    const { receiptNumber } = params

    // Search for certificate file with this receipt number
    const certificatesDir = path.join(process.cwd(), 'certificates', 'output')

    if (!fs.existsSync(certificatesDir)) {
      return NextResponse.json(
        { error: 'Certificate directory not found' },
        { status: 404 }
      )
    }

    // Find the certificate file
    const files = fs.readdirSync(certificatesDir)
    const certificateFile = files.find(file =>
      file.includes(`certificate_${receiptNumber}_`) && file.endsWith('.pdf')
    )

    if (!certificateFile) {
      return NextResponse.json(
        {
          error: 'Certificate not found',
          message: `No certificate found for receipt: ${receiptNumber}`,
          receiptNumber
        },
        { status: 404 }
      )
    }

    // Get the actual certificate URL
    const certificateUrl = `/api/certificates/download/${certificateFile}`

    // Create a simple HTML page with auto-download and manual download link
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Donation Certificate - ${receiptNumber}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 400px;
            margin: 50px auto;
            padding: 20px;
            text-align: center;
            background-color: #f5f5f5;
        }
        .card {
            background: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .success-icon {
            color: #22c55e;
            font-size: 48px;
            margin-bottom: 20px;
        }
        .download-btn {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 15px 30px;
            border: none;
            border-radius: 25px;
            font-size: 16px;
            cursor: pointer;
            margin: 20px 0;
            text-decoration: none;
            display: inline-block;
        }
        .download-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
        }
        .receipt-info {
            background: #f8f9fa;
            padding: 15px;
            border-radius: 8px;
            margin: 20px 0;
            border-left: 4px solid #667eea;
        }
        .auto-download {
            color: #666;
            font-size: 14px;
            margin-top: 10px;
        }
    </style>
</head>
<body>
    <div class="card">
        <div class="success-icon">📄</div>
        <h2>Your Donation Certificate is Ready!</h2>

        <div class="receipt-info">
            <strong>Receipt Number:</strong><br>
            ${receiptNumber}
        </div>

        <a href="${certificateUrl}" class="download-btn" download>
            📱 Download Certificate
        </a>

        <div class="auto-download">
            ⬇️ Your download should start automatically...
        </div>

        <div style="margin-top: 30px; font-size: 14px; color: #666;">
            <p><strong>Shri Raghavendra Swamy Brundavana Sannidhi</strong></p>
            <p>Service to Humanity is Service to God 🙏</p>
        </div>
    </div>

    <script>
        // Auto-download after 2 seconds
        setTimeout(() => {
            window.location.href = '${certificateUrl}';
        }, 2000);
    </script>
</body>
</html>`

    return new NextResponse(html, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
      },
    })

  } catch (error) {
    console.error('Error serving certificate:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}