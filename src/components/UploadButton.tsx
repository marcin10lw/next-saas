"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const UploadButton = () => {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <Dialog
      open={modalOpen}
      onOpenChange={() => setModalOpen((modalOpen) => !modalOpen)}
    >
      <DialogTrigger asChild>
        <Button variant="default">Upload PDF</Button>
      </DialogTrigger>
      <DialogContent className="">HELLO</DialogContent>
    </Dialog>
  );
};

export default UploadButton;
