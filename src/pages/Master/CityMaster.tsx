import { Button } from "@/components/ui/button";
import {
  SaveIcon,
  SavePlusIcon,
  File,
  Printer,
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


export default function CityMaster() {
  const { t } = useTranslation();
  
  const cityMasterSchema = z.object({
    cityCode: z
      .string()
      .min(1, t("cityMaster.validation.cityCodeRequired")),

    cityName: z
      .string()
      .min(4, t("cityMaster.validation.cityNameMin")),
  });

  type CityMasterFormData = z.infer<typeof cityMasterSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CityMasterFormData>({
    resolver: zodResolver(cityMasterSchema),
    defaultValues: {
      cityCode: "",
      cityName: "",
    },
  });

  const infoRef = useRef<HTMLDivElement>(null);
  const [isShow, setIsShow] = useState(false);

  const onSubmit = (data: cityMasterFormData) => {
    console.log(data);
  };

  const [search, setSearch] = useState("");
  const [cities, setCities] = useState<any[]>([]);
  const [parties, setParties] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(async () => {
      setLoading(true);

      try {
        // const res : any = { "data" : [{}]} /* await partyService.search(search);*/
        const res = {
          data: [
            {
              cityCode: "P001",
              cityName: "ABC Traders",
            },
          ],
        };

        setCities(res.data);
        setCities(res.data);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  return (
    <div className="grid h-[100%] gap-4 md:grid-cols-[40%_59%]">
      <div className="rounded-xl  justify-center ">
        <Card className="  ">
          <CardHeader>
            <CardTitle>{t("cityMaster.title")}</CardTitle>
            <CardDescription>
              Enter city's code and name.
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
                    <Label htmlFor="code">
                      {t("cityMaster.cityCode")}
                    </Label>
                    <Input
                      id="code"
                      type="number"
                      placeholder={t("cityMaster.cityCodePlaceholder")}
                      required
                      {...register("cityCode")}
                    />
                  </div>
                  {errors.cityCode && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.cityCode.message}
                    </p>
                  )}
                  <div className="grid gap-2">
                    <Label htmlFor="name">
                      {t("cityMaster.cityName")}
                    </Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder={t("cityMaster.cityNamePlaceholder")}
                      required
                      {...register("cityName")}
                    />
                  </div>
                  {errors.cityName && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.cityName.message}
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
              {t("cityMaster.common.save")}
              <SaveIcon className="ml-2 h-4 w-4" />
            </Button>
            <Button variant="outline" className="flex-1">
              {t("cityMaster.common.update")}
              <SavePlusIcon className="ml-2 h-4 w-4" />
            </Button>

            <Button variant="destructive" className="flex-1">
              {t("cityMaster.common.delete")}
              <Trash2 className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
          {/* <PaginationButtons /> */}
        </Card>
      </div>

      {isShow && (
        <Card ref={infoRef} className="p-0 pt-3   rounded-xl flex-1 ">
          <CardHeader className="">
            <CardTitle>{t("cityMaster.title")}</CardTitle>
            <div className="mt-3 w-full">
              <Searchbar
                value={search}
                onChange={setSearch}
                placeholder={t("cityMaster.common.searchCity")}
                resultCount={cities.length}
              />
            </div>
          </CardHeader>

          <TableWithFooter />
        </Card>
      )}
    </div>
  );
}
