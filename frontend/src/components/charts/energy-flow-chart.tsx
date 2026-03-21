"use client";

import { useEffect, useRef } from "react";
import * as d3 from "d3";

interface HourlyData {
  hour: number;
  generation: number;
  consumption: number;
  surplus: number;
}

interface EnergyFlowChartProps {
  data: HourlyData[];
}

export function EnergyFlowChart({ data }: EnergyFlowChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!svgRef.current || !containerRef.current || data.length === 0) return;

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = 300;
    const margin = { top: 20, right: 20, bottom: 40, left: 50 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // Clear previous render
    d3.select(svgRef.current).selectAll("*").remove();

    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height);

    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Scales
    const x = d3
      .scaleLinear()
      .domain([0, 23])
      .range([0, innerWidth]);

    const maxY = Math.max(
      d3.max(data, (d) => d.generation) ?? 0,
      d3.max(data, (d) => d.consumption) ?? 0
    );

    const y = d3
      .scaleLinear()
      .domain([0, maxY * 1.15])
      .range([innerHeight, 0]);

    // Grid lines
    g.append("g")
      .attr("class", "grid")
      .selectAll("line")
      .data(y.ticks(5))
      .join("line")
      .attr("x1", 0)
      .attr("x2", innerWidth)
      .attr("y1", (d) => y(d))
      .attr("y2", (d) => y(d))
      .attr("stroke", "#e1e3e4")
      .attr("stroke-dasharray", "4,4")
      .attr("opacity", 0.5);

    // Area generators
    const areaGen = d3
      .area<HourlyData>()
      .x((d) => x(d.hour))
      .y0(innerHeight)
      .curve(d3.curveBasis);

    // Generation area (green gradient)
    const genGradient = svg
      .append("defs")
      .append("linearGradient")
      .attr("id", "gen-gradient")
      .attr("x1", "0")
      .attr("y1", "0")
      .attr("x2", "0")
      .attr("y2", "1");
    genGradient
      .append("stop")
      .attr("offset", "0%")
      .attr("stop-color", "#2ecc71")
      .attr("stop-opacity", 0.3);
    genGradient
      .append("stop")
      .attr("offset", "100%")
      .attr("stop-color", "#2ecc71")
      .attr("stop-opacity", 0.02);

    g.append("path")
      .datum(data)
      .attr(
        "d",
        areaGen.y1((d) => y(d.generation))
      )
      .attr("fill", "url(#gen-gradient)");

    // Consumption area (blue gradient)
    const conGradient = svg
      .select("defs")
      .append("linearGradient")
      .attr("id", "con-gradient")
      .attr("x1", "0")
      .attr("y1", "0")
      .attr("x2", "0")
      .attr("y2", "1");
    conGradient
      .append("stop")
      .attr("offset", "0%")
      .attr("stop-color", "#2c3e50")
      .attr("stop-opacity", 0.2);
    conGradient
      .append("stop")
      .attr("offset", "100%")
      .attr("stop-color", "#2c3e50")
      .attr("stop-opacity", 0.02);

    g.append("path")
      .datum(data)
      .attr(
        "d",
        areaGen.y1((d) => y(d.consumption))
      )
      .attr("fill", "url(#con-gradient)");

    // Line generators
    const lineGen = d3
      .line<HourlyData>()
      .x((d) => x(d.hour))
      .curve(d3.curveBasis);

    // Generation line
    g.append("path")
      .datum(data)
      .attr("d", lineGen.y((d) => y(d.generation)))
      .attr("fill", "none")
      .attr("stroke", "#2ecc71")
      .attr("stroke-width", 3);

    // Consumption line
    g.append("path")
      .datum(data)
      .attr("d", lineGen.y((d) => y(d.consumption)))
      .attr("fill", "none")
      .attr("stroke", "#2c3e50")
      .attr("stroke-width", 3);

    // Peak generation node (solar yellow)
    const peakGen = data.reduce((max, d) =>
      d.generation > max.generation ? d : max
    );
    g.append("circle")
      .attr("cx", x(peakGen.hour))
      .attr("cy", y(peakGen.generation))
      .attr("r", 6)
      .attr("fill", "#FDB813")
      .attr("stroke", "#fff")
      .attr("stroke-width", 2);

    // X axis
    g.append("g")
      .attr("transform", `translate(0,${innerHeight})`)
      .call(
        d3
          .axisBottom(x)
          .ticks(12)
          .tickFormat((d) => `${d}:00`)
      )
      .selectAll("text")
      .attr("fill", "#42474e")
      .style("font-size", "11px");

    // Y axis
    g.append("g")
      .call(
        d3
          .axisLeft(y)
          .ticks(5)
          .tickFormat((d) => `${d} kWh`)
      )
      .selectAll("text")
      .attr("fill", "#42474e")
      .style("font-size", "11px");

    // Remove axis lines (no-line rule)
    g.selectAll(".domain").remove();
    g.selectAll(".tick line").remove();

    // Legend
    const legend = g
      .append("g")
      .attr("transform", `translate(${innerWidth - 180}, -10)`);

    legend
      .append("line")
      .attr("x1", 0)
      .attr("x2", 20)
      .attr("y1", 5)
      .attr("y2", 5)
      .attr("stroke", "#2ecc71")
      .attr("stroke-width", 3);
    legend
      .append("text")
      .attr("x", 26)
      .attr("y", 9)
      .text("Generation")
      .attr("fill", "#42474e")
      .style("font-size", "12px");

    legend
      .append("line")
      .attr("x1", 110)
      .attr("x2", 130)
      .attr("y1", 5)
      .attr("y2", 5)
      .attr("stroke", "#2c3e50")
      .attr("stroke-width", 3);
    legend
      .append("text")
      .attr("x", 136)
      .attr("y", 9)
      .text("Usage")
      .attr("fill", "#42474e")
      .style("font-size", "12px");

    // Resize handler
    const handleResize = () => {
      if (containerRef.current) {
        const newWidth = containerRef.current.clientWidth;
        svg.attr("width", newWidth);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [data]);

  return (
    <div ref={containerRef} className="w-full">
      <svg ref={svgRef} className="w-full" />
    </div>
  );
}
