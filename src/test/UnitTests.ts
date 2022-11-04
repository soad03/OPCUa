import { connectToPLC, disconnect,readVariable,runForServerConfiguration } from "../clients/ArcelikClients" 
import * as assert from 'assert'
import { ArcelikPilotConfig, ClientResponse, ClientVariablesResponse } from "../types"
import { OPCUAClient } from "node-opcua-client"
import { generateFiwareData } from "../util/FiwareDataBuidler"


describe("OPCUaClient Tests - Test server" ,()=>{
    const server:ArcelikPilotConfig = {
        "server": {
            "url": "opc.tcp://192.168.0.17:4334",
            "description":"TEST server",
            "fiware_id":"urn:ngsi-ld:Device:Arcelik:DataHandling:TEST"
        },
        "nodes": [
            {
                node_namespace: "ns=1;s=DataHandling.TypeNoCur",
                node_display_name:"DataHandling.TypeNoCur"
            }
        ]
    }
    describe("Unit tests",()=>{
        let  connection : OPCUAClient | Error 
            beforeEach( async ()=>{
                connection = await connectToPLC(server.server)
            })
        describe('Connection tests ', async () => {
            it('The client should be connected and the application name should be WoT-IL',async ()=>{
                assert.ok((connection as OPCUAClient).applicationName =='WoT-IL', `THe client is disconnected. ${connection}`)
                disconnect((connection as OPCUAClient))
            })
        })
        describe('Reading data from OPCUa server ', async () => {
            it(`The client should read the value of node ${server.nodes[0].node_namespace} and it value must not be null`,async ()=>{
                const client =(connection as OPCUAClient)
                const variable:ClientVariablesResponse = await readVariable(client,server.nodes[0])
                assert.ok(variable.value != null , `THe client readed value is = ${variable.value}`)
                disconnect(client)
            })
        })
        describe('Building Fiware payload ', async () => {
            let  fiware_payload:any
            it(`Fiware value section matchs with the cient response`,async ()=>{
                const client =(connection as OPCUAClient)
                const variable:ClientVariablesResponse = await readVariable(client,server.nodes[0])
                fiware_payload = generateFiwareData([variable],server.server.fiware_id,server.server.description)
                assert.strictEqual(fiware_payload.description.value,server.server.description, `THe fiware payload description must be = ${server.server.description}`)
                assert.strictEqual(fiware_payload.id,server.server.fiware_id, `THe fiware payload id must be = ${server.server.fiware_id}`)
                disconnect(client)
            })
        })
      
    })
    
    describe("Integration tests",()=>{
        describe("Requests to one server",()=>{
            it('The client must return one server with one node', async () => {   
                const result = await runForServerConfiguration([server])
                assert.ok((result as ClientResponse[]).length == 1,`Expected 1 server, given ${(result as ClientResponse[]).length} `)
                assert.ok((result as ClientResponse[])[0].variables.length == 1,`Expected 3 nodes, given ${(result as ClientResponse[])[0].variables.length} nodes`)
            })
        })
        describe("Requests to multiple servers",()=>{
            it('The client must return three servers with one node each', async () => {   
                const result = await runForServerConfiguration([server,server,server])
                assert.ok((result as ClientResponse[]).length == 3,`Expected three sets of nodes, given ${(result as ClientResponse[]).length}`)
                assert.ok((result as ClientResponse[])[0].variables.length == 1,`Expected three nodes, given ${(result as ClientResponse[])[0].variables.length}`)
            })
        })

    })
})

describe("OPCUaClient Tests - Prod server" ,()=>{
    const server:ArcelikPilotConfig = {
        "server": {
            "url": "opc.tcp://10.40.212.1:4840",
            "description":"Set of nodes to Mobile Clamp",
            "fiware_id":"urn:ngsi-ld:Device:Arcelik:DataHandling:Mobile:Clamp"
        },
        "nodes": [
            {
                "node_namespace": "ns=3;s=Shop4CF.Servo.DB501 - 09MS01 Mobile Clamp.POSITION.AUTOMATIC_OVERRIDE",
                "node_display_name": "AUTOMATIC_OVERRIDE"
            }
        ]
    }
    describe("Unit tests",()=>{
        let  connection : OPCUAClient | Error 
            beforeEach( async ()=>{
                connection = await connectToPLC(server.server)
            })
        describe('Connection tests ', async () => {
            it('The client should be connected and the application name should be WoT-IL',async ()=>{
                assert.ok((connection as OPCUAClient).applicationName =='WoT-IL', `THe client is disconnected. ${connection}`)
                disconnect((connection as OPCUAClient))
            })
        })
        describe('Reading data from OPCUa server ', async () => {
            it(`The client should read the value of node ${server.nodes[0].node_namespace} and it value must not be null`,async ()=>{
                const client =(connection as OPCUAClient)
                const variable:ClientVariablesResponse = await readVariable(client,server.nodes[0])
                assert.ok(variable.value != null , `THe client readed value is = ${variable.value}`)
                disconnect(client)
            })
        })
        describe('Building Fiware payload ', async () => {
            let  fiware_payload:any
            it(`Fiware value section matchs with the cient response`,async ()=>{
                const client =(connection as OPCUAClient)
                const variable:ClientVariablesResponse = await readVariable(client,server.nodes[0])
                fiware_payload = generateFiwareData([variable],server.server.fiware_id,server.server.description)
                assert.strictEqual(fiware_payload.description.value,server.server.description, `THe fiware payload description must be = ${server.server.description}`)
                assert.strictEqual(server.server.fiware_id,server.server.fiware_id, `THe fiware payload id must be = ${server.server.fiware_id}`)
                disconnect(client)
            })
        })
      
    })
    
    describe("Integration tests",()=>{
        describe("Requests to one server",()=>{
            it('The client must return one server with one node', async () => {   
                const result = await runForServerConfiguration([server])
                assert.ok((result as ClientResponse[]).length == 1,`Expected 1 server, given ${(result as ClientResponse[]).length} `)
                assert.ok((result as ClientResponse[])[0].variables.length == 1,`Expected 3 nodes, given ${(result as ClientResponse[])[0].variables.length} nodes`)
            })
        })
        describe("Requests to multiple servers",()=>{
            it('The client must return three servers with one node each', async () => {   
                const result = await runForServerConfiguration([server,server,server])
                assert.ok((result as ClientResponse[]).length == 3,`Expected three sets of nodes, given ${(result as ClientResponse[]).length}`)
                assert.ok((result as ClientResponse[])[0].variables.length == 1,`Expected three nodes, given ${(result as ClientResponse[])[0].variables.length}`)
            })
        })

    })
})


