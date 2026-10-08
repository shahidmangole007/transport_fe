<<<<<<< HEAD
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
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";

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
  dakNo: number;
  description: string;
  qty?: number;
  itemName?: string;

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
  crossCharges: number;
  remarks: string;
}

const lorryReceiptSchema = z.object({
  recordPrefix: z.string(),
  recordSeries: z.string().min(1),
  recordNo: z.number(),
  senderCode: z.string().min(1),
  receiverCode: z.string().min(1),
  motorNo: z.string().optional(),
  remark: z.string().optional(),
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
  crossCharges: z.number(),
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
        crossCharges: 0,
        remarks: "",
      },
    });

  const [records, setRecords] = useState<LorryReceipt[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [items, setItems] = useState<LorryReceiptItem[]>([
    { srNo: 1,dakNo: 1, description: "" },
  ]);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);


  const hamali = watch("hamali");
  const freightRate = watch("freightRate");
  const receiptCharge = watch("receiptCharge");
  const crossCharges = watch("crossCharges");
  const freightAmount = (hamali || 0) + (freightRate || 0) + (receiptCharge || 0) + (crossCharges || 0);

  const fetchRecords = async () => {
    setLoading(true);
    try {
      // const data = await getLorryReceipts();
      // setRecords(data);
      // if (data.length) loadRecord(data.length - 1, data);
    } finally {
      setLoading(false);
=======
import { useCallback, useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate, useParams } from "react-router-dom";
import {
  Table,
  TableHeader,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@/components/ui/table";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

import {
  Trash2,
  Plus,
  Save,
  Printer,
  X,
  RotateCcw,
  Pencil,
} from "lucide-react";

import {
  deleteLrById,
  getcurrentSer,
  getLrByKey,
  searchParty,
  submitLr,
  updateLrById,
} from "@/api/Lr.api";
import type { CreateLrTran, Series } from "@/types/lr";
import { SelectComboBox } from "@/components/SelectComboBox";
import type { Party } from "@/types/party";
import type { City } from "@/types/city";
import { searchCity } from "@/api/city.api";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { getVehicles } from "@/api/vehicle.api";
import type { Vehicle } from "@/types/vehicle";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { api } from "@/api/axios";
import type { Driver } from "@/types/driver";
import { getDrivers } from "@/api/driver.api";

const itemSchema = z.object({
  description: z.string(),
  quantity: z.string(),
});

const partySchema = z.object({
  code: z.number(),
  name: z.string(),
  address: z.string().nullable().optional(),
  mobileNo: z.string().nullable().optional(),
});

const citySchema = z.object({
  code: z.number().nullable(),
  name: z.string().nullable(),
});

const lorryReceiptSchema = z.object({
  branch: z.string().min(1, "Branch code is required"),

  receiptNo: z.string().min(1, "Receipt number is required"),

  series: z.string().min(1, "Series is required"),

  date: z
    .string()
    .min(1, "Date is required")
    .refine(
      (date) => date <= new Date().toISOString().split("T")[0],
      "Date cannot be in the future",
    ),

  paymentType: z.enum(["paid", "toPay"]),

  consignor: partySchema.nullable(),

  consignee: partySchema.nullable(),

  fromLocation: citySchema.nullable(),

  toLocation: citySchema.nullable(),

  address: z.string(),

  vehicleCode: z.custom<Vehicle>().nullable().optional(),

  driverCode: z.custom<Driver>().nullable().optional(),

  mobileNo: z.string(),

  mobileNoRec: z.string(),

  items: z
    .array(itemSchema)
    .refine(
      (items) =>
        items.some(
          (item) => item.description.trim() !== "" && Number(item.quantity) > 0,
        ),
      "At least one item is required",
    ),

  weight: z.string().optional(),
  amount: z.string().optional(),
  freight: z.string().optional(),
  hamali: z.string().optional(),
  advance: z.string().optional(),
  total: z.string().optional(),
  receiptCharge: z.string().optional(),
  otherCharges: z.string().optional(),

  remarks: z.string().optional(),
});

type LorryReceiptForm = z.infer<typeof lorryReceiptSchema>;

export default function LorryReceipt() {
  const form = useForm<LorryReceiptForm>({
    resolver: zodResolver(lorryReceiptSchema),

    defaultValues: {
      branch: "",
      receiptNo: "",
      series: "",

      date: new Date().toISOString().split("T")[0],

      paymentType: "paid",

      consignor: null,
      consignee: null,

      fromLocation: null,
      toLocation: null,

      vehicleCode: "",
      driverCode: "",

      address: "",
      mobileNo: "",
      mobileNoRec: "",

      items: [
        {
          description: "",
          quantity: "",
        },
      ],

      weight: "",
      amount: "",
      freight: "",
      hamali: "",
      advance: "",
      total: "",
      receiptCharge: "",
      otherCharges: "",

      remarks: "",
    },
  });

  const { control, handleSubmit, watch, getValues, setValue, reset } = form;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  const freight = Number(watch("freight") || 0);
  const hamali = Number(watch("hamali") || 0);
  const receiptCharge = Number(watch("receiptCharge") || 0);
  const otherCharges = Number(watch("otherCharges") || 0);
  const amount = Number(watch("amount") || 0);

  // const advance = Number(watch("advance") || 0);

  const calculatedTotal =
    amount + freight + hamali + receiptCharge + otherCharges;

  /* =========================================================
     UPDATE TOTAL
  ========================================================= */

  useEffect(() => {
    setValue("total", calculatedTotal.toFixed(2));
  }, [calculatedTotal, setValue]);

  const handleQuantityChange = (index: number, value: string) => {
    const lastRow = index === fields.length - 1;

    if (lastRow && value.trim() !== "") {
      append({
        description: "",
        quantity: "",
      });
    }
  };

  const onSubmit = async (data: LorryReceiptForm) => {
    debugger;
    console.log("SUBMIT DATA:", data);

    if (mode === "new") {
      if (!data.address.trim()) {
        toast.error("Address is required");
        return;
      }

      if (!/^\d{10}$/.test(data.mobileNo.trim())) {
        toast.error("Mobile number must be 10 digits");
        return;
      }

      if (!/^\d{10}$/.test(data.mobileNoRec.trim())) {
        toast.error("Mobile number must be 10 digits");
        return;
      }
    }

    const cleanedItems = data.items.filter(
      (item) => item.description.trim() !== "" || item.quantity.trim() !== "",
    );

    const payload: CreateLrTran | any = {
      branch: data.branch,
      receiptNo: data.receiptNo,
      series: data.series,
      date: data.date,
      paymentType: data.paymentType,

      paid: data.paymentType === "paid" ? 1 : 0,
      cash: 0,

      senderCode: data.consignor?.code ? String(data.consignor.code) : "",

      senderName: data.consignor?.name ?? "",

      receiverCode: data.consignee?.code ? String(data.consignee.code) : "",

      receiverName: data.consignee?.name ?? "",

      fromLoc: data.fromLocation?.name ?? "",
      toLoc: data.toLocation?.name ?? "",

      address: data.address ?? "",
      mobileNo: data.mobileNo ?? "",

      mobileNoRec: data.mobileNoRec ?? "",

      weight: Number(data.weight || 0),
      approxAmt: 0,

      freight: Number(data.freight || 0),
      hamali: Number(data.hamali || 0),
      receipt: Number(data.receiptCharge || 0),
      crossing: Number(data.otherCharges || 0),
      advance: Number(data.advance || 0),
      amount: Number(data.amount || 0),
      total: Number(data.total || 0),
      vehicleCode:
        typeof data.vehicleCode === "object"
          ? String(data.vehicleCode.code)
          : String(data.vehicleCode ?? ""),

      driverCode:
        typeof data.driverCode === "object"
          ? String(data.driverCode.code)
          : String(data.driverCode ?? ""),

      // Other backend fields
      qty: cleanedItems.reduce(
        (sum, item) => sum + Number(item.quantity || 0),
        0,
      ),

      motorNo: "",
      accoRecno: 0,

      remark: data.remarks ?? "",

      items: cleanedItems.map((item, index) => ({
        srno: index + 1,
        qty: Number(item.quantity || 0),
        itemName: item.description,
      })),
    };

    console.log("LR API PAYLOAD:", payload);

    if (mode === "new") {
      debugger;
      try {
        const response = await submitLr(payload);

        console.log("CREATE RESPONSE:", response);

        // toast.success("Lorry Receipt submitted successfully");

        // Store newly created LR
        setLrToPrint(response);

        // Open print confirmation
        setPrintStatus("confirm");
        setPrintErrorMessage(null);
        setPrintDialogOpen(true);
      } catch (error) {
        console.error("CREATE LR ERROR:", error);

        toast.error("Failed to submit Lorry Receipt");
      }

      return;
    }

    // -----------------------------
    // EDIT
    // -----------------------------

    if (mode === "edit") {
      try {
        const response = await updateLrById(Number(currentId), payload);

        console.log("UPDATE RESPONSE:", response);

        toast.success("Lorry Receipt updated successfully");
      } catch (error) {
        toast.error("Failed to update Lorry Receipt");
      }

      return;
    }
  };

  const [series, setSeries] = useState<Series | null>(null);

  const [parties, setParties] = useState<Party[]>([]);

  const [cities, setCities] = useState<City[]>([]);

  const [toCities, setToCities] = useState<City[]>([]);

  const [vehicles, setVehicles] = useState<Vehicle[]>([]);

  const [drivers, setDrivers] = useState<Driver[]>([]);

  const fetchCurrentSeries = async () => {
    try {
      const year = localStorage.getItem("current_year");

      if (!year) return;

      const data: any = await getcurrentSer(year);
      debugger;

      setSeries(data);

      setValue("branch", data.docPrefix ?? "");
      setValue("series", data.docSerial ?? "");
      setValue("receiptNo", String(data.docNo ?? ""));
    } catch (error) {
      console.error("Failed to fetch series:", error);
>>>>>>> 6eef6d2 (feat : chnages)
    }
  };

  useEffect(() => {
<<<<<<< HEAD
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
      crossCharges: record.crossCharges,
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
  setItems([{ srNo: 1, dakNo: 1, description: "" }]);

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
    crossCharges: 0,
    remarks: "",
  });
};

  const handleItemChange = (srNo: number,  field: "dakNo" | "description",
  value: string | number) => {
    setItems((prev) =>
      prev.map((item) => (item.srNo === srNo ? { ...item, [field]: value } : item))
    );
  };

  const addItemRow = () => {
    setItems((prev) => [
      ...prev,
      { srNo: prev.length + 1, dakNo: 0, description: "" },
    ]);
  };

  const handleDeleteItemRow = (srNo: number) => {
    setItems((prev) => {
      if (prev.length === 1) return prev; // कमीत कमी 1 row राहू दे

      const filtered = prev.filter((item) => item.srNo !== srNo);

      // srNo पुन्हा 1, 2, 3... क्रमाने लावा
      return filtered.map((item, index) => ({
        ...item,
        srNo: index + 1,
      }));
    });
  };

  const onSubmit: any = async (data: LorryReceiptFormData) => {
  
    try {
      setErrorMessage(null);

      const payload = {
        paid: data.payMode === "paid" ? 1 : 0,
        cash: data.billMode === "cash" ? 1 : 0,

        senderCode: data.senderCode,       
        receiverCode: data.receiverCode,   
        senderName: data.consignorName,
        receiverName: data.consigneeName,

        address: data.address,
        fromLoc: data.fromCity,
        toLoc: data.toCity,

        weight: data.weight,
        approxAmt: data.estimatedGoodsAmount,
        freight: data.freightRate,
        hamali: data.hamali,
        receipt: data.receiptCharge,
        crossing: data.crossCharges,
        advance: data.depositAmount,

        narration: data.remarks,

        amount: freightAmount,
        qty: items.reduce((sum, item) => sum + (item.qty || 0), 0),

        motorNo: data.motorNo,             
        accoRecno: data.recordNo,

        remark: data.remark,               

        items: items.map((item) => ({
          srno: item.srNo,
          qty: item.qty || 0,              // ⚠️ प्रत्येक item ला qty field add कर
          itemName: item.description,
        })),
      };


      console.log("Submitting Lorry Receipt:", payload);

      if (isEditing && records[currentIndex]) {
        // await updateLorryReceipt(records[currentIndex].id, submitObj);
      } else {
        // await createLorryReceipt(submitObj);
      }

      await fetchRecords();
    } catch (error) {
      if (axios.isAxiosError(error)) {

        console.log(error);
        

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
            CARD 1 - LR DETAILSy
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

              <Field>
                <FieldLabel className="text-xs">
                  {t("lorryReceipt.estimatedGoodsAmount")}
                </FieldLabel>

                <Input
                  className="h-8 text-xs"
                  type="number"
                  {...register("estimatedGoodsAmount", {
                    valueAsNumber: true,
                  })}
                />
              </Field>

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
            </div>

            

            {/* Other Charges */}
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

              <Field>
                <FieldLabel className="text-xs">
                  {t("lorryReceipt.crossCharges")}
                </FieldLabel>

                <Input
                  className="h-8 text-xs"
                  type="number"
                  {...register("crossCharges", {
                    valueAsNumber: true,
                  })}
                />
              </Field>
            </div>

            {/* Freight Rate + Freight Amount */}
            <div className="grid grid-cols-2 gap-2">

              <div>
                <label className="text-xs font-medium">
                  {t("lorryReceipt.freightAmount")}
                </label>

                <div className="h-8 mt-1 flex items-center justify-center rounded-md border bg-muted text-sm font-semibold">
                  ₹ {freightAmount.toFixed(2)}
                </div>
              </div>

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
                  <th className="px-2 py-1.5 text-left w-24">
                    {t("lorryReceipt.dakNo")}
                  </th>
                  <th className="px-2 py-1.5 text-left">
                    {t("lorryReceipt.itemDetails")}
                  </th>
                  <th className="px-2 py-1.5 text-left w-10"></th>
                </tr>
              </thead>

             <tbody>
              {items.map((item) => (
                <tr key={item.srNo} className="border-t">
                  <td className="px-2 py-1">
                    {item.srNo}
                  </td>

                  <td className="px-2 py-1">
                    <Input
                      type="number"
                      className="h-8 text-xs"
                      value={item.dakNo}
                      onChange={(e) =>
                        handleItemChange(item.srNo, "dakNo", Number(e.target.value))
                      }
                    />
                  </td>

                  <td className="px-2 py-1">
                    <Input
                      className="h-8 text-xs"
                      value={item.description}
                      onChange={(e) =>
                        handleItemChange(item.srNo, "description", e.target.value)
                      }
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();

                          if (item.description.trim() === "") {
                            return; // empty असेल तर काहीच करू नको
                          }

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

                  <td className="px-2 py-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => handleDeleteItemRow(item.srNo)}
                    >
                      <XCircle className="h-4 w-4 text-destructive" />
                    </Button>
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
            className="h-8 text-xs bg-purple-700"
            
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




  // <div className="h-screen flex   flex-col">

  //   <form action="" onSubmit={OnSubmit}>
  //     <Card className=" gap-8  h-8/12 grid grid-cols-3 ">
  //       <Card className="p-3 flex flex-col justify-center items-center h-fit">

  //           {/* <Field data-invalid={.driverCode ? true : undefined}> */}
  //           <Field >
  //               <FieldLabel htmlFor="prefix">
  //                 Branch Prefix
  //               </FieldLabel>
  //               <Input
  //                 id="prefix"
  //                 type="text"
  //                 required
  //               placeholder="branch"
  //                 {...register("recordPrefix")}
  //               />
  //             </Field>
  //       </Card>
  //       <Card className="">fdi</Card>
  //       <Card className="">dnfn</Card>

  //       <Button type="submit" >Submit</Button>
  //     </Card>

  //   </form>
  // </div>




);
=======
    const fetchVehicles = async () => {
      let vehicles = await getVehicles();
      setVehicles(vehicles);
    };
    fetchVehicles();

    const fetchDrivers = async () => {
      let drivers = await getDrivers();
      setDrivers(drivers);
    };
    fetchDrivers();
    fetchCurrentSeries();
  }, []);

  const searchParties = useCallback(async (search: string) => {
    if (search.trim().length < 1) {
      setParties([]);
      return;
    }

    try {
      const data = await searchParty(search.trim());
      debugger;
      setParties(data);
    } catch (error) {
      console.error("Failed to search parties:", error);
      setParties([]);
    }
  }, []);

  const searchCities = useCallback(async (search: string) => {
    if (search.trim().length < 1) {
      setCities([]);
      return;
    }

    try {
      const data = await searchCity(search.trim());

      setCities(data);
    } catch (error) {
      console.error("Failed to search cities:", error);
      setCities([]);
    }
  }, []);

  const searchToCities = useCallback(async (search: string) => {
    if (search.trim().length < 1) {
      setToCities([]);
      return;
    }

    try {
      const data = await searchCity(search.trim());

      setToCities(data);
    } catch (error) {
      console.error("Failed to search cities:", error);
      setToCities([]);
    }
  }, []);

  const selectedConsignee = watch("consignee");
  const selectedConsignor = watch("consignor");

  useEffect(() => {
    if (!selectedConsignee) {
      return;
    }

    setValue("address", selectedConsignee.address ?? "");

    setValue("mobileNo", selectedConsignee.mobileNo ?? "");
    setValue("mobileNoRec", selectedConsignor?.mobileNo ?? "");
  }, [selectedConsignee, setValue]);

  const [mode, setMode] = useState<"new" | "edit">("new");

  const handleNewMode = () => {
    form.reset({
      branch: getValues("branch"),

      receiptNo: "",
      series: "",

      date: new Date().toISOString().split("T")[0],

      paymentType: "paid",

      consignor: null,
      consignee: null,

      fromLocation: null,
      toLocation: null,

      address: "",
      mobileNo: "",
      mobileNoRec: "",

      items: [
        {
          description: "",
          quantity: "",
        },
      ],

      weight: "",
      amount: "",
      freight: "",
      hamali: "",
      advance: "",
      total: "",
      receiptCharge: "",
      otherCharges: "",

      remarks: "",
    });

    fetchCurrentSeries();
  };

  const handleEditMode = () => {
    form.reset({
      branch: getValues("branch"),

      receiptNo: "",
      series: "",

      date: "",

      paymentType: "paid",

      consignor: null,
      consignee: null,

      fromLocation: null,
      toLocation: null,

      address: "",
      mobileNo: "",
      mobileNoRec: "",

      items: [
        {
          description: "",
          quantity: "",
        },
      ],

      weight: "",
      amount: "",
      freight: "",
      hamali: "",
      advance: "",
      total: "",
      receiptCharge: "",
      otherCharges: "",

      remarks: "",
    });
  };

  const handleFindLR = async () => {
    const branch = getValues("branch")?.trim();
    const series = getValues("series")?.trim();
    const receiptNo = getValues("receiptNo")?.trim();

    if (!series) {
      toast.error("Enter series");
      return;
    }

    if (!receiptNo) {
      toast.error("Enter receipt number");
      return;
    }

    const docNo = Number(receiptNo);

    if (Number.isNaN(docNo)) {
      toast.error("Invalid receipt number");
      return;
    }

    try {
      debugger;

      const data = await getLrByKey(branch, series, docNo);

      setCurrentId(data.id);

      console.log("LR FROM BACKEND:", data);

      form.reset({
        branch: branch,

        receiptNo: String(data.docNo ?? ""),

        series: data.docSerial ?? "",

        date: data.docDate ? data.docDate.substring(0, 10) : "",

        paymentType: data.paid === 1 ? "paid" : "toPay",

        consignor: data.senderCode
          ? {
              code: Number(data.senderCode),
              name: data.senderName ?? "",
              address: data.address ?? "",
              mobileNo: null,
            }
          : null,

        consignee:
          data.receiverCode != null
            ? {
                code: Number(data.receiverCode),
                name: data.receiverName ?? "",
                address: data.address ?? "",
                mobileNo: null,
              }
            : data.receiverName
              ? {
                  code: 0,
                  name: data.receiverName,
                  address: data.address ?? "",
                  mobileNo: null,
                }
              : null,

        fromLocation: data.fromLoc
          ? {
              code: null,
              name: data.fromLoc,
            }
          : null,

        toLocation: data.toLoc
          ? {
              code: null,
              name: data.toLoc,
            }
          : null,

        address: data.address ?? "",

        mobileNo: data.mobileNo ?? "",

        mobileNoRec: data.mobileNoRec ?? "",

        items:
          data.items && data.items.length > 0
            ? data.items.map((item: any) => ({
                description: item.itemName ?? "",
                quantity: String(item.qty ?? ""),
              }))
            : [
                {
                  description: "",
                  quantity: "",
                },
              ],

        weight: String(data.weight ?? ""),
        amount: String(data.amount ?? ""),
        freight: String(data.freight ?? ""),
        hamali: String(data.hamali ?? ""),
        advance: String(data.advance ?? ""),
        total: String(data.total ?? ""),
        receiptCharge: String(data.receipt ?? ""),
        otherCharges: String(data.crossing ?? ""),
        remarks: data.remark ?? "",
      });

      toast.success("Lorry Receipt loaded");
    } catch (error) {
      console.error("Failed to fetch LR:", error);
      toast.error("Lorry Receipt not found");
    }
  };

  const fetchLorryReceipt = async (id: string) => {
    try {
      const data = await getLrByKey("KLP", "A", 1);

      console.log("LR for update:", data);

      form.reset({
        branch: data.branch,
        receiptNo: data.receiptNo,
        series: data.series,
        date: data.date,
        paymentType: data.paymentType,

        consignor: data.consignor
          ? {
              code: data.consignor.code,
              name: data.consignor.name,
              address: data.consignor.address,
            }
          : null,

        consignee: data.consignee
          ? {
              code: data.consignee.code,
              name: data.consignee.name,
              address: data.consignee.address,
            }
          : null,

        fromLocation: data.fromLocation ?? null,
        toLocation: data.toLocation ?? null,

        address: data.address ?? "",
        mobileNo: data.mobileNo ?? "",

        items: data.items ?? [],

        weight: data.weight ?? "",
        amount: data.amount ?? "",
        freight: data.freight ?? "",
        hamali: data.hamali ?? "",
        advance: data.advance ?? "",
        total: data.total ?? "",
        receiptCharge: data.receiptCharge ?? "",
        otherCharges: data.otherCharges ?? "",

        remarks: data.remarks ?? "",
      });
    } catch (error) {
      console.error("Failed to load LR:", error);
    }
  };

  const items = [
    {
      value: "new",
      label: "New",
      icon: Plus,
    },
    {
      value: "edit",
      label: "Edit",
      icon: Pencil,
    },
  ];

  const [currentId, setCurrentId] = useState<Number>(0);

  const handleUpdate = async () => {
    debugger;

    console.log(currentId);

    const data = getValues();

    console.log("UPDATE DATA:", data);

    await onSubmit(data);
  };

  const handleDelete = async () => {
    console.log(currentId, "delete");

    try {
      await deleteLrById(currentId);

      toast.success("Lorry Receipt deleted successfully");

      // optional: clear/reset after delete
      handleNewMode();
    } catch (error) {
      console.error("Failed to delete LR:", error);

      toast.error("Failed to delete Lorry Receipt");
    }
  };

  const [printDialogOpen, setPrintDialogOpen] = useState(false);
  const [lrToPrint, setLrToPrint] = useState<any | null>(null);
  const [printStatus, setPrintStatus] = useState<"confirm" | "error">(
    "confirm",
  );
  const [printErrorMessage, setPrintErrorMessage] = useState<string | null>(
    null,
  );

  const handlePrint = async () => {
    if (!lrToPrint?.id) {
      return;
    }

    try {
      console.log("lrtoptint", lrToPrint);

      const response = await api.get(
        `/reports/builty-receipt2/${lrToPrint.id}`,
        {
          responseType: "blob",
        },
      );

      const blob = response.data;

      const url = window.URL.createObjectURL(blob);

      const iframe = document.createElement("iframe");

      iframe.style.position = "fixed";
      iframe.style.width = "0";
      iframe.style.height = "0";
      iframe.style.border = "0";

      iframe.src = url;

      document.body.appendChild(iframe);

      iframe.onload = () => {
        iframe.contentWindow?.focus();
        iframe.contentWindow?.print();
      };
    } catch (error) {
      console.error("PRINT ERROR:", error);

      setPrintErrorMessage(
        error instanceof Error
          ? error.message
          : "Failed to print Lorry Receipt.",
      );

      setPrintStatus("error");
    }
  };

  const handleOldPrint = async () => {
    if (!currentId) {
      return;
    }

    try {
      console.log("currentId", currentId);

      const response = await api.get(`/reports/builty-receipt2/${currentId}`, {
        responseType: "blob",
      });

      const blob = response.data;

      const url = window.URL.createObjectURL(blob);

      const iframe = document.createElement("iframe");

      iframe.style.position = "fixed";
      iframe.style.width = "0";
      iframe.style.height = "0";
      iframe.style.border = "0";

      iframe.src = url;

      document.body.appendChild(iframe);

      iframe.onload = () => {
        iframe.contentWindow?.focus();
        iframe.contentWindow?.print();
      };
    } catch (error) {
      console.error("PRINT ERROR:", error);

      setPrintErrorMessage(
        error instanceof Error
          ? error.message
          : "Failed to print Lorry Receipt.",
      );

      setPrintStatus("error");
    }
  };

  return (
    <div className="min-h-screen bg-muted/30 p-4 md:p-6">
      <div className="mx-auto max-w-7xl">
        <Form {...form}>
          <form
            onSubmit={handleSubmit(onSubmit, (errors) => {
              console.log("SUBMIT VALIDATION ERRORS:", errors);
              toast.error("Please fix the validation errors");
            })}
            className="space-y-5"
          >
            <Card className="shadow-sm">
              <CardHeader className="border-b bg-muted/20">
                <div className="flex justify-between">
                  <div>
                    <CardTitle className="text-xl font-semibold">
                      Lorry Receipt
                    </CardTitle>

                    <p className="text-sm text-muted-foreground">
                      Create and manage lorry receipt details
                    </p>
                  </div>

                  <div>
                    <Select
                      items={items}
                      value={mode}
                      onValueChange={(value) => {
                        if (!value) return;

                        setMode(value);

                        if (value === "new") {
                          handleNewMode();
                        } else {
                          handleEditMode();
                        }
                      }}
                    >
                      <SelectTrigger className="w-full max-w-48">
                        <SelectValue />
                      </SelectTrigger>

                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Mode</SelectLabel>

                          {items.map((item) => {
                            const Icon = item.icon;

                            return (
                              <SelectItem key={item.value} value={item.value}>
                                <div className="flex items-center gap-2">
                                  <Icon className="h-4 w-4" />
                                  <span>{item.label}</span>
                                </div>
                              </SelectItem>
                            );
                          })}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pt-6">
                <div className="grid grid-cols-1 gap-5 md:grid-cols-10">
                  {/* Receipt No */}

                  <div className="md:col-span-3">
                    <FormField
                      control={control}
                      name="branch"
                      render={({ field }) => (
                        <FormItem>
                          <Label>Branch</Label>
                          <FormControl>
                            <Input {...field} readOnly />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <FormField
                      control={control}
                      name="series"
                      render={({ field }) => (
                        <FormItem>
                          <Label>Series</Label>
                          <FormControl>
                            <Input
                              {...field}
                              readOnly={mode === "new"}
                              placeholder={
                                mode === "edit" ? "Enter series" : ""
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="md:col-span-3">
                    <FormField
                      control={control}
                      name="receiptNo"
                      render={({ field }) => (
                        <FormItem>
                          <Label>Receipt No</Label>
                          <FormControl>
                            <Input
                              {...field}
                              readOnly={mode === "new"}
                              placeholder={
                                mode === "edit" ? "Enter receipt no. " : ""
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className=" items-end flex justify-center">
                    {mode === "edit" && (
                      <Button type="button" onClick={handleFindLR}>
                        Search
                      </Button>
                    )}
                  </div>

                  {/* Series */}

                  {/* Date */}

                  <div className="md:col-span-3">
                    <FormField
                      control={control}
                      name="date"
                      render={({ field }) => (
                        <FormItem>
                          <Label>Date</Label>

                          <FormControl>
                            <Input
                              type="date"
                              {...field}
                              max={new Date().toISOString().split("T")[0]}
                            />
                          </FormControl>

                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Vehicle Number */}
                  <div className="md:col-span-3">
                    <FormField
                      control={control}
                      name="vehicleCode"
                      render={({ field }) => (
                        <FormItem>
                          <Label>Vehicle Number</Label>

                          <FormControl>
                            <SelectComboBox
                              items={vehicles}
                              value={field.value}
                              onChange={(vehicle) => {
                                field.onChange(
                                  typeof vehicle === "object"
                                    ? String(vehicle?.code)
                                    : String(vehicle),
                                );
                              }}
                              getLabel={(vehicle: Vehicle) => vehicle.name}
                              getValue={(vehicle: Vehicle) =>
                                String(vehicle.code)
                              }
                              placeholder="Select vehicle number"
                              searchPlaceholder="Search vehicle number..."
                            />
                          </FormControl>

                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Driver Name */}
                  <div className="md:col-span-3">
                    <FormField
                      control={control}
                      name="driverCode"
                      render={({ field }) => (
                        <FormItem>
                          <Label>Driver Name</Label>

                          <FormControl>
                            <SelectComboBox
                              items={drivers}
                              value={field.value}
                              onChange={(driver) => {
                                field.onChange(
                                  typeof driver === "object"
                                    ? String(driver?.code)
                                    : String(driver),
                                );
                              }}
                              getLabel={(driver: Driver) => driver.name}
                              getValue={(driver: Driver) => String(driver.code)}
                              placeholder="Select driver name"
                              searchPlaceholder="Search driver name..."
                            />
                          </FormControl>

                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Payment */}

                  <div className="md:col-span-4 mt-4 ">
                    <FormField
                      control={control}
                      name="paymentType"
                      render={({ field }) => (
                        <FormItem>
                          <Label>Payment Type</Label>

                          <FormControl>
                            <RadioGroup
                              value={field.value}
                              onValueChange={field.onChange}
                              className="mt-3 flex gap-6"
                            >
                              <div className="flex items-center gap-2">
                                <RadioGroupItem value="paid" id="paid" />

                                <Label
                                  htmlFor="paid"
                                  className="cursor-pointer"
                                >
                                  Paid
                                </Label>
                              </div>

                              <div className="flex items-center gap-2">
                                <RadioGroupItem value="toPay" id="toPay" />

                                <Label
                                  htmlFor="toPay"
                                  className="cursor-pointer"
                                >
                                  To Pay
                                </Label>
                              </div>
                            </RadioGroup>
                          </FormControl>

                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* =================================================
                PARTY DETAILS
            ================================================= */}

            <Card className="shadow-sm">
              <CardHeader className="border-b">
                <CardTitle className="text-base">Party Details</CardTitle>
              </CardHeader>

              <CardContent className="pt-6">
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  <FormField
                    control={control}
                    name="consignor"
                    render={({ field }) => (
                      <FormItem>
                        <Label>Consignor</Label>

                        <FormControl>
                          <SelectComboBox
                            items={parties}
                            value={field.value}
                            onChange={field.onChange}
                            getLabel={(party) => party.name}
                            getValue={(party) => party.code}
                            placeholder="Enter consignor name"
                            searchPlaceholder="Search consignor..."
                            onSearch={searchParties}
                          />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={control}
                    name="consignee"
                    render={({ field }) => (
                      <FormItem>
                        <Label>Consignee</Label>

                        <FormControl>
                          <SelectComboBox
                            items={parties}
                            value={field.value}
                            onChange={field.onChange}
                            getLabel={(party) => party.name}
                            getValue={(party) => party.code}
                            placeholder="Enter consignee name"
                            searchPlaceholder="Search consignee..."
                            onSearch={searchParties}
                          />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={control}
                    name="fromLocation"
                    render={({ field }) => (
                      <FormItem>
                        <Label>From Location</Label>

                        <FormControl>
                          <SelectComboBox
                            items={cities}
                            value={field.value}
                            onChange={field.onChange}
                            getLabel={(city) => city.name}
                            getValue={(city) => city.code}
                            placeholder="Enter from location"
                            searchPlaceholder="Search from location..."
                            onSearch={searchCities}
                          />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={control}
                    name="toLocation"
                    render={({ field }) => (
                      <FormItem>
                        <Label>To Location</Label>

                        <FormControl>
                          <SelectComboBox
                            items={toCities}
                            value={field.value}
                            onChange={field.onChange}
                            getLabel={(city) => city.name}
                            getValue={(city) => city.code}
                            placeholder="Enter to location"
                            searchPlaceholder="Search to location..."
                            onSearch={searchToCities}
                          />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={control}
                    name="mobileNoRec"
                    render={({ field }) => (
                      <FormItem className="">
                        <Label>Consignor WhatsApp Number</Label>

                        <FormControl>
                          <Input placeholder="Enter Mobile No" {...field} />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={control}
                    name="mobileNo"
                    render={({ field }) => (
                      <FormItem className="">
                        <Label>Consignee WhatsApp Number</Label>

                        <FormControl>
                          <Input placeholder="Enter Mobile No" {...field} />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <Label>Address</Label>

                        <FormControl>
                          <Input placeholder="Enter address" {...field} />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* =================================================
                ITEMS
            ================================================= */}

            <Card className="shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between border-b">
                <div>
                  <CardTitle className="text-base">
                    Consignment Details
                  </CardTitle>

                  <p className="mt-1 text-sm text-muted-foreground">
                    Enter item details. A new row will automatically appear when
                    quantity is entered.
                  </p>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    append({
                      description: "",
                      quantity: "",
                    })
                  }
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Item
                </Button>
              </CardHeader>

              <CardContent className="pt-6">
                <div className="overflow-x-auto rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead className="w-16 text-center">Sr.</TableHead>

                        <TableHead>Description</TableHead>

                        <TableHead className="w-40">Quantity</TableHead>

                        <TableHead className="w-20 text-center">
                          Action
                        </TableHead>
                      </TableRow>
                    </TableHeader>

                    <TableBody>
                      {fields.map((item, index) => (
                        <TableRow key={item.id}>
                          <TableCell className="text-center font-medium">
                            {index + 1}
                          </TableCell>

                          {/* Description */}

                          <TableCell>
                            <FormField
                              control={control}
                              name={`items.${index}.description`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormControl>
                                    <Input
                                      placeholder="Item description"
                                      {...field}
                                    />
                                  </FormControl>

                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </TableCell>

                          {/* Quantity */}

                          <TableCell>
                            <FormField
                              control={control}
                              name={`items.${index}.quantity`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormControl>
                                    <Input
                                      type="number"
                                      min="1"
                                      placeholder="Qty"
                                      {...field}
                                      onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                          e.preventDefault();

                                          const value =
                                            e.currentTarget.value.trim();

                                          if (
                                            value !== "" &&
                                            index === fields.length - 1
                                          ) {
                                            append({
                                              description: "",
                                              quantity: "",
                                            });
                                          }
                                        }
                                      }}
                                    />
                                  </FormControl>

                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </TableCell>

                          {/* Delete */}

                          <TableCell className="text-center">
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              disabled={fields.length === 1}
                              onClick={() => remove(index)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>

            {/* =================================================
                CHARGES
            ================================================= */}

            <Card className="shadow-sm">
              <CardHeader className="border-b">
                <CardTitle className="text-base">Charges</CardTitle>
              </CardHeader>

              <CardContent className="pt-6">
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                  {/* Weight */}

                  <FormField
                    control={control}
                    name="weight"
                    render={({ field }) => (
                      <FormItem>
                        <Label>Weight</Label>

                        <FormControl>
                          <Input
                            type="number"
                            min="0"
                            placeholder="0.00"
                            {...field}
                          />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Amount */}

                  <FormField
                    control={control}
                    name="amount"
                    render={({ field }) => (
                      <FormItem>
                        <Label>Amount</Label>

                        <FormControl>
                          <Input
                            type="number"
                            min="0"
                            placeholder="0.00"
                            {...field}
                          />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Freight */}

                  <FormField
                    control={control}
                    name="freight"
                    render={({ field }) => (
                      <FormItem>
                        <Label>Freight</Label>

                        <FormControl>
                          <Input
                            type="number"
                            min="0"
                            placeholder="0.00"
                            {...field}
                          />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Hamali */}

                  <FormField
                    control={control}
                    name="hamali"
                    render={({ field }) => (
                      <FormItem>
                        <Label>Hamali</Label>

                        <FormControl>
                          <Input
                            type="number"
                            min="0"
                            placeholder="0.00"
                            {...field}
                          />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Advance */}

                  <FormField
                    control={control}
                    name="advance"
                    render={({ field }) => (
                      <FormItem>
                        <Label>Advance</Label>

                        <FormControl>
                          <Input
                            type="number"
                            min="0"
                            placeholder="0.00"
                            {...field}
                          />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Receipt Charge */}

                  <FormField
                    control={control}
                    name="receiptCharge"
                    render={({ field }) => (
                      <FormItem>
                        <Label>Receipt Charge</Label>

                        <FormControl>
                          <Input
                            type="number"
                            min="0"
                            placeholder="0.00"
                            {...field}
                          />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Other */}

                  <FormField
                    control={control}
                    name="otherCharges"
                    render={({ field }) => (
                      <FormItem>
                        <Label>Other Charges</Label>

                        <FormControl>
                          <Input
                            type="number"
                            min="0"
                            placeholder="0.00"
                            {...field}
                          />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Total */}

                  <FormField
                    control={control}
                    name="total"
                    render={({ field }) => (
                      <FormItem>
                        <Label>Total</Label>

                        <FormControl>
                          <Input
                            className="font-semibold bg-muted"
                            readOnly
                            {...field}
                          />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* =================================================
                REMARKS
            ================================================= */}

            <Card className="shadow-sm">
              <CardHeader className="border-b">
                <CardTitle className="text-base">Remarks</CardTitle>
              </CardHeader>

              <CardContent className="pt-6">
                <FormField
                  control={control}
                  name="remarks"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea
                          placeholder="Enter remarks..."
                          rows={4}
                          {...field}
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* =================================================
                ACTIONS
            ================================================= */}

            <div className="flex flex-wrap justify-end gap-3">
              {mode === "new" && (
                <Button type="submit">
                  <Save className="mr-2 h-4 w-4" />
                  Submit
                </Button>
              )}

              {mode === "edit" && (
                <Button
                  type="button"
                  variant={"default"}
                  onClick={handleOldPrint}
                >
                  <Printer className="mr-2 h-4 w-4" />
                  Print
                </Button>
              )}

              {mode === "edit" && (
                <Button
                  type="button"
                  variant={"secondary"}
                  onClick={handleUpdate}
                >
                  <Save className="mr-2 h-4 w-4" />
                  Update
                </Button>
              )}

              {mode === "edit" && (
                <Button
                  type="button"
                  variant="destructive"
                  onClick={handleDelete}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              )}
            </div>
          </form>
        </Form>
      </div>

      <AlertDialog open={printDialogOpen} onOpenChange={setPrintDialogOpen}>
        <AlertDialogContent>
          {printStatus === "confirm" && (
            <>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Lorry Receipt Submitted Successfully
                </AlertDialogTitle>

                <AlertDialogDescription>
                  Lorry Receipt{" "}
                  <strong>
                    {lrToPrint?.docPrefix} / {lrToPrint?.docSerial} /{" "}
                    {lrToPrint?.docNo}
                  </strong>{" "}
                  has been submitted successfully.
                  <br />
                  <br />
                  Do you want to print the Lorry Receipt?
                </AlertDialogDescription>
              </AlertDialogHeader>

              <AlertDialogFooter>
                <AlertDialogCancel
                  onClick={() => {
                    setPrintDialogOpen(false);
                    setLrToPrint(null);
                    handleNewMode();
                  }}
                >
                  No
                </AlertDialogCancel>

                <AlertDialogAction onClick={handlePrint}>
                  <Printer className="mr-2 h-4 w-4" />
                  Yes, Print
                </AlertDialogAction>
              </AlertDialogFooter>
            </>
          )}

          {printStatus === "error" && (
            <>
              <AlertDialogHeader>
                <AlertDialogTitle>Print Failed</AlertDialogTitle>

                <AlertDialogDescription>
                  {printErrorMessage}
                </AlertDialogDescription>
              </AlertDialogHeader>

              <AlertDialogFooter>
                <AlertDialogCancel
                  onClick={() => {
                    setPrintDialogOpen(false);
                    setLrToPrint(null);
                    setPrintErrorMessage(null);
                  }}
                >
                  Cancel
                </AlertDialogCancel>

                <AlertDialogAction
                  onClick={() => {
                    setPrintStatus("confirm");
                    setPrintErrorMessage(null);
                  }}
                >
                  Try Again
                </AlertDialogAction>
              </AlertDialogFooter>
            </>
          )}
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
>>>>>>> 6eef6d2 (feat : chnages)
}
