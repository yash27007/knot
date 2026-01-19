import { NonRetriableError } from "inngest";
import { NodeExecutor } from "../../../executions/types";
import ky, { type Options as KyOps } from "ky"


type HttpRequestData = {
  endpoint?: string;
  method?: "GET" | "PUT" | "POST" | "PATCH" | "DELETE";
  body?: string;
};

export const HttpRequestExecutor: NodeExecutor<HttpRequestData> = async ({
  nodeId,
  context,
  data,
  step,
}) => {
  // TODO PUBLISH loading state for manual trigger
  if (!data.endpoint) {
    throw new NonRetriableError("HTTP Request node: No endpoint configured");
  }

  let endpointURL : URL;
  try{
    endpointURL = new URL(data.endpoint);

  }catch{
    throw new NonRetriableError("HTTP Request Node: Invalid URL endpoint")
  }
  if(!["http:","https:"].includes(endpointURL.protocol)){
    throw new NonRetriableError("HTTP Request Node: Unsupported Protocol")
  }

  const response = await step.run(`http-request-${nodeId}`,async ()=>{
    const method = data.method || "GET"
    const endpoint = endpointURL.toString()
    const options: KyOps = { method}
    if(["POST","PUT","PATCH"].includes(method)){
        options.body = data.body
    }

    const response = await ky(endpoint,options)
    const contentType = response.headers.get("content-type")
    const responseData = contentType?.includes("application/json")
    ? await response.json()
    : await response.text()

    return{
      ...context,
      httpResponse: {
        status: response.status,
        statusText:response.statusText,
        data: responseData

      }
    }
  })

  // TODO Publish success State for maual trigger
  return response;
};
