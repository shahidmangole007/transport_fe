export interface LorryReceiptItem {
  srno: number;
  qty: number;
  itemName: string;
}

export interface LorryReceipt {
  paid: number; // 1 | 0
  cash: number; // 1 | 0

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

  narration: string;

  amount: number;
  qty: number;

  motorNo: string;
  accoRecno: number;

  remark: string;

  items: LorryReceiptItem[];
}

// Used when creating/updating — same shape as LorryReceipt for now since
// the API doesn't appear to return a separate "id" field; it's identified
// by prefix/series/no/finYear instead (see getLorryReceipt below).
export type CreateLorryReceipt = LorryReceipt;
export type UpdateLorryReceipt = LorryReceipt;