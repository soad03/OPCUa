export interface Server{
    url:string
    description:string;
    fiware_id:string
    
}

export interface Node{
    node_namespace:string;
    node_display_name:string;
}
export interface ArcelikPilotConfig{
    server:Server;
    nodes:Node[];
}
export interface ClientResponse{
     server:string;
     variables:ClientVariablesResponse[];
     fiware_id:string;
     description:string;
}
export interface ClientVariablesResponse{
    display_name:string,
    value:any;
    namespace:string;
}