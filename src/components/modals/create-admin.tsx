"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import CreateAdminForm from "../forms/create-user.form";
import { useState } from "react";

export function CreatAdminModal() {
  const [open, setOpen] = useState<boolean>(false);
  return (
    <Dialog open={open} onOpenChange={(val) => setOpen(val)}>
      <DialogTrigger asChild>
        <Button variant="outline">Create Admin User</Button>
      </DialogTrigger>
      <DialogContent className="w-full ">
        <DialogHeader className="p-4">
          <DialogTitle>Create an Admin Account</DialogTitle>
        </DialogHeader>
        <CreateAdminForm closeModal={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
