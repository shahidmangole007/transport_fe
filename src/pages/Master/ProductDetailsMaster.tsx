import { Button } from "@/components/ui/button";
import {
  SaveIcon,
  SavePlusIcon,
  Trash2,
  InfoIcon,
} from "lucide-react";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PaginationButtons } from "@/components/PaginationButtons";
import { useEffect, useRef, useState } from "react";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { FieldGroup } from "@/components/ui/field";
import { TableWithFooter } from "@/components/TableWithFooter";
import { Searchbar } from "@/components/Searchbar";
import { useTranslation } from "react-i18next";


export default function ProductDetailsMaster() {

  const { t } = useTranslation();

  const productDetailsMasterSchema = z.object({
    itemCode: z
      .string()
      .min(1, t("productDetailsMaster.validation.itemCodeRequired")),

    itemName: z
      .string()
      .min(4, t("productDetailsMaster.validation.itemNameMin")),
  });

  type ProductDetailsMasterFormData = z.infer<
    typeof productDetailsMasterSchema
  >;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductDetailsMasterFormData>({
    resolver: zodResolver(productDetailsMasterSchema),
    defaultValues: {
      itemCode: "",
      itemName: "",
    },
  });

  const infoRef = useRef<HTMLDivElement>(null);
  const [isShow, setIsShow] = useState(false);

  const onSubmit = (data: ProductDetailsMasterFormData) => {
    console.log(data);
  };

  const [search, setSearch] = useState("");
  const [products, setProducts] = useState<any[]>([]); 
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(async () => {
      setLoading(true);

      try {  
        const res = {
          data: [
            {
              itemCode: "P001",
              itemName: "ABC Traders",  
            },
          ],
        };

        setProducts(res.data);
        setProducts(res.data);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  return (
    <div className="grid h-full gap-4 md:grid-cols-[40%_59%]">
      <div>
        <Card className="  ">
          <CardHeader>
            <CardTitle>{t("productDetailsMaster.title")}</CardTitle>
            <CardDescription>
              {t("productDetailsMaster.description")}
            </CardDescription>
            <CardAction>
              <Button
                onClick={() => {
                  setIsShow(!isShow);
                }}
                variant="outline"
                size="icon"
              >
                <InfoIcon />
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent>
            <form>
              <FieldGroup>
                <div className="flex flex-col gap-6">
                  <div className="grid gap-2">
                    <Label htmlFor="code">{t("productDetailsMaster.itemCode")}</Label>
                    <Input
                      id="code"
                      type="number"
                      placeholder={t("productDetailsMaster.itemCodePlaceholder")}
                      required
                      {...register("itemCode")}
                    />
                  </div>
                  {errors.itemCode && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.itemCode.message}
                    </p>
                  )}
                  <div className="grid gap-2">
                    <Label htmlFor="name">{t("productDetailsMaster.itemName")}</Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder={t("productDetailsMaster.itemNamePlaceholder")}
                      required
                      {...register("itemName")}
                    />
                  </div>
                  {errors.itemName && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.itemName.message}
                    </p>
                  )}
                  
                </div>
              </FieldGroup>
            </form>
          </CardContent>
          <CardFooter className="flex justify- gap-2">
            <Button
              onClick={handleSubmit(onSubmit)}
              type="submit"
              className="flex-1"
            >
              {t("productDetailsMaster.common.save")}
              <SaveIcon className="ml-2 h-4 w-4" />
            </Button>
            <Button variant="outline" className="flex-1">
              {t("productDetailsMaster.common.update")}
              <SavePlusIcon className="ml-2 h-4 w-4" />
            </Button>

            <Button variant="destructive" className="flex-1">
              {t("productDetailsMaster.common.delete")}
              <Trash2 className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
          {/* <PaginationButtons /> */}
        </Card>
      </div>

      {isShow && (
        <Card ref={infoRef} className="p-0 pt-3   rounded-xl flex-1 ">
          <CardHeader className="">
            <CardTitle>{t("productDetailsMaster.title")}</CardTitle>
            <div className="mt-3 w-full">
              <Searchbar
                value={search}
                onChange={setSearch}
                placeholder={t("productDetailsMaster.common.searchProduct")}
                resultCount={products.length}
              />
            </div>
          </CardHeader>

          <TableWithFooter />
        </Card>
      )}
    </div>
  );
}
