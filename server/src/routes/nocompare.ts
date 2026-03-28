/**
 * NO COMPARE API ROUTES
 * Endpoints for NO COMPARE domestic energy comparison platform
 */

import express, { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import { nanoid } from 'nanoid';
import { query } from '../config/database';
import { OCRExtractionEngine } from '../engines/OCRExtractionEngine';
import { TariffOptimizer } from '../engines/TariffOptimizer';

// Instantiate engines
const ocrExtractionEngine = new OCRExtractionEngine();
const tariffOptimizer = new TariffOptimizer();

const router = express.Router();

// Configure file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, process.env.UPLOAD_DIR || './uploads');
  },
  filename: (req, file, cb) => {
    const uniqueId = nanoid(8);
    const timestamp = Date.now();
    const ext = path.extname(file.originalname);
    cb(null, `nocompare-${timestamp}-${uniqueId}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['application/pdf', 'image/png', 'image/jpeg'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF, PNG, and JPEG are allowed.'));
    }
  },
});


/**
 * POST /api/nocompare/upload
 * Upload single energy bill for comparison
 */
router.post('/upload', upload.single('bill'), async (req: Request, res: Response) => {
  try {
    const file = req.file;
    const { user_email } = req.body;

    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Extract bill data
    console.log(`📄 Extracting data from ${file.filename}...`);
    const extracted = await ocrExtractionEngine.extractBillData(file.path);

    // Create comparison ID
    const comparisonId = `CMP-${Date.now()}-${nanoid(8)}`;

    // Store in database (optional)
    if (user_email) {
      await query(`
        INSERT INTO bills (
          id, customer_id, supplier, account_number,
          bill_date, kwh_consumption, total_amount,
          tariff_type, standing_charge_monthly,
          created_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW())
      `, [
        comparisonId,
        user_email,
        (extracted as any).supplier_name || (extracted as any).supplier,
        extracted.account_number,
        extracted.bill_date,
        (extracted as any).kwh_consumption || 0,
        (extracted as any).total_amount || 0,
        (extracted as any).tariff_type || 'standard',
        (extracted as any).standing_charges || 0
      ]);
    }

    res.json({
      success: true,
      comparison_id: comparisonId,
      extracted_data: {
        supplier: (extracted as any).supplier_name || (extracted as any).supplier,
        account_number: extracted.account_number,
        bill_date: extracted.bill_date,
        total_kwh: (extracted as any).kwh_consumption || 0,
        total_cost: (extracted as any).total_amount || 0,
        tariff_type: (extracted as any).tariff_type,
      },
      message: 'Bill uploaded and processed successfully'
    });

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Failed to process bill' });
  }
});


/**
 * POST /api/nocompare/compare
 * Compare current bill with market tariffs
 */
router.post('/compare', async (req: Request, res: Response) => {
  try {
    const {
      supplier,
      tariff_type,
      monthly_kwh,
      current_monthly_cost,
      day_kwh = 0,
      night_kwh = 0,
      peak_kwh = 0
    } = req.body;

    if (!supplier || !monthly_kwh || !current_monthly_cost) {
      return res.status(400).json({ 
        error: 'supplier, monthly_kwh, and current_monthly_cost are required' 
      });
    }

    console.log(`🔍 Comparing ${supplier} tariff...`);

    // Get usage profile
    const usageProfile = {
      totalKwh: monthly_kwh,
      dayKwh: day_kwh || monthly_kwh * 0.65, // Default 65% day usage
      nightKwh: night_kwh || monthly_kwh * 0.35, // Default 35% night usage
      peakKwh: peak_kwh || 0,
    };

    // Get facility data (domestic)
    const facilityData = {
      facilityType: 'domestic',
      squareMeters: 100, // Average home
      operatingHours: { weekday: 16, weekend: 24 },
      hasHvac: true,
      hasKitchen: true,
      hasIndustrialEquipment: false,
      occupancy: 3, // Average household
    };

    // Build a synthetic usage pattern for findOptimalTariff
    const usagePattern = {
      annual_consumption_kwh: (monthly_kwh || 0) * 12,
      day_percentage: 0.65,
      night_percentage: 0.35,
      peak_percentage: 0,
      off_peak_percentage: 1,
      profile_type: 'flat' as const,
      seasonal_variation: 0.2
    };
    const syntheticBills = [{
      supplier_name: supplier,
      tariff_name: tariff_type || 'standard',
      total_amount: current_monthly_cost * 12,
      total_kwh: (monthly_kwh || 0) * 12
    }];
    // Run tariff optimization using the correct method
    const optimization = tariffOptimizer.findOptimalTariff(
      usagePattern as any,
      syntheticBills as any
    );

    // Store recommendation
    const recommendationId = `REC-${Date.now()}-${nanoid(8)}`;
    
    await query(`
      INSERT INTO switching_recommendations (
        id,
        current_supplier,
        current_tariff,
        current_monthly_cost,
        recommended_supplier,
        recommended_tariff,
        recommended_monthly_cost,
        annual_savings,
        confidence_score,
        created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW())
    `, [
      recommendationId,
      supplier,
      tariff_type || 'standard',
      current_monthly_cost,
      optimization.optimal_tariff.supplier,
      optimization.optimal_tariff.tariff_name,
      optimization.optimal_tariff.estimated_annual_cost / 12,
      optimization.annual_savings,
      optimization.percentage_savings / 100
    ]);

    const projectedMonthlyCost = optimization.optimal_tariff.estimated_annual_cost / 12;

    res.json({
      success: true,
      recommendation_id: recommendationId,
      current: {
        supplier,
        tariff_type: tariff_type || 'standard',
        monthly_kwh,
        monthly_cost: current_monthly_cost,
        annual_cost: current_monthly_cost * 12,
      },
      recommended: {
        supplier: optimization.optimal_tariff.supplier,
        tariff_name: optimization.optimal_tariff.tariff_name,
        tariff_type: optimization.optimal_tariff.tariff_type,
        monthly_cost: projectedMonthlyCost,
        annual_cost: optimization.optimal_tariff.estimated_annual_cost,
      },
      savings: {
        monthly: current_monthly_cost - projectedMonthlyCost,
        annual: optimization.annual_savings,
        percentage: optimization.percentage_savings.toFixed(1),
      },
      confidence: optimization.percentage_savings.toFixed(0) + '%',
      message: optimization.annual_savings > 100
        ? `You could save €${optimization.annual_savings.toFixed(2)}/year by switching!`
        : 'You are already on a competitive tariff.'
    });

  } catch (error) {
    console.error('Comparison error:', error);
    res.status(500).json({ error: 'Failed to compare tariffs' });
  }
});


/**
 * GET /api/nocompare/suppliers
 * Get list of energy suppliers and tariffs
 */
router.get('/suppliers', async (req: Request, res: Response) => {
  try {
    const result = await query(`
      SELECT DISTINCT
        supplier,
        tariff_name,
        tariff_type,
        unit_rate_day,
        unit_rate_night,
        standing_charge_monthly,
        contract_length_months,
        exit_fee
      FROM tariff_database
      WHERE active = true
      ORDER BY supplier, tariff_name
    `);

    // Group by supplier
    const supplierMap = new Map<string, any[]>();
    
    result.rows.forEach(row => {
      if (!supplierMap.has(row.supplier)) {
        supplierMap.set(row.supplier, []);
      }
      supplierMap.get(row.supplier)!.push({
        name: row.tariff_name,
        type: row.tariff_type,
        day_rate: row.unit_rate_day,
        night_rate: row.unit_rate_night,
        standing_charge: row.standing_charge_monthly,
        contract_length: row.contract_length_months,
        exit_fee: row.exit_fee,
      });
    });

    const suppliers = Array.from(supplierMap.entries()).map(([name, tariffs]) => ({
      name,
      tariffs
    }));

    res.json({
      success: true,
      count: suppliers.length,
      suppliers
    });

  } catch (error) {
    console.error('Suppliers fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch suppliers' });
  }
});


/**
 * POST /api/nocompare/switch/initiate
 * Initiate switching process
 */
router.post('/switch/initiate', async (req: Request, res: Response) => {
  try {
    const {
      user_email,
      user_name,
      user_phone,
      user_address,
      current_supplier,
      recommended_supplier,
      recommended_tariff,
      annual_savings
    } = req.body;

    if (!user_email || !user_name || !recommended_supplier) {
      return res.status(400).json({ 
        error: 'user_email, user_name, and recommended_supplier are required' 
      });
    }

    const switchId = `SWITCH-${Date.now()}-${nanoid(8)}`;

    // Create switching record
    await query(`
      INSERT INTO switching_recommendations (
        id,
        customer_email,
        customer_name,
        customer_phone,
        customer_address,
        current_supplier,
        recommended_supplier,
        recommended_tariff,
        annual_savings,
        status,
        created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'initiated', NOW())
    `, [
      switchId,
      user_email,
      user_name,
      user_phone,
      user_address,
      current_supplier,
      recommended_supplier,
      recommended_tariff,
      annual_savings
    ]);

    // TODO: Send confirmation email
    // TODO: Notify supplier
    // TODO: Track commission

    res.json({
      success: true,
      switch_id: switchId,
      message: 'Switching process initiated. We will contact you within 24 hours.',
      next_steps: [
        '1. We will verify your details with the new supplier',
        '2. The new supplier will contact you to finalize the contract',
        '3. Switching typically takes 2-3 weeks',
        '4. Your energy supply will not be interrupted',
      ]
    });

  } catch (error) {
    console.error('Switch initiation error:', error);
    res.status(500).json({ error: 'Failed to initiate switch' });
  }
});


/**
 * GET /api/nocompare/switch/:switchId
 * Get switching status
 */
router.get('/switch/:switchId', async (req: Request, res: Response) => {
  try {
    const { switchId } = req.params;

    const result = await query(`
      SELECT * FROM switching_recommendations WHERE id = $1
    `, [switchId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Switch request not found' });
    }

    res.json({
      success: true,
      switch: result.rows[0]
    });

  } catch (error) {
    console.error('Switch status error:', error);
    res.status(500).json({ error: 'Failed to fetch switch status' });
  }
});

export default router;
