const graphCanvas = document.getElementById("graphCanvas");
const graphCtx = graphCanvas.getContext("2d");

const resultCanvas = document.getElementById("resultCanvas");
const resultCtx = resultCanvas.getContext("2d");

const adjacencyList = {};
const nodePositions = {};
let traversalSequence = [];

function generateRandomPosition() {
    return { x: Math.random() * 700 + 50, y: Math.random() * 200 + 50 };
}

function createEdge(source, target, weight) {
    if (!adjacencyList[source]) {
        adjacencyList[source] = [];
    }

    if (!nodePositions[source]) {
        nodePositions[source] = generateRandomPosition();
    }

    if (!nodePositions[target]) {
        nodePositions[target] = generateRandomPosition();
    }

    adjacencyList[source].push({ node: target, weight });
    renderGraph(graphCtx, adjacencyList, nodePositions);
}

function renderGraph(ctx, graph, positions) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    ctx.font = "14px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    for (let source in graph) {
        for (let edge of graph[source]) {
            const target = edge.node;
            const start = positions[source];
            const end = positions[target];

            ctx.beginPath();
            ctx.moveTo(start.x, start.y);
            ctx.lineTo(end.x, end.y);
            ctx.strokeStyle = "#666";
            ctx.stroke();

            const midX = (start.x + end.x) / 2;
            const midY = (start.y + end.y) / 2;
            ctx.fillStyle = "black";
            ctx.fillText(edge.weight, midX, midY);
        }
    }

    for (let node in positions) {
        const { x, y } = positions[node];

        ctx.beginPath();
        ctx.arc(x, y, 20, 0, 2 * Math.PI);
        ctx.fillStyle = "blue";
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = "white";
        ctx.fillText(node, x, y);
    }
}

function performBFS(startNode) {
    if (!adjacencyList[startNode]) {
        alert(`Node ${startNode} does not exist in the graph.`);
        return;
    }

    const visited = new Set();
    const queue = [startNode];
    traversalSequence = [];

    while (queue.length > 0) {
        const currentNode = queue.shift();
        if (!visited.has(currentNode)) {
            visited.add(currentNode);
            traversalSequence.push(currentNode);

            for (let neighbor of adjacencyList[currentNode] || []) {
                if (!visited.has(neighbor.node)) {
                    queue.push(neighbor.node);
                }
            }
        }
    }
    renderTraversal(resultCtx, traversalSequence);
}

function performDFS(startNode) {
    if (!adjacencyList[startNode]) {
        alert(`Node ${startNode} does not exist in the graph.`);
        return;
    }

    const visited = new Set();
    const stack = [startNode];
    traversalSequence = [];

    while (stack.length > 0) {
        const currentNode = stack.pop();
        if (!visited.has(currentNode)) {
            visited.add(currentNode);
            traversalSequence.push(currentNode);

            for (let neighbor of adjacencyList[currentNode] || []) {
                if (!visited.has(neighbor.node)) {
                    stack.push(neighbor.node);
                }
            }
        }
    }
    renderTraversal(resultCtx, traversalSequence);
}

function performUCS(startNode) {
    if (!adjacencyList[startNode]) {
        alert(`Node ${startNode} does not exist in the graph.`);
        return;
    }

    const visited = new Set();
    const priorityQueue = [{ node: startNode, cost: 0 }];
    traversalSequence = [];

    while (priorityQueue.length > 0) {
        priorityQueue.sort((a, b) => a.cost - b.cost);
        const current = priorityQueue.shift();

        if (!visited.has(current.node)) {
            visited.add(current.node);
            traversalSequence.push(current.node);

            for (let neighbor of adjacencyList[current.node] || []) {
                priorityQueue.push({
                    node: neighbor.node,
                    cost: current.cost + neighbor.weight,
                });
            }
        }
    }
    renderTraversal(resultCtx, traversalSequence);
}

function renderTraversal(ctx, sequence) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    const sequencePositions = {};
    let xOffset = 50;

    ctx.font = "14px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    sequence.forEach((node) => {
        sequencePositions[node] = { x: xOffset, y: 150 };
        xOffset += 100;
    });

    const traversalGraph = {};
    for (let i = 0; i < sequence.length - 1; i++) {
        const source = sequence[i];
        const target = sequence[i + 1];

        if (!traversalGraph[source]) {
            traversalGraph[source] = [];
        }
        traversalGraph[source].push({ node: target, weight: 1 });
    }

    renderGraph(ctx, traversalGraph, sequencePositions);
}

document.getElementById("add-edge-btn").addEventListener("click", () => {
    const source = document.getElementById("source-node").value.toUpperCase();
    const target = document.getElementById("target-node").value.toUpperCase();
    const weight = parseInt(document.getElementById("edge-weight").value, 10);

    if (!source || !target || isNaN(weight)) {
        alert("Please fill in all fields correctly before adding an edge.");
        return;
    }

    createEdge(source, target, weight);
});

document.getElementById("bfs-btn").addEventListener("click", () => {
    const startNode = prompt("Enter the starting node:").toUpperCase();
    if (startNode) performBFS(startNode);
});

document.getElementById("dfs-btn").addEventListener("click", () => {
    const startNode = prompt("Enter the starting node:").toUpperCase();
    if (startNode) performDFS(startNode);
});

document.getElementById("ucs-btn").addEventListener("click", () => {
    const startNode = prompt("Enter the starting node:").toUpperCase();
    if (startNode) performUCS(startNode);
});

document.getElementById("clear-graph").addEventListener("click", () => {
    traversalSequence = [];
    resultCtx.clearRect(0, 0, resultCanvas.width, resultCanvas.height);
    graphCtx.clearRect(0, 0, graphCanvas.width, graphCanvas.height);

    for (let key in adjacencyList) {
        delete adjacencyList[key];
    }
    for (let key in nodePositions) {
        delete nodePositions[key];
    }
});
