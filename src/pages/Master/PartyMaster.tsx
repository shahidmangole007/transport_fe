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

const partyMasterSchema = z.object({
  partyCode: z.string().min(1, "Party Code  is required"),
  partyName: z.string().min(4, "Party Name must be at least 4 characters"),
  partyAddress: z
    .string()
    .min(4, "Party Address must be at least 4 characters"),
});

type partyMasterFormData = z.infer<typeof partyMasterSchema>;

export default function PartyMaster() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<partyMasterFormData>({
    resolver: zodResolver(partyMasterSchema),
    defaultValues: {
      partyCode: "",
      partyName: "",
      partyAddress: "",
    },
  });

  const infoRef = useRef<HTMLIFrameElement>(null);
  const [isShow, setIsShow] = useState(false);

  const onSubmit = (data: partyMasterFormData) => {
    console.log(data);
  };

  const [search, setSearch] = useState("");
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
              partyCode: "P001",
              partyName: "ABC Traders",
              partyAddress: "Kolhapur",
            },
          ],
        };

        setParties(res.data);
        setParties(res.data);
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
            <CardTitle>Party Master</CardTitle>
            <CardDescription>
              Enter party's code, name and address.
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
                    <Label htmlFor="code">Party Code</Label>
                    <Input
                      id="code"
                      type="number"
                      placeholder="party code"
                      required
                      {...register("partyCode")}
                    />
                  </div>
                  {errors.partyCode && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.partyCode.message}
                    </p>
                  )}
                  <div className="grid gap-2">
                    <Label htmlFor="name">Party Name</Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="party name"
                      required
                      {...register("partyName")}
                    />
                  </div>
                  {errors.partyName && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.partyName.message}
                    </p>
                  )}
                  <div className="grid gap-2">
                    <Label htmlFor="name">Party Address</Label>
                    <Input
                      id="address"
                      type="text"
                      placeholder="party address"
                      required
                      {...register("partyAddress")}
                    />
                  </div>
                  {errors.partyAddress && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.partyAddress.message}
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
            <CardTitle>Party Master</CardTitle>
            <div className="mt-3 w-full">
              <Searchbar
                value={search}
                onChange={setSearch}
                placeholder="Search Party..."
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
