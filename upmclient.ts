
import { AttributeIds,OPCUAClient,DataValue,TimestampsToReturn,SecurityPolicy, NotificationMessage} from "node-opcua";
import { Logger } from './Logger'
import { trytypes } from './trytypes'

var trayType="NA";
var default_index = 0
// const nodeId_TypeNoCur = "ns=4;s=\"DataHandling\".\"TypeNoCur\"";
const dateIssued ="https://smart-data-models.github.io/data-models/terms.jsonld#/definitions/dateIssued"
var axios= require("axios")
//Fiware Configuration
const fiware_url=process.env.FIWARE_SERVER_URL || undefined
const fiware_node_id=process.env.FIWARE_NODE_ID || undefined
//const fiware_node_id="urn:ngsi-ld:Alert:BOSH:feed-trigger-";

//Line 2 configuration
const LINE_2_URL=process.env.LINE_2_URL || undefined
const TypeNoCur_plc_nodeid_L2=process.env.TypeNoCur_NODEID_L2 || undefined
const BlisterEntry_plc_nodeid_L2=process.env.BlisterEntry_NODEID_L2  || undefined

//Line 5 configuration
const LINE_5_URL=process.env.LINE_5_URL || undefined
const TypeNoCur_plc_nodeid_L5=process.env.TypeNoCur_NODEID_L5 || undefined
const BlisterEntry_plc_nodeid_L5=process.env.BlisterEntry_NODEID_L5|| undefined

// interval of subscription checks
const publishing_interval = 1000


var notification_body ={
    id: '',
    type: "Alert",
    category:{
        type: "Property",
        value: "feeding-trigger"
    },
    description: {
        type: "Property",
        value: '',
                 },
    dateIssued: {
        type: "Property",
        value: {
            "@type": "DateTime",
            "@value": new Date().toISOString()
        }
                },
            
      alertSource: {
        type: "Relationship",
        object: "urn:ngsi-ld:Asset:BOS:LS2"
    },
    "@context": [
       "https://smartdatamodels.org/context.jsonld",
       "https://raw.githubusercontent.com/shop4cf/data-models/master/docs/shop4cfcontext.jsonld"

    ]       

    }

const connectionStrategy={
    maxRetry: 2,
    initialDelay: 2000,
    maxDelay: 10 * 1000
}
const requestedParameter= {
    samplingInterval: 500,
    discardOldest: true,
    queueSize: 10
}
const serverConnectionConfiguration={
    endpoint_must_exist: false,
    securityPolicy: SecurityPolicy.None,
    applicationName: "WoT-IL",
    connectionStrategy: connectionStrategy
}


async function init(){

    if(fiware_node_id == undefined){
        Logger.failure(`undefined fiware_node_id. Actual value =${fiware_node_id}. Check environment configuration`)
        throw new Error();
    }
    if(fiware_url == undefined){
        const message=`undefined fiware_url. Actual value =${fiware_url}. Check environment configuration`
        Logger.failure(message)
        throw new Error(message);
    }
    if(LINE_2_URL == undefined){
        const message=`undefined LINE_2_URL. Actual value =${LINE_2_URL}. Check environment configuration`
        Logger.failure(message)
        throw new Error(message);
    }
    if(LINE_5_URL == undefined){
        const message=`undefined LINE_5_URL. Actual value =${LINE_5_URL}. Check environment configuration`
        Logger.failure(message)
        throw new Error(message);
    }
    if(TypeNoCur_plc_nodeid_L2 == undefined){
        const message=`undefined TypeNoCur_plc_nodeid_L2. Actual value =${TypeNoCur_plc_nodeid_L2}. Check environment configuration`
        Logger.failure(message)
        throw new Error(message);
    }
    if(BlisterEntry_plc_nodeid_L2 == undefined){
        const message=`undefined BlisterEntry_plc_nodeid_L2. Actual value =${BlisterEntry_plc_nodeid_L2}. Check environment configuration`
        Logger.failure(message)
        throw new Error(message);
    }

    if(TypeNoCur_plc_nodeid_L5 == undefined){
        const message=`undefined TypeNoCur_plc_nodeid_L5. Actual value =${TypeNoCur_plc_nodeid_L5}. Check environment configuration`
        Logger.failure(message)
        throw new Error(message);
    }
    if(BlisterEntry_plc_nodeid_L5 == undefined){
        const message=`undefined BlisterEntry_plc_nodeid_L5. Actual value =${BlisterEntry_plc_nodeid_L5}. Check environment configuration`
        Logger.failure(message)
        throw new Error(message);
    }
    
    const entity_id = await getLastRecordOfType("https://uri.fiware.org/ns/data-models%23Alert")
    if(entity_id > 0){
        default_index = 0
    }

    //Line 2 setup
    const l2_client = await connectoToPLC(LINE_2_URL)
    const TypeNoCur_subscription_L2 = await createSubscription(l2_client,TypeNoCur_plc_nodeid_L2)
    const BlisterEntry_subscription_L2 = await createSubscription(l2_client,BlisterEntry_plc_nodeid_L2)

    TypeNoCur_subscription_L2.on("changed",  async (dataValue_TypeNoCur: DataValue) => {
        Logger.debug(`Monitoring TypeNoCur on line 2. Current value = ${dataValue_TypeNoCur.value.value.toString()}`)
        if(trytypes.TypeA.indexOf(dataValue_TypeNoCur.value.value.toString()) != -1){
            trayType = 'A'
        }else if(trytypes.TypeB.indexOf(dataValue_TypeNoCur.value.value.toString()) == -1){
            trayType = 'B'
        }else if(trytypes.TypeC.indexOf(dataValue_TypeNoCur.value.value.toString()) == -1){
            trayType = 'C'
        }else{
            Logger.warn(`L2 - try type not defined. Given ${dataValue_TypeNoCur.value.value.toString()}`)
        }       
    });
    
    BlisterEntry_subscription_L2.on("changed",  async (dataValue_BlisterEntry: DataValue) => {
        Logger.debug(`Monitoring BlisterEntry on line 2. Current value = ${dataValue_BlisterEntry.value.value.toString()}`)
        if(dataValue_BlisterEntry.value.value.toString() == "false"){
            default_index=default_index+1;
            notification_body.id=`${fiware_node_id}${default_index}`
            notification_body.description.value=trayType
            notification_body.alertSource.object='urn:ngsi-ld:Asset:BOS:LS2'
            postRecord(notification_body)
           }else{
            Logger.debug("BlisterEntry at line L2 is not needed")
        }         
    });
    //Line 5 setup
    const l5_client = await connectoToPLC(LINE_5_URL)
    const TypeNoCur_subscription_L5 = await createSubscription(l5_client,TypeNoCur_plc_nodeid_L5)
    const BlisterEntry_subscription_L5 = await createSubscription(l5_client,BlisterEntry_plc_nodeid_L5)

    TypeNoCur_subscription_L5.on("changed",  async (dataValue_TypeNoCur: DataValue) => {
        Logger.debug(`Monitoring TypeNoCur on line 5. Current value = ${dataValue_TypeNoCur.value.value.toString()}`)
        if(trytypes.TypeA.indexOf(dataValue_TypeNoCur.value.value.toString()) != -1){
            trayType = 'A'
        }else if(trytypes.TypeB.indexOf(dataValue_TypeNoCur.value.value.toString()) == -1){
            trayType = 'B'
        }else if(trytypes.TypeC.indexOf(dataValue_TypeNoCur.value.value.toString()) == -1){
            trayType = 'C'
        }else{
            Logger.warn(`L5 - try type not defined. Given ${dataValue_TypeNoCur.value.value.toString()}`)
        }       
    });
    
    BlisterEntry_subscription_L5.on("changed",  async (dataValue_BlisterEntry: DataValue) => {
        Logger.debug(`Monitoring BlisterEntry on line 5. Current value = ${dataValue_BlisterEntry.value.value.toString()}`)
        if(dataValue_BlisterEntry.value.value.toString() == "false"){
            default_index=default_index+1;
            notification_body.id=`${fiware_node_id}${default_index}`
            notification_body.description.value=trayType
            notification_body.alertSource.object='urn:ngsi-ld:Asset:BOS:LS5'
            postRecord(notification_body)
           }else{
            Logger.debug("BlisterEntry at line L5 is not needed")
        }         
    });

}

async function connectoToPLC(url:any){
    Logger.debug(`Connecting to PLC ${url}...`)
    const client = OPCUAClient.create(serverConnectionConfiguration);
    try {
        await  client.connect(url)
        return client
    } catch (error) {
        Logger.failure(`Cant connect to PLC ${url} --- ${JSON.stringify(error)}`)
    }
}

async function getLastRecordOfType(record_type:any){
    Logger.debug(`finding record of type ${record_type}`)
    try {
        var result = await axios.get(`${fiware_url}/ngsi-ld/v1/entities?type=${record_type}`).then((response:any)=>response.data)
    if(result.length != 0 ){
        let idStartNumber = result.map((o:any)=>o.id.split('-')
            .slice(-1)[0])
            .map((l:string)=>parseInt(l)).sort( (a: number,b: number) =>a - b )
            .slice(-1)[0]

    Logger.debug(`last notification id was  ${idStartNumber}`)
      return parseInt(idStartNumber)
    }else{
        Logger.debug(`there is no entity matching with ${record_type}`)
        return 0
    } 
    } catch (error) {
        Logger.failure(`EXCEPTION GIVEN - cant get getLastRecordOfType  ${record_type } - ${JSON.stringify(error)}`)
        return 0
    }
}

async function createSubscription(client:any,node_id:any) {
    Logger.debug(`creating subscription for ${node_id}...`);
    const session = await client.createSession();
    const subscription = await  session.createSubscription2({
        requestedPublishingInterval: 1000,
        requestedLifetimeCount: 100,
        requestedMaxKeepAliveCount: 20,
        maxNotificationsPerPublish: 10,
        publishingEnabled: true,
        priority: 10
    });

    subscription
        .on("started", () => console.log("subscription started - subscriptionId=", subscription.subscriptionId))
        .on("keepalive", () => Logger.debug(`keep alive ${node_id}`))
        .on("terminated", () => console.log("subscription terminated"));
    const itemToMonitor={
        nodeId:node_id,
        attributeId: AttributeIds.Value
    }
    const monitoredItem = await subscription.monitor(
        itemToMonitor,
        requestedParameter,
        TimestampsToReturn.Both);
return monitoredItem
}

async function readVariable(client:any,node:any){
    const session = await client.createSession();
    const maxAge = 0;
    const nodeToRead = {
      nodeId: node,
    };
    const dataValue =  await session.read(nodeToRead, maxAge);
    console.log(" value " , dataValue.toString());
}

async function browse(client:any){
   
    const session = await client.createSession();
    const browseResult = await session.browse("RootFolder");
    // const browsePath = makeBrowsePath("RootFolder", "/Objects/Server.ServerStatus.BuildInfo");
    // const result = await session.translateBrowsePath(browsePath);
    console.log(JSON.stringify(browseResult));
    
    // const productNameNodeId = result.targets[0].targetId;
    // console.log(" Product Name nodeId = ", productNameNodeId.toString());
}

function postRecord(body:any){
    const headers={
        'Content-Type': 'application/ld+json',
        }
    Logger.debug(`body id = ${body.id}`)
    axios.post(`${fiware_url}/ngsi-ld/v1/entities`,body,{headers:headers}).then((response:any)=>{
        Logger.debug(JSON.stringify({response:response.status,statusText:response.statusText}))
    },(error:any)=>{
        Logger.failure(JSON.stringify(error))
    }).catch((r:any)=>{
        Logger.failure(JSON.stringify(r))
    })

}
init()
