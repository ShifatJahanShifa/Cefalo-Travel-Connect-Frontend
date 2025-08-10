export type transportCreation = {
    transport_type: string 
    transport_name: string 
   
}

export type getTransport = {
    transport_id: string
    transport_type: string
    transport_name: string 
    
  
}

export type transportUpdation = {
    transport_id?: string
    transport_type?: string 
    transport_name?: string 
  
}