import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

export async function POST(request: NextRequest) {
  try {
    const { firstName, lastName, email, phone, subject, message } = await request.json()

    // Validate required fields
    if (!firstName || !lastName || !email || !phone || !subject || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    // Create transporter using SMTP with improved configuration
    const createTransporter = (config: any) => {
      return nodemailer.createTransport({
        ...config,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
        tls: {
          rejectUnauthorized: false
        },
        connectionTimeout: 20000, // 20 seconds
        greetingTimeout: 10000, // 10 seconds
        socketTimeout: 20000, // 20 seconds
      })
    }

    // Primary SMTP configuration (Hostinger)
    const primaryConfig = {
      host: process.env.SMTP_HOST || 'mail.hostinger.com',
      port: parseInt(process.env.SMTP_PORT || '465'),
      secure: parseInt(process.env.SMTP_PORT || '465') === 465,
    }

    // Fallback SMTP configuration (Gmail)
    const fallbackConfig = {
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
    }

    let transporter = createTransporter(primaryConfig)

    // Email to recipient (info@humsafarforeverlove.com)
    const recipientMailOptions = {
      from: process.env.SMTP_USER,
      to: 'info@humsafarforeverlove.com',
      subject: `New Contact Form Submission: ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
          <div style="background: linear-gradient(135deg, #8B5CF6, #A855F7); padding: 20px; border-radius: 10px 10px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px;">New Contact Form Submission</h1>
            <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">Humsafar Forever Love</p>
          </div>
          
          <div style="padding: 30px; background: #f9f9f9;">
            <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <h2 style="color: #333; margin: 0 0 20px 0; font-size: 18px; border-bottom: 2px solid #8B5CF6; padding-bottom: 10px;">Contact Information</h2>
              
              <div style="margin-bottom: 15px;">
                <strong style="color: #8B5CF6;">Name:</strong>
                <span style="margin-left: 10px; color: #333;">${firstName} ${lastName}</span>
              </div>
              
              <div style="margin-bottom: 15px;">
                <strong style="color: #8B5CF6;">Email:</strong>
                <span style="margin-left: 10px; color: #333;">${email}</span>
              </div>
              
              <div style="margin-bottom: 15px;">
                <strong style="color: #8B5CF6;">Phone:</strong>
                <span style="margin-left: 10px; color: #333;">${phone}</span>
              </div>
              
              <div style="margin-bottom: 15px;">
                <strong style="color: #8B5CF6;">Subject:</strong>
                <span style="margin-left: 10px; color: #333;">${subject}</span>
              </div>
            </div>
            
            <div style="background: white; padding: 20px; border-radius: 8px;">
              <h2 style="color: #333; margin: 0 0 15px 0; font-size: 18px; border-bottom: 2px solid #8B5CF6; padding-bottom: 10px;">Message</h2>
              <div style="background: #f8f9fa; padding: 15px; border-radius: 6px; border-left: 4px solid #8B5CF6;">
                <p style="margin: 0; color: #333; line-height: 1.6;">${message.replace(/\n/g, '<br>')}</p>
              </div>
            </div>
          </div>
          
          <div style="background: #8B5CF6; padding: 15px; border-radius: 0 0 10px 10px; text-align: center;">
            <p style="color: white; margin: 0; font-size: 14px; opacity: 0.9;">This email was sent from the Humsafar Forever Love contact form</p>
            <p style="color: white; margin: 5px 0 0 0; font-size: 12px; opacity: 0.7;">Please respond to the customer at: ${email}</p>
          </div>
        </div>
      `,
    }

    // Confirmation email to sender
    const senderMailOptions = {
      from: process.env.SMTP_USER,
      to: email,
      subject: 'Thank you for contacting Humsafar Forever Love',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
          <div style="background: linear-gradient(135deg, #8B5CF6, #A855F7); padding: 20px; border-radius: 10px 10px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px;">Thank You for Contacting Us!</h1>
            <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">Humsafar Forever Love</p>
          </div>
          
          <div style="padding: 30px; background: #f9f9f9;">
            <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <h2 style="color: #333; margin: 0 0 20px 0; font-size: 18px;">Dear ${firstName} ${lastName},</h2>
              
              <p style="color: #333; line-height: 1.6; margin-bottom: 15px;">Thank you for reaching out to us! We have received your message and our team will get back to you within 24-48 hours.</p>
              
              <div style="background: #f8f9fa; padding: 15px; border-radius: 6px; border-left: 4px solid #8B5CF6; margin: 20px 0;">
                <h3 style="color: #8B5CF6; margin: 0 0 10px 0; font-size: 16px;">Your Message Summary:</h3>
                <p style="margin: 5px 0; color: #333;"><strong>Subject:</strong> ${subject}</p>
                <p style="margin: 5px 0; color: #333;"><strong>Message:</strong> ${message}</p>
              </div>
              
              <p style="color: #333; line-height: 1.6; margin-bottom: 15px;">In the meantime, feel free to explore our website to learn more about our matchmaking services and success stories.</p>
              
              <p style="color: #333; line-height: 1.6;">Best regards,<br>The Humsafar Forever Love Team</p>
            </div>
          </div>
          
          <div style="background: #8B5CF6; padding: 15px; border-radius: 0 0 10px 10px; text-align: center;">
            <p style="color: white; margin: 0; font-size: 14px; opacity: 0.9;">Humsafar Forever Love - Your Journey to Forever Starts Here</p>
            <p style="color: white; margin: 5px 0 0 0; font-size: 12px; opacity: 0.7;">Visit us at: humsafarforeverlove.com</p>
          </div>
        </div>
      `,
    }

    // Function to send emails with fallback
    const sendEmailsWithFallback = async () => {
      let lastError = null
      
      // Try primary transporter first
      try {
        console.log('Verifying primary SMTP connection...')
        await transporter.verify()
        console.log('Primary SMTP connection verified successfully')
        
        console.log('Sending emails with primary transporter...')
        const recipientResult = await transporter.sendMail(recipientMailOptions)
        const senderResult = await transporter.sendMail(senderMailOptions)
        
        console.log('Both emails sent successfully with primary transporter')
        return { recipientResult, senderResult }
      } catch (error) {
        console.log('Primary transporter failed:', error)
        lastError = error
        
        // Try fallback transporter
        try {
          console.log('Trying fallback SMTP configuration...')
          transporter = createTransporter(fallbackConfig)
          
          await transporter.verify()
          console.log('Fallback SMTP connection verified successfully')
          
          console.log('Sending emails with fallback transporter...')
          const recipientResult = await transporter.sendMail(recipientMailOptions)
          const senderResult = await transporter.sendMail(senderMailOptions)
          
          console.log('Both emails sent successfully with fallback transporter')
          return { recipientResult, senderResult }
        } catch (fallbackError) {
          console.log('Fallback transporter also failed:', fallbackError)
          throw fallbackError
        }
      }
    }

    // Send emails with fallback mechanism
    const { recipientResult, senderResult } = await sendEmailsWithFallback()

    return NextResponse.json(
      { 
        message: 'Emails sent successfully', 
        recipientMessageId: recipientResult.messageId,
        senderMessageId: senderResult.messageId
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error sending email:', error)
    return NextResponse.json(
      { error: 'Failed to send email', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}