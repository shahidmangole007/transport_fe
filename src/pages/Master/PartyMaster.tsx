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
  getParties,
  searchParty,
  createParty,
  deleteParty,
  updateParty,
} from "@/api/party.api";

import type { Party } from "@/types/party";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Spinner } from "@/components/ui/spinner";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

const columns: any = [
  {
    accessorKey: "code",
    header: "Party Code",
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "address",
    header: "Address",
  },
];


export default function PartyMaster() {
  const { t } = useTranslation();

  const partyMasterSchema = z.object({
    partyName: z
      .string()
      .min(2, t("partyMaster.validation.partyNameRequired"))
      .min(2, t("partyMaster.validation.partyNameMin")),

    partyAddress: z
    .string()
    .min(2, t("partyMaster.validation.partyNameRequired"))
    .min(2, t("partyMaster.validation.partyNameMin")),
  });

  const partyMasterUpdateSchema = z.object({
    partyCode: z.number(),
    partyName: z
      .string()
      .min(2, t("partyMaster.validation.partyNameRequired"))
      .min(2, t("partyMaster.validation.partyNameMin")),

    partyAddress: z
    .string()
    .min(2, t("partyMaster.validation.partyNameRequired"))
    .min(2, t("partyMaster.validation.partyNameMin")),
  });

  type partyMasterFormData = z.infer<typeof partyMasterSchema>;
  type partyMasterUpdateFormData = z.infer<typeof partyMasterUpdateSchema>;

  const {
    register: registerAdd,
    handleSubmit: handleAddSubmit,
    reset: resetAdd,
    formState: { errors: addErrors },
  } = useForm<partyMasterFormData>({
    resolver: zodResolver(partyMasterSchema),
    defaultValues: {
      partyName: "",
      partyAddress:"",
    },
  });

  const {
    register: registerUpdate,
    handleSubmit: handleUpdateSubmit,
    reset: resetUpdate,
    formState: { errors: updateErrors },
  } = useForm<partyMasterUpdateFormData>({
    resolver: zodResolver(partyMasterUpdateSchema),
    defaultValues: {
      partyCode: 0,
      partyName: "",
      partyAddress:"",
    },
  });

  const infoRef = useRef<HTMLDivElement>(null);
  const [isShow, setIsShow] = useState(false);
  const [parties, setParties] = useState<Party[]>([]);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedParty, setSelectedParty] = useState<Party | null>(null);
  const [showAlert, setShowAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [partyToDelete, setPartyToDelete] = useState<Party | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [deleteStatus, setDeleteStatus] = useState<
    "confirm" | "success" | "error"
  >("confirm");

  const fetchParties = async () => {
    setLoading(true);

    try {
      const data = await getParties();
      setParties(data);
    } finally {
      setLoading(false);
    }
  };

  const searchParties = async (query: string) => {
    setLoading(true);
    debugger;
    try {
      if (query.trim() === "") {
        // Search box cleared
        const data = await getParties();
        setParties(data);
      } else {
        debugger;
        const data = await searchParty(query);
        setParties(data);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchParties();
  }, []);

  const onSubmit = async (data: partyMasterFormData) => {
    try {
      setSubmitLoading(true);
      setErrorMessage(null);

      let submitObj = { name: data.partyName };
      const response = await createParty(submitObj);

      setShowAlert(true);

      await fetchParties();

      resetAdd();

      setTimeout(() => {
        setShowAlert(false);
      }, 5000);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setErrorMessage(
          error.response?.data?.message ??
            error.message ??
            "Failed to save party",
        );
      } else {
        setErrorMessage("Failed to save party");
      }
    } finally {
      setSubmitLoading(false);
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
    }
  };

  const onUpdate = async (data: partyMasterUpdateFormData) => {
    try {
      setUpdateLoading(true);
      setErrorMessage(null);
      console.log(data);

      const response = await updateParty(data.partyCode, { name: data.partyName });

      setShowAlert(true);

      await fetchParties();

      resetAdd();

      setTimeout(() => {
        setShowAlert(false);
      }, 5000);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setErrorMessage(
          error.response?.data?.message ??
            error.message ??
            "Failed to update party",
        );
      } else {
        setErrorMessage("Failed to update party");
      }
    } finally {
      setUpdateLoading(false);
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
    }
  };

  const handleEdit = (row: Party) => {
    console.log("Editing:", row);

    setSelectedParty(row);
    setIsEditing(true);

    resetUpdate({
      partyCode: row.code,
      partyName: row.name,
      partyAddress: row.name,
    });
  };

  const handleCancel = () => {
    setIsEditing(false);

    resetAdd();
    resetUpdate();

    setSelectedParty(null);
    setShowAlert(false);
  };

  const handleDeleteClick = (row: Party) => {
    setPartyToDelete(row);
    setDeleteStatus("confirm");
    setDeleteDialogOpen(true);
  };

  const handleDelete = async (data: Party) => {
    try {
      setUpdateLoading(true);
      setErrorMessage(null);

      await deleteParty(data.code);

      await fetchParties();

      setDeleteStatus("success");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setErrorMessage(
          error.response?.data?.message ??
            error.message ??
            "Failed to delete party",
        );
      } else {
        setErrorMessage("Failed to delete party");
      }

      setDeleteStatus("error");
    } finally {
      setUpdateLoading(false);
    }
  };

  const location = useLocation();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "F1" && location.pathname === "/dashboard/partymaster") {
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
              <CardTitle>{t("partyMaster.edit.title")}</CardTitle>
              <CardDescription>
                {t("partyMaster.edit.description")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Field data-invalid={updateErrors.partyCode ? true : undefined}>
                <FieldLabel htmlFor="code">
                  {t("partyMaster.edit.partyCodeFeild")}
                </FieldLabel>
                <Input
                  id="code"
                  readOnly
                  type="number"
                  required
                  {...registerUpdate("partyCode", { valueAsNumber: true })}
                  // aria-invalid={updateErrors.cityName ? true : undefined}
                />
                {/* <FieldDescription>
                  {updateErrors.cityName?.message}
                </FieldDescription> */}
              </Field>

              <Field data-invalid={updateErrors.partyName ? true : undefined}>
                <FieldLabel htmlFor="name">
                  {t("partyMaster.edit.cityNameFeild")}
                </FieldLabel>
                <Input
                  id="name"
                  placeholder={t("partyMaster.edit.cityNameFeildPlaceHolder")}
                  required
                  {...registerUpdate("partyName")}
                  aria-invalid={updateErrors.partyName ? true : undefined}
                />
                <FieldDescription>
                  {updateErrors.partyName?.message}
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
                    {t("partyMaster.edit.successAlertTitle")}
                  </AlertTitle>
                  <AlertDescription>
                    {t("partyMaster.edit.successAlertDescription")}
                  </AlertDescription>
                </Alert>
              )}

              {errorMessage && (
                <Alert variant={"destructive"} className="max-w-md mt-2 ">
                  <AlertCircleIcon />
                  <AlertTitle>{t("partyMaster.edit.failAlertTitle")}</AlertTitle>
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
              <CardTitle>{t("partyMaster.insert.title")}</CardTitle>
              <CardDescription>
                {t("partyMaster.insert.description")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Field data-invalid={addErrors.partyName ? true : undefined}>
                <FieldLabel htmlFor="name">Party Name</FieldLabel>
                <Input
                  id="name"
                  placeholder={t("partyMaster.insert.savePlaceHolher")}
                  required
                  {...registerAdd("partyName")}
                  aria-invalid={addErrors.partyName ? true : undefined}
                />
                <FieldDescription>
                  {addErrors.partyName?.message}
                </FieldDescription>
              </Field>

              <Field data-invalid={addErrors.partyAddress? true : undefined}>
                <FieldLabel htmlFor="name">Address</FieldLabel>
                <Input
                  id="name"
                  placeholder={t("partyMaster.insert.saveAddressHolher")}
                  required
                  {...registerAdd("partyAddress")}
                  aria-invalid={addErrors.partyAddress ? true : undefined}
                />
                <FieldDescription>
                  {addErrors.partyAddress?.message}
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
                    {t("partyMaster.insert.successAlertTitle")}
                  </AlertTitle>
                  <AlertDescription>
                    {t("partyMaster.insert.successAlertDescription")}
                  </AlertDescription>
                </Alert>
              )}

              {errorMessage && (
                <Alert variant={"destructive"} className="max-w-md mt-2 ">
                  <AlertCircleIcon />
                  <AlertTitle>
                    {t("partyMaster.insert.failAlertTitle")}
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
            data={parties}
            columns={columns}
            rowId={(row) => row.code}
            onRowClick={(row) => console.log(row)}
            placeHolder="Search Party"
            onSearch={searchParties}
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
                  {t("partyMaster.common.alertTitle")}
                </AlertDialogTitle>

                <AlertDialogDescription>
                  {t("partyMaster.common.deleteConfirm1")}{" "}
                  <strong>{partyToDelete?.name}</strong>?
                  {t("partyMaster.common.deleteConfirm2")}
                </AlertDialogDescription>
              </AlertDialogHeader>

              <AlertDialogFooter>
                <AlertDialogCancel>{t("common.cancel")}</AlertDialogCancel>

                <AlertDialogAction
                  variant={"destructive"}
                  onClick={() => {
                    if (partyToDelete) {
                      handleDelete(partyToDelete);
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
                  {t("partyMaster.common.successDeleteTitle")}
                </AlertDialogTitle>

                <AlertDialogDescription>
                  {partyToDelete?.name}{" "}
                  {t("partyMaster.common.hasBeenDeletedSuccessfully")}
                </AlertDialogDescription>
              </AlertDialogHeader>

              <AlertDialogFooter>
                <AlertDialogAction
                  onClick={() => {
                    setDeleteDialogOpen(false);
                    setPartyToDelete(null);
                  }}
                >
                  {t("partyMaster.common.ok")}
                </AlertDialogAction>
              </AlertDialogFooter>
            </>
          )}

          {deleteStatus === "error" && (
            <>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  {t("partyMaster.common.failureDeleteTitle")}
                </AlertDialogTitle>

                <AlertDialogDescription>{errorMessage}</AlertDialogDescription>
              </AlertDialogHeader>

              <AlertDialogFooter>
                <AlertDialogCancel
                  onClick={() => {
                    setDeleteDialogOpen(false);
                    setPartyToDelete(null);
                  }}
                >
                  {t("partyMaster.common.cancel")}
                </AlertDialogCancel>

                <AlertDialogAction
                  onClick={() => {
                    if (partyToDelete) {
                      setDeleteStatus("confirm");
                      setErrorMessage(null);
                    }
                  }}
                >
                  {t("partyMaster.common.cancel")}
                </AlertDialogAction>
              </AlertDialogFooter>
            </>
          )}
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
