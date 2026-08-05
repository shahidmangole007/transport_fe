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


export default function VehicleMaster() {

  const { t } = useTranslation();

  const vehicleMasterSchema = z.object({
    vehicleCode: z
      .string()
      .min(1, t("vehicleMaster.validation.vehicleCodeRequired")),

    vehicleNumber: z
      .string()
      .min(4, t("vehicleMaster.validation.vehicleNumberMin")),

    vehicleOwner: z
      .string()
      .min(4, t("vehicleMaster.validation.vehicleOwnerMin")),
  });

  type VehicleMasterFormData = z.infer<typeof vehicleMasterSchema>;
    
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<VehicleMasterFormData>({
    resolver: zodResolver(vehicleMasterSchema),
    defaultValues: {
      vehicleCode: "",
      vehicleNumber: "",
      vehicleOwner: "",
    },
  });

  const infoRef = useRef<HTMLDivElement>(null);
  const [isShow, setIsShow] = useState(false);

  const onSubmit = (data: VehicleMasterFormData) => {
    console.log(data);
  };

  const [search, setSearch] = useState("");
  const [vehicles, setVehicles] = useState<any[]>([]);
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
              vehicleCode : "P001",
              vehicleNumber: "ABC Traders",
              vehicleOwner: "Kolhapur",
            },
          ],
        };

        setVehicles(res.data);
        setVehicles(res.data);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  return (
    <div className="grid h-full gap-4 md:grid-cols-[40%_59%]">
      <div >
        <Card className="  ">
          <CardHeader>
            <CardTitle>{t("vehicleMaster.title")}</CardTitle>
            <CardDescription>
              {t("vehicleMaster.description")}
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
                    <Label htmlFor="code">{t("vehicleMaster.vehicleCode")}</Label>
                    <Input
                      id="code"
                      type="number"
                      placeholder={t("vehicleMaster.vehicleCodePlaceholder")}
                      required
                      {...register("vehicleCode")} 
                    />
                  </div>
                  {errors.vehicleCode && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.vehicleCode.message}
                    </p>
                  )}
                  <div className="grid gap-2">
                    <Label htmlFor="name">{t("vehicleMaster.vehicleNumber")}</Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder={t("vehicleMaster.vehicleNumberPlaceholder")}
                      required
                      {...register("vehicleNumber")}
                    />
                  </div>
                  {errors.vehicleNumber && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.vehicleNumber.message}
                    </p>
                  )}
                  <div className="grid gap-2">
                    <Label htmlFor="address">{t("vehicleMaster.vehicleOwner")}</Label>
                    <Input
                      id="address"
                      type="text"
                      placeholder={t("vehicleMaster.vehicleOwnerPlaceholder")}
                      required
                      {...register("vehicleOwner")}
                    />
                  </div>
                  {errors.vehicleOwner && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.vehicleOwner.message}
                    </p>
                  )}
                </div>
              </FieldGroup>
            </form>
          </CardContent>
          <CardFooter className="flex gap-2">
            <Button
              onClick={handleSubmit(onSubmit)}
              type="button"
              className="flex-1"
            >
              {t("partyMaster.common.save")}
              <SaveIcon className="ml-2 h-4 w-4" />
            </Button>
            <Button variant="outline" className="flex-1">
              {t("partyMaster.common.update")}
              <SavePlusIcon className="ml-2 h-4 w-4" />
            </Button>

            <Button variant="destructive" className="flex-1">
              {t("partyMaster.common.delete")}  
              <Trash2 className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
          {/* <PaginationButtons /> */}
        </Card>
      </div>

      {isShow && (
        <Card ref={infoRef} className="p-0 pt-3   rounded-xl flex-1 ">
          <CardHeader className="">
            <CardTitle>{t("vehicleMaster.title")}</CardTitle>
            <div className="mt-3 w-full">
              <Searchbar
                value={search}
                onChange={setSearch}
                placeholder={t("vehicleMaster.common.searchVehicle")}
                resultCount={vehicles.length}
              />
            </div>
          </CardHeader>

          <TableWithFooter />
        </Card>
      )}
    </div>
  );
}
