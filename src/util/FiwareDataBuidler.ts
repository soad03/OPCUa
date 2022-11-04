import { ArcelikPilotConfig, ClientResponse, ClientVariablesResponse, Server } from "../types";
import { fiwareMessage } from "../FiwareMessage"

/**
 * 
 * @param variables 
 * @param fiware_id 
 * @param description 
 * @returns 
 */
export const generateFiwareData=(variables:ClientVariablesResponse[],fiware_id:string,description:string)=>{
    let payload:any={}
    variables.forEach(variable => {
        payload[variable.display_name]=variable.value
    });

    fiwareMessage.id = fiware_id
    fiwareMessage.value.value = payload
    fiwareMessage.description.value = description
    return fiwareMessage
}

export const generateFiwarePayload=(data:ClientResponse)=>{
      return generateFiwareData(data.variables,data.fiware_id,data.description)
}