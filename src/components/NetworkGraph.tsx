import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import {
  Network,
  Search,
  Filter,
  ShieldAlert,
  User,
  Smartphone,
  MapPin,
  FileText,
  DollarSign,
  Share2,
  X,
  Sparkles,
} from 'lucide-react';
import { NetworkNode, NetworkLink, Suspect } from '../types';
import { MOCK_SUSPECTS } from '../data/mockDatabase';

interface NetworkGraphProps {
  initialNodes: NetworkNode[];
  initialLinks: NetworkLink[];
  onOpenSuspectDossier?: (suspect: Suspect) => void;
  onTriggerAIBrief?: (topic: string) => void;
}

export const NetworkGraph: React.FC<NetworkGraphProps> = ({
  initialNodes,
  initialLinks,
  onOpenSuspectDossier,
  onTriggerAIBrief,
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [selectedType, setSelectedType] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedNode, setSelectedNode] = useState<NetworkNode | null>(null);

  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    const width = containerRef.current.clientWidth || 900;
    const height = containerRef.current.clientHeight || 650;

    // Filter nodes
    let nodes: NetworkNode[] = JSON.parse(JSON.stringify(initialNodes));
    let links: NetworkLink[] = JSON.parse(JSON.stringify(initialLinks));

    if (selectedType !== 'All') {
      const allowedIds = new Set(nodes.filter((n) => n.type === selectedType).map((n) => n.id));
      // Keep nodes connected to these
      links.forEach((l) => {
        const src = typeof l.source === 'string' ? l.source : (l.source as any).id;
        const tgt = typeof l.target === 'string' ? l.target : (l.target as any).id;
        if (allowedIds.has(src)) allowedIds.add(tgt);
        if (allowedIds.has(tgt)) allowedIds.add(src);
      });
      nodes = nodes.filter((n) => allowedIds.has(n.id));
      links = links.filter((l) => {
        const src = typeof l.source === 'string' ? l.source : (l.source as any).id;
        const tgt = typeof l.target === 'string' ? l.target : (l.target as any).id;
        return allowedIds.has(src) && allowedIds.has(tgt);
      });
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const matchedIds = new Set(
        nodes
          .filter((n) => n.name.toLowerCase().includes(term) || (n.details && n.details.toLowerCase().includes(term)))
          .map((n) => n.id)
      );
      nodes.forEach((n) => {
        if (matchedIds.has(n.id)) n.risk_score = 10;
      });
    }

    // Clear previous SVG contents
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    svg.attr('width', width).attr('height', height).attr('viewBox', [0, 0, width, height]);

    // Zoom container
    const g = svg.append('g');

    const zoom = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.3, 4])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });

    svg.call(zoom as any);

    // Color mapper for node types
    const getNodeColor = (type: string) => {
      switch (type) {
        case 'Suspect':
          return '#ef4444'; // Red
        case 'Alias':
          return '#c084fc'; // Purple
        case 'ModusOperandi':
          return '#f59e0b'; // Amber
        case 'BankAccount':
          return '#06b6d4'; // Cyan
        case 'Vehicle':
          return '#3b82f6'; // Blue
        case 'Location':
          return '#10b981'; // Emerald
        case 'FIR':
          return '#6366f1'; // Indigo
        default:
          return '#94a3b8';
      }
    };

    // D3 Force Simulation
    const simulation = d3
      .forceSimulation<any>(nodes as any)
      .force(
        'link',
        d3
          .forceLink<any, any>(links as any)
          .id((d) => d.id)
          .distance(120)
      )
      .force('charge', d3.forceManyBody().strength(-350))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(35));

    // Links (lines)
    const linkGroup = g.append('g').attr('class', 'links');

    const link = linkGroup
      .selectAll('line')
      .data(links)
      .enter()
      .append('line')
      .attr('stroke', '#334155')
      .attr('stroke-opacity', 0.7)
      .attr('stroke-width', (d) => Math.max(1.5, d.weight || 2));

    // Link Labels
    const linkText = g
      .append('g')
      .selectAll('text')
      .data(links)
      .enter()
      .append('text')
      .text((d) => d.relationship)
      .attr('font-size', '8px')
      .attr('fill', '#64748b')
      .attr('text-anchor', 'middle');

    // Nodes (groups)
    const nodeGroup = g.append('g').attr('class', 'nodes');

    const node = nodeGroup
      .selectAll('.node')
      .data(nodes)
      .enter()
      .append('g')
      .attr('class', 'node cursor-pointer')
      .call(
        d3
          .drag<any, any>()
          .on('start', dragstarted)
          .on('drag', dragged)
          .on('end', dragended)
      );

    // Circle background for nodes
    node
      .append('circle')
      .attr('r', (d) => (d.type === 'Suspect' ? 22 : 16))
      .attr('fill', (d) => getNodeColor(d.type))
      .attr('stroke', '#0f172a')
      .attr('stroke-width', 2)
      .attr('class', 'transition duration-150 hover:brightness-125')
      .on('click', (event, d) => {
        setSelectedNode(d as any);
      });

    // Node Name Labels
    node
      .append('text')
      .text((d) => d.name)
      .attr('x', 0)
      .attr('y', (d) => (d.type === 'Suspect' ? 34 : 28))
      .attr('text-anchor', 'middle')
      .attr('fill', '#f1f5f9')
      .attr('font-size', '10px')
      .attr('font-weight', '600');

    // Sub-label for details
    node
      .append('text')
      .text((d) => (d.type === 'Suspect' ? `Risk: ${d.risk_score || 'N/A'}` : d.type))
      .attr('x', 0)
      .attr('y', (d) => (d.type === 'Suspect' ? 45 : 38))
      .attr('text-anchor', 'middle')
      .attr('fill', '#94a3b8')
      .attr('font-size', '8px');

    // Simulation tick handler
    simulation.on('tick', () => {
      link
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y);

      linkText
        .attr('x', (d: any) => (d.source.x + d.target.x) / 2)
        .attr('y', (d: any) => (d.source.y + d.target.y) / 2 - 4);

      node.attr('transform', (d: any) => `translate(${d.x},${d.y})`);
    });

    function dragstarted(event: any, d: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event: any, d: any) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragended(event: any, d: any) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }
  }, [initialNodes, initialLinks, selectedType, searchTerm]);

  // Find detailed suspect object if node is suspect
  const currentSuspect = selectedNode?.type === 'Suspect'
    ? MOCK_SUSPECTS.find((s) => s.suspect_id === selectedNode.id || s.full_name === selectedNode.name)
    : null;

  return (
    <div className="relative w-full h-full flex flex-col bg-slate-950 overflow-hidden">
      {/* Control Overlay Bar */}
      <div className="absolute top-3 left-3 right-3 z-20 flex flex-wrap items-center justify-between gap-3 bg-slate-900/90 backdrop-blur-md p-3 rounded-xl border border-slate-800 shadow-xl">
        <div className="flex items-center gap-2">
          <Network className="w-5 h-5 text-amber-500" />
          <div>
            <h2 className="text-xs font-bold text-slate-100 uppercase tracking-wider">
              Criminological Link Analysis Engine
            </h2>
            <p className="text-[10px] text-slate-400">
              Multi-Jurisdictional Node Network (Suspects, Aliases, Bank Mule Accounts, MOs)
            </p>
          </div>
        </div>

        {/* Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-none">
          {['All', 'Suspect', 'Alias', 'ModusOperandi', 'BankAccount', 'Location', 'FIR'].map((t) => (
            <button
              key={t}
              onClick={() => setSelectedType(t)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition whitespace-nowrap ${
                selectedType === t
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {t === 'ModusOperandi' ? 'Modus Operandi' : t === 'BankAccount' ? 'Bank Accounts' : t}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search network node..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-3 py-1 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500 w-48"
          />
        </div>
      </div>

      {/* D3 Graph Canvas Container */}
      <div ref={containerRef} className="w-full h-full">
        <svg ref={svgRef} className="w-full h-full" />
      </div>

      {/* Legend Overlay at bottom left */}
      <div className="absolute bottom-4 left-4 z-20 bg-slate-900/90 backdrop-blur-md p-2.5 rounded-xl border border-slate-800 text-[10px] flex items-center gap-3">
        <span className="flex items-center gap-1 text-red-400">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span> Suspect
        </span>
        <span className="flex items-center gap-1 text-purple-400">
          <span className="w-2.5 h-2.5 rounded-full bg-purple-400"></span> Alias
        </span>
        <span className="flex items-center gap-1 text-amber-400">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> MO
        </span>
        <span className="flex items-center gap-1 text-cyan-400">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-500"></span> Bank Mule
        </span>
        <span className="flex items-center gap-1 text-emerald-400">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Location
        </span>
      </div>

      {/* Node Detail Drawer */}
      {selectedNode && (
        <div className="absolute right-4 top-20 bottom-20 z-30 w-80 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-4 flex flex-col justify-between animate-in slide-in-from-right duration-200">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <Share2 className="w-4 h-4" />
                Network Node Dossier
              </span>
              <button
                onClick={() => setSelectedNode(null)}
                className="text-slate-400 hover:text-slate-200 p-1 rounded-lg hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-300">
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                <div className="text-[10px] text-slate-500 uppercase font-mono">{selectedNode.type} NODE</div>
                <div className="text-base font-bold text-slate-100">{selectedNode.name}</div>
                {selectedNode.district && (
                  <div className="text-[11px] text-amber-400 mt-0.5">📍 {selectedNode.district}</div>
                )}
              </div>

              {selectedNode.details && (
                <div>
                  <div className="text-[10px] text-slate-500 font-mono">NODE METADATA</div>
                  <div className="p-2 bg-slate-950 rounded border border-slate-800 text-slate-300">
                    {selectedNode.details}
                  </div>
                </div>
              )}

              {currentSuspect && (
                <div className="space-y-2 bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Criminal Risk Rating:</span>
                    <span className="font-bold text-red-400 text-sm">{currentSuspect.risk_score} / 10.0</span>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-500 block mb-1">Known Aliases:</span>
                    <div className="flex flex-wrap gap-1">
                      {currentSuspect.aliases.map((a) => (
                        <span key={a} className="bg-purple-950 text-purple-300 border border-purple-500/30 px-1.5 py-0.5 rounded text-[10px]">
                          {a}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-500 block mb-1">Status:</span>
                    <span className="font-bold text-amber-400 px-2 py-0.5 bg-amber-500/10 rounded border border-amber-500/30">
                      {currentSuspect.status}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 space-y-2">
            {currentSuspect && onOpenSuspectDossier && (
              <button
                onClick={() => onOpenSuspectDossier(currentSuspect)}
                className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-2 rounded-lg text-xs transition"
              >
                View Complete SCRB Criminal Dossier
              </button>
            )}

            <button
              onClick={() => {
                if (onTriggerAIBrief) {
                  onTriggerAIBrief(`Perform syndicate analysis on node ${selectedNode.name} (${selectedNode.type}).`);
                }
              }}
              className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-cyan-300 font-semibold py-2 rounded-lg text-xs transition border border-slate-700"
            >
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>AI Syndicate Synthesis</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
