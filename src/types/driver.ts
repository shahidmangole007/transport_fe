export interface Driver {
    code: number,
    name: string,
    stdCode: string,
    year: string
}

export interface CreateDriver {
    name: string,
}

export interface UpdateDriver {
    name: string,
}