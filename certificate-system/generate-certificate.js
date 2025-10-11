const fs = require('fs').promises;
const path = require('path');
const puppeteer = require('puppeteer');

/**
 * Generate a donation certificate PDF
 * @param {Object} donationData - The donation details
 * @returns {Promise<string>} Path to generated PDF
 */
async function generateCertificate(donationData) {
    try {
        console.log('📜 Generating certificate...');

        // Read the HTML template
        const templatePath = path.join(__dirname, 'certificate-template.html');
        let template = await fs.readFile(templatePath, 'utf8');

        // Format amount with Indian number formatting
        const formattedAmount = new Intl.NumberFormat('en-IN', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(donationData.amount);

        // Format date
        const dateObj = new Date(donationData.date);
        const formattedDate = dateObj.toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });

        // Replace all placeholders
        const replacements = {
            '{{TEMPLE_NAME}}': donationData.templeName || 'Shri Ram Mandir',
            '{{TEMPLE_ADDRESS}}': donationData.templeAddress || 'Sacred Place of Worship',
            '{{DEITY_NAME}}': donationData.deityName || 'Lord Ram',
            '{{DONOR_NAME}}': donationData.donorName,
            '{{RECEIPT_NUMBER}}': donationData.receiptNumber,
            '{{AMOUNT}}': formattedAmount,
            '{{DATE}}': formattedDate,
            '{{PAYMENT_MODE}}': donationData.paymentMode,
            '{{TRANSACTION_ID}}': donationData.transactionId,
            '{{PHONE}}': donationData.templePhone || '+91 93031 66287',
            '{{EMAIL}}': donationData.templeEmail || 'info@temple.org',
            '{{WEBSITE}}': donationData.templeWebsite || 'www.temple.org',
            '{{FULL_ADDRESS}}': donationData.fullAddress || 'Temple Address, City, State - PIN'
        };

        // Replace all placeholders in template
        Object.keys(replacements).forEach(key => {
            template = template.replace(new RegExp(key, 'g'), replacements[key]);
        });

        // Launch Puppeteer
        console.log('🚀 Launching browser...');
        const browser = await puppeteer.launch({
            headless: 'new',
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });

        const page = await browser.newPage();

        // Set content
        await page.setContent(template, {
            waitUntil: 'networkidle0'
        });

        // Generate PDF
        console.log('📄 Generating PDF...');
        const pdfBuffer = await page.pdf({
            format: 'A4',
            printBackground: true,
            margin: {
                top: '0mm',
                right: '0mm',
                bottom: '0mm',
                left: '0mm'
            }
        });

        await browser.close();

        // Save PDF
        const fileName = `certificate_${donationData.receiptNumber.replace(/\//g, '_')}.pdf`;
        const outputPath = path.join(__dirname, 'certificates', fileName);

        // Create certificates directory if it doesn't exist
        await fs.mkdir(path.join(__dirname, 'certificates'), { recursive: true });

        await fs.writeFile(outputPath, pdfBuffer);

        console.log('✅ Certificate generated successfully!');
        console.log('📁 Saved to:', outputPath);

        return outputPath;

    } catch (error) {
        console.error('❌ Error generating certificate:', error);
        throw error;
    }
}

/**
 * Example usage - Generate a sample certificate
 */
async function generateSampleCertificate() {
    const sampleData = {
        // Donor Information
        donorName: 'Ramesh Kumar Sharma',

        // Donation Details
        amount: 5000.00,
        receiptNumber: 'TMPL/FY/2024-25/00123',
        date: new Date('2025-10-11'),
        paymentMode: 'UPI Payment',
        transactionId: 'razorpay_ABC123XYZ456',

        // Temple Information
        templeName: 'Shri Ram Mandir',
        templeAddress: 'Sacred Place of Worship',
        deityName: 'Lord Ram',
        templePhone: '+91 93031 66287',
        templeEmail: 'contact@rammandir.org',
        templeWebsite: 'www.rammandir.org',
        fullAddress: 'Ram Janmabhoomi, Ayodhya, Uttar Pradesh - 224123'
    };

    const pdfPath = await generateCertificate(sampleData);
    console.log('\n🎉 Sample certificate created!');
    console.log('You can view it at:', pdfPath);
}

// If running directly, generate sample
if (require.main === module) {
    generateSampleCertificate()
        .then(() => {
            console.log('\n✨ Done!');
            process.exit(0);
        })
        .catch(error => {
            console.error('Error:', error);
            process.exit(1);
        });
}

module.exports = { generateCertificate };
