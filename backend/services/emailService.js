const https = require('https')

const sendNotificationEmail = ({ subject, text, html }) => {
  const apiKey = process.env.RESEND_API_KEY
  const from = process.env.EMAIL_FROM
  const to = process.env.ENQUIRY_NOTIFICATION_EMAIL

  if (!apiKey || !from || !to) {
    console.warn('Email notification skipped: Resend environment settings are incomplete.')
    return Promise.resolve({ sent: false, reason: 'Email settings are incomplete.' })
  }

  const payload = JSON.stringify({ from, to: [to], subject, text, html })

  return new Promise((resolve, reject) => {
    const request = https.request({
      hostname: 'api.resend.com',
      path: '/emails',
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload),
      },
    }, (response) => {
      let body = ''
      response.setEncoding('utf8')
      response.on('data', (chunk) => { body += chunk })
      response.on('end', () => {
        let result = {}
        try { result = body ? JSON.parse(body) : {} } catch (_) {}
        if (response.statusCode >= 200 && response.statusCode < 300) {
          resolve({ sent: true, id: result.id })
        } else {
          reject(new Error(result.message || `Resend returned HTTP ${response.statusCode}`))
        }
      })
    })

    request.on('error', reject)
    request.setTimeout(15000, () => request.destroy(new Error('Resend request timed out.')))
    request.write(payload)
    request.end()
  })
}

module.exports = { sendNotificationEmail }
