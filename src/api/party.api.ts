import { api } from "./axios"
import type { Party, CreateParty, UpdateParty } from "@/types/party"

export const getParties = async (): Promise<Party[]> => {
  const response = await api.get<Party[]>("/party")
  return response.data;
}



export const getParty = (id: number) => {
  return api.get<Party>(`/party/${id}`)
}

export const createParty = (party: CreateParty) => {
  return api.post("/party", party);
};

export const updateParty = (id: number, party: UpdateParty) => {
  return api.put(`/party/${id}`, party);
};

export const deleteParty = (id: number) => {
  return api.delete(`/party/${id}`);
}


export const searchParty = async (query: string) => {
  const res = await api.get("/party/search", {
    params: { query },
  });

  return res.data;
};