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
import { useEffect, useRef, useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { FieldGroup } from "@/components/ui/field";
import { TableWithFooter } from "@/components/TableWithFooter";
import { Searchbar } from "@/components/Searchbar";
import { useTranslation } from "react-i18next";

export default function PartyMaster() {
  const { t } = useTranslation();

  const partyMasterSchema = z.object({
    partyCode: z
      .string()
      .min(1, t("partyMaster.validation.partyCodeRequired")),
    partyName: z
      .string()
      .min(4, t("partyMaster.validation.partyNameMin")),
    partyAddress: z
      .string()
      .min(4, t("partyMaster.validation.partyAddressMin")),
  });

  type PartyMasterFormData = z.infer<typeof partyMasterSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PartyMasterFormData>({
    resolver: zodResolver(partyMasterSchema),
    defaultValues: {
      partyCode: "",
      partyName: "",
      partyAddress: "",
    },
  });

  const infoRef = useRef<HTMLDivElement>(null);

  const [isShow, setIsShow] = useState(false);
  const [search, setSearch] = useState("");
  const [parties, setParties] = useState<any[]>([]);
  const [, setLoading] = useState(false);

  const onSubmit = (data: PartyMasterFormData) => {
    console.log(data);
  };

  useEffect(() => {
    const timer = setTimeout(async () => {
      setLoading(true);

      try {
        const res = {
          data: [
            {
              partyCode: "P001",
              partyName: "ABC Traders",
              partyAddress: "Kolhapur",
            },
          ],
        };

        setParties(res.data);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  return (
    <div className="grid h-full gap-4 md:grid-cols-[40%_59%]">
      <div>
        <Card>
          <CardHeader>
            <CardTitle>{t("partyMaster.title")}</CardTitle>

            <CardDescription>
              {t("partyMaster.description")}
            </CardDescription>

            <CardAction>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setIsShow(!isShow)}
              >
                <InfoIcon />
              </Button>
            </CardAction>
          </CardHeader>

          <CardContent>
            <form>
              <FieldGroup>
                <div className="flex flex-col gap-6">
                  {/* Party Code */}
                  <div className="grid gap-2">
                    <Label htmlFor="code">
                      {t("partyMaster.partyCode")}
                    </Label>

                    <Input
                      id="code"
                      type="number"
                      placeholder={t(
                        "partyMaster.partyCodePlaceholder"
                      )}
                      {...register("partyCode")}
                    />
                  </div>

                  {errors.partyCode && (
                    <p className="text-sm text-red-500">
                      {errors.partyCode.message}
                    </p>
                  )}

                  {/* Party Name */}
                  <div className="grid gap-2">
                    <Label htmlFor="name">
                      {t("partyMaster.partyName")}
                    </Label>

                    <Input
                      id="name"
                      placeholder={t(
                        "partyMaster.partyNamePlaceholder"
                      )}
                      {...register("partyName")}
                    />
                  </div>

                  {errors.partyName && (
                    <p className="text-sm text-red-500">
                      {errors.partyName.message}
                    </p>
                  )}

                  {/* Party Address */}
                  <div className="grid gap-2">
                    <Label htmlFor="address">
                      {t("partyMaster.partyAddress")}
                    </Label>

                    <Input
                      id="address"
                      placeholder={t(
                        "partyMaster.partyAddressPlaceholder"
                      )}
                      {...register("partyAddress")}
                    />
                  </div>

                  {errors.partyAddress && (
                    <p className="text-sm text-red-500">
                      {errors.partyAddress.message}
                    </p>
                  )}
                </div>
              </FieldGroup>
            </form>
          </CardContent>

          <CardFooter className="flex gap-2">
            <Button
              type="button"
              className="flex-1"
              onClick={handleSubmit(onSubmit)}
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
        </Card>
      </div>

      {isShow && (
        <Card ref={infoRef} className="p-0 pt-3 rounded-xl flex-1">
          <CardHeader>
            <CardTitle>{t("partyMaster.title")}</CardTitle>

            <div className="mt-3 w-full">
              <Searchbar
                value={search}
                onChange={setSearch}
                placeholder={t("partyMaster.common.searchParty")}
                resultCount={parties.length}
              />
            </div>
          </CardHeader>

          <TableWithFooter />
        </Card>
      )}
    </div>
  );
}