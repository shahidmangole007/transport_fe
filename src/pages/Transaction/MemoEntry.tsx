import { Button } from "@/components/ui/button";
import {
  FilePlus2,
  CheckCircle2,
  XCircle,
  Printer,
  HelpCircle,
  ChevronsLeft,
  ChevronLeft,
  ChevronRight,
  ChevronsRight,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import axios from "axios";
import { useTranslation } from "react-i18next";

// ---- ASSUMED types/api — replace with your actual memoEntry.ts / memoEntry.api.ts ----
// import type { MemoEntry, CreateMemoEntry, UpdateMemoEntry } from "@/types/memoEntry";
// import {
//   getMemoEntries,
//   getMemoEntry,
//   createMemoEntry,
//   updateMemoEntry,
//   deleteMemoEntry,
// } from "@/api/memoEntry.api";

interface MemoEntryRow {
  srNo: number;
  branch: string;
  series: string;
  receiptNo: string;
  consignorName: string;
  consigneeName: string;
  village: string;
}

interface MemoEntryRecord {
  id: number;
  memoNo: string;
  date: string;
  truckNo: string;
  driverName: string;
  rows: MemoEntryRow[];
}

const memoEntrySchema = z.object({
  memoNo: z.string().min(1, "Memo number is required"),
  date: z.string().min(1, "Date is required"),
  truckNo: z.string().min(1, "Truck number is required"),
  driverName: z.string().min(1, "Driver name is required"),
});

type MemoEntryFormData = z.infer<typeof memoEntrySchema>;

const inputCls = "h-8 text-sm";
const labelCls = "text-xs";

export default function MemoEntry() {
  const { t } = useTranslation();

  const { register, handleSubmit, reset } = useForm<MemoEntryFormData>({
    resolver: zodResolver(memoEntrySchema),
    defaultValues: {
      memoNo: "",
      date: "",
      truckNo: "",
      driverName: "",
    },
  });

  const [records, setRecords] = useState<MemoEntryRecord[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [rows, setRows] = useState<MemoEntryRow[]>([
    {
      srNo: 1,
      branch: "",
      series: "",
      receiptNo: "",
      consignorName: "",
      consigneeName: "",
      village: "",
    },
  ]);
  const [isEditing, setIsEditing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchRecords = async () => {
    try {
      // const data = await getMemoEntries();
      // setRecords(data);
      // if (data.length) loadRecord(data.length - 1, data);
    } catch {
      // wire up once API is connected
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const loadRecord = (index: number, source: MemoEntryRecord[] = records) => {
    const record = source[index];
    if (!record) return;

    setCurrentIndex(index);
    setRows(record.rows);
    reset({
      memoNo: record.memoNo,
      date: record.date,
      truckNo: record.truckNo,
      driverName: record.driverName,
    });
  };

  const goFirst = () => records.length && loadRecord(0);
  const goPrev = () => currentIndex > 0 && loadRecord(currentIndex - 1);
  const goNext = () =>
    currentIndex < records.length - 1 && loadRecord(currentIndex + 1);
  const goLast = () => records.length && loadRecord(records.length - 1);

  const handleNew = () => {
    setIsEditing(false);
    setRows([
      {
        srNo: 1,
        branch: "",
        series: "",
        receiptNo: "",
        consignorName: "",
        consigneeName: "",
        village: "",
      },
    ]);
    reset();
  };

  const handleRowChange = (
    srNo: number,
    field: keyof Omit<MemoEntryRow, "srNo">,
    value: string,
  ) => {
    setRows((prev) =>
      prev.map((row) => (row.srNo === srNo ? { ...row, [field]: value } : row)),
    );
  };

  const addRow = () => {
    setRows((prev) => [
      ...prev,
      {
        srNo: prev.length + 1,
        branch: "",
        series: "",
        receiptNo: "",
        consignorName: "",
        consigneeName: "",
        village: "",
      },
    ]);
  };

  const handleDeleteRow = (srNo: number) => {
    setRows((prev) => {
      if (prev.length === 1) return prev;

      return prev
        .filter((row) => row.srNo !== srNo)
        .map((row, index) => ({ ...row, srNo: index + 1 }));
    });
  };

  const onSubmit = async (data: MemoEntryFormData) => {
    try {
      setErrorMessage(null);

      const submitObj = { ...data, rows };

      if (isEditing && records[currentIndex]) {
        // await updateMemoEntry(records[currentIndex].id, submitObj);
      } else {
        // await createMemoEntry(submitObj);
      }

      await fetchRecords();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setErrorMessage(
          error.response?.data?.message ??
            error.message ??
            "Failed to save memo entry",
        );
      } else {
        setErrorMessage("Failed to save memo entry");
      }
    }
  };

  const handleDelete = async () => {
    const record = records[currentIndex];
    if (!record) return;

    try {
      // await deleteMemoEntry(record.id);
      await fetchRecords();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setErrorMessage(
          error.response?.data?.message ??
            error.message ??
            "Failed to delete memo entry",
        );
      } else {
        setErrorMessage("Failed to delete memo entry");
      }
    }
  };

  const handlePrint = () => window.print();

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex h-full flex-col overflow-hidden"
    >
      <Card className="flex flex-1 flex-col overflow-hidden py-3">
        <CardContent className="flex-1 overflow-hidden space-y-3 text-sm">
          {/* Header fields */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-end gap-2">
              <Field className="gap-1 flex-1">
                <FieldLabel className={labelCls}>
                  {t("memoEntry.memoNo")}
                </FieldLabel>
                <Input className={inputCls} {...register("memoNo")} />
              </Field>
            </div>

            <Field className="gap-1">
              <FieldLabel className={labelCls}>
                {t("memoEntry.date")}
              </FieldLabel>
              <Input className={inputCls} type="date" {...register("date")} />
            </Field>

            <div className="flex items-end gap-2">
              <Field className="gap-1 flex-1">
                <FieldLabel className={labelCls}>
                  {t("memoEntry.truckNo")}
                </FieldLabel>
                <Input className={inputCls} {...register("truckNo")} />
              </Field>
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="h-8 w-8 shrink-0"
              >
                <HelpCircle className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex items-end gap-2">
              <Field className="gap-1 flex-1">
                <FieldLabel className={labelCls}>
                  {t("memoEntry.driverName")}
                </FieldLabel>
                <Input className={inputCls} {...register("driverName")} />
              </Field>
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="h-8 w-8 shrink-0"
              >
                <HelpCircle className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Rows grid */}
          <div className="border rounded-md overflow-hidden flex-1 flex flex-col">
            <div className="flex-1 overflow-y-auto">
              <table className="w-full text-xs">
                <thead className="bg-muted sticky top-0">
                  <tr>
                    <th className="px-2 py-1.5 text-left w-10">
                      {t("memoEntry.srNo")}
                    </th>
                    <th className="px-2 py-1.5 text-left w-16">
                      {t("memoEntry.branch")}
                    </th>
                    <th className="px-2 py-1.5 text-left w-16">
                      {t("memoEntry.series")}
                    </th>
                    <th className="px-2 py-1.5 text-left w-24">
                      {t("memoEntry.receiptNo")}
                    </th>
                    <th className="px-2 py-1.5 text-left">
                      {t("memoEntry.consignorName")}
                    </th>
                    <th className="px-2 py-1.5 text-left">
                      {t("memoEntry.consigneeName")}
                    </th>
                    <th className="px-2 py-1.5 text-left w-32">
                      {t("memoEntry.village")}
                    </th>
                    <th className="px-2 py-1.5 text-left w-10"></th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => (
                    <tr key={row.srNo} className="border-t">
                      <td className="px-2 py-1">{row.srNo}</td>

                      <td className="px-2 py-1">
                        <Input
                          className={inputCls}
                          value={row.branch}
                          onChange={(e) =>
                            handleRowChange(row.srNo, "branch", e.target.value)
                          }
                        />
                      </td>

                      <td className="px-2 py-1">
                        <Input
                          className={inputCls}
                          value={row.series}
                          onChange={(e) =>
                            handleRowChange(row.srNo, "series", e.target.value)
                          }
                        />
                      </td>

                      <td className="px-2 py-1">
                        <Input
                          className={inputCls}
                          value={row.receiptNo}
                          onChange={(e) =>
                            handleRowChange(
                              row.srNo,
                              "receiptNo",
                              e.target.value,
                            )
                          }
                        />
                      </td>

                      <td className="px-2 py-1">
                        <Input
                          className={inputCls}
                          value={row.consignorName}
                          onChange={(e) =>
                            handleRowChange(
                              row.srNo,
                              "consignorName",
                              e.target.value,
                            )
                          }
                        />
                      </td>

                      <td className="px-2 py-1">
                        <Input
                          className={inputCls}
                          value={row.consigneeName}
                          onChange={(e) =>
                            handleRowChange(
                              row.srNo,
                              "consigneeName",
                              e.target.value,
                            )
                          }
                        />
                      </td>

                      <td className="px-2 py-1">
                        <Input
                          className={inputCls}
                          value={row.village}
                          onChange={(e) =>
                            handleRowChange(row.srNo, "village", e.target.value)
                          }
                        />
                      </td>

                      <td className="px-2 py-1">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => handleDeleteRow(row.srNo)}
                        >
                          <XCircle className="h-4 w-4 text-destructive" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <Button
              type="button"
              variant="outline"
              size="sm"
              className="m-1 h-6 text-xs w-fit"
              onClick={addRow}
            >
              + {t("memoEntry.addRow")}
            </Button>
          </div>

          {errorMessage && (
            <p className="text-xs text-destructive">{errorMessage}</p>
          )}
        </CardContent>
      </Card>

      {/* Action bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 mt-2 border-t pt-2">
        <div className="flex gap-2">
          <Button type="button" variant="outline" size="sm" onClick={handleNew}>
            <FilePlus2 className="mr-1 h-3.5 w-3.5" />
            {t("common.new")}
          </Button>
          <Button type="submit" size="sm">
            <CheckCircle2 className="mr-1 h-3.5 w-3.5" />
            {t("common.save")}
          </Button>
          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={handleDelete}
          >
            <XCircle className="mr-1 h-3.5 w-3.5" />
            {t("common.delete")}
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handlePrint}
          >
            <Printer className="mr-1 h-3.5 w-3.5" />
            {t("common.print")}
          </Button>
        </div>

        <div className="flex gap-1">
          <Button type="button" variant="ghost" size="icon" onClick={goFirst}>
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button type="button" variant="ghost" size="icon" onClick={goPrev}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button type="button" variant="ghost" size="icon" onClick={goNext}>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button type="button" variant="ghost" size="icon" onClick={goLast}>
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </form>
  );
}
