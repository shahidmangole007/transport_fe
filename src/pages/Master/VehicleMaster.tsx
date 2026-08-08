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
// import data from "../../data/data.json";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useEffect, useRef, useState } from "react";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { DataTable } from "@/components/data-table";

import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Spinner } from "@/components/ui/spinner";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import type { Vehicle } from "@/types/vehicle";
import { createVehicle, deleteVehicle, getVehicles, searchVehicle, updateVehicle } from "@/api/vehicle.api";

const columns: any = [
  {
    accessorKey: "code",
    header: "Vehicle Code",
  },
  {
    accessorKey: "name",
    header: "Vehicle Number",
  },
  {
    accessorKey: "ownerName",
    header: "Owner Name",
  },
  {
    accessorKey: "year",
    header: "Year",
  },
];



export default function VehicleMaster() {

  const { t } = useTranslation();
  
type vehicleMasterFormData = z.infer<typeof vehicleMasterSchema>;
type vehicleMasterUpdateFormData = z.infer<typeof vehicleMasterUpdateSchema>;


  const vehicleMasterSchema = z.object({
  vehicleName: z
    .string()
    .min(2, t("vehicleMaster.validation.vehicleNameRequired"))
    .min(4, t("vehicleMaster.validation.vehicleNameMinlength")),
  vehicleOwnerName: z
    .string()
    .min(2, t("vehicleMaster.validation.vehicleOwnerNameRequired"))
    .min(4, t("vehicleMaster.validation.vehicleOwnerNameMinlength")),
});

const vehicleMasterUpdateSchema = z.object({
  vehicleCode: z
    .number(),
  vehicleName: z
    .string()
    .min(2, t("vehicleMaster.validation.vehicleNameRequired"))
    .min(4, t("vehicleMaster.validation.vehicleNameMinlength")),
  vehicleOwnerName: z
    .string()
    .min(2, t("vehicleMaster.validation.vehicleOwnerNameRequired"))
    .min(4, t("vehicleMaster.validation.vehicleOwnerNameMinlength")),
});

  

  const {
    register: registerAdd,
    handleSubmit: handleAddSubmit,
    reset: resetAdd,
    formState: { errors: addErrors },
  } = useForm<vehicleMasterFormData>({
    resolver: zodResolver(vehicleMasterSchema),
    defaultValues: {
      vehicleName: "",
      vehicleOwnerName: "",
    },
  });

  const {
    register: registerUpdate,
    handleSubmit: handleUpdateSubmit,
    reset: resetUpdate,
    formState: { errors: updateErrors },
  } = useForm<vehicleMasterUpdateFormData>({
    resolver: zodResolver(vehicleMasterUpdateSchema),
    defaultValues: {
      vehicleCode : 0,
      vehicleName: "",
      vehicleOwnerName: "",
    },
  });

  const infoRef = useRef<HTMLIFrameElement>(null);
  const [isShow, setIsShow] = useState(false);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [showAlert, setShowAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [vehicleToDelete, setVehicleToDelete] = useState<Vehicle | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [deleteStatus, setDeleteStatus] = useState<
    "confirm" | "success" | "error"
  >("confirm");

  const fetchVehicles = async () => {
    setLoading(true);

    try {
      const data = await getVehicles();
      setVehicles(data);
    } finally {
      setLoading(false);
    }
  };

  const searchVehicles = async (query: string) => {
    setLoading(true);
    debugger;
    try {
      if (query.trim() === "") {
        const data = await getVehicles();
        setVehicles(data);
      } else {
        debugger;
        const data = await searchVehicle(query);
        setVehicles(data);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const onSubmit = async (data: vehicleMasterFormData) => {
    try {
      setSubmitLoading(true);
      setErrorMessage(null);

      let submitObj = { name: data.vehicleName , ownerName : data.vehicleOwnerName  };
      const response = await createVehicle(submitObj);

      setShowAlert(true);

      await fetchVehicles();

      resetAdd();

      setTimeout(() => {
        setShowAlert(false);
      }, 3000);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setErrorMessage(
          error.response?.data?.message ??
            error.message ??
            "Failed to save vehicle",
        );
      } else {
        setErrorMessage("Failed to save vehicle");
      }
    } finally {
      setSubmitLoading(false);
      setTimeout(() => {
        setErrorMessage(null);
      }, 3000);
    }
  };

  const onUpdate = async (data: vehicleMasterUpdateFormData) => {
    try {
      setUpdateLoading(true);
      setErrorMessage(null);

      const updateObj = { name : data.vehicleName , ownerName : data.vehicleOwnerName }
      const response = await updateVehicle(data.vehicleCode, updateObj);

      setShowAlert(true);

      await fetchVehicles();

      resetAdd();

      setTimeout(() => {
        setShowAlert(false);
      }, 3000);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setErrorMessage(
          error.response?.data?.message ??
            error.message ??
            "Failed to update vehicle",
        );
      } else {
        setErrorMessage("Failed to update vehicle");
      }
    } finally {
      setUpdateLoading(false);
      setTimeout(() => {
        setErrorMessage(null);
      }, 3000);
    }
  };

  const handleEdit = (row: Vehicle) => {
    console.log("Editing:", row);

    setSelectedVehicle(row);
    setIsEditing(true);

    resetUpdate({
      vehicleCode: row.code,
      vehicleName: row.name,
      vehicleOwnerName : row.ownerName
    });
  };

  const handleCancel = () => {
    setIsEditing(false);

    resetAdd();
    resetUpdate();

    setSelectedVehicle(null);
    setShowAlert(false);
  };

  const handleDeleteClick = (row: Vehicle) => {
    setVehicleToDelete(row);
    setDeleteStatus("confirm");
    setDeleteDialogOpen(true);
  };

  const handleDelete = async (data: Vehicle) => {
    try {
      setUpdateLoading(true);
      setErrorMessage(null);

      await deleteVehicle(data.code);

      await fetchVehicles();

      setDeleteStatus("success");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setErrorMessage(
          error.response?.data?.message ??
            error.message ??
            "Failed to delete vehicle",
        );
      } else {
        setErrorMessage("Failed to delete vehicle");
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
        location.pathname === "/dashboard/vehiclemaster"
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
              <CardTitle>{t("vehicleMaster.edit.title")}</CardTitle>
              <CardDescription>
                {t("vehicleMaster.edit.description")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Field data-invalid={updateErrors.vehicleCode ? true : undefined}>
                <FieldLabel htmlFor="code">
                  {t("vehicleMaster.edit.vehicleCodeFeild")}
                </FieldLabel>
                <Input
                  id="code"
                  readOnly
                  type="number"
                  required
                  {...registerUpdate("vehicleCode", { valueAsNumber: true })}
                
                />
               
              </Field>

              <Field data-invalid={updateErrors.vehicleName ? true : undefined}>
                <FieldLabel htmlFor="name">
                  {t("vehicleMaster.edit.vehicleNumberFeild")}
                </FieldLabel>
                <Input
                  id="name"
                  placeholder={t("vehicleMaster.edit.vehicleNumberPlaceHolder")}
                  required
                  {...registerUpdate("vehicleName")}
                  aria-invalid={updateErrors.vehicleName ? true : undefined}
                />
                <FieldDescription>
                  {updateErrors.vehicleName?.message}
                </FieldDescription>
              </Field>

              <Field data-invalid={updateErrors.vehicleOwnerName ? true : undefined}>
                <FieldLabel htmlFor="ownername">
                  {t("vehicleMaster.edit.vehicleOwnerFeild")}
                </FieldLabel>
                <Input
                  id="ownername"
                  placeholder={t("vehicleMaster.edit.vehicleOwnerPlaceHolder")}
                  required
                  {...registerUpdate("vehicleOwnerName")}
                  aria-invalid={updateErrors.vehicleOwnerName ? true : undefined}
                />
                <FieldDescription>
                  {updateErrors.vehicleOwnerName?.message}
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
                    {t("vehicleMaster.edit.successAlertTitle")}
                  </AlertTitle>
                  <AlertDescription>
                    {t("vehicleMaster.edit.successAlertDescription")}
                  </AlertDescription>
                </Alert>
              )}

              {errorMessage && (
                <Alert variant={"destructive"} className="max-w-md mt-2 ">
                  <AlertCircleIcon />
                  <AlertTitle>{t("vehicleMaster.edit.failAlertTitle")}</AlertTitle>
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
              <CardTitle>{t("vehicleMaster.insert.title")}</CardTitle>
              <CardDescription>
                {t("vehicleMaster.insert.description")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Field data-invalid={addErrors.vehicleName ? true : undefined}>
                <FieldLabel htmlFor="name">{t("vehicleMaster.insert.vehicleNumberFeild")}</FieldLabel>
                <Input
                  id="name"
                  placeholder={t("vehicleMaster.insert.vehicleNumberPlaceHolder")}
                  required
                  {...registerAdd("vehicleName")}
                  aria-invalid={addErrors.vehicleName ? true : undefined}
                />
                <FieldDescription>
                  {addErrors.vehicleName?.message}
                </FieldDescription>
              </Field>

              <Field data-invalid={addErrors.vehicleOwnerName ? true : undefined}>
                <FieldLabel htmlFor="name">{t("vehicleMaster.insert.vehicleOwnerFeild")}</FieldLabel>
                <Input
                  id="name"
                  placeholder={t("vehicleMaster.insert.vehicleOwnerPlaceHolder")}
                  required
                  {...registerAdd("vehicleOwnerName")}
                  aria-invalid={addErrors.vehicleOwnerName ? true : undefined}
                />
                <FieldDescription>
                  {addErrors.vehicleOwnerName?.message}
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
                    {t("vehicleMaster.insert.successAlertTitle")}
                  </AlertTitle>
                  <AlertDescription>
                    {t("vehicleMaster.insert.successAlertDescription")}
                  </AlertDescription>
                </Alert>
              )}

              {errorMessage && (
                <Alert variant={"destructive"} className="max-w-md mt-2 ">
                  <AlertCircleIcon />
                  <AlertTitle>
                    {t("vehicleMaster.insert.failAlertTitle")}
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
            data={vehicles}
            columns={columns}
            rowId={(row) => row.code}
            onRowClick={(row) => console.log(row)}
            placeHolder={t("vehicleMaster.common.search")}
            onSearch={searchVehicles}
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
                <AlertDialogTitle>{t("vehicleMaster.common.alertTitle")}</AlertDialogTitle>

                <AlertDialogDescription>
                  {t("vehicleMaster.common.deleteConfirm1")}{" "}
                  <strong>{vehicleToDelete?.name} </strong> 
                {t("vehicleMaster.common.deleteConfirm2")}
                </AlertDialogDescription>
              </AlertDialogHeader>

              <AlertDialogFooter>
                <AlertDialogCancel>{t("common.cancel")}</AlertDialogCancel>

                <AlertDialogAction
                variant={"destructive"}
                  onClick={() => {
                    if (vehicleToDelete) {
                      handleDelete(vehicleToDelete);
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
                <AlertDialogTitle>{t("vehicleMaster.common.successDeleteTitle")}</AlertDialogTitle>

                <AlertDialogDescription>
                  {vehicleToDelete?.name} {t("vehicleMaster.common.hasBeenDeletedSuccessfully")}
                </AlertDialogDescription>
              </AlertDialogHeader>

              <AlertDialogFooter>
                <AlertDialogAction
                  onClick={() => {
                    setDeleteDialogOpen(false);
                    setVehicleToDelete(null);
                  }}
                >
                  {t("vehicleMaster.common.ok")}
                </AlertDialogAction>
              </AlertDialogFooter>
            </>
          )}

          {deleteStatus === "error" && (
            <>
              <AlertDialogHeader>
                <AlertDialogTitle>{t("vehicleMaster.common.failureDeleteTitle")}</AlertDialogTitle>

                <AlertDialogDescription>{errorMessage}</AlertDialogDescription>
              </AlertDialogHeader>

              <AlertDialogFooter>
                <AlertDialogCancel
                  onClick={() => {
                    setDeleteDialogOpen(false);
                    setVehicleToDelete(null);
                  }}
                >
                  {t("vehicleMaster.common.cancel")}
                </AlertDialogCancel>

                <AlertDialogAction
                  onClick={() => {
                    if (vehicleToDelete) {
                      setDeleteStatus("confirm");
                      setErrorMessage(null);
                    }
                  }}
                >
                  {t("vehicleMaster.common.tryAgain")}
                </AlertDialogAction>
              </AlertDialogFooter>
            </>
          )}
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
