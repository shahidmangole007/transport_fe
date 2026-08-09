import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TableWithFooter } from "@/components/TableWithFooter";

import {
  Save,
  Pencil,
  Trash2,
  Printer,
  Plus,
  X,
  ChevronsLeft,
  ChevronLeft,
  ChevronRight,
  ChevronsRight,
} from "lucide-react";

import {
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import type { ColumnDef } from "@tanstack/react-table";

export default function MemoEntry() {
  const { t } = useTranslation();

  // ============================
  // Validation Schema
  // ============================

  const memoSchema = z.object({
    memoNumber: z
      .string()
      .min(1, t("memoEntry.validation.memoNumberRequired")),

    lrNumber: z
      .string()
      .min(1, t("memoEntry.validation.lrNumberRequired")),

    date: z.string(),

    driverName: z
      .string()
      .min(1, t("memoEntry.validation.driverNameRequired")),
  });

  type MemoFormData = z.infer<typeof memoSchema>;

  // ============================
  // React Hook Form
  // ============================

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<MemoFormData>({
    resolver: zodResolver(memoSchema),
    defaultValues: {
      memoNumber: "",
      lrNumber: "",
      date: "",
      driverName: "",
    },
  });

  // ============================
  // States
  // ============================

  const [rows, setRows] = useState<MemoRow[]>([]);
  const [search, setSearch] = useState("");

  // ============================
  // Load Table Data
  // ============================

  useEffect(() => {
    setRows([
      {
        branch: "",
        series: "",
        lrNo: "",
        consignor: "",
        consignee: "",
        place: "",
      },
      {
        branch: "",
        series: "",
        lrNo: "",
        consignor: "",
        consignee: "",
        place: "",
      },
      {
        branch: "",
        series: "",
        lrNo: "",
        consignor: "",
        consignee: "",
        place: "",
      },
    ]);
  }, []);

  // ============================
  // Table Columns
  // ============================

  const columns = useMemo<ColumnDef<any>[]>(
    () => [
      {
        accessorKey: "branch",
        header: t("memoEntry.table.branch"),
      },
      {
        accessorKey: "series",
        header: t("memoEntry.table.series"),
      },
      {
        accessorKey: "lrNo",
        header: t("memoEntry.table.lrNo"),
      },
      {
        accessorKey: "consignor",
        header: t("memoEntry.table.consignor"),
      },
      {
        accessorKey: "consignee",
        header: t("memoEntry.table.consignee"),
      },
      {
        accessorKey: "place",
        header: t("memoEntry.table.place"),
      },
    ],
    [t]
  );

  // ============================
  // React Table
  // ============================

  const table = useReactTable({
    data: rows,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  // ============================
  // Submit
  // ============================

  const onSubmit = (data: MemoFormData) => {
    console.log(data);
  };

  return (
    <>
      {/* UI will come here in Part 2 */}
    </>
  );
}