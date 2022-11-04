import axios from 'axios'

const axiosInstance = axios.create({
    baseURL:process.env.FIWARE_URL
})

export const sendFiwareMessage=(data:any)=>{
    return axiosInstance.post("",data )
}
export const readFiwareMessage=()=>{
    return axiosInstance.get("")
}