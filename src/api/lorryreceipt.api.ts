import { api } from "./axios";
import type {
  LorryReceipt,
  CreateLorryReceipt,
  UpdateLorryReceipt,
} from "@/types/lorryreceipt";

// GET http://localhost:8080/api/lr/{prefix}/{series}/{no}/{finYear}
// e.g. /api/lr/KLP/A/4000/2026-2027
export const getLorryReceipt = async (
  prefix: string,
  series: string,
  no: number,
  finYear: string,
): Promise<LorryReceipt> => {
  const response = await api.get<LorryReceipt>(
    `/lr/${prefix}/${series}/${no}/${finYear}`,
  );
  return response.data;
};

// POST http://localhost:8080/api/lr
export const createLorryReceipt = (lorryReceipt: CreateLorryReceipt) => {
  return api.post("/lr", lorryReceipt);
};

// ---- Not confirmed yet — these follow the same REST pattern as driver.api.ts, ----
// ---- but you'll need to confirm the actual endpoints/params with your backend. ----

// Guessing PUT /lr/{prefix}/{series}/{no}/{finYear} for update — confirm with backend
export const updateLorryReceipt = (
  prefix: string,
  series: string,
  no: number,
  finYear: string,
  lorryReceipt: UpdateLorryReceipt,
) => {
  return api.put(`/lr/${prefix}/${series}/${no}/${finYear}`, lorryReceipt);
};

// Guessing DELETE /lr/{prefix}/{series}/{no}/{finYear} — confirm with backend
export const deleteLorryReceipt = (
  prefix: string,
  series: string,
  no: number,
  finYear: string,
) => {
  return api.delete(`/lr/${prefix}/${series}/${no}/${finYear}`);
};

// Guessing GET /lr/search?query=... for search — confirm with backend
export const searchLorryReceipt = async (query: string) => {
  const res = await api.get("/lr/search", {
    params: { query },
  });
  return res.data;
};

// For record navigation (first/prev/next/last), you likely need something like
// GET /lr/{prefix}/{series}/{finYear}/first, /last, /next/{no}, /prev/{no}
// — confirm the actual navigation endpoints with your backend before wiring
// up goFirst/goPrev/goNext/goLast in the component.