const express = require('express')
const path = require('path')
const fs = require('fs')
const cors = require('cors')

const app = express()
const PORT = 3011

// Middleware
app.use(cors())
app.use(express.static('public'))
app.use('/certificates', express.static('certificates'))

// Certificate serving endpoint
app.get('/certificate/:receiptNumber', (req, res) => {
  const { receiptNumber } = req.params
  const certificatePath = path.join(__dirname, 'certificates', `${receiptNumber}.pdf`)

  if (fs.existsSync(certificatePath)) {
    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', `inline; filename="certificate-${receiptNumber}.pdf"`)
    res.sendFile(certificatePath)
  } else {
    res.status(404).json({
      error: 'Certificate not found',
      message: `Certificate for receipt ${receiptNumber} is not available yet. Please contact the temple office.`
    })
  }
})

// Certificate info endpoint
app.get('/api/certificate/:receiptNumber', (req, res) => {
  const { receiptNumber } = req.params
  const certificatePath = path.join(__dirname, 'certificates', `${receiptNumber}.pdf`)

  if (fs.existsSync(certificatePath)) {
    res.json({
      success: true,
      receiptNumber,
      downloadUrl: `http://106.51.129.224:${PORT}/certificate/${receiptNumber}`,
      viewUrl: `http://106.51.129.224:${PORT}/certificate/${receiptNumber}`,
      available: true
    })
  } else {
    res.json({
      success: false,
      receiptNumber,
      available: false,
      message: 'Certificate not found'
    })
  }
})

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'PDF Certificate Service',
    port: PORT,
    timestamp: new Date().toISOString()
  })
})

// Create certificates directory if it doesn't exist
const certificatesDir = path.join(__dirname, 'certificates')
if (!fs.existsSync(certificatesDir)) {
  fs.mkdirSync(certificatesDir, { recursive: true })
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`📜 PDF Certificate Service running on http://0.0.0.0:${PORT}`)
  console.log(`🔗 Certificate URL pattern: http://106.51.129.224:${PORT}/certificate/{receiptNumber}`)
  console.log(`📁 Serving certificates from: ${certificatesDir}`)
  console.log(`✅ Health check: http://106.51.129.224:${PORT}/health`)
})