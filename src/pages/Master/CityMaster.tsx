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
import data from "../../data/data.json";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useRef, useState } from "react";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { FieldGroup } from "@/components/ui/field";
import { TableWithFooter } from "@/components/TableWithFooter";
import { Searchbar } from "@/components/Searchbar";
import { DataTable } from "@/components/data-table";
import { getCities } from "@/api/city.api";
import type { City } from "@/types/city";

const cityMasterSchema = z.object({
  cityCode: z.string().min(1, "City Code  is required"),
  cityName: z.string().min(4, "City Name is required"),
});

type cityMasterFormData = z.infer<typeof cityMasterSchema>;

export default function CityMaster() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<cityMasterFormData>({
    resolver: zodResolver(cityMasterSchema),
    defaultValues: {
      cityCode: "",
      cityName: "",
    },
  });

  const infoRef = useRef<HTMLIFrameElement>(null);
  const [isShow, setIsShow] = useState(false);

  const onSubmit = (data: cityMasterFormData) => {
    console.log(data);
  };

  const [search, setSearch] = useState("");
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCities = async () => {
      setLoading(true);

      try {
        const data = await getCities();

        console.log("API Response:", data);

        setCities(data);
      } catch (error) {
        console.error("Failed to fetch cities:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCities();
  }, []);

  useEffect(() => {
    console.log("Cities State Updated:", cities);
  }, [cities]);

  return (
    <div className="grid h-[100%] gap-4 md:grid-cols-[40%_59%]">
      <div className="rounded-xl  justify-center ">
        <Card className="  ">
          <CardHeader>
            <CardTitle>City Master</CardTitle>
            <CardDescription>Enter city's code and name.</CardDescription>
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
                <Field data-invalid={errors.cityCode ? true : undefined}>
                  <FieldLabel htmlFor="code">City Code</FieldLabel>

                  <Input
                    type="number"
                    id="code"
                    placeholder="Enter city code"
                    required
                    {...register("cityCode")}
                    aria-invalid={errors.cityCode ? true : undefined}
                  />

                  <FieldDescription>
                    {errors.cityCode?.message}
                  </FieldDescription>
                </Field>

                <Field data-invalid={errors.cityName ? true : undefined}>
                  <FieldLabel htmlFor="name">City Name</FieldLabel>
                  <Input
                    id="name"
                    placeholder="Enter city name"
                    required
                    {...register("cityName")}
                    aria-invalid={errors.cityName ? true : undefined}
                  />
                  <FieldDescription>
                    {errors.cityName?.message}
                  </FieldDescription>
                </Field>
              </FieldGroup>
            </form>
          </CardContent>
          <CardFooter className="flex justify- gap-2">
            <Button
              onClick={handleSubmit(onSubmit)}
              type="submit"
              className="flex-1"
            >
              Save
              <SaveIcon data-icon="inline-end" />
            </Button>
            <Button variant="outline" className="flex-1">
              Update
              <SavePlusIcon data-icon="inline-end" />
            </Button>

            <Button variant="destructive" className="flex-1">
              Delete
              <Trash2 data-icon="inline-end" />
            </Button>
          </CardFooter>
          {/* <PaginationButtons /> */}
        </Card>
      </div>

      {isShow && (
        <Card ref={infoRef} className="p-0 pt-3   rounded-xl flex-1 ">
          <CardHeader className="">
            <CardTitle>City Master</CardTitle>
            <div className="mt-3 w-full">
              <Searchbar
                value={search}
                onChange={setSearch}
                placeholder="Search City..."
                resultCount={cities.length}
              />
            </div>
          </CardHeader>

          {/* <TableWithFooter /> */}
          <DataTable data={data} />
        </Card>
      )}
    </div>
  );
}
