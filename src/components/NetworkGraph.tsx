"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import * as d3 from "d3";
import { CompanyNode, CompanyRelationship } from "@/types/company";
import GraphControls from "./GraphControls";

interface NetworkGraphProps {
  companies: CompanyNode[];
  relationships: CompanyRelationship[];
}

export default function NetworkGraph({ companies, relationships }: NetworkGraphProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const zoomRef = useRef<d3.ZoomBehavior<SVGSVGElement, unknown> | null>(null);

  // Set up dimensions on mount and resize
  useEffect(() => {
    const updateDimensions = () => {
      if (svgRef.current && svgRef.current.parentElement) {
        const { width, height } = svgRef.current.parentElement.getBoundingClientRect();
        setDimensions({ width, height });
      }
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    
    return () => {
      window.removeEventListener("resize", updateDimensions);
    };
  }, []);

  // Render the network graph
  useEffect(() => {
    if (!svgRef.current || !tooltipRef.current || companies.length === 0 || relationships.length === 0) return;

    const svg = d3.select(svgRef.current);
    const tooltip = d3.select(tooltipRef.current);
    
    // Clear previous graph
    svg.selectAll("*").remove();
    
    // Set up the simulation
    const simulation = d3.forceSimulation<d3.SimulationNodeDatum & CompanyNode>()
      .force("link", d3.forceLink<d3.SimulationNodeDatum, d3.SimulationLinkDatum<d3.SimulationNodeDatum>>().id((d: any) => d.id).distance(100))
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(dimensions.width / 2, dimensions.height / 2))
      .force("x", d3.forceX(dimensions.width / 2).strength(0.1))
      .force("y", d3.forceY(dimensions.height / 2).strength(0.1));
    
    // Convert data for D3
    const nodes = [...companies];
    const links = relationships.map(rel => ({
      source: rel.source,
      target: rel.target,
      type: rel.type
    }));
    
    // Create the link lines
    const link = svg.append("g")
      .attr("class", "links")
      .selectAll("line")
      .data(links)
      .enter()
      .append("line")
      .attr("class", "link")
      .attr("stroke-width", 1.5);
    
    // Create arrowhead marker definition for links
    svg.append("defs").selectAll("marker")
      .data(["owned_by"])
      .enter().append("marker")
      .attr("id", d => `arrow-${d}`)
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 20)
      .attr("refY", 0)
      .attr("markerWidth", 6)
      .attr("markerHeight", 6)
      .attr("orient", "auto")
      .append("path")
      .attr("fill", "#999")
      .attr("d", "M0,-5L10,0L0,5");
    
    // Apply markers to links
    link.attr("marker-end", d => `url(#arrow-${d.type})`);
    
    // Create the node circles
    const nodeGroup = svg.append("g")
      .attr("class", "nodes")
      .selectAll("g")
      .data(nodes)
      .enter()
      .append("g")
      .attr("class", "node-group")
      .call(d3.drag<SVGGElement, any>()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended));
    
    // Add circles to node groups
    nodeGroup.append("circle")
      .attr("r", 10)
      .attr("class", "node")
      .attr("fill", getNodeColor);
    
    // Add text labels to node groups
    nodeGroup.append("text")
      .attr("dx", 15)
      .attr("dy", ".35em")
      .attr("font-size", "12px")
      .attr("fill", "#fff")
      .text(d => d.label)
      .style("pointer-events", "none")
      .each(function(d) {
        // Truncate long labels
        const text = d3.select(this);
        const label = d.label;
        if (label.length > 20) {
          text.text(label.substring(0, 18) + "...");
        }
      });
    
    // Handle node hover events for tooltip
    nodeGroup
      .on("mouseover", function(event, d) {
        tooltip.style("opacity", 1)
          .html(tooltipContent(d))
          .style("left", (event.pageX + 10) + "px")
          .style("top", (event.pageY - 28) + "px");
        
        d3.select(this).select("circle")
          .transition()
          .duration(200)
          .attr("r", 13);
      })
      .on("mouseout", function() {
        tooltip.style("opacity", 0);
        
        d3.select(this).select("circle")
          .transition()
          .duration(200)
          .attr("r", 10);
      });
    
    // Set up the simulation tick behavior
    simulation
      .nodes(nodes as (d3.SimulationNodeDatum & CompanyNode)[])
      .on("tick", ticked);
    
    (simulation.force("link") as d3.ForceLink<d3.SimulationNodeDatum, d3.SimulationLinkDatum<d3.SimulationNodeDatum>>)
      .links(links as d3.SimulationLinkDatum<d3.SimulationNodeDatum>[]);
    
    // Functions for simulation behavior
    function ticked() {
      link
        .attr("x1", d => Math.max(10, Math.min(dimensions.width - 10, (d.source as any).x)))
        .attr("y1", d => Math.max(10, Math.min(dimensions.height - 10, (d.source as any).y)))
        .attr("x2", d => Math.max(10, Math.min(dimensions.width - 10, (d.target as any).x)))
        .attr("y2", d => Math.max(10, Math.min(dimensions.height - 10, (d.target as any).y)));
      
      nodeGroup.attr("transform", d => {
        const x = Math.max(10, Math.min(dimensions.width - 10, (d as any).x));
        const y = Math.max(10, Math.min(dimensions.height - 10, (d as any).y));
        return `translate(${x}, ${y})`;
      });
    }
    
    function dragstarted(event: d3.D3DragEvent<SVGGElement, any, any>) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }
    
    function dragged(event: d3.D3DragEvent<SVGGElement, any, any>) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }
    
    function dragended(event: d3.D3DragEvent<SVGGElement, any, any>) {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }
    
    // Create zoom behavior
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 4])
      .on("zoom", (event) => {
        svg.selectAll("g").attr("transform", event.transform.toString());
      });
    
    svg.call(zoom);
    
    // Store zoom reference for controls
    zoomRef.current = zoom;
    
    // Helper functions
    function getNodeColor(d: CompanyNode) {
      const colors = ["#00bcd4", "#4fc3f7", "#64ffda", "#80deea", "#b2ebf2"];
      // Simple hash function to consistently get a color based on company id
      const hash = d.id.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
      return colors[hash % colors.length];
    }
    
    function tooltipContent(d: CompanyNode) {
      let content = `<strong>${d.label}</strong>`;
      
      if (d.industry) {
        content += `<br/>Branche: ${d.industry}`;
      }
      
      if (d.country) {
        content += `<br/>Land: ${d.country}`;
      }
      
      if (d.foundingYear) {
        content += `<br/>Gegründet: ${d.foundingYear}`;
      }
      
      if (d.url) {
        content += `<br/><a href="${d.url}" target="_blank" rel="noopener noreferrer">Mehr Info</a>`;
      }
      
      return content;
    }
    
    // Clean up simulation on unmount
    return () => {
      simulation.stop();
    };
  }, [dimensions, companies, relationships]);
  
  // Zoom control handlers
  const handleZoomIn = useCallback(() => {
    if (svgRef.current && zoomRef.current) {
      const svg = d3.select<SVGSVGElement, unknown>(svgRef.current);
      zoomRef.current.scaleBy(svg.transition().duration(300) as any, 1.3);
    }
  }, []);

  const handleZoomOut = useCallback(() => {
    if (svgRef.current && zoomRef.current) {
      const svg = d3.select<SVGSVGElement, unknown>(svgRef.current);
      zoomRef.current.scaleBy(svg.transition().duration(300) as any, 0.7);
    }
  }, []);

  const handleReset = useCallback(() => {
    if (svgRef.current && zoomRef.current) {
      const svg = d3.select<SVGSVGElement, unknown>(svgRef.current);
      (svg.transition().duration(500) as any)
        .call(
          zoomRef.current.transform,
          d3.zoomIdentity.translate(dimensions.width / 2, dimensions.height / 2).scale(0.8)
        );
    }
  }, [dimensions]);
  
  return (
    <div className="relative w-full h-full">
      <svg 
        ref={svgRef} 
        width={dimensions.width} 
        height={dimensions.height}
        className="w-full h-full bg-[#191919]"
      />
      <div 
        ref={tooltipRef} 
        className="tooltip" 
        style={{ opacity: 0 }}
      />
      <GraphControls 
        onZoomIn={handleZoomIn} 
        onZoomOut={handleZoomOut} 
        onReset={handleReset} 
      />
    </div>
  );
}
