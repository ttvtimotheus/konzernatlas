"use client";

import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { styled } from '@/styles/stitches.config';
import { CompanyNode, CompanyRelationship } from '@/types/company';

// Styled Components für die Grafik
const GraphContainer = styled('div', {
  width: '100%',
  height: '75vh',
  border: '1px solid $gray8',
  borderRadius: '$lg',
  overflow: 'hidden',
  position: 'relative',
  backgroundColor: '$tertiary',
  boxShadow: 'inset 0 0 50px rgba(0, 0, 0, 0.2)',
});

const GraphSvg = styled('svg', {
  width: '100%',
  height: '100%',
});

const GraphControls = styled('div', {
  position: 'absolute',
  top: '$4',
  right: '$4',
  display: 'flex',
  gap: '$2',
  zIndex: 10,
});

const ControlButton = styled('button', {
  background: 'rgba(28, 28, 30, 0.8)',
  border: '1px solid $gray8',
  borderRadius: '$sm',
  color: '$gray11',
  padding: '$2',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  transition: '$fast',
  
  '&:hover': {
    background: 'rgba(40, 40, 45, 0.9)',
    color: '$foreground',
    borderColor: '$gray7',
  },
  
  '& svg': {
    width: 18,
    height: 18,
  },
});

const Tooltip = styled('div', {
  position: 'absolute',
  backgroundColor: 'rgba(28, 28, 30, 0.95)',
  color: '$foreground',
  padding: '$4',
  borderRadius: '$default',
  boxShadow: '0 6px 16px rgba(0, 0, 0, 0.3)',
  maxWidth: '320px',
  pointerEvents: 'none',
  zIndex: 100,
  opacity: 0,
  transform: 'translateY(10px)',
  transition: 'opacity 0.2s, transform 0.2s',
  borderLeft: '3px solid $primary',
  fontSize: '$sm',
  lineHeight: '$normal',
});

const TooltipCompanyName = styled('h4', {
  fontSize: '$lg',
  fontWeight: '$bold',
  marginBottom: '$2',
  fontFamily: '$mono',
});

const TooltipInfo = styled('p', {
  marginBottom: '$2',
});

const TooltipMeta = styled('div', {
  display: 'flex',
  justifyContent: 'space-between',
  marginTop: '$3',
  fontSize: '$xs',
  color: '$gray9',
  borderTop: '1px solid $gray8',
  paddingTop: '$2',
});

const TooltipCritique = styled('div', {
  fontStyle: 'italic',
  marginTop: '$3',
  color: '$gray10',
  fontSize: '$xs',
  borderLeft: '2px solid $primary',
  paddingLeft: '$2',
});

const Legend = styled('div', {
  position: 'absolute',
  bottom: '$4',
  left: '$4',
  background: 'rgba(28, 28, 30, 0.8)',
  padding: '$3',
  borderRadius: '$default',
  display: 'flex',
  flexDirection: 'column',
  gap: '$2',
  fontSize: '$xs',
  zIndex: 10,
  backdropFilter: 'blur(4px)',
  border: '1px solid $gray8',
});

const LegendItem = styled('div', {
  display: 'flex',
  alignItems: 'center',
  gap: '$2',
});

const LegendColor = styled('div', {
  width: '12px',
  height: '12px',
  borderRadius: '50%',
  flexShrink: 0,
  
  variants: {
    type: {
      main: { background: '$gray12' },
      full: { background: '$primary' },
      partial: { background: '$secondary' },
      holding: { background: '$tertiary', border: '1px solid $gray9' },
    },
  },
});

// Zufällige kapitalismuskritische Nachrichten für Tooltips
const criticalTooltips = [
  "Konzerne definieren die Grenzen unserer Freiheit.",
  "Wenn Macht konzentriert wird, leidet Demokratie.",
  "Marktkonzentration führt zu Preissteigerungen.",
  "Wer die Infrastruktur besitzt, kontrolliert die Zukunft.",
  "Monopolbildung ist die logische Folge unregulierten Kapitalismus.",
  "Unternehmensverflechtungen sind die unsichtbaren Fäden der Macht.",
  "Globaler Kapitalismus kennt keine Grenzen, nur Profitmargen.",
  "Ein Konzern ist ein Staat ohne Staatsbürger.",
  "Die Dividende von heute ist die Ungleichheit von morgen.",
];

const getRandomCriticalTooltip = () => {
  return criticalTooltips[Math.floor(Math.random() * criticalTooltips.length)];
};

// Hauptkomponente
interface NetworkGraphProps {
  companies: CompanyNode[];
  relationships: CompanyRelationship[];
  onNodeClick?: (companyId: string) => void;
}

const StyledNetworkGraph: React.FC<NetworkGraphProps> = ({ companies, relationships, onNodeClick }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [isZooming, setIsZooming] = useState(false);
  
  // Graph-Visualisierung mit D3
  useEffect(() => {
    if (!containerRef.current || !svgRef.current || companies.length === 0) return;
    // Wir rendern jetzt auch, wenn keine Beziehungen vorhanden sind (relationships.length === 0)
    
    // Container-Dimensionen
    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;
    
    // SVG und Containers löschen
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();
    
    // Tooltip-Element
    const tooltip = d3.select(tooltipRef.current);
    
    // Haupt-Container erstellen
    const container = svg.append("g");
    
    // Zoom-Funktion
    const zoom = d3.zoom()
      .scaleExtent([0.2, 5])
      .on("zoom", (event) => {
        container.attr("transform", event.transform);
        setIsZooming(true);
        setTimeout(() => setIsZooming(false), 100);
      });
    
    svg.call(zoom as any);
    
    // Force-Directed Graph erstellen
    const simulation = d3.forceSimulation(companies as d3.SimulationNodeDatum[])
      .force("link", d3.forceLink(relationships)
        .id((d: any) => d.id)
        .distance(100))
      .force("charge", d3.forceManyBody().strength(-400))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("x", d3.forceX(width / 2).strength(0.1))
      .force("y", d3.forceY(height / 2).strength(0.1));
    
    // Verbindungen zeichnen
    const links = container.append("g")
      .attr("class", "links")
      .selectAll("line")
      .data(relationships)
      .enter()
      .append("line")
      .attr("class", "link")
      .attr("stroke", "#333")
      .attr("stroke-opacity", 0.6)
      .attr("stroke-width", (d) => d.value || 1);
    
    // Knoten zeichnen
    const nodes = container.append("g")
      .attr("class", "nodes")
      .selectAll(".node")
      .data(companies)
      .enter()
      .append("g")
      .attr("class", "node")
      .style("cursor", "pointer");
    
    // Knotenform
    nodes.append("circle")
      .attr("r", (d) => d.nodeType === 'main' ? 20 : 15)
      .attr("fill", (d) => {
        switch (d.nodeType) {
          case 'main':
            return '#f0f0f0';  // Hauptunternehmen (weiß)
          case 'full-ownership':
            return '#ff3b30';  // Volle Besitzanteile (rot)
          case 'partial-ownership':
            return '#ff9500';  // Teilbesitz (orange)
          default:
            return '#1c1c1e';  // Holdings (dunkelgrau)
        }
      })
      .attr("stroke", (d) => d.nodeType === 'main' ? '#ff3b30' : (d.nodeType === 'holding' ? '#f0f0f0' : 'none'))
      .attr("stroke-width", 1.5);
      
    // Pulsieren für Hauptknoten
    nodes.filter(d => d.nodeType === 'main')
      .append("circle")
      .attr("r", 20)
      .attr("fill", "none")
      .attr("stroke", "#ff3b30")
      .attr("stroke-width", 1)
      .attr("opacity", 0.7)
      .attr("class", "pulse");
    
    // Labels für Knoten
    nodes.append("text")
      .attr("dy", (d) => d.nodeType === 'main' ? -28 : -20)
      .attr("text-anchor", "middle")
      .text(d => d.label?.length > 20 ? d.label.substring(0, 20) + '...' : d.label)
      .attr("fill", "#f0f0f0")
      .attr("font-size", (d) => d.nodeType === 'main' ? "14px" : "12px")
      .attr("font-weight", (d) => d.nodeType === 'main' ? "bold" : "normal")
      .attr("pointer-events", "none");
    
    // Tooltip und Interaktivität
    nodes.on("mouseover", function(event, d) {
      // Hover-Effekt
      d3.select(this).select("circle").transition()
        .attr("r", (d: any) => (d.nodeType === 'main' ? 24 : 18));
      
      // Verbundene Knoten markieren
      const connectedNodeIds = relationships
        .filter(rel => rel.source === d.id || rel.target === d.id)
        .flatMap(rel => [rel.source, rel.target]);
      
      nodes.filter((node: any) => connectedNodeIds.includes(node.id))
        .select("circle")
        .transition()
        .attr("stroke", "#ff3b30")
        .attr("stroke-width", 2);
      
      // Verbundene Links markieren
      links.filter((link: any) => link.source.id === d.id || link.target.id === d.id)
        .transition()
        .attr("stroke", "#ff3b30")
        .attr("stroke-opacity", 1)
        .attr("stroke-width", (d: any) => (d.value || 1) + 1);
      
      // Tooltip-Position
      const [x, y] = d3.pointer(event, containerRef.current);
      tooltip
        .style("left", `${x + 20}px`)
        .style("top", `${y - 20}px`)
        .style("opacity", "1")
        .style("transform", "translateY(0)");
      
      // Tooltip-Inhalt
      tooltip.html(`
        <div>
          <h4 class="tooltip-company-name">${d.label}</h4>
          <p class="tooltip-info">${d.description || 'Keine Beschreibung verfügbar'}</p>
          ${d.founded ? `<p class="tooltip-info">Gegründet: ${d.founded}</p>` : ''}
          ${d.headquarters ? `<p class="tooltip-info">Hauptsitz: ${d.headquarters}</p>` : ''}
          <div class="tooltip-meta">
            <span>Typ: ${d.nodeType === 'main' ? 'Hauptunternehmen' : 
              d.nodeType === 'full-ownership' ? 'Vollständiger Besitz' : 
              d.nodeType === 'partial-ownership' ? 'Teilbesitz' : 'Holding'}</span>
            ${d.wikidata ? `<a href="https://www.wikidata.org/wiki/${d.wikidata}" target="_blank">Wikidata</a>` : ''}
          </div>
          <div class="tooltip-critique">${getRandomCriticalTooltip()}</div>
        </div>
      `);
    })
    .on("mouseout", function(event, d) {
      // Hover-Effekt zurücksetzen
      d3.select(this).select("circle").transition()
        .attr("r", (d: any) => (d.nodeType === 'main' ? 20 : 15));
      
      // Verbundene Knoten zurücksetzen
      nodes.select("circle")
        .transition()
        .attr("stroke", (d: any) => d.nodeType === 'main' ? '#ff3b30' : (d.nodeType === 'holding' ? '#f0f0f0' : 'none'))
        .attr("stroke-width", 1.5);
      
      // Verbundene Links zurücksetzen
      links.transition()
        .attr("stroke", "#333")
        .attr("stroke-opacity", 0.6)
        .attr("stroke-width", (d: any) => d.value || 1);
      
      // Tooltip ausblenden
      tooltip
        .style("opacity", "0")
        .style("transform", "translateY(10px)");
    })
    .on("click", function(event, d) {
      event.preventDefault();
      if (onNodeClick) {
        onNodeClick(d.id);
      }
    });
    
    // Simulation-Update bei jedem Tick
    simulation.on("tick", () => {
      links
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y);
      
      nodes.attr("transform", (d: any) => `translate(${d.x}, ${d.y})`);
    });
    
    // Initialer Zoom, um den gesamten Graphen zu zeigen
    const initialScale = 0.8;
    svg.call(
      (zoom as any).transform,
      d3.zoomIdentity
        .translate(width / 2, height / 2)
        .scale(initialScale)
        .translate(-width / 2, -height / 2)
    );
    
    // Aufräumen bei Komponenten-Unmount
    return () => {
      simulation.stop();
    };
  }, [companies, relationships, onNodeClick]);
  
  // Reset-Zoom Funktion
  const handleResetZoom = () => {
    if (!svgRef.current) return;
    
    const svg = d3.select(svgRef.current);
    const width = containerRef.current?.clientWidth || 0;
    const height = containerRef.current?.clientHeight || 0;
    
    const initialScale = 0.8;
    svg.transition().duration(750).call(
      (d3.zoom() as any).transform,
      d3.zoomIdentity
        .translate(width / 2, height / 2)
        .scale(initialScale)
        .translate(-width / 2, -height / 2)
    );
  };
  
  return (
    <GraphContainer ref={containerRef}>
      <GraphSvg ref={svgRef}></GraphSvg>
      
      <GraphControls>
        <ControlButton onClick={handleResetZoom} title="Zoom zurücksetzen">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </ControlButton>
      </GraphControls>
      
      <Tooltip ref={tooltipRef}></Tooltip>
      
      <Legend>
        <LegendItem>
          <LegendColor type="main" />
          <span>Hauptunternehmen</span>
        </LegendItem>
        <LegendItem>
          <LegendColor type="full" />
          <span>Voller Besitz</span>
        </LegendItem>
        <LegendItem>
          <LegendColor type="partial" />
          <span>Teilbesitz</span>
        </LegendItem>
        <LegendItem>
          <LegendColor type="holding" />
          <span>Beteiligung</span>
        </LegendItem>
      </Legend>
    </GraphContainer>
  );
};

export default StyledNetworkGraph;
