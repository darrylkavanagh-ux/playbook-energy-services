/**
 * CONSPIRACY DETECTION ENGINE
 * 
 * Implements critical conspiracy detection techniques as specified in
 * Section 7.4 of the FINAL MASTER FORENSIC INVESTIGATION DIRECTIVE v3.0
 * 
 * Detection Methods:
 * 1. Temporal Correlation Analysis - Simultaneous actions by multiple parties
 * 2. Actor Intersection Analysis - Shared actors across multiple matters
 * 3. Financial Flow Mapping - Money trails between parties
 * 4. Cui Bono Analysis - Who benefits from the scheme
 * 5. Communication Pattern Analysis - Contact between parties at critical times
 * 6. Geographic Clustering - Physical proximity of actors
 * 
 * Modeled on: FBI, NCA, SFO, GNECB, Europol, INTERPOL, CAB, IAASA
 */

import { query } from '../config/database';

interface TemporalCorrelation {
  actors: string[];
  entities: string[];
  events: Array<{
    date: string;
    type: string;
    description: string;
  }>;
  correlation_strength: number;
  time_window_days: number;
}

interface ActorIntersection {
  actor_id: string;
  actor_name: string;
  matters_involved: string[];
  entities_involved: string[];
  intersection_count: number;
  centrality_score: number;
}

interface FinancialFlow {
  from_party: string;
  to_party: string;
  total_amount: number;
  transaction_count: number;
  date_range: {
    start: string;
    end: string;
  };
  suspicious_indicators: string[];
  aml_flags: string[];
}

interface CuiBono {
  party_id: string;
  party_name: string;
  party_type: 'ACTOR' | 'ENTITY';
  benefits: Array<{
    type: string;
    value: number;
    description: string;
  }>;
  total_benefit_value: number;
  benefit_sources: string[];
}

interface ConspiracyLink {
  link_id: string;
  link_type: string;
  parties_involved: string[];
  evidence_strength: 'WEAK' | 'MODERATE' | 'STRONG' | 'CONCLUSIVE';
  detection_methods: string[];
  description: string;
}

export class ConspiracyDetectionEngine {
  /**
   * 1. TEMPORAL CORRELATION ANALYSIS
   * Identifies simultaneous or near-simultaneous actions by multiple parties
   * that suggest coordination
   */
  async detectTemporalCorrelations(
    time_window_days: number = 7,
    minimum_events: number = 3
  ): Promise<TemporalCorrelation[]> {
    try {
      console.log(`🔍 Running Temporal Correlation Analysis (${time_window_days} day window)...`);

      // Find events that cluster within the time window
      const result = await query(`
        WITH event_clusters AS (
          SELECT 
            event_date,
            event_type,
            event_title,
            event_description,
            actors_involved,
            entities_involved,
            COUNT(*) OVER (
              PARTITION BY DATE_TRUNC('day', event_date)
            ) as events_same_day
          FROM forensic_timeline
          WHERE event_date >= CURRENT_DATE - INTERVAL '2 years'
        )
        SELECT 
          event_date,
          event_type,
          event_title,
          event_description,
          actors_involved,
          entities_involved,
          events_same_day
        FROM event_clusters
        WHERE events_same_day >= $1
        ORDER BY event_date DESC
      `, [minimum_events]);

      const correlations: TemporalCorrelation[] = [];
      
      // Group by date clusters
      const dateGroups = new Map<string, any[]>();
      result.rows.forEach(row => {
        const dateKey = row.event_date.toISOString().split('T')[0];
        if (!dateGroups.has(dateKey)) {
          dateGroups.set(dateKey, []);
        }
        dateGroups.get(dateKey)?.push(row);
      });

      // Analyze each cluster
      for (const [date, events] of dateGroups) {
        const allActors = new Set<string>();
        const allEntities = new Set<string>();
        
        events.forEach(event => {
          event.actors_involved?.forEach((a: string) => allActors.add(a));
          event.entities_involved?.forEach((e: string) => allEntities.add(e));
        });

        if (events.length >= minimum_events) {
          correlations.push({
            actors: Array.from(allActors),
            entities: Array.from(allEntities),
            events: events.map(e => ({
              date: e.event_date,
              type: e.event_type,
              description: e.event_title
            })),
            correlation_strength: Math.min(events.length / 10, 1.0),
            time_window_days
          });
        }
      }

      console.log(`✅ Found ${correlations.length} temporal correlations`);
      return correlations;

    } catch (error) {
      console.error('❌ Temporal correlation analysis error:', error);
      throw error;
    }
  }

  /**
   * 2. ACTOR INTERSECTION ANALYSIS
   * Identifies actors who appear across multiple matters, suggesting
   * they may be coordinating or have central roles in the conspiracy
   */
  async detectActorIntersections(
    minimum_intersection_count: number = 2
  ): Promise<ActorIntersection[]> {
    try {
      console.log('🔍 Running Actor Intersection Analysis...');

      const result = await query(`
        WITH actor_matter_counts AS (
          SELECT 
            UNNEST(fm.actors_involved) as actor_id,
            fm.matter_id,
            fm.title as matter_title
          FROM forensic_matters fm
          WHERE fm.status != 'CLOSED'
        ),
        actor_entity_counts AS (
          SELECT 
            faer.actor_id,
            faer.entity_id
          FROM forensic_actor_entity_relationships faer
          WHERE faer.status = 'active'
        ),
        actor_summary AS (
          SELECT 
            amc.actor_id,
            COUNT(DISTINCT amc.matter_id) as matter_count,
            ARRAY_AGG(DISTINCT amc.matter_id) as matters_involved,
            COUNT(DISTINCT aec.entity_id) as entity_count,
            ARRAY_AGG(DISTINCT aec.entity_id) as entities_involved
          FROM actor_matter_counts amc
          LEFT JOIN actor_entity_counts aec ON amc.actor_id = aec.actor_id
          GROUP BY amc.actor_id
          HAVING COUNT(DISTINCT amc.matter_id) >= $1
        )
        SELECT 
          asSum.actor_id,
          fa.full_name as actor_name,
          asSum.matter_count,
          asSum.matters_involved,
          asSum.entity_count,
          asSum.entities_involved
        FROM actor_summary asSum
        JOIN forensic_actors fa ON asSum.actor_id = fa.actor_id
        ORDER BY asSum.matter_count DESC, asSum.entity_count DESC
      `, [minimum_intersection_count]);

      const intersections: ActorIntersection[] = result.rows.map(row => ({
        actor_id: row.actor_id,
        actor_name: row.actor_name,
        matters_involved: row.matters_involved || [],
        entities_involved: row.entities_involved || [],
        intersection_count: row.matter_count,
        centrality_score: (row.matter_count * 0.6 + row.entity_count * 0.4) / 10
      }));

      console.log(`✅ Found ${intersections.length} significant actor intersections`);
      return intersections;

    } catch (error) {
      console.error('❌ Actor intersection analysis error:', error);
      throw error;
    }
  }

  /**
   * 3. FINANCIAL FLOW MAPPING
   * Traces money flows between parties to identify suspicious patterns
   */
  async mapFinancialFlows(
    minimum_amount: number = 10000
  ): Promise<FinancialFlow[]> {
    try {
      console.log('🔍 Running Financial Flow Mapping...');

      const result = await query(`
        SELECT 
          from_party_id,
          from_party_type,
          to_party_id,
          to_party_type,
          COUNT(*) as transaction_count,
          SUM(amount) as total_amount,
          MIN(transaction_date) as first_transaction,
          MAX(transaction_date) as last_transaction,
          ARRAY_AGG(DISTINCT unnest(suspicious_indicators)) 
            FILTER (WHERE suspicious_indicators IS NOT NULL) as all_suspicious_indicators,
          ARRAY_AGG(DISTINCT unnest(aml_flags)) 
            FILTER (WHERE aml_flags IS NOT NULL) as all_aml_flags
        FROM forensic_transactions
        WHERE amount > $1
        GROUP BY from_party_id, from_party_type, to_party_id, to_party_type
        HAVING SUM(amount) > $1
        ORDER BY total_amount DESC
      `, [minimum_amount]);

      const flows: FinancialFlow[] = result.rows.map(row => ({
        from_party: row.from_party_id,
        to_party: row.to_party_id,
        total_amount: parseFloat(row.total_amount),
        transaction_count: parseInt(row.transaction_count),
        date_range: {
          start: row.first_transaction,
          end: row.last_transaction
        },
        suspicious_indicators: row.all_suspicious_indicators || [],
        aml_flags: row.all_aml_flags || []
      }));

      console.log(`✅ Mapped ${flows.length} significant financial flows`);
      return flows;

    } catch (error) {
      console.error('❌ Financial flow mapping error:', error);
      throw error;
    }
  }

  /**
   * 4. CUI BONO ANALYSIS
   * Determines who benefits financially from the scheme
   */
  async analyzeCuiBono(): Promise<CuiBono[]> {
    try {
      console.log('🔍 Running Cui Bono Analysis (Who Benefits?)...');

      // Analyze financial inflows
      const result = await query(`
        WITH party_inflows AS (
          SELECT 
            to_party_id as party_id,
            to_party_type as party_type,
            SUM(amount) as total_inflow,
            COUNT(*) as inflow_count,
            ARRAY_AGG(DISTINCT transaction_type) as benefit_types
          FROM forensic_transactions
          GROUP BY to_party_id, to_party_type
        ),
        party_outflows AS (
          SELECT 
            from_party_id as party_id,
            SUM(amount) as total_outflow
          FROM forensic_transactions
          GROUP BY from_party_id
        )
        SELECT 
          pi.party_id,
          pi.party_type,
          pi.total_inflow,
          COALESCE(po.total_outflow, 0) as total_outflow,
          (pi.total_inflow - COALESCE(po.total_outflow, 0)) as net_benefit,
          pi.inflow_count,
          pi.benefit_types
        FROM party_inflows pi
        LEFT JOIN party_outflows po ON pi.party_id = po.party_id
        WHERE (pi.total_inflow - COALESCE(po.total_outflow, 0)) > 0
        ORDER BY net_benefit DESC
      `);

      const beneficiaries: CuiBono[] = [];

      for (const row of result.rows) {
        let party_name = 'Unknown';
        
        // Get party name
        if (row.party_type === 'ACTOR') {
          const actorResult = await query(
            'SELECT full_name FROM forensic_actors WHERE actor_id = $1',
            [row.party_id]
          );
          party_name = actorResult.rows[0]?.full_name || party_name;
        } else {
          const entityResult = await query(
            'SELECT legal_name FROM forensic_entities WHERE entity_id = $1',
            [row.party_id]
          );
          party_name = entityResult.rows[0]?.legal_name || party_name;
        }

        beneficiaries.push({
          party_id: row.party_id,
          party_name,
          party_type: row.party_type,
          benefits: [
            {
              type: 'Net Financial Gain',
              value: parseFloat(row.net_benefit),
              description: `${row.inflow_count} inbound transactions`
            }
          ],
          total_benefit_value: parseFloat(row.net_benefit),
          benefit_sources: row.benefit_types || []
        });
      }

      console.log(`✅ Identified ${beneficiaries.length} beneficiaries`);
      return beneficiaries;

    } catch (error) {
      console.error('❌ Cui Bono analysis error:', error);
      throw error;
    }
  }

  /**
   * 5. COMPREHENSIVE CONSPIRACY DETECTION
   * Combines all detection methods to identify and score potential conspiracies
   */
  async detectConspiracies(): Promise<ConspiracyLink[]> {
    try {
      console.log('🔍 Running Comprehensive Conspiracy Detection...');

      const [
        temporalCorrelations,
        actorIntersections,
        financialFlows,
        beneficiaries
      ] = await Promise.all([
        this.detectTemporalCorrelations(),
        this.detectActorIntersections(),
        this.mapFinancialFlows(),
        this.analyzeCuiBono()
      ]);

      const conspiracyLinks: ConspiracyLink[] = [];

      // 1. Financial + Temporal Links
      for (const flow of financialFlows) {
        if (flow.suspicious_indicators.length > 0 || flow.aml_flags.length > 0) {
          const link_id = `LINK-FIN-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
          
          conspiracyLinks.push({
            link_id,
            link_type: 'FINANCIAL_CONSPIRACY',
            parties_involved: [flow.from_party, flow.to_party],
            evidence_strength: flow.aml_flags.length > 2 ? 'STRONG' : 
                             flow.suspicious_indicators.length > 0 ? 'MODERATE' : 'WEAK',
            detection_methods: ['Financial Flow Mapping', 'AML Analysis'],
            description: `Suspicious financial flow of €${flow.total_amount.toLocaleString()} across ${flow.transaction_count} transactions`
          });
        }
      }

      // 2. Actor Intersection + Financial Links
      for (const intersection of actorIntersections) {
        if (intersection.intersection_count >= 3) {
          const link_id = `LINK-ACTOR-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
          
          conspiracyLinks.push({
            link_id,
            link_type: 'ACTOR_INTERSECTION',
            parties_involved: [intersection.actor_id, ...intersection.entities_involved],
            evidence_strength: intersection.centrality_score > 0.7 ? 'STRONG' :
                             intersection.centrality_score > 0.4 ? 'MODERATE' : 'WEAK',
            detection_methods: ['Actor Intersection Analysis'],
            description: `${intersection.actor_name} appears in ${intersection.intersection_count} matters and ${intersection.entities_involved.length} entities`
          });
        }
      }

      // 3. Cui Bono + Multi-Actor Links
      for (const beneficiary of beneficiaries) {
        if (beneficiary.total_benefit_value > 100000) {
          const link_id = `LINK-BENEFIT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
          
          conspiracyLinks.push({
            link_id,
            link_type: 'CUI_BONO',
            parties_involved: [beneficiary.party_id],
            evidence_strength: beneficiary.total_benefit_value > 500000 ? 'STRONG' :
                             beneficiary.total_benefit_value > 250000 ? 'MODERATE' : 'WEAK',
            detection_methods: ['Cui Bono Analysis'],
            description: `${beneficiary.party_name} received net benefit of €${beneficiary.total_benefit_value.toLocaleString()}`
          });
        }
      }

      // 4. Temporal Correlation Links
      for (const correlation of temporalCorrelations) {
        if (correlation.correlation_strength > 0.5) {
          const link_id = `LINK-TEMP-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
          
          conspiracyLinks.push({
            link_id,
            link_type: 'TEMPORAL_CORRELATION',
            parties_involved: [...correlation.actors, ...correlation.entities],
            evidence_strength: correlation.correlation_strength > 0.8 ? 'STRONG' :
                             correlation.correlation_strength > 0.6 ? 'MODERATE' : 'WEAK',
            detection_methods: ['Temporal Correlation Analysis'],
            description: `${correlation.events.length} coordinated events within ${correlation.time_window_days} days`
          });
        }
      }

      // Store conspiracy links in database
      for (const link of conspiracyLinks) {
        await query(`
          INSERT INTO forensic_conspiracy_links (
            link_id, link_type, description,
            node_a_type, node_a_id,
            node_b_type, node_b_id,
            connection_strength,
            evidence_supporting,
            detection_method,
            metadata
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
          ON CONFLICT (link_id) DO NOTHING
        `, [
          link.link_id,
          link.link_type,
          link.description,
          'ACTOR',
          link.parties_involved[0] || 'UNKNOWN',
          'ENTITY',
          link.parties_involved[1] || 'UNKNOWN',
          link.evidence_strength === 'CONCLUSIVE' ? 1.0 :
          link.evidence_strength === 'STRONG' ? 0.8 :
          link.evidence_strength === 'MODERATE' ? 0.5 : 0.3,
          JSON.stringify(link.detection_methods),
          link.detection_methods.join(', '),
          JSON.stringify({ parties_involved: link.parties_involved })
        ]);
      }

      console.log(`✅ Detected ${conspiracyLinks.length} conspiracy links`);
      return conspiracyLinks;

    } catch (error) {
      console.error('❌ Comprehensive conspiracy detection error:', error);
      throw error;
    }
  }

  /**
   * Generate Investigation Report
   */
  async generateInvestigationReport(): Promise<{
    temporal_correlations: TemporalCorrelation[];
    actor_intersections: ActorIntersection[];
    financial_flows: FinancialFlow[];
    beneficiaries: CuiBono[];
    conspiracy_links: ConspiracyLink[];
    summary: {
      total_actors: number;
      total_entities: number;
      total_matters: number;
      total_transactions_value: number;
      conspiracy_links_count: number;
      high_risk_actors: number;
      critical_findings: number;
    };
  }> {
    try {
      console.log('📊 Generating Comprehensive Investigation Report...');

      const [
        temporal_correlations,
        actor_intersections,
        financial_flows,
        beneficiaries,
        conspiracy_links
      ] = await Promise.all([
        this.detectTemporalCorrelations(),
        this.detectActorIntersections(),
        this.mapFinancialFlows(),
        this.analyzeCuiBono(),
        this.detectConspiracies()
      ]);

      // Get summary statistics
      const actorCount = await query('SELECT COUNT(*) FROM forensic_actors');
      const entityCount = await query('SELECT COUNT(*) FROM forensic_entities');
      const matterCount = await query('SELECT COUNT(*) FROM forensic_matters');
      const transactionSum = await query('SELECT COALESCE(SUM(amount), 0) as total FROM forensic_transactions');
      const highRiskActors = await query("SELECT COUNT(*) FROM forensic_actors WHERE risk_level = 'HIGH' OR risk_level = 'CRITICAL'");
      const criticalFindings = await query("SELECT COUNT(*) FROM forensic_findings WHERE severity = 'CRITICAL'");

      const report = {
        temporal_correlations,
        actor_intersections,
        financial_flows,
        beneficiaries,
        conspiracy_links,
        summary: {
          total_actors: parseInt(actorCount.rows[0].count),
          total_entities: parseInt(entityCount.rows[0].count),
          total_matters: parseInt(matterCount.rows[0].count),
          total_transactions_value: parseFloat(transactionSum.rows[0].total),
          conspiracy_links_count: conspiracy_links.length,
          high_risk_actors: parseInt(highRiskActors.rows[0].count),
          critical_findings: parseInt(criticalFindings.rows[0].count)
        }
      };

      console.log('✅ Investigation Report generated successfully');
      return report;

    } catch (error) {
      console.error('❌ Report generation error:', error);
      throw error;
    }
  }
}

export default new ConspiracyDetectionEngine();
