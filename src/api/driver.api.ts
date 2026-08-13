import { api } from "./axios"
import type { Driver, CreateDriver, UpdateDriver } from "@/types/driver"

export const getDrivers = async (): Promise<Driver[]> => {
  const response = await api.get<Driver[]>("/driver")
  return response.data;
}



export const getDriver = (id: number) => {
  return api.get<Driver>(`/driver/${id}`)
}

export const createDriver = (driver: CreateDriver) => {
  return api.post("/driver", driver);
};

export const updateDriver = (id: number, driver: UpdateDriver) => {
  return api.put(`/driver/${id}`, driver);
};

export const deleteDriver = (id: number) => {
  return api.delete(`/driver/${id}`);
}


export const searchDriver = async (query: string) => {
  const res = await api.get("/driver/search", {
    params: { query },
  });

  return res.data;
};