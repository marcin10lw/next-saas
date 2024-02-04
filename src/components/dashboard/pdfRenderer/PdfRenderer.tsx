"use client";

import { useState } from "react";

import PdfControl from "./PdfControl";
import PdfDisplay from "./PdfDisplay";

interface PdfRendererProps {
  fileUrl: string;
}

const PdfRenderer = ({ fileUrl }: PdfRendererProps) => {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <div className="flex h-full w-full flex-col items-center rounded-md bg-white shadow">
      <PdfControl
        currentPage={currentPage}
        numPages={numPages}
        setCurrentPage={setCurrentPage}
      />
      <PdfDisplay
        currentPage={currentPage}
        fileUrl={fileUrl}
        numPages={numPages}
        setNumPages={setNumPages}
      />
    </div>
  );
};

export default PdfRenderer;
