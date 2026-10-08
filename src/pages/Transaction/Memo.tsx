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

import { getcurrentSer, getLrByKey, searchParty } from "@/api/Lr.api";
import type { Series } from "@/types/lr";
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

const itemSchema = z.object({
  description: z.string().min(1, "Description is required"),

  quantity: z
    .string()
    .min(1, "Quantity is required")
    .refine((value) => Number(value) > 0, "Quantity must be greater than 0"),
});

const partySchema = z.object({
  code: z.number(),
  name: z.string(),
  address: z.string(),
  mobileNo: z.string(),
});

const citySchema = z.object({
  code: z.number(),
  name: z.string(),
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

  address: z.string().min(1, "Address is required"),

  mobileNo: z.string().regex(/^\d{10}$/, "Mobile number must be 10 digits"),

  items: z.array(itemSchema).min(1, "At least one item is required"),

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

export default function Memo() {
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

      address: "",
      mobileNo: "",

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

  /* =========================================================
     ADD NEW ITEM ROW
  ========================================================= */

  const handleQuantityChange = (index: number, value: string) => {
    const lastRow = index === fields.length - 1;

    if (lastRow && value.trim() !== "") {
      append({
        description: "",
        quantity: "",
      });
    }
  };

  /* =========================================================
     SUBMIT
  ========================================================= */

  const onSubmit = (data: LorryReceiptForm) => {
    const cleanedItems = data.items.filter(
      (item) => item.description.trim() !== "" || item.quantity.trim() !== "",
    );

    const payload = {
      branch: data.branch,
      receiptNo: data.receiptNo,
      series: data.series,
      date: data.date,

      paymentType: data.paymentType,

      consignorCode: data.consignor?.code,
      consignorName: data.consignor?.name,

      consigneeCode: data.consignee?.code,
      consigneeName: data.consignee?.name,

      fromLocationCode: data.fromLocation?.code,
      fromLocationName: data.fromLocation?.name,

      toLocationCode: data.toLocation?.code,
      toLocationName: data.toLocation?.name,

      address: data.address,
      mobileNo: data.mobileNo,

      items: cleanedItems,

      weight: data.weight,
      amount: data.amount,
      freight: data.freight,
      hamali: data.hamali,
      advance: data.advance,
      total: data.total,
      receiptCharge: data.receiptCharge,
      otherCharges: data.otherCharges,

      remarks: data.remarks,
    };

    console.log("LR Payload:", payload);

    // await saveLorryReceipt(payload);
  };

  /* =========================================================
     NEW
  ========================================================= */

  // const handleNew = () => {
  //   reset({
  //     receiptNo: "",
  //     series: "",
  //     date: new Date().toISOString().split("T")[0],

  //     paymentType: "paid",

  //     consignor: "",
  //     consignee: "",
  //     address: "",
  //     destination: "",

  //     items: [
  //       {
  //         description: "",
  //         quantity: "",
  //       },
  //     ],

  //     weight: "",
  //     amount: "",
  //     freight: "",
  //     hamali: "",
  //     advance: "",
  //     total: "",
  //     receiptCharge: "",
  //     otherCharges: "",

  //     remarks: "",
  //   });
  // };

  const [series, setSeries] = useState<Series | null>(null);

  const [parties, setParties] = useState<Party[]>([]);

  const [cities, setCities] = useState<City[]>([]);

  const [toCities, setToCities] = useState<City[]>([]);

  const fetchCurrentSeries = async () => {
    try {
      const year = localStorage.getItem("current_year");

      if (!year) return;

      const data = await getcurrentSer(year);
      debugger;

      setSeries(data);

      setValue("branch", data.docPrefix ?? "");
      setValue("series", data.docSerial ?? "");
      setValue("receiptNo", String(data.docNo ?? ""));
    } catch (error) {
      console.error("Failed to fetch series:", error);
    }
  };

  // useEffect(() => {
  //   fetchCurrentSeries();
  // }, []);

  const searchParties = useCallback(async (search: string) => {
    if (search.trim().length < 2) {
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
    if (search.trim().length < 2) {
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
    if (search.trim().length < 2) {
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

  useEffect(() => {
    if (selectedConsignee?.address) {
      setValue("address", selectedConsignee.address);
      setValue("mobileNo", selectedConsignee.mobileNo);
    }
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

  let handleUpdate = () => {};

  const handleFindLR = async () => {
    const branch = getValues("branch")?.trim();
    const series = getValues("series")?.trim();
    const docNo = Number(getValues("receiptNo")?.trim());

    if (!series) {
      toast.error("Enter series");
      return;
    }

    if (!docNo) {
      toast.error("Enter document number");
      return;
    }

    try {
      const data = await getLrByKey(branch, series, docNo);

      console.log("LR found:", data);
      form.reset({
        branch: getValues("branch"),

        receiptNo: String(data.docNo ?? ""),
        series: data.docSerial ?? "",

        date: data.docDate ? data.docDate.substring(0, 10) : "",

        paymentType: data.paid === 1 ? "paid" : "toPay",

        consignor: {
          code: Number(data.senderCode),
          name: data.senderName ?? "",
          address: data.address ?? "",
          mobileNo: "",
        },

        consignee: {
          code: Number(data.receiverCode),
          name: data.receiverName ?? "",
          address: data.address ?? "",
          mobileNo: "",
        },

        fromLocation: data.fromLoc ?? null,
        toLocation: data.toLoc ?? null,

        address: data.address ?? "",
        mobileNo: "",

        items: (data.items ?? []).map((item) => ({
          description: item.itemName ?? "",
          quantity: String(item.qty ?? ""),
        })),

        weight: String(data.weight ?? ""),
        amount: String(data.amount ?? ""),
        freight: String(data.freight ?? ""),
        hamali: String(data.hamali ?? ""),
        advance: String(data.advance ?? ""),
        total: String(data.amount ?? ""),
        receiptCharge: String(data.receipt ?? ""),
        otherCharges: String(data.crossing ?? ""),

        remarks: data.remark ?? "",
      });

      toast.success("Lorry Receipt loaded", {
        style: {
          background: "green",
          color: "white",
        },
      });
    } catch (error) {
      console.error("Failed to fetch LR:", error);
      toast.error("Lorry Receipt not found", {
        style: {
          background: "red",
          color: "white",
        },
      });
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

  return (
    <div className="min-h-screen bg-muted/30 p-4 md:p-6">
      <div className="mx-auto max-w-7xl">
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <Card className="shadow-sm">
              <CardHeader className="border-b bg-muted/20">
                <div className="flex justify-between">
                  <div>
                    <CardTitle className="text-xl font-semibold">
                      Memo Entry
                    </CardTitle>

                    <p className="text-sm text-muted-foreground">
                      Create and manage memo details
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

                  <div className="md:col-span-5">
                    <FormField
                      control={control}
                      name="branch"
                      render={({ field }) => (
                        <FormItem>
                          <Label>Memo Number</Label>
                          <FormControl>
                            <Input {...field} readOnly />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Date */}

                  <div className="md:col-span-5">
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

                  <div className="md:col-span-5">
                    <FormField
                      control={control}
                      name="consignor"
                      render={({ field }) => (
                        <FormItem>
                          <Label>Vehicle Number</Label>

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
                  </div>

                  <div className="md:col-span-5">
                    <FormField
                      control={control}
                      name="consignee"
                      render={({ field }) => (
                        <FormItem>
                          <Label>Driver Name</Label>

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
                  </div>
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
                    Lr Tran Details 
                  </CardTitle>

                  <p className="mt-1 text-sm text-muted-foreground">
                    Enter Lr Tran Details. A new row will automatically appear when
                    lr tran no is entered.
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
                ACTIONS
            ================================================= */}

            <div className="flex flex-wrap justify-end gap-3">
              {/* <Button type="button" variant="outline" onClick={handleNew}>
                <RotateCcw className="mr-2 h-4 w-4" />
                New
              </Button> */}

              <Button type="submit">
                <Save className="mr-2 h-4 w-4" />
                Submit
              </Button>

              <Button
                type="button"
                variant={"secondary"}
                onClick={handleUpdate}
              >
                Update
              </Button>

              <Button type="button" variant="destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
