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

const productDetailsMasterSchema = z.object({
  itemCode: z.string().min(1, "Item Code  is required"),
  itemName: z.string().min(4, "Item Name is required"),
  
});

type productDetailsMasterFormData = z.infer<typeof productDetailsMasterSchema>;

export default function ProductDetailsMaster() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<productDetailsMasterFormData>({
    resolver: zodResolver(productDetailsMasterSchema),
    defaultValues: {
      itemCode: "",
      itemName: "",
    },
  });

  const infoRef = useRef<HTMLIFrameElement>(null);
  const [isShow, setIsShow] = useState(false);

  const onSubmit = (data: productDetailsMasterFormData) => {
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
    <div className="grid h-[100%] gap-4 md:grid-cols-[40%_59%]">
      <div className="rounded-xl  justify-center ">
        <Card className="  ">
          <CardHeader>
            <CardTitle>Product Details Master</CardTitle>
            <CardDescription>
              Enter product details.
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
                    <Label htmlFor="code">Item Code</Label>
                    <Input
                      id="code"
                      type="number"
                      placeholder="item code"
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
                    <Label htmlFor="name">Item Name</Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="item name"
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
