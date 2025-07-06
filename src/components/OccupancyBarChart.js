import React, { useRef, useEffect } from "react";
import * as d3 from "d3";

const OccupancyBarChart = ({ vehicles, width = 600, height = 300 }) => {
  const svgRef = useRef();

  // Count trains by occupancy status (including unknown)
  const counts = vehicles.reduce((acc, v) => {
    const status = v.occupancy || "unknown";
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});

  // Convert counts object to array for D3
  const data = Object.entries(counts).map(([key, value]) => ({
    status: key,
    count: value,
  }));

  useEffect(() => {
    if (!data.length) return;

    const margin = { top: 20, right: 20, bottom: 110, left: 50 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // clear previous contents

    // Create main group element
    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // X scale: occupancy status categories
    const x = d3
      .scaleBand()
      .domain(data.map((d) => d.status))
      .range([0, innerWidth])
      .padding(0.2);

    // Y scale: counts
    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.count)])
      .nice()
      .range([innerHeight, 0]);

    // X axis
    const xAxis = (g) =>
      g
        .attr("transform", `translate(0,${innerHeight})`)
        .call(d3.axisBottom(x))
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-0.8em")
        .attr("dy", "0.15em")
        .attr("transform", "rotate(-35)");

    // Y axis
    const yAxis = (g) =>
      g.call(d3.axisLeft(y).ticks(null, "d")).append("text")
        .attr("fill", "black")
        .attr("x", -margin.left)
        .attr("y", -10)
        .attr("text-anchor", "start")
        .text("Count");

    g.append("g").call(xAxis);
    g.append("g").call(yAxis);

    // Bars
    g.selectAll(".bar")
      .data(data)
      .join("rect")
      .attr("class", "bar")
      .attr("x", (d) => x(d.status))
      .attr("y", (d) => y(d.count))
      .attr("width", x.bandwidth())
      .attr("height", (d) => innerHeight - y(d.count))
      .attr("fill", "#4a90e2");

    // Optional: add count labels above bars
    g.selectAll(".label")
      .data(data)
      .join("text")
      .attr("class", "label")
      .attr("x", (d) => x(d.status) + x.bandwidth() / 2)
      .attr("y", (d) => y(d.count) - 5)
      .attr("text-anchor", "middle")
      .text((d) => d.count);
  }, [data, height, width]);

  return (
    <svg
      ref={svgRef}
      width={width}
      height={height}
      style={{ fontFamily: "sans-serif", fontSize: 12 }}
    />
  );
};

export default OccupancyBarChart;
