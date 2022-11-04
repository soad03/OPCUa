import { AttributeIds, ClientSession,DataValue, OPCUAClient, SecurityPolicy } from "node-opcua-client";
import { ArcelikPilotConfig, ClientResponse, ClientVariablesResponse, Node, Server } from "../types";

export async function connectToPLC(server: Server):Promise<OPCUAClient | Error>  {
    console.log(`Connecting to ${server.url}`);
    
    const connectionStrategy = {
        maxRetry: 1,
        initialDelay: 1000
    }
    const serverConnectionConfiguration = {
        endpointMustExist: false,
        securityPolicy: SecurityPolicy.None,
        applicationName: "WoT-IL",
        connectionStrategy: connectionStrategy
    }
    const client = OPCUAClient.create(serverConnectionConfiguration);
    try {
        await client.connect(server.url)
    } catch (error) {
        return new Error(error as string)
    }
    return client
}

export const disconnect = async (client: OPCUAClient) => {
    client.disconnect()
}

export const createSubscription = () => {

}

async function readValuesFromNode(session: ClientSession, node_id: string) {
    return await session.read({ nodeId: node_id, attributeId: AttributeIds.Value })
}

export const runForServerConfiguration = async (serverConfig: ArcelikPilotConfig[]): Promise<ClientResponse[] | Error> => {
    const result: ClientResponse[] = []
    for (const server_config_key in serverConfig) {
        const data: ClientVariablesResponse[] = []
        const server = serverConfig[server_config_key]
        const connection = await connectToPLC(server.server)
        if(connection as OPCUAClient){
            for (const key in server.nodes) {
                const node = server.nodes[key]
                const variableValue = await readVariable(connection as OPCUAClient, node)
                data.push(variableValue)
            }
            result.push({server:server.server.url,variables:data,fiware_id:server.server.fiware_id,description:server.server.description})
            disconnect(connection as OPCUAClient)   
        }
    }
    return  result
}

export const conenctToServer = async (server: Server): Promise<OPCUAClient | Error> => {
    const connection = await connectToPLC(server)
    return connection
}

export const readVariable = async (client: OPCUAClient, node: Node): Promise<ClientVariablesResponse> => {
    const session = await client.createSession();
    const datavalue = await readValuesFromNode(session, node.node_namespace)
    const result:ClientVariablesResponse = {
        display_name:node.node_display_name,
        value:datavalue.value.value,
        namespace:node.node_namespace
    }
    return result
}

export const readRootFolder = async (client: OPCUAClient) => {
    const session = await client.createSession();
    const browseResult = await session.browse("RootFolder");
    return browseResult
}
