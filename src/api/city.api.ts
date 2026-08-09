import { api } from "./axios"
import type { City, CreateCity, UpdateCity } from "@/types/city"

export const getCities = async (): Promise<City[]> => {
  const response = await api.get<City[]>("/city")
  return response.data;
}



export const getCity = (id: number) => {
  return api.get<City>(`/city/${id}`)
}

export const createCity = (city: CreateCity) => {
  return api.post("/city", city);
};

export const updateCity = (id: number, city: UpdateCity) => {
  return api.put(`/city/${id}`, city);
};

export const deleteCity = (id: number) => {
  return api.delete(`/city/${id}`);
}


export const searchCity = async (query: string) => {
  const res = await api.get("/city/search", {
    params: { query },
  });

  return res.data;
};