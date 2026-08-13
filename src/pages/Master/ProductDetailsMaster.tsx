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
  getProducts,
  searchProduct,
  createProduct,
  deleteProduct,
  updateProduct,
} from "@/api/product.api";

import type { Product } from "@/types/product";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Spinner } from "@/components/ui/spinner";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

const columns: any = [
  {
    accessorKey: "code",
    header: "Product Code",
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

export default function ProductDetailsMaster() {
  const { t } = useTranslation();

  const productMasterSchema = z.object({
    productName: z
      .string()
      .min(2, t("productMaster.validation.productNameRequired"))
      .min(2, t("productMaster.validation.productNameMinlength")),
  });

  const productMasterUpdateSchema = z.object({
    productCode: z.number(),
    productName: z
      .string()
      .min(2, t("productMaster.validation.productNameRequired"))
      .min(2, t("productMaster.validation.productNameMinlength")),
  });

  type productMasterFormData = z.infer<typeof productMasterSchema>;
  type productMasterUpdateFormData = z.infer<
    typeof productMasterUpdateSchema
  >;

  const {
    register: registerAdd,
    handleSubmit: handleAddSubmit,
    reset: resetAdd,
    formState: { errors: addErrors },
  } = useForm<productMasterFormData>({
    resolver: zodResolver(productMasterSchema),
    defaultValues: {
      productName: "",
    },
  });

  const {
    register: registerUpdate,
    handleSubmit: handleUpdateSubmit,
    reset: resetUpdate,
    formState: { errors: updateErrors },
  } = useForm<productMasterUpdateFormData>({
    resolver: zodResolver(productMasterUpdateSchema),
    defaultValues: {
      productCode: 0,
      productName: "",
    },
  });

  const infoRef = useRef<HTMLDivElement>(null);
  const [isShow, setIsShow] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(
    null,
  );
  const [showAlert, setShowAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(
    null,
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [deleteStatus, setDeleteStatus] = useState<
    "confirm" | "success" | "error"
  >("confirm");

  const fetchProducts = async () => {
    setLoading(true);

    try {
      const data = await getProducts();
      setProducts(data);
    } finally {
      setLoading(false);
    }
  };

  const searchProducts = async (query: string) => {
    setLoading(true);

    try {
      if (query.trim() === "") {
        // Search box cleared
        const data = await getProducts();
        setProducts(data);
      } else {
        const data = await searchProduct(query);
        setProducts(data);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const onSubmit = async (data: productMasterFormData) => {
    try {
      setSubmitLoading(true);
      setErrorMessage(null);

      let submitObj = { name: data.productName };
      const response = await createProduct(submitObj);

      setShowAlert(true);

      await fetchProducts();

      resetAdd();

      setTimeout(() => {
        setShowAlert(false);
      }, 5000);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setErrorMessage(
          error.response?.data?.message ??
            error.message ??
            "Failed to save product",
        );
      } else {
        setErrorMessage("Failed to save product");
      }
    } finally {
      setSubmitLoading(false);
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
    }
  };

  const onUpdate = async (data: productMasterUpdateFormData) => {
    try {
      setUpdateLoading(true);
      setErrorMessage(null);

      const response = await updateProduct(data.productCode, {
        name: data.productName,
      });

      setShowAlert(true);

      await fetchProducts();

      resetAdd();

      setTimeout(() => {
        setShowAlert(false);
      }, 5000);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setErrorMessage(
          error.response?.data?.message ??
            error.message ??
            "Failed to update product",
        );
      } else {
        setErrorMessage("Failed to update product");
      }
    } finally {
      setUpdateLoading(false);
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
    }
  };

  const handleEdit = (row: Product) => {
    setSelectedProduct(row);
    setIsEditing(true);

    resetUpdate({
      productCode: row.code,
      productName: row.name,
    });
  };

  const handleCancel = () => {
    setIsEditing(false);

    resetAdd();
    resetUpdate();

    setSelectedProduct(null);
    setShowAlert(false);
  };

  const handleDeleteClick = (row: Product) => {
    setProductToDelete(row);
    setDeleteStatus("confirm");
    setDeleteDialogOpen(true);
  };

  const handleDelete = async (data: Product) => {
    try {
      setUpdateLoading(true);
      setErrorMessage(null);

      await deleteProduct(data.code);

      await fetchProducts();

      setDeleteStatus("success");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setErrorMessage(
          error.response?.data?.message ??
            error.message ??
            "Failed to delete product",
        );
      } else {
        setErrorMessage("Failed to delete product");
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
        location.pathname === "/dashboard/productmaster"
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
              <CardTitle>{t("productMaster.edit.title")}</CardTitle>
              <CardDescription>
                {t("productMaster.edit.description")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Field
                data-invalid={updateErrors.productCode ? true : undefined}
              >
                <FieldLabel htmlFor="code">
                  {t("productMaster.edit.productCodeFeild")}
                </FieldLabel>
                <Input
                  id="code"
                  readOnly
                  type="number"
                  required
                  {...registerUpdate("productCode", { valueAsNumber: true })}
                />
              </Field>

              <Field
                data-invalid={updateErrors.productName ? true : undefined}
              >
                <FieldLabel htmlFor="name">
                  {t("productMaster.edit.productNameFeild")}
                </FieldLabel>
                <Input
                  id="name"
                  placeholder={t(
                    "productMaster.edit.productNameFeildPlaceHolder",
                  )}
                  required
                  {...registerUpdate("productName")}
                  aria-invalid={updateErrors.productName ? true : undefined}
                />
                <FieldDescription>
                  {updateErrors.productName?.message}
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
                    {t("productMaster.edit.successAlertTitle")}
                  </AlertTitle>
                  <AlertDescription>
                    {t("productMaster.edit.successAlertDescription")}
                  </AlertDescription>
                </Alert>
              )}

              {errorMessage && (
                <Alert variant={"destructive"} className="max-w-md mt-2 ">
                  <AlertCircleIcon />
                  <AlertTitle>
                    {t("productMaster.edit.failAlertTitle")}
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
              <CardTitle>{t("productMaster.insert.title")}</CardTitle>
              <CardDescription>
                {t("productMaster.insert.description")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Field data-invalid={addErrors.productName ? true : undefined}>
                <FieldLabel htmlFor="name">Product Name</FieldLabel>
                <Input
                  id="name"
                  placeholder={t("productMaster.insert.savePlaceHolher")}
                  required
                  {...registerAdd("productName")}
                  aria-invalid={addErrors.productName ? true : undefined}
                />
                <FieldDescription>
                  {addErrors.productName?.message}
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
                    {t("productMaster.insert.successAlertTitle")}
                  </AlertTitle>
                  <AlertDescription>
                    {t("productMaster.insert.successAlertDescription")}
                  </AlertDescription>
                </Alert>
              )}

              {errorMessage && (
                <Alert variant={"destructive"} className="max-w-md mt-2 ">
                  <AlertCircleIcon />
                  <AlertTitle>
                    {t("productMaster.insert.failAlertTitle")}
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
            data={products}
            columns={columns}
            rowId={(row) => row.code}
            onRowClick={(row) => console.log(row)}
            placeHolder="Search Product"
            onSearch={searchProducts}
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
                  {t("productMaster.common.alertTitle")}
                </AlertDialogTitle>

                <AlertDialogDescription>
                  {t("productMaster.common.deleteConfirm1")}{" "}
                  <strong>{productToDelete?.name}</strong>?
                  {t("productMaster.common.deleteConfirm2")}
                </AlertDialogDescription>
              </AlertDialogHeader>

              <AlertDialogFooter>
                <AlertDialogCancel>{t("common.cancel")}</AlertDialogCancel>

                <AlertDialogAction
                  variant={"destructive"}
                  onClick={() => {
                    if (productToDelete) {
                      handleDelete(productToDelete);
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
                  {t("productMaster.common.successDeleteTitle")}
                </AlertDialogTitle>

                <AlertDialogDescription>
                  {productToDelete?.name}{" "}
                  {t("productMaster.common.hasBeenDeletedSuccessfully")}
                </AlertDialogDescription>
              </AlertDialogHeader>

              <AlertDialogFooter>
                <AlertDialogAction
                  onClick={() => {
                    setDeleteDialogOpen(false);
                    setProductToDelete(null);
                  }}
                >
                  {t("productMaster.common.ok")}
                </AlertDialogAction>
              </AlertDialogFooter>
            </>
          )}

          {deleteStatus === "error" && (
            <>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  {t("productMaster.common.failureDeleteTitle")}
                </AlertDialogTitle>

                <AlertDialogDescription>{errorMessage}</AlertDialogDescription>
              </AlertDialogHeader>

              <AlertDialogFooter>
                <AlertDialogCancel
                  onClick={() => {
                    setDeleteDialogOpen(false);
                    setProductToDelete(null);
                  }}
                >
                  {t("productMaster.common.cancel")}
                </AlertDialogCancel>

                <AlertDialogAction
                  onClick={() => {
                    if (productToDelete) {
                      setDeleteStatus("confirm");
                      setErrorMessage(null);
                    }
                  }}
                >
                  {t("productMaster.common.cancel")}
                </AlertDialogAction>
              </AlertDialogFooter>
            </>
          )}
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
