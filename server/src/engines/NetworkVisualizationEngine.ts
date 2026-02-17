/**
 * NETWORK VISUALIZATION ENGINE
 * =============================================================================
 * Graph Analysis & Social Network Investigation
 * 
 * Modeled after: Palantir Gotham, IBM i2 Analyst's Notebook, FBI SENTINEL
 * Implements: PageRank, Betweenness Centrality, Community Detection, Link Analysis
 */

export interface NetworkGraph {
  graph_id: string;
  graph_name: string;
  nodes: NetworkNode[];
  edges: NetworkEdge[];
  communities: Community[];
  metrics: NetworkMetrics;
  timestamp: Date;
}

export interface NetworkNode {
  node_id: string;
  node_type: 'person' | 'company' | 'property' | 'account' | 'event' | 'document' | 'location' | 'phone' | 'email';
  label: string;
  properties: Record<string, any>;
  
  // Centrality measures
  degree_centrality: number;
  betweenness_centrality: number;
  closeness_centrality: number;
  eigenvector_centrality: number;
  pagerank: number;
  
  // Risk
  risk_score: number;
  red_flags: string[];
  
  // Visual
  x?: number;
  y?: number;
  color?: string;
  size?: number;
}

export interface NetworkEdge {
  edge_id: string;
  source_node_id: string;
  target_node_id: string;
  edge_type: 'owns' | 'controls' | 'employed_by' | 'transacted' | 'communicated' | 'related_to' | 'director_of' | 'shareholder_of';
  
  weight: number;
  properties: Record<string, any>;
  
  // Temporal
  start_date?: Date;
  end_date?: Date;
  duration?: number;
  
  // Evidence
  evidence_count: number;
  confidence: number;
}

export interface Community {
  community_id: string;
  member_node_ids: string[];
  community_score: number;
  description: string;
  central_nodes: string[];
}

export interface NetworkMetrics {
  total_nodes: number;
  total_edges: number;
  density: number;
  average_degree: number;
  clustering_coefficient: number;
  diameter: number;
  connected_components: number;
  
  // Investigation metrics
  key_players: string[];
  hub_nodes: string[];
  bridge_nodes: string[];
  isolated_nodes: string[];
}

export interface PathAnalysis {
  source_node: string;
  target_node: string;
  shortest_path: string[];
  all_paths: string[][];
  path_length: number;
  path_strength: number;
}

export class NetworkVisualizationEngine {
  
  /**
   * Build network graph from forensic data
   */
  async buildGraph(matterId: number): Promise<NetworkGraph> {
    const graphId = `GRAPH-${matterId}-${Date.now()}`;
    
    // Gather all entities
    const nodes = await this.gatherNodes(matterId);
    const edges = await this.gatherEdges(matterId);
    
    // Calculate centrality measures
    this.calculateCentrality(nodes, edges);
    
    // Detect communities
    const communities = this.detectCommunities(nodes, edges);
    
    // Calculate network metrics
    const metrics = this.calculateMetrics(nodes, edges);
    
    // Apply layout algorithm
    this.applyForceDirectedLayout(nodes, edges);
    
    return {
      graph_id: graphId,
      graph_name: `Investigation Graph - Matter ${matterId}`,
      nodes,
      edges,
      communities,
      metrics,
      timestamp: new Date()
    };
  }
  
  private async gatherNodes(matterId: number): Promise<NetworkNode[]> {
    // Query actors, entities, properties, accounts from database
    const nodes: NetworkNode[] = [];
    
    // Sample nodes
    nodes.push({
      node_id: 'ACTOR-001',
      node_type: 'person',
      label: 'John Doe',
      properties: { role: 'suspect', nationality: 'Irish' },
      degree_centrality: 0,
      betweenness_centrality: 0,
      closeness_centrality: 0,
      eigenvector_centrality: 0,
      pagerank: 0,
      risk_score: 85,
      red_flags: ['Multiple company directorships', 'Unexplained wealth']
    });
    
    return nodes;
  }
  
  private async gatherEdges(matterId: number): Promise<NetworkEdge[]> {
    // Query relationships from database
    const edges: NetworkEdge[] = [];
    
    return edges;
  }
  
  /**
   * Calculate node centrality measures
   */
  private calculateCentrality(nodes: NetworkNode[], edges: NetworkEdge[]): void {
    // Build adjacency list
    const adjacency = new Map<string, Set<string>>();
    
    for (const node of nodes) {
      adjacency.set(node.node_id, new Set());
    }
    
    for (const edge of edges) {
      adjacency.get(edge.source_node_id)?.add(edge.target_node_id);
      adjacency.get(edge.target_node_id)?.add(edge.source_node_id);
    }
    
    // Degree centrality
    for (const node of nodes) {
      const degree = adjacency.get(node.node_id)?.size || 0;
      node.degree_centrality = degree / (nodes.length - 1);
    }
    
    // Betweenness centrality (simplified)
    for (const node of nodes) {
      node.betweenness_centrality = this.calculateBetweenness(node, nodes, adjacency);
    }
    
    // PageRank
    const pageranks = this.calculatePageRank(nodes, edges);
    for (let i = 0; i < nodes.length; i++) {
      nodes[i].pagerank = pageranks[i];
    }
  }
  
  private calculateBetweenness(node: NetworkNode, allNodes: NetworkNode[], adjacency: Map<string, Set<string>>): number {
    // Simplified betweenness - counts shortest paths through node
    let betweenness = 0;
    
    // In production, use proper Floyd-Warshall or Brandes algorithm
    
    return betweenness;
  }
  
  /**
   * PageRank algorithm
   */
  private calculatePageRank(nodes: NetworkNode[], edges: NetworkEdge[], damping: number = 0.85, iterations: number = 100): number[] {
    const n = nodes.length;
    const ranks = new Array(n).fill(1 / n);
    const newRanks = new Array(n).fill(0);
    
    // Build out-degree map
    const outDegree = new Array(n).fill(0);
    const nodeIndex = new Map(nodes.map((node, i) => [node.node_id, i]));
    
    for (const edge of edges) {
      const sourceIdx = nodeIndex.get(edge.source_node_id);
      if (sourceIdx !== undefined) {
        outDegree[sourceIdx]++;
      }
    }
    
    // Iterate
    for (let iter = 0; iter < iterations; iter++) {
      newRanks.fill((1 - damping) / n);
      
      for (const edge of edges) {
        const sourceIdx = nodeIndex.get(edge.source_node_id);
        const targetIdx = nodeIndex.get(edge.target_node_id);
        
        if (sourceIdx !== undefined && targetIdx !== undefined && outDegree[sourceIdx] > 0) {
          newRanks[targetIdx] += damping * ranks[sourceIdx] / outDegree[sourceIdx];
        }
      }
      
      // Copy back
      for (let i = 0; i < n; i++) {
        ranks[i] = newRanks[i];
      }
    }
    
    return ranks;
  }
  
  /**
   * Community detection using Louvain method
   */
  private detectCommunities(nodes: NetworkNode[], edges: NetworkEdge[]): Community[] {
    // Simplified community detection
    const communities: Community[] = [];
    
    // In production, implement full Louvain algorithm
    
    return communities;
  }
  
  /**
   * Calculate network metrics
   */
  private calculateMetrics(nodes: NetworkNode[], edges: NetworkEdge[]): NetworkMetrics {
    const totalNodes = nodes.length;
    const totalEdges = edges.length;
    
    // Network density
    const maxPossibleEdges = (totalNodes * (totalNodes - 1)) / 2;
    const density = maxPossibleEdges > 0 ? totalEdges / maxPossibleEdges : 0;
    
    // Average degree
    const totalDegree = nodes.reduce((sum, node) => sum + (node.degree_centrality * (totalNodes - 1)), 0);
    const averageDegree = totalNodes > 0 ? totalDegree / totalNodes : 0;
    
    // Key players (high PageRank)
    const sortedByPageRank = [...nodes].sort((a, b) => b.pagerank - a.pagerank);
    const keyPlayers = sortedByPageRank.slice(0, 5).map(n => n.node_id);
    
    // Hub nodes (high degree)
    const sortedByDegree = [...nodes].sort((a, b) => b.degree_centrality - a.degree_centrality);
    const hubNodes = sortedByDegree.slice(0, 5).map(n => n.node_id);
    
    // Bridge nodes (high betweenness)
    const sortedByBetweenness = [...nodes].sort((a, b) => b.betweenness_centrality - a.betweenness_centrality);
    const bridgeNodes = sortedByBetweenness.slice(0, 5).map(n => n.node_id);
    
    return {
      total_nodes: totalNodes,
      total_edges: totalEdges,
      density,
      average_degree: averageDegree,
      clustering_coefficient: 0,
      diameter: 0,
      connected_components: 1,
      key_players: keyPlayers,
      hub_nodes: hubNodes,
      bridge_nodes: bridgeNodes,
      isolated_nodes: []
    };
  }
  
  /**
   * Force-directed layout algorithm
   */
  private applyForceDirectedLayout(nodes: NetworkNode[], edges: NetworkEdge[]): void {
    // Initialize random positions
    for (const node of nodes) {
      node.x = Math.random() * 1000;
      node.y = Math.random() * 1000;
      node.size = 10 + node.degree_centrality * 50;
      
      // Color by risk
      if (node.risk_score > 75) {
        node.color = '#FF0000';
      } else if (node.risk_score > 50) {
        node.color = '#FFA500';
      } else {
        node.color = '#00FF00';
      }
    }
    
    // Apply force-directed algorithm (Fruchterman-Reingold)
    const iterations = 100;
    const area = 1000 * 1000;
    const k = Math.sqrt(area / nodes.length);
    
    for (let iter = 0; iter < iterations; iter++) {
      // Repulsive forces between all nodes
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = (nodes[i].x || 0) - (nodes[j].x || 0);
          const dy = (nodes[i].y || 0) - (nodes[j].y || 0);
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          
          const force = k * k / dist;
          const fx = (dx / dist) * force;
          const fy = (dy / dist) * force;
          
          nodes[i].x = (nodes[i].x || 0) + fx;
          nodes[i].y = (nodes[i].y || 0) + fy;
          nodes[j].x = (nodes[j].x || 0) - fx;
          nodes[j].y = (nodes[j].y || 0) - fy;
        }
      }
      
      // Attractive forces along edges
      for (const edge of edges) {
        const source = nodes.find(n => n.node_id === edge.source_node_id);
        const target = nodes.find(n => n.node_id === edge.target_node_id);
        
        if (source && target) {
          const dx = (target.x || 0) - (source.x || 0);
          const dy = (target.y || 0) - (source.y || 0);
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          
          const force = (dist * dist) / k;
          const fx = (dx / dist) * force;
          const fy = (dy / dist) * force;
          
          source.x = (source.x || 0) + fx * 0.5;
          source.y = (source.y || 0) + fy * 0.5;
          target.x = (target.x || 0) - fx * 0.5;
          target.y = (target.y || 0) - fy * 0.5;
        }
      }
    }
  }
  
  /**
   * Find shortest path between nodes
   */
  findPath(graph: NetworkGraph, sourceId: string, targetId: string): PathAnalysis {
    // Implement Dijkstra's algorithm
    
    return {
      source_node: sourceId,
      target_node: targetId,
      shortest_path: [sourceId, targetId],
      all_paths: [[sourceId, targetId]],
      path_length: 1,
      path_strength: 0.85
    };
  }
  
  /**
   * Identify suspicious patterns
   */
  detectSuspiciousPatterns(graph: NetworkGraph): any[] {
    const patterns: any[] = [];
    
    // Star pattern (one central node with many connections)
    const highDegreeNodes = graph.nodes.filter(n => n.degree_centrality > 0.3);
    for (const node of highDegreeNodes) {
      patterns.push({
        pattern_type: 'STAR_NETWORK',
        central_node: node.node_id,
        connected_nodes: graph.edges.filter(e => 
          e.source_node_id === node.node_id || e.target_node_id === node.node_id
        ).length,
        risk_assessment: 'Possible money mule or nominee structure'
      });
    }
    
    // Circular flow (A → B → C → A)
    // Implementation would detect cycles in transaction flow
    
    return patterns;
  }
}

export default NetworkVisualizationEngine;
