"use client";

import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { CompanyNode, CompanyRelationship } from "@/types/company";

interface NetworkGraphProps {
  companies: CompanyNode[];
  relationships: CompanyRelationship[];
}

export default function NetworkGraph({ companies, relationships }: NetworkGraphProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [selectedNode, setSelectedNode] = useState<CompanyNode | null>(null);

  useEffect(() => {
    if (!svgRef.current || companies.length === 0) return;

    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;

    // Clear existing graph
    d3.select(svgRef.current).selectAll("*").remove();

    // Create container for zoom
    const svg = d3.select(svgRef.current);
    const g = svg.append("g");

    // Add zoom functionality
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.5, 5])
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
      });

    svg.call(zoom);

    // Create a tooltip
    const tooltip = d3.select(tooltipRef.current);

    // Convert relationships to links
    const links = relationships.map(rel => ({
      source: rel.source,
      target: rel.target,
      type: rel.type
    }));

    // Create force simulation
    const simulation = d3.forceSimulation<any, any>()
      .force("link", d3.forceLink().id((d: any) => d.id).distance(100))
      .force("charge", d3.forceManyBody().strength(-500))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collide", d3.forceCollide().radius(60));

    // Draw links
    const link = g.append("g")
      .selectAll("line")
      .data(links)
      .enter()
      .append("line")
      .attr("class", "link")
      .attr("stroke", "#4a5568")
      .attr("stroke-width", 1.5)
      .attr("stroke-dasharray", (d) => d.type === "owned_by" ? "0" : "5,5");

    // Draw nodes
    const node = g.append("g")
      .selectAll(".node")
      .data(companies)
      .enter()
      .append("g")
      .attr("class", "node")
      .call(d3.drag<SVGGElement, any>()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended))
      .on("click", (event, d) => {
        setSelectedNode(d);
        event.stopPropagation();
      })
      .on("mouseover", (event, d) => {
        tooltip.style("visibility", "visible")
          .html(`
            <div class="font-bold">${d.label}</div>
            ${d.industry ? `<div>Industry: ${d.industry}</div>` : ''}
            ${d.country ? `<div>Country: ${d.country}</div>` : ''}
            ${d.foundingYear ? `<div>Founded: ${d.foundingYear}</div>` : ''}
          `)
          .style("left", (event.pageX + 10) + "px")
          .style("top", (event.pageY - 20) + "px");
      })
      .on("mouseout", () => {
        tooltip.style("visibility", "hidden");
      });

    // Add circles to nodes
    node.append("circle")
      .attr("r", 20)
      .attr("fill", (d) => {
        // Generate color based on company ID for consistency
        const hash = d.id.split("").reduce((a, b) => {
          a = ((a << 5) - a) + b.charCodeAt(0);
          return a & a;
        }, 0);
        return d3.schemeCategory10[Math.abs(hash) % 10];
      })
      .attr("stroke", "#1a202c")
      .attr("stroke-width", 2);

    // Add text labels to nodes
    node.append("text")
      .text((d) => d.label)
      .attr("x", 25)
      .attr("y", 5)
      .attr("text-anchor", "start")
      .attr("fill", "#e2e8f0")
      .attr("font-size", "12px");

    // Define drag functions
    function dragstarted(event: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    function dragged(event: any) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    function dragended(event: any) {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }

    // Update node and link positions on each tick
    simulation.nodes(companies).on("tick", () => {
      link
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y);

      node.attr("transform", (d: any) => `translate(${d.x},${d.y})`);
    });

    simulation.force<d3.ForceLink<any, any>>("link")?.links(links);

    // Center view on initial load
    svg.call(zoom.transform, d3.zoomIdentity.translate(width/2, height/2).scale(0.8));

    // Handle window resize
    const handleResize = () => {
      if (!svgRef.current) return;
      const newWidth = svgRef.current.clientWidth;
      const newHeight = svgRef.current.clientHeight;

      simulation.force("center", d3.forceCenter(newWidth / 2, newHeight / 2));
      simulation.alpha(0.3).restart();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      simulation.stop();
    };
  }, [companies, relationships]);

  return (
    <div className="w-full h-full relative">
      <svg 
        ref={svgRef} 
        className="w-full h-full bg-gray-900/50 rounded-lg border border-gray-800"
      />
      <div 
        ref={tooltipRef} 
        className="absolute invisible bg-gray-800 p-2 rounded-md shadow-lg text-sm text-white border border-gray-700 z-10"
      />
      
      {selectedNode && (
        <div className="absolute top-4 right-4 bg-gray-800/90 p-4 rounded-lg border border-gray-700 max-w-xs">
          <h3 className="text-lg font-bold mb-2">{selectedNode.label}</h3>
          {selectedNode.industry && (
            <p className="text-sm mb-1"><span className="text-gray-400">Industry:</span> {selectedNode.industry}</p>
          )}
          {selectedNode.country && (
            <p className="text-sm mb-1"><span className="text-gray-400">Country:</span> {selectedNode.country}</p>
          )}
          {selectedNode.foundingYear && (
            <p className="text-sm mb-1"><span className="text-gray-400">Founded:</span> {selectedNode.foundingYear}</p>
          )}
          {selectedNode.url && (
            <a 
              href={selectedNode.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm text-cyan-400 hover:underline mt-2 inline-block"
            >
              View on Wikidata
            </a>
          )}
          <button 
            onClick={() => setSelectedNode(null)}
            className="absolute top-2 right-2 text-gray-400 hover:text-white"
            aria-label="Close"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}
