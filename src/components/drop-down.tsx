"use client";

import { LanguagesIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import i18n from "@/locales/i18s";

export function Dropdown() {
  const changeLanguage = (lang: "en" | "mr") => {
    i18n.changeLanguage(lang);
    localStorage.setItem("language", lang);
  };

  return (
    <div className="">
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button variant="outline">
              <LanguagesIcon />
              Language
            </Button>
          }
        />
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => changeLanguage("mr")}>
            मराठी 
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => changeLanguage("en")}>
            English
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
