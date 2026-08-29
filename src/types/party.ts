export interface Party {
    code: number,
    name: string,
    stdCode: string,
    year: string
}

export interface CreateParty {
    name: string,
}

export interface UpdateParty {
    name: string,
}