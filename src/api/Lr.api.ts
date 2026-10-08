
import type { CreateLrTran, Series } from "@/types/lr";
import { api } from "./axios"


// export const getVehicles = async (): Promise<Vehicle[]> => {
//   const response = await api.get<Vehicle[]>("/vehicle")
//   return response.data;
// }

export const getcurrentSer =  async (year : string): Promise<Series> =>{
    const response = await api.get<Series>("lr/currentSeries" , {
        params : { year}
    })
    return response.data;
}


export const getParties =  async() : Promise<any> =>{
    const response =  await api.get<any[]>("/party")
    return response.data;
    
}

export const searchParty =  async(search : string) : Promise<any> =>{
    const response =  await api.get<any[]>("/party/search" , {
        params : { search }
    })
    return response.data; 
}

export const getLrByKey = async(doc_Prefix : string , doc_serial : string , doc_No : number ) : Promise<any> =>{

    const current_year : string = localStorage.getItem("current_year") || ""
    debugger
    const response =  await api.get<any>(`/lr/${doc_Prefix}/${doc_serial}/${doc_No}/${current_year}`)
    return response.data;
}


export const submitLr =  async(data : CreateLrTran) : Promise<any> =>{
    const response =  await api.post(`/lr` , data)
    return response.data
}


export const deleteLrById = async(id : Number) : Promise<any> => {
    const res =  await api.delete(`/lr/${id}`)
    return res.data;
}

export const updateLrById = async (id: number, data: any) => {
  const response = await api.put(`/lr/${id}`, data);

  return response.data;
};