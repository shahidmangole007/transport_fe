"use client";

import {

  LanguagesIcon,

} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Dropdown() {
  return (
    <div className="">
      <DropdownMenu>
        <DropdownMenuTrigger render={
          <Button variant="outline">
           <LanguagesIcon />
          Language
          </Button>} />
        <DropdownMenuContent>
          <DropdownMenuItem>
            Marathi
          </DropdownMenuItem>
          <DropdownMenuItem>
            English
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
