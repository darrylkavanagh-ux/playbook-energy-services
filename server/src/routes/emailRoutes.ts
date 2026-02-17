/**
 * EMAIL & REFERENCE CODE API ROUTES
 */

import { Router, Request, Response } from 'express';
import EmailBillProcessor from '../services/EmailBillProcessor';
import { query } from '../config/database';
import nodemailer from 'nodemailer';

const router = Router();

/**
 * POST /api/references/generate
 * Generate new reference code for customer
 */
router.post('/generate', async (req: Request, res: Response) => {
  try {
    const { customer_id, project_id, expires_in_days, customer_email, customer_name } = req.body;
    
    if (!customer_id || !project_id) {
      return res.status(400).json({ error: 'customer_id and project_id required' });
    }
    
    // Generate reference code
    const referenceCode = await EmailBillProcessor.generateReferenceCode(
      customer_id,
      project_id,
      expires_in_days
    );
    
    // Send email to customer with instructions
    if (customer_email) {
      await sendReferenceCodeEmail(customer_email, customer_name, referenceCode);
    }
    
    res.json({
      success: true,
      reference_code: referenceCode,
      instructions: `Email bills to: ${process.env.BILLS_EMAIL_ADDRESS}`,
      email_subject: `Include reference code: ${referenceCode} in subject or body`,
      expires_at: expires_in_days 
        ? new Date(Date.now() + expires_in_days * 24 * 60 * 60 * 1000)
        : null
    });
    
  } catch (error) {
    console.error('Generate reference error:', error);
    res.status(500).json({ error: 'Failed to generate reference code' });
  }
});

/**
 * GET /api/references/:code
 * Get reference code details
 */
router.get('/:code', async (req: Request, res: Response) => {
  try {
    const { code } = req.params;
    
    const result = await query(`
      SELECT 
        rc.*,
        c.name as customer_name,
        c.contact_email,
        ap.project_name,
        ap.status as project_status
      FROM reference_codes rc
      JOIN customers c ON c.id = rc.customer_id
      JOIN audit_projects ap ON ap.id = rc.project_id
      WHERE rc.code = $1
    `, [code]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Reference code not found' });
    }
    
    res.json(result.rows[0]);
    
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch reference code' });
  }
});

/**
 * GET /api/references/customer/:customerId
 * Get all reference codes for customer
 */
router.get('/customer/:customerId', async (req: Request, res: Response) => {
  try {
    const { customerId } = req.params;
    
    const codes = await EmailBillProcessor.getCustomerReferenceCodes(customerId);
    
    res.json({
      customer_id: customerId,
      total_codes: codes.length,
      codes
    });
    
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch customer reference codes' });
  }
});

/**
 * DELETE /api/references/:code
 * Deactivate reference code
 */
router.delete('/:code', async (req: Request, res: Response) => {
  try {
    const { code } = req.params;
    
    await EmailBillProcessor.deactivateReferenceCode(code);
    
    res.json({
      success: true,
      message: `Reference code ${code} deactivated`
    });
    
  } catch (error) {
    res.status(500).json({ error: 'Failed to deactivate reference code' });
  }
});

/**
 * GET /api/email-logs
 * Get email processing logs
 */
router.get('/logs', async (req: Request, res: Response) => {
  try {
    const { customer_id, project_id, limit = 50 } = req.query;
    
    let whereClause = '';
    const params: any[] = [];
    
    if (customer_id) {
      params.push(customer_id);
      whereClause = `WHERE customer_id = $${params.length}`;
    }
    
    if (project_id) {
      params.push(project_id);
      whereClause += whereClause ? ` AND project_id = $${params.length}` : `WHERE project_id = $${params.length}`;
    }
    
    params.push(limit);
    
    const result = await query(`
      SELECT 
        el.*,
        c.name as customer_name
      FROM email_logs el
      LEFT JOIN customers c ON c.id = el.customer_id
      ${whereClause}
      ORDER BY el.processed_at DESC
      LIMIT $${params.length}
    `, params);
    
    res.json({
      total: result.rows.length,
      logs: result.rows
    });
    
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch email logs' });
  }
});

/**
 * POST /api/email-monitor/start
 * Start email monitoring service
 */
router.post('/monitor/start', async (req: Request, res: Response) => {
  try {
    const { interval_minutes = 5 } = req.body;
    
    // Create email processor instance
    const emailConfig = {
      user: process.env.BILLS_EMAIL_ADDRESS || '',
      password: process.env.BILLS_EMAIL_PASSWORD || '',
      host: process.env.BILLS_EMAIL_IMAP_HOST || 'imap.gmail.com',
      port: parseInt(process.env.BILLS_EMAIL_IMAP_PORT || '993'),
      tls: true,
      tlsOptions: { rejectUnauthorized: false }
    };
    
    if (!emailConfig.user || !emailConfig.password) {
      return res.status(400).json({ 
        error: 'Email configuration not set. Configure BILLS_EMAIL_ADDRESS and BILLS_EMAIL_PASSWORD in .env' 
      });
    }
    
    const processor = new EmailBillProcessor(emailConfig);
    await processor.startMonitoring(interval_minutes);
    
    res.json({
      success: true,
      message: 'Email monitoring started',
      email: emailConfig.user,
      check_interval_minutes: interval_minutes
    });
    
  } catch (error) {
    console.error('Email monitor start error:', error);
    res.status(500).json({ error: `Failed to start email monitoring: ${error.message}` });
  }
});

/**
 * POST /api/email-monitor/check-now
 * Manually trigger inbox check
 */
router.post('/monitor/check-now', async (req: Request, res: Response) => {
  try {
    const emailConfig = {
      user: process.env.BILLS_EMAIL_ADDRESS || '',
      password: process.env.BILLS_EMAIL_PASSWORD || '',
      host: process.env.BILLS_EMAIL_IMAP_HOST || 'imap.gmail.com',
      port: parseInt(process.env.BILLS_EMAIL_IMAP_PORT || '993'),
      tls: true,
      tlsOptions: { rejectUnauthorized: false }
    };
    
    const processor = new EmailBillProcessor(emailConfig);
    await processor.checkInbox();
    
    res.json({
      success: true,
      message: 'Inbox check completed'
    });
    
  } catch (error) {
    res.status(500).json({ error: `Inbox check failed: ${error.message}` });
  }
});

/**
 * Helper: Send reference code email to customer
 */
async function sendReferenceCodeEmail(
  to: string,
  customerName: string,
  referenceCode: string
): Promise<void> {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD
      }
    });
    
    const billsEmail = process.env.BILLS_EMAIL_ADDRESS || 'bills@foxlite.ie';
    
    await transporter.sendMail({
      from: process.env.SMTP_FROM || 'noreply@foxlite.ie',
      to,
      subject: `Your FOXLITE Reference Code: ${referenceCode}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Welcome to FOXLITE Energy Audit</h2>
          <p>Dear ${customerName},</p>
          
          <p>Thank you for choosing FOXLITE for your utility audit. We've generated your unique reference code:</p>
          
          <div style="background-color: #FFD700; padding: 20px; text-align: center; font-size: 24px; font-weight: bold; margin: 20px 0;">
            ${referenceCode}
          </div>
          
          <h3>How to Send Your Bills:</h3>
          <ol>
            <li>Forward your energy bills to: <strong>${billsEmail}</strong></li>
            <li>Include your reference code <strong>${referenceCode}</strong> in the email subject or body</li>
            <li>Attach all bills as PDF or image files</li>
          </ol>
          
          <p><strong>Example Email Subject:</strong><br>
          "Energy Bills for Audit - Reference: ${referenceCode}"</p>
          
          <p>Our AI system will automatically process your bills and begin the audit within minutes of receiving them.</p>
          
          <p><strong>What happens next:</strong></p>
          <ul>
            <li>We'll extract data from all your bills automatically</li>
            <li>Our AI will analyze them for overcharges and errors</li>
            <li>You'll receive a detailed audit report within 48 hours</li>
            <li>We'll identify all potential savings and overcharges</li>
          </ul>
          
          <p>If you have any questions, please don't hesitate to contact us.</p>
          
          <p>Best regards,<br>
          <strong>FOXLITE Consulting Team</strong><br>
          Powered by VERITECH CORE - 12 AI Engines</p>
          
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #ccc;">
          <p style="font-size: 12px; color: #666;">
            This is an automated message. Please do not reply directly to this email.
          </p>
        </div>
      `
    });
    
    console.log(`✅ Reference code email sent to ${to}`);
    
  } catch (error) {
    console.error('Failed to send reference code email:', error);
    // Don't throw - email is optional
  }
}

export default router;
