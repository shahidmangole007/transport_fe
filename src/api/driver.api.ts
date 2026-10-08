<<<<<<< HEAD
import { api } from "./axios"
import type { Driver, CreateDriver, UpdateDriver } from "@/types/driver"
=======
import type { Driver } from "@/types/driver";
import { api } from "./axios"

>>>>>>> 6eef6d2 (feat : chnages)

export const getDrivers = async (): Promise<Driver[]> => {
  const response = await api.get<Driver[]>("/driver")
  return response.data;
}



<<<<<<< HEAD
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
=======
// export const getCity = (id: number) => {
//   return api.get<City>(`/city/${id}`)
// }

// export const createCity = (city: CreateCity) => {
//   return api.post("/city", city);
// };

// export const updateCity = (id: number, city: UpdateCity) => {
//   return api.put(`/city/${id}`, city);
// };

// export const deleteCity = (id: number) => {
//   return api.delete(`/city/${id}`);
// }


// export const searchCity = async (search: string) => {
//   const res = await api.get("/city/search", {
//     params: { search },
//   });

//   return res.data;
// };
>>>>>>> 6eef6d2 (feat : chnages)
