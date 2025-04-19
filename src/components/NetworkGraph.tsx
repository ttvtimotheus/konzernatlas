"use client";

import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { CompanyNode, CompanyRelationship } from '@/types/company';
import { CRITIQUE_MESSAGES } from '@/data/topCorporations';

interface NetworkGraphProps {
  companies: CompanyNode[];
  relationships: CompanyRelationship[];
  onNodeClick?: (companyId: string) => void;
}

// Zufällige kapitalismuskritische Nachricht auswählen
const getRandomCritique = () => {
  return CRITIQUE_MESSAGES[Math.floor(Math.random() * CRITIQUE_MESSAGES.length)];
};

export default function NetworkGraph({ companies, relationships, onNodeClick }: NetworkGraphProps) {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const [critiqueMessage, setCritiqueMessage] = useState<string>('');

  useEffect(() => {
    if (!svgRef.current || companies.length === 0) return;

    const svg = d3.select(svgRef.current);
    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;
    const tooltip = d3.select(tooltipRef.current);

    // Clear any existing elements
    svg.selectAll('*').remove();

    // Create a container group for all elements to enable zooming
    const container = svg.append('g');

    // Create the simulation with improved forces
    const simulation = d3.forceSimulation(companies as d3.SimulationNodeDatum[])
      .force('link', d3.forceLink(relationships)
        .id((d: any) => d.id)
        .distance(d => {
          // Distanz basierend auf Beziehungstyp anpassen
          const rel = d as unknown as CompanyRelationship;
          return rel.type === 'full' ? 120 : 150;
        }))
      .force('charge', d3.forceManyBody().strength(-350))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('x', d3.forceX(width / 2).strength(0.05))
      .force('y', d3.forceY(height / 2).strength(0.05))
      .force('collision', d3.forceCollide().radius(30));

    // Hintergrund für Zoom-Interaktionen
    container.append('rect')
      .attr('width', width)
      .attr('height', height)
      .attr('fill', 'none')
      .attr('pointer-events', 'all');

    // Links mit unterschiedlichen Stilen basierend auf Beziehungstyp
    const link = container.append('g')
      .selectAll('line')
      .data(relationships)
      .enter().append('line')
      .attr('class', 'link')
      .attr('stroke-width', d => d.type === 'full' ? 2 : 1)
      .attr('stroke-dasharray', d => d.type === 'partial' ? '5,5' : null)
      .attr('marker-end', d => `url(#arrow-${d.type})`);

    // Pfeilspitzen für verschiedene Beziehungstypen
    const defs = svg.append('defs');

    ['full', 'partial', 'owner'].forEach(type => {
      defs.append('marker')
        .attr('id', `arrow-${type}`)
        .attr('viewBox', '0 -5 10 10')
        .attr('refX', 25)
        .attr('refY', 0)
        .attr('orient', 'auto')
        .attr('markerWidth', 6)
        .attr('markerHeight', 6)
        .append('path')
        .attr('d', 'M0,-5L10,0L0,5')
        .attr('fill', type === 'full' ? 'var(--primary)' : 
                     type === 'partial' ? 'var(--secondary)' : 'var(--muted)');
    });

    // Knoten mit unterschiedlichen Stilen basierend auf nodeType
    const node = container.append('g')
      .selectAll('circle')
      .data(companies)
      .enter().append('circle')
      .attr('class', d => `node node-${d.nodeType || 'default'}`)
      .attr('r', d => {
        // Größe basierend auf Knotentyp
        if (d.nodeType === 'main') return 18;
        if (d.nodeType === 'holding') return 14;
        if (d.nodeType === 'parent') return 12;
        return 10; // Standardgröße für andere Knotentypen
      })
      .attr('fill', d => {
        // Farbe basierend auf Knotentyp
        switch(d.nodeType) {
          case 'main': return '#ffffff';
          case 'holding': return 'var(--tertiary)';
          case 'parent': return 'var(--tertiary)';
          case 'full-ownership': return 'var(--primary)';
          case 'partial-ownership': return 'var(--secondary)';
          default: return '#64ffda';
        }
      })
      .attr('stroke', d => d.nodeType === 'holding' || d.nodeType === 'parent' ? 'var(--foreground)' : 'none')
      .attr('stroke-width', d => d.nodeType === 'holding' || d.nodeType === 'parent' ? 1.5 : 0)
      .classed('pulse-animation', d => d.nodeType === 'main') // Hauptunternehmen pulsieren
      .call(d3.drag<SVGCircleElement, any>()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended) as any);

    // Verbesserte Knotenbeschriftungen
    const labels = container.append('g')
      .selectAll('text')
      .data(companies)
      .enter().append('text')
      .attr('dx', 15)
      .attr('dy', '.35em')
      .attr('class', 'node-label')
      .text(d => d.label)
      .style('fill', 'var(--foreground)')
      .style('font-size', d => d.nodeType === 'main' ? '14px' : '12px')
      .style('font-weight', d => d.nodeType === 'main' ? 'bold' : 'normal')
      .style('pointer-events', 'none')
      .style('text-shadow', '1px 1px 2px rgba(0,0,0,0.8)');

    // Verbesserte Tooltip-Interaktion mit kapitalismuskritischen Nachrichten
    node.on('mouseover', function(event, d: CompanyNode) {
      // Kritische Nachricht generieren
      setCritiqueMessage(getRandomCritique());

      const industry = d.industry ? `<div class="text-sm text-gray-300"><span class="font-bold">Branche:</span> ${d.industry}</div>` : '';
      const country = d.country ? `<div class="text-sm text-gray-300"><span class="font-bold">Land:</span> ${d.country}</div>` : '';
      const founded = d.inception ? `<div class="text-sm text-gray-300"><span class="font-bold">Gegründet:</span> ${d.inception}</div>` : '';

      tooltip.style('display', 'block')
        .html(`
          <div class="font-bold text-base mb-1">${d.label}</div>
          ${industry}
          ${country}
          ${founded}
          ${d.nodeType === 'full-ownership' ? '<div class="text-xs text-red-400 mt-1">Vollständig kontrolliert</div>' : ''}
          ${d.nodeType === 'partial-ownership' ? '<div class="text-xs text-orange-400 mt-1">Teilweise kontrolliert</div>' : ''}
          ${d.nodeType === 'holding' ? '<div class="text-xs text-gray-400 mt-1">Finanzholding</div>' : ''}
          <div class="critique-message mt-2">${critiqueMessage}</div>
        `)
        .style('left', (event.pageX + 10) + 'px')
        .style('top', (event.pageY - 20) + 'px');

      // Hervorheben des Knotens und verbundener Kanten
      d3.select(this)
        .transition()
        .duration(200)
        .attr('r', (d: any) => {
          const currentRadius = parseFloat(d3.select(this).attr('r'));
          return currentRadius * 1.2;
        })
        .attr('stroke', 'var(--highlight)')
        .attr('stroke-width', 2);

      // Verbundene Links hervorheben
      link.each(function(l: any) {
        if (l.source.id === d.id || l.target.id === d.id) {
          d3.select(this)
            .transition()
            .duration(200)
            .attr('stroke-opacity', 0.8)
            .attr('stroke-width', l.type === 'full' ? 3 : 2);
        }
      });
    })
    .on('mousemove', function(event) {
      tooltip
        .style('left', (event.pageX + 15) + 'px')
        .style('top', (event.pageY - 30) + 'px');
    })
    .on('mouseout', function(event, d: any) {
      tooltip.style('display', 'none');

      // Knoten-Stil zurücksetzen
      d3.select(this)
        .transition()
        .duration(200)
        .attr('r', function(d: any) {
          if (d.nodeType === 'main') return 18;
          if (d.nodeType === 'holding') return 14;
          if (d.nodeType === 'parent') return 12;
          return 10;
        })
        .attr('stroke', (d: any) => d.nodeType === 'holding' || d.nodeType === 'parent' ? 'var(--foreground)' : 'none')
        .attr('stroke-width', (d: any) => d.nodeType === 'holding' || d.nodeType === 'parent' ? 1.5 : 0);

      // Links zurücksetzen
      link.transition()
        .duration(200)
        .attr('stroke-opacity', 0.5)
        .attr('stroke-width', d => d.type === 'full' ? 2 : 1);
    })
    .on('click', function(event, d: CompanyNode) {
      if (onNodeClick && d.id) {
        event.preventDefault();
        onNodeClick(d.id);
      }
    });

    // Update positions on simulation tick
    simulation.on('tick', () => {
      // Begrenze Positionen innerhalb des sichtbaren Bereichs
      companies.forEach((d: any) => {
        d.x = Math.max(50, Math.min(width - 50, d.x));
        d.y = Math.max(50, Math.min(height - 50, d.y));
      });

      link
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y);

      node
        .attr('cx', (d: any) => d.x)
        .attr('cy', (d: any) => d.y);

      labels
        .attr('x', (d: any) => d.x)
        .attr('y', (d: any) => d.y);
    });

    // Sanfte Zoom-Funktionalität
    const zoom = d3.zoom()
      .scaleExtent([0.3, 3])
      .on('zoom', (event) => {
        container.attr('transform', event.transform);
      });

    svg.call(zoom as any);

    // Drag-Funktionen mit verbesserter Interaktion
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
      // Hauptknoten fixiert lassen, andere freigeben
      if (d.nodeType !== 'main') {
        d.fx = null;
        d.fy = null;
      }
    }

    // Startup-Animation für flüssiges Erscheinen
    companies.forEach((d: any, i: number) => {
      const delay = i * 50;
      d.x = width / 2;
      d.y = height / 2;
    });

    simulation.alpha(1).restart();

    return () => {
      simulation.stop();
    };
  }, [companies, relationships, onNodeClick, critiqueMessage]);

  return (
    <div className="relative network-container">
      {/* Informative Layer über dem Graphen */}
      <div className="absolute top-4 left-4 z-10 bg-opacity-80 bg-[#1c1c1e] p-3 rounded-lg border border-[#333] max-w-xs">
        <h3 className="text-sm font-bold mb-2">Konzernverflechtungen</h3>
        <div className="text-xs space-y-1">
          <div className="flex items-center">
            <span className="inline-block w-3 h-3 rounded-full bg-[var(--primary)] mr-2"></span>
            <span>Vollbesitz (&gt;50%)</span>
          </div>
          <div className="flex items-center">
            <span className="inline-block w-3 h-3 rounded-full bg-[var(--secondary)] mr-2"></span>
            <span>Teilbesitz</span>
          </div>
          <div className="flex items-center">
            <span className="inline-block w-3 h-3 rounded-full border border-white bg-[var(--tertiary)] mr-2"></span>
            <span>Holdings / Finanzstrukturen</span>
          </div>
        </div>
      </div>
      
      {/* Hauptgraph */}
      <svg ref={svgRef} width="100%" height="100%"></svg>
      
      {/* Verbesserter Tooltip */}
      <div 
        ref={tooltipRef} 
        className="tooltip" 
        style={{ display: 'none' }}
      ></div>
      
      {/* Minimalistisches Bedienungshinweis */}
      <div className="absolute bottom-4 right-4 text-xs text-gray-500">
        Zoom mit Scrollrad, Verschieben mit Drag & Drop
      </div>
    </div>
  );
}
