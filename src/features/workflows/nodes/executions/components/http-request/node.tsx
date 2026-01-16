"use client"

import type { Node, NodeProps, useReactFlow } from "@xyflow/react"

import { GlobeIcon } from "lucide-react"
import { memo } from "react";
import { BaseExecutionNode } from "../base-execution-node";

type HttpRequestNodeData = {
    endpoint?: string,
    method?: "GET" | "PUT" | "POST" | "PATCH" | "DELETE";
    body?: string;
    [key:string] : unknown;
};

type HttpRequestNodeType = Node<HttpRequestNodeData>;

export const HttpRequestNode = memo((props:NodeProps<HttpRequestNodeType>)=>{
const nodeData = props.data as HttpRequestNodeData
const description = nodeData?.endpoint
? `${nodeData.method || "GET"}: ${nodeData.endpoint}`
: "Not Configured"

return (
    <>
    <BaseExecutionNode
    {...props}
    id={props.id}
    icon={GlobeIcon}
    name="HTTP Request"
    description={description}
    onSetting={()=>{}}
    onDoubleClick={()=>{}}
    />
    </>
)
})

HttpRequestNode.displayName = "HttpRequestNode";