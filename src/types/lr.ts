export interface LrTran {
    code: number,
    name: string,
    stdCode: string,
    year: string
}

export interface CreateLrTran {
  paid: number;
  cash: number;

  senderCode: string;
  receiverCode: string;

  senderName: string;
  receiverName: string;

  address: string;

  fromLoc: string;
  toLoc: string;

  weight: number;
  approxAmt: number;

  freight: number;
  hamali: number;
  receipt: number;
  crossing: number;
  advance: number;
  amount: number;

  qty: number;

  motorNo: string;

  accoRecno: number;

  remark: string;

  items: LrItemRequestDto[];
}

export interface LrItemRequestDto {
  srno: number;
  qty: number;
  itemName: string;
}

export interface UpdateLrTran {
    name: string,
}

export interface Series {
    docNo: number
    docSerial: string 
    docPrefix: string
}


