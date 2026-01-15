"use client";
import { PlusIcon } from "lucide-react";

import { memo } from "react";

import { Button } from "@/components/ui/button";

export const AddNodeButton = memo(() => {
  return (
    <Button
      onClick={() => {}}
      size="icon"
      variant="outline"
      className="bg-backgroud"
    >
      <PlusIcon className="size-4" />
    </Button>
  );
});

AddNodeButton.displayName = "AddNodeButton";
