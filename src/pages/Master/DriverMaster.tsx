import { Button } from "@/components/ui/button";
import {
  SaveIcon,
  SavePlusIcon,
  File,
  Printer,
  Trash2,
  InfoIcon,
  CheckCircle2Icon,
  AlertCircleIcon,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useEffect, useRef, useState } from "react";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { DataTable } from "@/components/data-table";
import {
  getDrivers,
  searchDriver,
  createDriver,
  deleteDriver,
  updateDriver,
} from "@/api/driver.api";

import type { Driver } from "@/types/driver";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Spinner } from "@/components/ui/spinner";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

const columns: any = [
  {
    accessorKey: "code",
    header: "Driver Code",
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "stdCode",
    header: "STD Code",
  },
  {
    accessorKey: "year",
    header: "Year",
  },
];

export default function DriverMaster() {
  const { t } = useTranslation();

  const driverMasterSchema = z.object({
    driverName: z
      .string()
      .min(2, t("driverMaster.validation.driverNameRequired"))
      .min(2, t("driverMaster.validation.driverNameMinlength")),
  });

  const driverMasterUpdateSchema = z.object({
    driverCode: z.number(),
    driverName: z
      .string()
      .min(2, t("driverMaster.validation.driverNameRequired"))
      .min(2, t("driverMaster.validation.driverNameMinlength")),
  });

  type driverMasterFormData = z.infer<typeof driverMasterSchema>;
  type driverMasterUpdateFormData = z.infer<typeof driverMasterUpdateSchema>;

  const {
    register: registerAdd,
    handleSubmit: handleAddSubmit,
    reset: resetAdd,
    formState: { errors: addErrors },
  } = useForm<driverMasterFormData>({
    resolver: zodResolver(driverMasterSchema),
    defaultValues: {
      driverName: "",
    },
  });

  const {
    register: registerUpdate,
    handleSubmit: handleUpdateSubmit,
    reset: resetUpdate,
    formState: { errors: updateErrors },
  } = useForm<driverMasterUpdateFormData>({
    resolver: zodResolver(driverMasterUpdateSchema),
    defaultValues: {
      driverCode: 0,
      driverName: "",
    },
  });

  const infoRef = useRef<HTMLDivElement>(null);
  const [isShow, setIsShow] = useState(false);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [showAlert, setShowAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [driverToDelete, setDriverToDelete] = useState<Driver | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [deleteStatus, setDeleteStatus] = useState<
    "confirm" | "success" | "error"
  >("confirm");

  const fetchDrivers = async () => {
    setLoading(true);

    try {
      const data = await getDrivers();
      setDrivers(data);
    } finally {
      setLoading(false);
    }
  };

  const searchDrivers = async (query: string) => {
    setLoading(true);

    try {
      if (query.trim() === "") {
        // Search box cleared
        const data = await getDrivers();
        setDrivers(data);
      } else {
        const data = await searchDriver(query);
        setDrivers(data);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDrivers();
  }, []);

  const onSubmit = async (data: driverMasterFormData) => {
    try {
      setSubmitLoading(true);
      setErrorMessage(null);

      let submitObj = { name: data.driverName };
      const response = await createDriver(submitObj);

      setShowAlert(true);

      await fetchDrivers();

      resetAdd();

      setTimeout(() => {
        setShowAlert(false);
      }, 5000);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setErrorMessage(
          error.response?.data?.message ??
            error.message ??
            "Failed to save driver",
        );
      } else {
        setErrorMessage("Failed to save driver");
      }
    } finally {
      setSubmitLoading(false);
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
    }
  };

  const onUpdate = async (data: driverMasterUpdateFormData) => {
    try {
      setUpdateLoading(true);
      setErrorMessage(null);

      const response = await updateDriver(data.driverCode, {
        name: data.driverName,
      });

      setShowAlert(true);

      await fetchDrivers();

      resetAdd();

      setTimeout(() => {
        setShowAlert(false);
      }, 5000);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setErrorMessage(
          error.response?.data?.message ??
            error.message ??
            "Failed to update driver",
        );
      } else {
        setErrorMessage("Failed to update driver");
      }
    } finally {
      setUpdateLoading(false);
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
    }
  };

  const handleEdit = (row: Driver) => {
    setSelectedDriver(row);
    setIsEditing(true);

    resetUpdate({
      driverCode: row.code,
      driverName: row.name,
    });
  };

  const handleCancel = () => {
    setIsEditing(false);

    resetAdd();
    resetUpdate();

    setSelectedDriver(null);
    setShowAlert(false);
  };

  const handleDeleteClick = (row: Driver) => {
    setDriverToDelete(row);
    setDeleteStatus("confirm");
    setDeleteDialogOpen(true);
  };

  const handleDelete = async (data: Driver) => {
    try {
      setUpdateLoading(true);
      setErrorMessage(null);

      await deleteDriver(data.code);

      await fetchDrivers();

      setDeleteStatus("success");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setErrorMessage(
          error.response?.data?.message ??
            error.message ??
            "Failed to delete driver",
        );
      } else {
        setErrorMessage("Failed to delete driver");
      }

      setDeleteStatus("error");
    } finally {
      setUpdateLoading(false);
    }
  };

  const location = useLocation();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.key === "F1" &&
        location.pathname === "/dashboard/drivermaster"
      ) {
        event.preventDefault();

        setIsShow((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [location.pathname]);

  return (
    <div className="grid h-full gap-8  md:grid-cols-[max-content_1fr] ">
      {isEditing ? (
        <form onSubmit={handleUpdateSubmit(onUpdate)}>
          <Card className="max-w-full min-w-md  max-h-fit">
            <CardHeader>
              <CardTitle>{t("driverMaster.edit.title")}</CardTitle>
              <CardDescription>
                {t("driverMaster.edit.description")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Field data-invalid={updateErrors.driverCode ? true : undefined}>
                <FieldLabel htmlFor="code">
                  {t("driverMaster.edit.driverCodeFeild")}
                </FieldLabel>
                <Input
                  id="code"
                  readOnly
                  type="number"
                  required
                  {...registerUpdate("driverCode", { valueAsNumber: true })}
                />
              </Field>

              <Field data-invalid={updateErrors.driverName ? true : undefined}>
                <FieldLabel htmlFor="name">
                  {t("driverMaster.edit.driverNameFeild")}
                </FieldLabel>
                <Input
                  id="name"
                  placeholder={t(
                    "driverMaster.edit.driverNameFeildPlaceHolder",
                  )}
                  required
                  {...registerUpdate("driverName")}
                  aria-invalid={updateErrors.driverName ? true : undefined}
                />
                <FieldDescription>
                  {updateErrors.driverName?.message}
                </FieldDescription>
              </Field>

              <div className="flex gap-4 mt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  className="flex-1"
                >
                  {t("common.cancel")}
                </Button>

                <Button type="submit" className="flex-1">
                  {updateLoading && <Spinner data-icon="inline-start" />}
                  {t("common.update")}
                </Button>
              </div>

              {showAlert && (
                <Alert className="max-w-md mt-2 text-green-500">
                  <CheckCircle2Icon />
                  <AlertTitle>
                    {t("driverMaster.edit.successAlertTitle")}
                  </AlertTitle>
                  <AlertDescription>
                    {t("driverMaster.edit.successAlertDescription")}
                  </AlertDescription>
                </Alert>
              )}

              {errorMessage && (
                <Alert variant={"destructive"} className="max-w-md mt-2 ">
                  <AlertCircleIcon />
                  <AlertTitle>
                    {t("driverMaster.edit.failAlertTitle")}
                  </AlertTitle>
                  <AlertDescription>{errorMessage}</AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </form>
      ) : (
        <form onSubmit={handleAddSubmit(onSubmit)}>
          <Card className="max-w-sm min-w-sm w-full max-h-fit">
            <CardHeader>
              <CardTitle>{t("driverMaster.insert.title")}</CardTitle>
              <CardDescription>
                {t("driverMaster.insert.description")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Field data-invalid={addErrors.driverName ? true : undefined}>
                <FieldLabel htmlFor="name">Driver Name</FieldLabel>
                <Input
                  id="name"
                  placeholder={t("driverMaster.insert.savePlaceHolher")}
                  required
                  {...registerAdd("driverName")}
                  aria-invalid={addErrors.driverName ? true : undefined}
                />
                <FieldDescription>
                  {addErrors.driverName?.message}
                </FieldDescription>
              </Field>

              <Button type="submit" className="w-full mt-4">
                {submitLoading && <Spinner data-icon="inline-start" />}
                {t("common.submit")}
              </Button>

              {showAlert && (
                <Alert className="max-w-md mt-2 text-green-500">
                  <CheckCircle2Icon />
                  <AlertTitle>
                    {t("driverMaster.insert.successAlertTitle")}
                  </AlertTitle>
                  <AlertDescription>
                    {t("driverMaster.insert.successAlertDescription")}
                  </AlertDescription>
                </Alert>
              )}

              {errorMessage && (
                <Alert variant={"destructive"} className="max-w-md mt-2 ">
                  <AlertCircleIcon />
                  <AlertTitle>
                    {t("driverMaster.insert.failAlertTitle")}
                  </AlertTitle>
                  <AlertDescription>{errorMessage}</AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </form>
      )}

      {isShow && (
        <Card className="overflow-hidden min-w-0">
          <DataTable
            data={drivers}
            columns={columns}
            rowId={(row) => row.code}
            onRowClick={(row) => console.log(row)}
            placeHolder="Search Driver"
            onSearch={searchDrivers}
            renderActions={(row) => (
              <>
                <DropdownMenuItem onClick={() => handleEdit(row)}>
                  {t("common.edit")}
                </DropdownMenuItem>

                <DropdownMenuItem
                  variant="destructive"
                  onClick={() => handleDeleteClick(row)}
                >
                  {t("common.delete")}
                </DropdownMenuItem>
              </>
            )}
          />
        </Card>
      )}

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          {deleteStatus === "confirm" && (
            <>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  {t("driverMaster.common.alertTitle")}
                </AlertDialogTitle>

                <AlertDialogDescription>
                  {t("driverMaster.common.deleteConfirm1")}{" "}
                  <strong>{driverToDelete?.name}</strong>?
                  {t("driverMaster.common.deleteConfirm2")}
                </AlertDialogDescription>
              </AlertDialogHeader>

              <AlertDialogFooter>
                <AlertDialogCancel>{t("common.cancel")}</AlertDialogCancel>

                <AlertDialogAction
                  variant={"destructive"}
                  onClick={() => {
                    if (driverToDelete) {
                      handleDelete(driverToDelete);
                    }
                  }}
                >
                  {t("common.delete")}
                </AlertDialogAction>
              </AlertDialogFooter>
            </>
          )}

          {deleteStatus === "success" && (
            <>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  {t("driverMaster.common.successDeleteTitle")}
                </AlertDialogTitle>

                <AlertDialogDescription>
                  {driverToDelete?.name}{" "}
                  {t("driverMaster.common.hasBeenDeletedSuccessfully")}
                </AlertDialogDescription>
              </AlertDialogHeader>

              <AlertDialogFooter>
                <AlertDialogAction
                  onClick={() => {
                    setDeleteDialogOpen(false);
                    setDriverToDelete(null);
                  }}
                >
                  {t("driverMaster.common.ok")}
                </AlertDialogAction>
              </AlertDialogFooter>
            </>
          )}

          {deleteStatus === "error" && (
            <>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  {t("driverMaster.common.failureDeleteTitle")}
                </AlertDialogTitle>

                <AlertDialogDescription>{errorMessage}</AlertDialogDescription>
              </AlertDialogHeader>

              <AlertDialogFooter>
                <AlertDialogCancel
                  onClick={() => {
                    setDeleteDialogOpen(false);
                    setDriverToDelete(null);
                  }}
                >
                  {t("driverMaster.common.cancel")}
                </AlertDialogCancel>

                <AlertDialogAction
                  onClick={() => {
                    if (driverToDelete) {
                      setDeleteStatus("confirm");
                      setErrorMessage(null);
                    }
                  }}
                >
                  {t("driverMaster.common.cancel")}
                </AlertDialogAction>
              </AlertDialogFooter>
            </>
          )}
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
