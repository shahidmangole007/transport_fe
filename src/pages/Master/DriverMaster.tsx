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


export default function DriverMaster() {

  const { t } = useTranslation();

const driverMasterSchema = z.object({
  driverCode: z
    .string()
    .min(1, t("driverMaster.validation.driverCodeRequired")),

  driverName: z
    .string()
    .min(4, t("driverMaster.validation.driverNameMin")),
});

type DriverMasterFormData = z.infer<typeof driverMasterSchema>;


  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DriverMasterFormData>({
    resolver: zodResolver(driverMasterSchema),
    defaultValues: {
      driverCode: "",
      driverName: "",
    },
  });

  const infoRef = useRef<HTMLDivElement>(null);
  const [isShow, setIsShow] = useState(false);

  const onSubmit = (data: DriverMasterFormData) => {
    console.log(data);
  };

  const [search, setSearch] = useState("");
  const [drivers, setDrivers] = useState<any[]>([]);
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
              driverCode: "P001",
              driverName: "ABC Traders",
            },
          ],
        };

        setDrivers(res.data);
        setDrivers(res.data);
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
            <CardTitle>{t("driverMaster.title")}</CardTitle>
            <CardDescription>
              {t("driverMaster.description")}
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
                      {t("driverMaster.driverCode")}
                    </Label>
                    <Input
                      id="code"
                      type="number"
                      placeholder={t("driverMaster.driverCodePlaceholder")}
                      required
                      {...register("driverCode")}
                    />
                  </div>
                  {errors.driverCode && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.driverCode.message}
                    </p>
                  )}
                  <div className="grid gap-2">
                    <Label htmlFor="name">
                      {t("driverMaster.driverName")}
                    </Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder={t("driverMaster.driverNamePlaceholder")}
                      required
                      {...register("driverName")}
                    />
                  </div>
                  {errors.driverName && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.driverName.message}
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
              {t("driverMaster.common.save")}
              <SaveIcon className="ml-2 h-4 w-4" />
            </Button>
            <Button variant="outline" className="flex-1">
              Update
              <SavePlusIcon className="ml-2 h-4 w-4" />
            </Button>

            <Button variant="destructive" className="flex-1">
              Delete
              <Trash2 className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
          {/* <PaginationButtons /> */}
        </Card>
      </div>

      {isShow && (
        <Card ref={infoRef} className="p-0 pt-3   rounded-xl flex-1 ">
          <CardHeader className="">
            <CardTitle>{t("driverMaster.title")}</CardTitle>
            <div className="mt-3 w-full">
              <Searchbar
                value={search}
                onChange={setSearch}
                placeholder={t("driverMaster.common.searchDriver")}
                resultCount={drivers.length}
              />
            </div>
          </CardHeader>

          <TableWithFooter />
        </Card>
      )}
    </div>
  );
}
