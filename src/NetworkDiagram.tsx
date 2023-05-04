import React, { useRef, useEffect } from "react";
import * as d3 from "d3";

const NetworkDiagram = ({ data }) => {
    const svgRef = useRef(null);
    useEffect(() => {
        data = JSON.parse(data)
        const { activitiesParams, network } = data;

        const width = 800;
        const height = 500;
        const margin = { top: 20, right: 20, bottom: 20, left: 20 };

        const svg = d3.select(svgRef.current)
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left}, ${margin.top})`);

        // Create nodes
        const nodes = Object.keys(activitiesParams).map((taskId, i) => ({
            id: taskId,
            x: i % 2 === 0 ? 200 : 600,
            y: 100 + Math.floor(i / 2) * 200,
        }));
        function getNodePosition(nodeId) {
            const node = nodes.find((n) => n.id === nodeId);
            console.log({ x: node.x, y: node.y })
            return { x: node.x, y: node.y };
        }

        nodes.push({ id: "__start", x: 50, y: 250 }, { id: "__end", x: 750, y: 250 });

        svg.selectAll("circle")
            .data(nodes)
            .enter()
            .append("circle")
            .attr("r", 10)
            .attr("cx", (d) => d.x)
            .attr("cy", (d) => d.y)
            .classed("special", (d) => d.id === "__start" || d.id === "__end")
            .classed("task", (d) => d.id !== "__start" && d.id !== "__end");

        svg.selectAll("text")
            .data(nodes)
            .enter()
            .append("text")
            .attr("x", (d) => d.x + 10)
            .attr("y", (d) => d.y + 10)
            .text((d) => d.id);

        // Create edges
        const edges = Object.entries(network)
            .flatMap(([sourceId, { successors }]) =>
                successors.map((targetId) => ({ source: sourceId, target: targetId }))
            );

        svg.selectAll("line")
            .data(edges)
            .enter()
            .append("line")
            .attr("x1", (d) => getNodePosition(d.source).x)
            .attr("y1", (d) => getNodePosition(d.source).y)
            .attr("x2", (d) => getNodePosition(d.target).x)
            .attr("y2", (d) => getNodePosition(d.target).y)
            .classed("edge", true)
            .attr("marker-end", "url(#triangle)")
            .attr("stroke-width", 1)
            .attr("stroke", "black");

        // Create marker
        svg.append("defs").append("marker")
            .attr("id", "triangle")
            .attr("refX", 22)
            .attr("refY", 6)
            .attr("markerWidth", 30)
            .attr("markerHeight", 30)
            .attr("orient", "auto")
            .append("path")
            .attr("d", "M 0 0 12 6 0 12 3 6")
            .style("fill", "pink");

    }, [data]);

    return <svg ref={svgRef}></svg>;
};
export default NetworkDiagram;
