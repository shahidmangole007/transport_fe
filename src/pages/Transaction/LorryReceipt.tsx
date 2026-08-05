import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableHeader,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function LorryReceipt() {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Lorry Receipt</CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">

        {/* Top Section */}
        <div className="grid grid-cols-12 gap-4">

          <div className="col-span-3">
            <Label>Receipt No</Label>
            <Input />
          </div>

          <div className="col-span-2">
            <Label>Series</Label>
            <Input />
          </div>

          <div className="col-span-3">
            <Label>Date</Label>
            <Input type="date" />
          </div>

          <div className="col-span-4">
            <Label>Payment Type</Label>

            <RadioGroup
              defaultValue="paid"
              className="flex gap-6 mt-2"
            >
              <div className="flex items-center gap-2">
                <RadioGroupItem value="paid" id="paid" />
                <Label htmlFor="paid">Paid</Label>
              </div>

              <div className="flex items-center gap-2">
                <RadioGroupItem value="toPay" id="toPay" />
                <Label htmlFor="toPay">To Pay</Label>
              </div>

              <div className="flex items-center gap-2">
                <RadioGroupItem value="credit" id="credit" />
                <Label htmlFor="credit">Credit</Label>
              </div>
            </RadioGroup>

          </div>

        </div>

        {/* Party Details */}

        <div className="grid grid-cols-2 gap-4">

          <div>
            <Label>Consignor</Label>
            <Input />
          </div>

          <div>
            <Label>Consignee</Label>
            <Input />
          </div>

          <div>
            <Label>Address</Label>
            <Input />
          </div>

          <div>
            <Label>Destination</Label>
            <Input />
          </div>

        </div>

        {/* Items */}

        <div>

          <Table>

            <TableHeader>
              <TableRow>
                <TableHead width={80}>Sr.</TableHead>
                <TableHead>Description</TableHead>
                <TableHead width={150}>Quantity</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>

              {[1,2,3,4,5].map((i)=>(
                <TableRow key={i}>

                  <TableCell>{i}</TableCell>

                  <TableCell>
                    <Input />
                  </TableCell>

                  <TableCell>
                    <Input />
                  </TableCell>

                </TableRow>
              ))}

            </TableBody>

          </Table>

        </div>

        {/* Charges */}

        <div className="grid grid-cols-4 gap-4">

          <div>
            <Label>Weight</Label>
            <Input />
          </div>

          <div>
            <Label>Amount</Label>
            <Input />
          </div>

          <div>
            <Label>Freight</Label>
            <Input />
          </div>

          <div>
            <Label>Hamali</Label>
            <Input />
          </div>

          <div>
            <Label>Advance</Label>
            <Input />
          </div>

          <div>
            <Label>Total</Label>
            <Input />
          </div>

          <div>
            <Label>Receipt Charge</Label>
            <Input />
          </div>

          <div>
            <Label>Other Charges</Label>
            <Input />
          </div>

        </div>

        {/* Remarks */}

        <div>

          <Label>Remarks</Label>

          <Textarea rows={4} />

        </div>

        {/* Buttons */}

        <div className="flex justify-end gap-3">

          <Button variant="outline">
            New
          </Button>

          <Button>
            Save
          </Button>

          <Button variant="secondary">
            Update
          </Button>

          <Button variant="destructive">
            Delete
          </Button>

          <Button variant="outline">
            Print
          </Button>

          <Button variant="outline">
            Close
          </Button>

        </div>

      </CardContent>
    </Card>
  );
}