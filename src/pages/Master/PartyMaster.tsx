import { Button } from "@/components/ui/button";
import { SaveIcon, PrinterIcon , PrinterCheckIcon , SavePlusIcon, X, Printer, Trash2 } from "lucide-react";
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
import samplePdf from "../../../public/sample.pdf"

export default function PartyMaster() {
  return (
    <div className="grid h-[100%]  md:grid-cols-2">
      <div className=" rounded-xl max-w-xl  justify-center ">
        <Card className="  max-w-xl ">
          <CardHeader>
            <CardTitle>Party Master</CardTitle>
            <CardDescription>
              Enter party's code, name and address.
            </CardDescription>
            {/* <CardAction>
              <Button variant="link">Sign Up</Button>
            </CardAction> */}
          </CardHeader>
          <CardContent>
            <form>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="code">Party Code</Label>
                  <Input
                    id="code"
                    type="number"
                    placeholder="party code"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="name">Party Name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="party name"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="name">Party Address</Label>
                  <Input
                    id="address"
                    type="text"
                    placeholder="party address"
                    required
                  />
                </div>
              </div>
            </form>
          </CardContent>
           <CardFooter className="flex justify- gap-2">
            <Button type="submit" className="flex-1" >
              Save
              <SaveIcon data-icon="inline-end" />
            </Button>
            <Button variant="outline" className="flex-1">
              Update
              <SavePlusIcon data-icon="inline-end" />
            </Button>
            <Button variant="outline" className="flex-1" >
              Print
              <Printer data-icon="inline-end" />
            </Button>
            <Button variant="destructive" className="flex-1" >
              Delete
              <Trash2 data-icon="inline-end" />
            </Button>
          </CardFooter> 
              <PaginationButtons />
        </Card>
      
      </div>
      {/* <div className=" rounded-xl bg-orange-400" /> */}
      <div className=" rounded-xl flex-1 bg-violet-400" >

              <iframe src="../../../public/sample.pdf"  className="w-full h-full" ></iframe>

      </div>
    </div>
  );
}



