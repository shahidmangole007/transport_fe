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
import {
  getCities,
  searchCity,
  createCity,
  deleteCity,
  updateCity,
} from "@/api/city.api";

import type { City } from "@/types/city";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Spinner } from "@/components/ui/spinner";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

const columns: any = [
  {
    accessorKey: "code",
    header: "City Code",
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "year",
    header: "Year",
  },
];


export default function CityMaster() {
  const { t } = useTranslation();

  const cityMasterSchema = z.object({
    cityName: z
      .string()
      .min(2, t("cityMaster.validation.cityNameRequired"))
      .min(2, t("cityMaster.validation.cityNameMinlength")),
  });

  const cityMasterUpdateSchema = z.object({
    cityCode: z.number(),
    cityName: z
      .string()
      .min(2, t("cityMaster.validation.cityNameRequired"))
      .min(2, t("cityMaster.validation.cityNameMinlength")),
  });

  type cityMasterFormData = z.infer<typeof cityMasterSchema>;
  type cityMasterUpdateFormData = z.infer<typeof cityMasterUpdateSchema>;

  const {
    register: registerAdd,
    handleSubmit: handleAddSubmit,
    reset: resetAdd,
    formState: { errors: addErrors },
  } = useForm<cityMasterFormData>({
    resolver: zodResolver(cityMasterSchema),
    defaultValues: {
      cityName: "",
    },
  });

  const {
    register: registerUpdate,
    handleSubmit: handleUpdateSubmit,
    reset: resetUpdate,
    formState: { errors: updateErrors },
  } = useForm<cityMasterUpdateFormData>({
    resolver: zodResolver(cityMasterUpdateSchema),
    defaultValues: {
      cityCode: 0,
      cityName: "",
    },
  });

  const infoRef = useRef<HTMLIFrameElement>(null);
  const [isShow, setIsShow] = useState(false);
  const [cities, setCities] = useState<City[]>([]);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [showAlert, setShowAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [cityToDelete, setCityToDelete] = useState<City | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [deleteStatus, setDeleteStatus] = useState<
    "confirm" | "success" | "error"
  >("confirm");

  const fetchCities = async () => {
    setLoading(true);

    try {
      const data = await getCities();
      setCities(data);
    } finally {
      setLoading(false);
    }
  };

  const searchCities = async (query: string) => {
    setLoading(true);
    debugger;
    try {
      if (query.trim() === "") {
        // Search box cleared
        const data = await getCities();
        setCities(data);
      } else {
        debugger;
        const data = await searchCity(query);
        setCities(data);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCities();
  }, []);

  const onSubmit = async (data: cityMasterFormData) => {
    try {
      setSubmitLoading(true);
      setErrorMessage(null);

      let submitObj = { name: data.cityName };
      const response = await createCity(submitObj);

      setShowAlert(true);

      await fetchCities();

      resetAdd();

      setTimeout(() => {
        setShowAlert(false);
      }, 5000);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setErrorMessage(
          error.response?.data?.message ??
            error.message ??
            "Failed to save city",
        );
      } else {
        setErrorMessage("Failed to save city");
      }
    } finally {
      setSubmitLoading(false);
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
    }
  };

  const onUpdate = async (data: cityMasterUpdateFormData) => {
    try {
      setUpdateLoading(true);
      setErrorMessage(null);
      console.log(data);

      const response = await updateCity(data.cityCode, { name: data.cityName });

      setShowAlert(true);

      await fetchCities();

      resetAdd();

      setTimeout(() => {
        setShowAlert(false);
      }, 5000);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setErrorMessage(
          error.response?.data?.message ??
            error.message ??
            "Failed to update city",
        );
      } else {
        setErrorMessage("Failed to update city");
      }
    } finally {
      setUpdateLoading(false);
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
    }
  };

  const handleEdit = (row: City) => {
    console.log("Editing:", row);

    setSelectedCity(row);
    setIsEditing(true);

    resetUpdate({
      cityCode: row.code,
      cityName: row.name,
    });
  };

  const handleCancel = () => {
    setIsEditing(false);

    resetAdd();
    resetUpdate();

    setSelectedCity(null);
    setShowAlert(false);
  };

  const handleDeleteClick = (row: City) => {
    setCityToDelete(row);
    setDeleteStatus("confirm");
    setDeleteDialogOpen(true);
  };

  const handleDelete = async (data: City) => {
    try {
      setUpdateLoading(true);
      setErrorMessage(null);

      await deleteCity(data.code);

      await fetchCities();

      setDeleteStatus("success");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setErrorMessage(
          error.response?.data?.message ??
            error.message ??
            "Failed to delete city",
        );
      } else {
        setErrorMessage("Failed to delete city");
      }

      setDeleteStatus("error");
    } finally {
      setUpdateLoading(false);
    }
  };

  const location = useLocation();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "F1" && location.pathname === "/dashboard/citymaster") {
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
              <CardTitle>{t("cityMaster.edit.title")}</CardTitle>
              <CardDescription>
                {t("cityMaster.edit.description")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Field data-invalid={updateErrors.cityCode ? true : undefined}>
                <FieldLabel htmlFor="code">
                  {t("cityMaster.edit.cityCodeFeild")}
                </FieldLabel>
                <Input
                  id="code"
                  readOnly
                  type="number"
                  required
                  {...registerUpdate("cityCode", { valueAsNumber: true })}
                  // aria-invalid={updateErrors.cityName ? true : undefined}
                />
                {/* <FieldDescription>
                  {updateErrors.cityName?.message}
                </FieldDescription> */}
              </Field>

              <Field data-invalid={updateErrors.cityName ? true : undefined}>
                <FieldLabel htmlFor="name">
                  {t("cityMaster.edit.cityNameFeild")}
                </FieldLabel>
                <Input
                  id="name"
                  placeholder={t("cityMaster.edit.cityNameFeildPlaceHolder")}
                  required
                  {...registerUpdate("cityName")}
                  aria-invalid={updateErrors.cityName ? true : undefined}
                />
                <FieldDescription>
                  {updateErrors.cityName?.message}
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
                    {t("cityMaster.edit.successAlertTitle")}
                  </AlertTitle>
                  <AlertDescription>
                    {t("cityMaster.edit.successAlertDescription")}
                  </AlertDescription>
                </Alert>
              )}

              {errorMessage && (
                <Alert variant={"destructive"} className="max-w-md mt-2 ">
                  <AlertCircleIcon />
                  <AlertTitle>{t("cityMaster.edit.failAlertTitle")}</AlertTitle>
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
              <CardTitle>{t("cityMaster.insert.title")}</CardTitle>
              <CardDescription>
                {t("cityMaster.insert.description")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Field data-invalid={addErrors.cityName ? true : undefined}>
                <FieldLabel htmlFor="name">City Name</FieldLabel>
                <Input
                  id="name"
                  placeholder={t("cityMaster.insert.savePlaceHolher")}
                  required
                  {...registerAdd("cityName")}
                  aria-invalid={addErrors.cityName ? true : undefined}
                />
                <FieldDescription>
                  {addErrors.cityName?.message}
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
                    {t("cityMaster.insert.successAlertTitle")}
                  </AlertTitle>
                  <AlertDescription>
                    {t("cityMaster.insert.successAlertDescription")}
                  </AlertDescription>
                </Alert>
              )}

              {errorMessage && (
                <Alert variant={"destructive"} className="max-w-md mt-2 ">
                  <AlertCircleIcon />
                  <AlertTitle>
                    {t("cityMaster.insert.failAlertTitle")}
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
            data={cities}
            columns={columns}
            rowId={(row) => row.code}
            onRowClick={(row) => console.log(row)}
            placeHolder="Search City"
            onSearch={searchCities}
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
                  {t("cityMaster.common.alertTitle")}
                </AlertDialogTitle>

                <AlertDialogDescription>
                  {t("cityMaster.common.deleteConfirm1")}{" "}
                  <strong>{cityToDelete?.name}</strong>?
                  {t("cityMaster.common.deleteConfirm2")}
                </AlertDialogDescription>
              </AlertDialogHeader>

              <AlertDialogFooter>
                <AlertDialogCancel>{t("common.cancel")}</AlertDialogCancel>

                <AlertDialogAction
                  variant={"destructive"}
                  onClick={() => {
                    if (cityToDelete) {
                      handleDelete(cityToDelete);
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
                  {t("cityMaster.common.successDeleteTitle")}
                </AlertDialogTitle>

                <AlertDialogDescription>
                  {cityToDelete?.name}{" "}
                  {t("cityMaster.common.hasBeenDeletedSuccessfully")}
                </AlertDialogDescription>
              </AlertDialogHeader>

              <AlertDialogFooter>
                <AlertDialogAction
                  onClick={() => {
                    setDeleteDialogOpen(false);
                    setCityToDelete(null);
                  }}
                >
                  {t("cityMaster.common.ok")}
                </AlertDialogAction>
              </AlertDialogFooter>
            </>
          )}

          {deleteStatus === "error" && (
            <>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  {t("cityMaster.common.failureDeleteTitle")}
                </AlertDialogTitle>

                <AlertDialogDescription>{errorMessage}</AlertDialogDescription>
              </AlertDialogHeader>

              <AlertDialogFooter>
                <AlertDialogCancel
                  onClick={() => {
                    setDeleteDialogOpen(false);
                    setCityToDelete(null);
                  }}
                >
                  {t("cityMaster.common.cancel")}
                </AlertDialogCancel>

                <AlertDialogAction
                  onClick={() => {
                    if (cityToDelete) {
                      setDeleteStatus("confirm");
                      setErrorMessage(null);
                    }
                  }}
                >
                  {t("cityMaster.common.cancel")}
                </AlertDialogAction>
              </AlertDialogFooter>
            </>
          )}
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
