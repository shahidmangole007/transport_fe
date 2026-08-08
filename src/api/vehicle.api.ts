import type { CreateVehicle, UpdateVehicle, Vehicle } from "@/types/vehicle";
import { api } from "./axios"


export const getVehicles = async (): Promise<Vehicle[]> => {
  const response = await api.get<Vehicle[]>("/vehicle")
  return response.data;
}



export const getVehicle = (id: number) => {
  return api.get<Vehicle>(`/vehicle/${id}`)
}

export const createVehicle = (vehicle: CreateVehicle) => {
  return api.post("/vehicle", vehicle);
};

export const updateVehicle = (id: number, vehicle: UpdateVehicle) => {
  return api.put(`/vehicle/${id}`, vehicle);
};

export const deleteVehicle = (id: number) => {
  return api.delete(`/vehicle/${id}`);
}


export const searchVehicle = async (query: string) => {
  const res = await api.get("/vehicle/search", {
    params: { query },
  });

  return res.data;
};