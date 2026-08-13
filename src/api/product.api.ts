import { api } from "./axios"
import type { Product, CreateProduct, UpdateProduct } from "@/types/product"

export const getProducts = async (): Promise<Product[]> => {
  const response = await api.get<Product[]>("/product")
  return response.data;
}



export const getProduct = (id: number) => {
  return api.get<Product>(`/product/${id}`)
}

export const createProduct = (product: CreateProduct) => {
  return api.post("/product", product);
};

export const updateProduct = (id: number, product: UpdateProduct) => {
  return api.put(`/product/${id}`, product);
};

export const deleteProduct = (id: number) => {
  return api.delete(`/product/${id}`);
}


export const searchProduct = async (query: string) => {
  const res = await api.get("/product/search", {
    params: { query },
  });

  return res.data;
};