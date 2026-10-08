import type { DashboardData } from "@/types/dashboard";
import { api } from "./axios"



// export const monthlyParties = async () :Promise<any[]> =>{
//     const response = await api.get<any>("/party/monthlyNewParties")
//     debugger
//     return response.data;
// }


export const topCities = async() : Promise<any[]> =>{
    const response  = await api.get("/city/top5ActiveCity");
    debugger
    return response.data;
}


export const dashBoardData =  async() : Promise<DashboardData> => {
    const year : string = localStorage.getItem("current_year") || ""
    const response = await api.get(`/dashboard`, {
        params : {year}
    })
    debugger
    return response.data;
}