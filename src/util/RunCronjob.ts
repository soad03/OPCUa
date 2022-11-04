import { runForServerConfiguration } from "../clients/ArcelikClients";
import { ArcelikPilotConfig, ClientResponse } from "../types";
import * as cronjob from 'node-schedule'
import {generateFiwarePayload } from "./FiwareDataBuidler";
import axios from "axios";
import { environment } from "../environment";
    
/**
 * String with the cron tab seting.
 * 
 * For example "1 * * * * *" to execute every minute
 * @param jobConfig 
 */
export const runJob=(jobConfig:string,clientConfig:ArcelikPilotConfig[])=>{
    cronjob.scheduleJob(jobConfig,async ()=>{
        console.log(`running scheduled job at ${new Date()}`)
        const client_response = await runForServerConfiguration(clientConfig)
        if(client_response as ClientResponse[]){
            (client_response as ClientResponse[]).forEach(clientResult => {
                const payload = generateFiwarePayload(clientResult)               
                axios.post(`${environment.fiware_url}/ngsi-ld/v1/entities`,payload,{headers:{'Content-Type': 'application/ld+json'}}).then(response=>{
                    console.log(response.data);
                }).catch(err=>console.log(err.response.data))
            });
        }
    })
}
