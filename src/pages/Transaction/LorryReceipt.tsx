import { Button } from "@/components/ui/button";
import {
  FilePlus2,
  CheckCircle2,
  XCircle,
  Printer,
  X,
  ChevronsLeft,
  ChevronLeft,
  ChevronRight,
  ChevronsRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useEffect,useRef, useState } from "react";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { Label } from "recharts";
import { RadioGroup } from "@base-ui/react";

// ---- ASSUMED types/api — replace with your actual lorryReceipt.ts / lorryReceipt.api.ts ----
// import type { LorryReceipt, CreateLorryReceipt, UpdateLorryReceipt } from "@/types/lorryReceipt";
// import {
//   getLorryReceipts,
//   getLorryReceipt,
//   createLorryReceipt,
//   updateLorryReceipt,
//   deleteLorryReceipt,
// } from "@/api/lorryReceipt.api";

interface LorryReceiptItem {
  srNo: number;
  description: string;
}

interface LorryReceipt {
  id: number;
  recordPrefix: string; // e.g. "KLP"
  recordSeries: string; // e.g. "A"
  recordNo: number; // e.g. 9999
  payMode: "toPay" | "paid";
  date: string;
  billMode: "cash" | "credit";
  consignorName: string;
  consigneeName: string;
  address: string;
  fromCity: string;
  toCity: string;
  items: LorryReceiptItem[];
  lrCount: number;
  freightRate: number;
  freightAmount: number;
  weight: number;
  estimatedGoodsAmount: number;
  hamali: number;
  receiptCharge: number;
  depositAmount: number;
  cashFreight: number;
  remarks: string;
}

const lorryReceiptSchema = z.object({
  recordPrefix: z.string().min(1),
  recordSeries: z.string().min(1),
  recordNo: z.number(),
  payMode: z.enum(["toPay", "paid"]),
  date: z.string().min(1),
  billMode: z.enum(["cash", "credit"]),
  consignorName: z.string().min(2, "Consignor name is required"),
  consigneeName: z.string().min(2, "Consignee name is required"),
  address: z.string().optional(),
  fromCity: z.string().min(1, "From city is required"),
  toCity: z.string().min(1, "To city is required"),
  lrCount: z.number(),
  freightRate: z.number(),
  weight: z.number(),
  estimatedGoodsAmount: z.number(),
  hamali: z.number(),
  receiptCharge: z.number(),
  depositAmount: z.number(),
  cashFreight: z.number(),
  remarks: z.string().optional(),
});

type LorryReceiptFormData = z.infer<typeof lorryReceiptSchema>;

export default function LorryReceipt() {
  const { t } = useTranslation();

  const { register, control, handleSubmit, reset, watch, setValue } =
    useForm<LorryReceiptFormData>({
      resolver: zodResolver(lorryReceiptSchema),
      defaultValues: {
        recordPrefix: "",
        recordSeries: "",
        recordNo: 0,
        payMode: "toPay",
        date: new Date().toISOString().split("T")[0],
        billMode: "cash",
        consignorName: "",
        consigneeName: "",
        address: "",
        fromCity: "",
        toCity: "",
        lrCount: 1,
        freightRate: 0,
        weight: 0,
        estimatedGoodsAmount: 0,
        hamali: 0,
        receiptCharge: 0,
        depositAmount: 0,
        cashFreight: 0,
        remarks: "",
      },
    });

  const [records, setRecords] = useState<LorryReceipt[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [items, setItems] = useState<LorryReceiptItem[]>([
    { srNo: 1, description: "" },
  ]);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const lrCount = watch("lrCount");
  const freightRate = watch("freightRate");
  const freightAmount = (lrCount || 0) * (freightRate || 0);

  const fetchRecords = async () => {
    setLoading(true);
    try {
      // const data = await getLorryReceipts();
      // setRecords(data);
      // if (data.length) loadRecord(data.length - 1, data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const loadRecord = (index: number, source: LorryReceipt[] = records) => {
    const record = source[index];
    if (!record) return;

    setCurrentIndex(index);
    setItems(record.items);
    reset({
      recordPrefix: record.recordPrefix,
      recordSeries: record.recordSeries,
      recordNo: record.recordNo,
      payMode: record.payMode,
      date: record.date,
      billMode: record.billMode,
      consignorName: record.consignorName,
      consigneeName: record.consigneeName,
      address: record.address,
      fromCity: record.fromCity,
      toCity: record.toCity,
      lrCount: record.lrCount,
      freightRate: record.freightRate,
      weight: record.weight,
      estimatedGoodsAmount: record.estimatedGoodsAmount,
      hamali: record.hamali,
      receiptCharge: record.receiptCharge,
      depositAmount: record.depositAmount,
      cashFreight: record.cashFreight,
      remarks: record.remarks,
    });
  };

  const goFirst = () => records.length && loadRecord(0);
  const goPrev = () => currentIndex > 0 && loadRecord(currentIndex - 1);
  const goNext = () =>
    currentIndex < records.length - 1 && loadRecord(currentIndex + 1);
  const goLast = () => records.length && loadRecord(records.length - 1);

  const handleNew = () => {
  setIsEditing(false);
  setItems([{ srNo: 1, description: "" }]);

  reset({
    recordPrefix: "",
    recordSeries: "",
    recordNo: 0,
    payMode: "toPay",
    date: new Date().toISOString().split("T")[0],
    billMode: "cash",
    consignorName: "",
    consigneeName: "",
    address: "",
    fromCity: "",
    toCity: "",
    lrCount: 1,
    freightRate: 0,
    weight: 0,
    estimatedGoodsAmount: 0,
    hamali: 0,
    receiptCharge: 0,
    depositAmount: 0,
    cashFreight: 0,
    remarks: "",
  });
};

  const handleItemChange = (srNo: number, description: string) => {
    setItems((prev) =>
      prev.map((item) => (item.srNo === srNo ? { ...item, description } : item))
    );
  };

  const addItemRow = () => {
    setItems((prev) => [...prev, { srNo: prev.length + 1, description: "" }]);
  };

  const onSubmit = async (data: LorryReceiptFormData) => {
    try {
      setErrorMessage(null);

      const submitObj = { ...data, items, freightAmount };

      if (isEditing && records[currentIndex]) {
        // await updateLorryReceipt(records[currentIndex].id, submitObj);
      } else {
        // await createLorryReceipt(submitObj);
      }

      await fetchRecords();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setErrorMessage(
          error.response?.data?.message ??
            error.message ??
            "Failed to save lorry receipt"
        );
      } else {
        setErrorMessage("Failed to save lorry receipt");
      }
    }
  };

  const handleDelete = async () => {
    const record = records[currentIndex];
    if (!record) return;

    try {
      // await deleteLorryReceipt(record.id);
      await fetchRecords();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setErrorMessage(
          error.response?.data?.message ??
            error.message ??
            "Failed to delete lorry receipt"
        );
      } else {
        setErrorMessage("Failed to delete lorry receipt");
      }
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const itemInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  return (
  <form onSubmit={handleSubmit(onSubmit)} className="w-full">
    <div className="max-w-5xl mx-auto px-2 space-y-3">

      {/* =========================
          HEADER
      ========================== */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold">
            {t("lorryReceipt.title")}
          </h1>
          <p className="text-xs text-muted-foreground">
            {t("lorryReceipt.description")}
          </p>
        </div>

        {errorMessage && (
          <p className="text-xs text-destructive">
            {errorMessage}
          </p>
        )}
      </div>

      {/* =========================
          3 CARDS
      ========================== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">

        {/* =========================
            CARD 1 - LR DETAILS
        ========================== */}
        <Card className="shadow-sm">
          <CardHeader className="px-4 py-3 border-b">
            <CardTitle className="text-sm font-semibold">
              {t("lorryReceipt.lrDetails")}
            </CardTitle>
          </CardHeader>

          <CardContent className="p-4 space-y-3">

            {/* Record Number */}
            <div>
              <FieldLabel className="text-xs">
                {t("lorryReceipt.recordNo")}
              </FieldLabel>

              <div className="grid grid-cols-3 gap-2 mt-1">
                <Input
                  className="h-8 text-xs"
                  placeholder="Prefix"
                  {...register("recordPrefix")}
                />

                <Input
                  className="h-8 text-xs"
                  placeholder="Series"
                  {...register("recordSeries")}
                />

                <Input
                  className="h-8 text-xs"
                  type="number"
                  placeholder="No"
                  {...register("recordNo", {
                    valueAsNumber: true,
                  })}
                />
              </div>
            </div>

            {/* Date */}
            <Field>
              <FieldLabel className="text-xs">
                {t("lorryReceipt.date")}
              </FieldLabel>

              <Input
                type="date"
                className="h-8 text-xs"
                {...register("date")}
              />
            </Field>

            {/* Pay Mode */}
            <Field>
              <FieldLabel className="text-xs">
                {t("lorryReceipt.payMode")}
              </FieldLabel>

              <Controller
                control={control}
                name="payMode"
                render={({ field }) => (
                  <div className="grid grid-cols-2 gap-2 mt-1">
                    <Button
                      type="button"
                      size="sm"
                      variant={
                        field.value === "toPay"
                          ? "default"
                          : "outline"
                      }
                      className="h-8 text-xs"
                      onClick={() => field.onChange("toPay")}
                    >
                      {t("lorryReceipt.toPay")}
                    </Button>

                    <Button
                      type="button"
                      size="sm"
                      variant={
                        field.value === "paid"
                          ? "default"
                          : "outline"
                      }
                      className="h-8 text-xs"
                      onClick={() => field.onChange("paid")}
                    >
                      {t("lorryReceipt.paid")}
                    </Button>
                  </div>
                )}
              />
            </Field>

            {/* Bill Mode */}
            <Field>
              <FieldLabel className="text-xs">
                {t("lorryReceipt.billMode")}
              </FieldLabel>

              <Controller
                control={control}
                name="billMode"
                render={({ field }) => (
                  <div className="grid grid-cols-2 gap-2 mt-1">
                    <Button
                      type="button"
                      size="sm"
                      variant={
                        field.value === "cash"
                          ? "default"
                          : "outline"
                      }
                      className="h-8 text-xs"
                      onClick={() => field.onChange("cash")}
                    >
                      {t("lorryReceipt.cash")}
                    </Button>

                    <Button
                      type="button"
                      size="sm"
                      variant={
                        field.value === "credit"
                          ? "default"
                          : "outline"
                      }
                      className="h-8 text-xs"
                      onClick={() => field.onChange("credit")}
                    >
                      {t("lorryReceipt.credit")}
                    </Button>
                  </div>
                )}
              />
            </Field>

          </CardContent>
        </Card>


        {/* =========================
            CARD 2 - PARTY & ROUTE
        ========================== */}
        <Card className="shadow-sm">
          <CardHeader className="px-4 py-3 border-b">
            <CardTitle className="text-sm font-semibold">
              {t("lorryReceipt.partyDetails")}
            </CardTitle>
          </CardHeader>

          <CardContent className="p-4 space-y-3">

            {/* Consignor */}
            <Field>
              <FieldLabel className="text-xs">
                {t("lorryReceipt.consignorName")}
              </FieldLabel>

              <Input
                className="h-8 text-xs"
                placeholder={t(
                  "lorryReceipt.consignorPlaceholder"
                )}
                {...register("consignorName")}
              />
            </Field>

            {/* Consignee */}
            <Field>
              <FieldLabel className="text-xs">
                {t("lorryReceipt.consigneeName")}
              </FieldLabel>

              <Input
                className="h-8 text-xs"
                placeholder={t(
                  "lorryReceipt.consigneePlaceholder"
                )}
                {...register("consigneeName")}
              />
            </Field>

            {/* Address */}
            <Field>
              <FieldLabel className="text-xs">
                {t("lorryReceipt.address")}
              </FieldLabel>

              <Input
                className="h-8 text-xs"
                placeholder={t(
                  "lorryReceipt.addressPlaceholder"
                )}
                {...register("address")}
              />
            </Field>

            {/* Route */}
            <div>
              <FieldLabel className="text-xs">
                {t("lorryReceipt.route")}
              </FieldLabel>

              <div className="grid grid-cols-2 gap-2 mt-1">
                <Input
                  className="h-8 text-xs"
                  placeholder={t(
                    "lorryReceipt.fromCityPlaceholder"
                  )}
                  {...register("fromCity")}
                />

                <Input
                  className="h-8 text-xs"
                  placeholder={t(
                    "lorryReceipt.toCityPlaceholder"
                  )}
                  {...register("toCity")}
                />
              </div>
            </div>

          </CardContent>
        </Card>


        {/* =========================
            CARD 3 - CHARGES
        ========================== */}
        <Card className="shadow-sm">
          <CardHeader className="px-4 py-3 border-b">
            <CardTitle className="text-sm font-semibold">
              {t("lorryReceipt.charges")}
            </CardTitle>
          </CardHeader>

          <CardContent className="p-4 space-y-3">

            {/* LR Count + Weight */}
            <div className="grid grid-cols-2 gap-2">

              <Field>
                <FieldLabel className="text-xs">
                  {t("lorryReceipt.lrCount")}
                </FieldLabel>

                <Input
                  className="h-8 text-xs"
                  type="number"
                  {...register("lrCount", {
                    valueAsNumber: true,
                  })}
                />
              </Field>

              <Field>
                <FieldLabel className="text-xs">
                  {t("lorryReceipt.weight")}
                </FieldLabel>

                <Input
                  className="h-8 text-xs"
                  type="number"
                  {...register("weight", {
                    valueAsNumber: true,
                  })}
                />
              </Field>

            </div>

            {/* Freight Rate + Freight Amount */}
            <div className="grid grid-cols-2 gap-2">

              <Field>
                <FieldLabel className="text-xs">
                  {t("lorryReceipt.freightRate")}
                </FieldLabel>

                <Input
                  className="h-8 text-xs"
                  type="number"
                  {...register("freightRate", {
                    valueAsNumber: true,
                  })}
                />
              </Field>

              <div>
                <label className="text-xs font-medium">
                  {t("lorryReceipt.freightAmount")}
                </label>

                <div className="h-8 mt-1 flex items-center justify-center rounded-md border bg-muted text-sm font-semibold">
                  ₹ {freightAmount.toFixed(2)}
                </div>
              </div>

            </div>

            {/* Other Charges */}
            <div className="grid grid-cols-2 gap-2">

              <Field>
                <FieldLabel className="text-xs">
                  {t("lorryReceipt.hamali")}
                </FieldLabel>

                <Input
                  className="h-8 text-xs"
                  type="number"
                  {...register("hamali", {
                    valueAsNumber: true,
                  })}
                />
              </Field>

              <Field>
                <FieldLabel className="text-xs">
                  {t("lorryReceipt.receiptCharge")}
                </FieldLabel>

                <Input
                  className="h-8 text-xs"
                  type="number"
                  {...register("receiptCharge", {
                    valueAsNumber: true,
                  })}
                />
              </Field>

            </div>

            <div className="grid grid-cols-2 gap-2">

              <Field>
                <FieldLabel className="text-xs">
                  {t("lorryReceipt.depositAmount")}
                </FieldLabel>

                <Input
                  className="h-8 text-xs"
                  type="number"
                  {...register("depositAmount", {
                    valueAsNumber: true,
                  })}
                />
              </Field>

              <Field>
                <FieldLabel className="text-xs">
                  {t("lorryReceipt.cashFreight")}
                </FieldLabel>

                <Input
                  className="h-8 text-xs"
                  type="number"
                  {...register("cashFreight", {
                    valueAsNumber: true,
                  })}
                />
              </Field>

            </div>

          </CardContent>
        </Card>

      </div>


      {/* =========================
          ITEMS + REMARKS
      ========================== */}
      <Card className="shadow-sm">
        <CardContent className="p-3">

          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold">
              {t("lorryReceipt.itemDetails")}
            </span>

            <Button
              type="button"
              size="sm"
              variant="outline"
              className="h-7 text-xs"
              onClick={addItemRow}
            >
              + {t("lorryReceipt.addRow")}
            </Button>
          </div>

          <div className="border rounded-md overflow-hidden">
            <table className="w-full text-xs">
              <thead className="bg-muted">
                <tr>
                  <th className="px-2 py-1.5 text-left w-14">
                    {t("lorryReceipt.srNo")}
                  </th>
                  <th className="px-2 py-1.5 text-left">
                    {t("lorryReceipt.itemDetails")}
                  </th>
                </tr>
              </thead>

              <tbody>
                {items.map((item) => (
                  <tr
                    key={item.srNo}
                    className="border-t"
                  >
                    <td className="px-2 py-1">
                      {item.srNo}
                    </td>

                    <td className="px-2 py-1">
                      <Input
                        value={item.description}
                        onChange={(e) =>
                          handleItemChange(item.srNo, e.target.value)
                        }
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();

                            if (item.srNo === items.length) {
                              addItemRow();
                            }

                            setTimeout(() => {
                              const nextInput = document.querySelector(
                                `input[data-item-row="${item.srNo + 1}"]`
                              ) as HTMLInputElement | null;

                              nextInput?.focus();
                            }, 0);
                          }
                        }}
                        data-item-row={item.srNo}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Remarks */}
          <div className="mt-3">
            <FieldLabel className="text-xs">
              {t("lorryReceipt.remarks")}
            </FieldLabel>

            <Textarea
              className="mt-1 min-h-14 text-xs resize-none"
              rows={2}
              {...register("remarks")}
            />
          </div>

        </CardContent>
      </Card>


      {/* =========================
          ACTION BAR
      ========================== */}
      <div className="flex items-center justify-between gap-2">

        <div className="flex gap-1.5">

          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-8 text-xs"
            onClick={handleNew}
          >
            <FilePlus2 className="mr-1 h-3.5 w-3.5" />
            {t("common.new")}
          </Button>

          <Button
            type="submit"
            size="sm"
            className="h-8 text-xs"
          >
            <CheckCircle2 className="mr-1 h-3.5 w-3.5" />
            {t("common.save")}
          </Button>

          <Button
            type="button"
            variant="destructive"
            size="sm"
            className="h-8 text-xs"
            onClick={handleDelete}
          >
            <XCircle className="mr-1 h-3.5 w-3.5" />
            {t("common.delete")}
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-8 text-xs"
            onClick={handlePrint}
          >
            <Printer className="mr-1 h-3.5 w-3.5" />
            {t("common.print")}
          </Button>

        </div>

        {/* Navigation */}
        <div className="flex gap-0.5">

          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={goFirst}
          >
            <ChevronsLeft className="h-4 w-4" />
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={goPrev}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={goNext}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={goLast}
          >
            <ChevronsRight className="h-4 w-4" />
          </Button>

        </div>

      </div>

    </div>
  </form>
);
}
