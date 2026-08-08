export interface Vehicle {
    code: number,
    name: string,
    ownerName: string,
    year: string
}

export interface CreateVehicle {
    name: string,
    ownerName: string,
}

export interface UpdateVehicle {
    name: string,
    ownerName: string,
}