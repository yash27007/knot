import { Connection, Node } from "@/generated/prisma/client";
import toposort from "toposort";

export const topologicalSort = (
  nodes: Node[],
  connections: Connection[],
): Node[] => {
  // if no connections, return node as is ( they are all independent)
  if (connections.length === 0) return nodes;
  // create edges for toposort

  const edges: [string, string][] = connections.map((connection) => [
    connection.fromNodeId,
    connection.toNodeId,
  ]);

  // Collect connected node IDs
  const connectedNodeIds = new Set<string>();
  for (const connection of connections) {
    connectedNodeIds.add(connection.fromNodeId);
    connectedNodeIds.add(connection.toNodeId);
  }

  // Collect isolated nodes separately (don't add self-edges which would cause cycles)
  const isolatedNodeIds: string[] = [];
  for (const node of nodes) {
    if (!connectedNodeIds.has(node.id)) {
      isolatedNodeIds.push(node.id);
    }
  }

  // Perform topological sort
  let sortedNodeIds: string[];

  try {
    sortedNodeIds = toposort(edges);
    // Append isolated nodes at the end, then dedupe
    sortedNodeIds = [...new Set([...sortedNodeIds, ...isolatedNodeIds])];
  } catch (error) {
    if (error instanceof Error && error.message.includes("Cyclic")) {
      throw new Error("Workflow contains a cycle");
    }

    throw error;
  }

  const nodeMap = new Map(nodes.map((n) => [n.id, n]));
  return sortedNodeIds.map((id) => nodeMap.get(id)!).filter(Boolean);
};
