/**
 * EMAIL BILL PROCESSING SERVICE
 * Monitors email inbox for bills sent by customers with reference codes
 */

import Imap from 'imap';
import { simpleParser, ParsedMail, Attachment } from 'mailparser';
import fs from 'fs/promises';
import path from 'path';
import { nanoid } from 'nanoid';
import { query } from '../config/database';

export interface EmailConfig {
  user: string;
  password: string;
  host: string;
  port: number;
  tls: boolean;
  tlsOptions?: {
    rejectUnauthorized: boolean;
  };
}

export interface ReferenceCode {
  code: string;
  customer_id: string;
  customer_name: string;
  project_id: string;
  active: boolean;
  created_at: Date;
  expires_at?: Date;
}

export interface ProcessedEmail {
  email_id: string;
  from: string;
  subject: string;
  reference_code?: string;
  customer_id?: string;
  attachments_count: number;
  processed_bills: string[];
  status: 'success' | 'error' | 'no_reference' | 'invalid_reference';
  error_message?: string;
  received_at: Date;
  processed_at: Date;
}

export class EmailBillProcessor {
  
  private imap: Imap | null = null;
  private isProcessing: boolean = false;
  private processInterval: NodeJS.Timeout | null = null;
  
  constructor(private config: EmailConfig) {}
  
  /**
   * Start monitoring inbox for new emails
   */
  async startMonitoring(intervalMinutes: number = 5): Promise<void> {
    console.log('📧 Starting email monitoring service...');
    console.log(`   Email: ${this.config.user}`);
    console.log(`   Check interval: ${intervalMinutes} minutes`);
    
    // Initial check
    await this.checkInbox();
    
    // Set up periodic checking
    this.processInterval = setInterval(async () => {
      await this.checkInbox();
    }, intervalMinutes * 60 * 1000);
    
    console.log('✅ Email monitoring started');
  }
  
  /**
   * Stop monitoring
   */
  stopMonitoring(): void {
    if (this.processInterval) {
      clearInterval(this.processInterval);
      this.processInterval = null;
    }
    if (this.imap) {
      this.imap.end();
      this.imap = null;
    }
    console.log('🛑 Email monitoring stopped');
  }
  
  /**
   * Check inbox for new emails
   */
  async checkInbox(): Promise<void> {
    if (this.isProcessing) {
      console.log('⏳ Already processing emails, skipping...');
      return;
    }
    
    this.isProcessing = true;
    
    try {
      console.log('📬 Checking inbox for new bills...');
      
      this.imap = new Imap(this.config);
      
      await new Promise<void>((resolve, reject) => {
        this.imap!.once('ready', () => {
          this.imap!.openBox('INBOX', false, async (err, box) => {
            if (err) {
              reject(err);
              return;
            }
            
            try {
              await this.processNewEmails(box);
              resolve();
            } catch (error) {
              reject(error);
            }
          });
        });
        
        this.imap!.once('error', (err) => {
          reject(err);
        });
        
        this.imap!.connect();
      });
      
    } catch (error) {
      console.error('❌ Email processing error:', error);
    } finally {
      if (this.imap) {
        this.imap.end();
        this.imap = null;
      }
      this.isProcessing = false;
    }
  }
  
  /**
   * Process new unread emails
   */
  private async processNewEmails(box: any): Promise<void> {
    return new Promise((resolve, reject) => {
      // Search for unseen emails
      this.imap!.search(['UNSEEN'], async (err, results) => {
        if (err) {
          reject(err);
          return;
        }
        
        if (!results || results.length === 0) {
          console.log('   No new emails found');
          resolve();
          return;
        }
        
        console.log(`   Found ${results.length} new emails`);
        
        const fetch = this.imap!.fetch(results, { bodies: '' });
        const processedEmails: ProcessedEmail[] = [];
        
        fetch.on('message', (msg, seqno) => {
          msg.on('body', async (stream, info) => {
            try {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const parsed = await simpleParser(stream as any) as ParsedMail;
              const processed = await this.processEmail(parsed, seqno);
              processedEmails.push(processed);
              
              // Mark as seen after processing
              this.imap!.addFlags(seqno, ['\\Seen'], (err) => {
                if (err) console.error('Failed to mark email as seen:', err);
              });
              
            } catch (error) {
              console.error(`Failed to process email ${seqno}:`, error);
            }
          });
        });
        
        fetch.once('error', (err) => {
          reject(err);
        });
        
        fetch.once('end', () => {
          console.log(`✅ Processed ${processedEmails.length} emails`);
          
          // Log summary
          processedEmails.forEach(email => {
            console.log(`   ${email.status.toUpperCase()}: ${email.from} - ${email.reference_code || 'No reference'} - ${email.attachments_count} attachments`);
          });
          
          resolve();
        });
      });
    });
  }
  
  /**
   * Process single email
   */
  private async processEmail(email: ParsedMail, seqno: number): Promise<ProcessedEmail> {
    const emailId = `EMAIL-${Date.now()}-${seqno}`;
    const from = email.from?.text || 'unknown';
    const subject = email.subject || '(no subject)';
    
    console.log(`\n📨 Processing email from: ${from}`);
    console.log(`   Subject: ${subject}`);
    
    try {
      // Extract reference code from subject or body
      const referenceCode = this.extractReferenceCode(email);
      
      if (!referenceCode) {
        console.log('   ⚠️ No reference code found');
        return {
          email_id: emailId,
          from,
          subject,
          attachments_count: email.attachments.length,
          processed_bills: [],
          status: 'no_reference',
          error_message: 'No reference code found in email',
          received_at: email.date || new Date(),
          processed_at: new Date()
        };
      }
      
      console.log(`   🔑 Reference code: ${referenceCode}`);
      
      // Validate reference code and get customer
      const reference = await this.validateReferenceCode(referenceCode);
      
      if (!reference) {
        console.log('   ❌ Invalid or expired reference code');
        return {
          email_id: emailId,
          from,
          subject,
          reference_code: referenceCode,
          attachments_count: email.attachments.length,
          processed_bills: [],
          status: 'invalid_reference',
          error_message: 'Reference code not found or expired',
          received_at: email.date || new Date(),
          processed_at: new Date()
        };
      }
      
      console.log(`   ✅ Customer: ${reference.customer_name}`);
      
      // Process PDF attachments
      const processedBills: string[] = [];
      
      if (email.attachments && email.attachments.length > 0) {
        console.log(`   📎 Processing ${email.attachments.length} attachments...`);
        
        for (const attachment of email.attachments) {
          if (this.isPDFOrImage(attachment)) {
            try {
              const savedPath = await this.saveAttachment(
                attachment, 
                reference.customer_id,
                reference.project_id
              );
              processedBills.push(savedPath);
              console.log(`      ✅ Saved: ${attachment.filename}`);
            } catch (error) {
              console.error(`      ❌ Failed to save: ${attachment.filename}`, error);
            }
          } else {
            console.log(`      ⏭️ Skipped: ${attachment.filename} (not PDF/image)`);
          }
        }
      }
      
      // Log email processing to database
      await this.logEmailProcessing(emailId, reference, from, subject, processedBills);
      
      // Trigger audit if we have bills
      if (processedBills.length > 0) {
        console.log(`   🚀 Triggering audit for ${processedBills.length} bills...`);
        await this.triggerAudit(reference.project_id, processedBills);
      }
      
      return {
        email_id: emailId,
        from,
        subject,
        reference_code: referenceCode,
        customer_id: reference.customer_id,
        attachments_count: email.attachments.length,
        processed_bills: processedBills,
        status: 'success',
        received_at: email.date || new Date(),
        processed_at: new Date()
      };
      
    } catch (error) {
      console.error('   ❌ Processing error:', error);
      return {
        email_id: emailId,
        from,
        subject,
        attachments_count: email.attachments?.length || 0,
        processed_bills: [],
        status: 'error',
        error_message: (error instanceof Error ? error.message : String(error)),
        received_at: email.date || new Date(),
        processed_at: new Date()
      };
    }
  }
  
  /**
   * Extract reference code from email
   * Format: REF-XXXXX or FOXLITE-XXXXX or AUDIT-XXXXX
   */
  private extractReferenceCode(email: ParsedMail): string | null {
    const text = `${email.subject || ''} ${email.text || ''}`;
    
    // Pattern: REF-XXXXX, FOXLITE-XXXXX, AUDIT-XXXXX, or FL-XXXXX
    const patterns = [
      /REF-([A-Z0-9]{8,})/i,
      /FOXLITE-([A-Z0-9]{8,})/i,
      /AUDIT-([A-Z0-9]{8,})/i,
      /FL-([A-Z0-9]{8,})/i,
      /Reference:\s*([A-Z0-9-]{8,})/i
    ];
    
    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match) {
        return match[0].toUpperCase();
      }
    }
    
    return null;
  }
  
  /**
   * Validate reference code against database
   */
  private async validateReferenceCode(code: string): Promise<ReferenceCode | null> {
    try {
      const result = await query(`
        SELECT 
          rc.code,
          rc.customer_id,
          c.name as customer_name,
          rc.project_id,
          rc.active,
          rc.created_at,
          rc.expires_at
        FROM reference_codes rc
        JOIN customers c ON c.id = rc.customer_id
        WHERE rc.code = $1
        AND rc.active = true
        AND (rc.expires_at IS NULL OR rc.expires_at > NOW())
      `, [code]);
      
      if (result.rows.length === 0) {
        return null;
      }
      
      return result.rows[0] as ReferenceCode;
      
    } catch (error) {
      console.error('Database error validating reference:', error);
      return null;
    }
  }
  
  /**
   * Check if attachment is PDF or image
   */
  private isPDFOrImage(attachment: Attachment): boolean {
    const contentType = attachment.contentType.toLowerCase();
    const filename = (attachment.filename || '').toLowerCase();
    
    return (
      contentType.includes('pdf') ||
      contentType.includes('image/jpeg') ||
      contentType.includes('image/jpg') ||
      contentType.includes('image/png') ||
      filename.endsWith('.pdf') ||
      filename.endsWith('.jpg') ||
      filename.endsWith('.jpeg') ||
      filename.endsWith('.png')
    );
  }
  
  /**
   * Save attachment to disk
   */
  private async saveAttachment(
    attachment: Attachment, 
    customerId: string, 
    projectId: string
  ): Promise<string> {
    const uploadDir = process.env.UPLOAD_DIR || './uploads';
    const customerDir = path.join(uploadDir, customerId, projectId);
    
    // Create directory if it doesn't exist
    await fs.mkdir(customerDir, { recursive: true });
    
    // Generate unique filename
    const timestamp = Date.now();
    const randomId = nanoid(8);
    const extension = path.extname(attachment.filename || '.pdf');
    const filename = `bill-${timestamp}-${randomId}${extension}`;
    const filepath = path.join(customerDir, filename);
    
    // Save file
    await fs.writeFile(filepath, attachment.content);
    
    return filepath;
  }
  
  /**
   * Log email processing to database
   */
  private async logEmailProcessing(
    emailId: string,
    reference: ReferenceCode,
    from: string,
    subject: string,
    processedBills: string[]
  ): Promise<void> {
    try {
      await query(`
        INSERT INTO email_logs (
          email_id,
          customer_id,
          project_id,
          reference_code,
          from_email,
          subject,
          attachments_count,
          processed_bills,
          processed_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())
      `, [
        emailId,
        reference.customer_id,
        reference.project_id,
        reference.code,
        from,
        subject,
        processedBills.length,
        JSON.stringify(processedBills)
      ]);
    } catch (error) {
      console.error('Failed to log email processing:', error);
    }
  }
  
  /**
   * Trigger audit process for newly uploaded bills
   */
  private async triggerAudit(projectId: string, billFiles: string[]): Promise<void> {
    try {
      // Update audit project with new bills
      await query(`
        UPDATE audit_projects
        SET 
          total_bills_analyzed = total_bills_analyzed + $1,
          updated_at = NOW()
        WHERE id = $2
      `, [billFiles.length, projectId]);
      
      // TODO: Trigger actual audit processing (queue job)
      console.log(`   ✅ Audit triggered for project ${projectId}`);
      
    } catch (error) {
      console.error('Failed to trigger audit:', error);
    }
  }
  
  /**
   * Generate new reference code for customer
   */
  static async generateReferenceCode(
    customerId: string,
    projectId: string,
    expiresInDays?: number
  ): Promise<string> {
    // Format: FOXLITE-{RANDOM8}
    const randomPart = nanoid(8).toUpperCase();
    const code = `FOXLITE-${randomPart}`;
    
    const expiresAt = expiresInDays 
      ? new Date(Date.now() + expiresInDays * 24 * 60 * 60 * 1000)
      : null;
    
    try {
      await query(`
        INSERT INTO reference_codes (
          code,
          customer_id,
          project_id,
          active,
          expires_at,
          created_at
        ) VALUES ($1, $2, $3, true, $4, NOW())
      `, [code, customerId, projectId, expiresAt]);
      
      return code;
      
    } catch (error) {
      console.error('Failed to generate reference code:', error);
      throw new Error('Could not generate reference code');
    }
  }
  
  /**
   * Deactivate reference code
   */
  static async deactivateReferenceCode(code: string): Promise<void> {
    await query(`
      UPDATE reference_codes
      SET active = false, updated_at = NOW()
      WHERE code = $1
    `, [code]);
  }
  
  /**
   * Get all active reference codes for customer
   */
  static async getCustomerReferenceCodes(customerId: string): Promise<ReferenceCode[]> {
    const result = await query(`
      SELECT 
        rc.code,
        rc.customer_id,
        c.name as customer_name,
        rc.project_id,
        rc.active,
        rc.created_at,
        rc.expires_at
      FROM reference_codes rc
      JOIN customers c ON c.id = rc.customer_id
      WHERE rc.customer_id = $1
      AND rc.active = true
      ORDER BY rc.created_at DESC
    `, [customerId]);
    
    return result.rows as ReferenceCode[];
  }
}

export default EmailBillProcessor;
