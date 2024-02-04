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
  const [scale, setScale] = useState(1);

  return (
    <div className="flex h-full w-full flex-col items-center rounded-md bg-white shadow">
      <PdfControl
        numPages={numPages}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        scale={scale}
        setScale={setScale}
      />
      <PdfDisplay
        currentPage={currentPage}
        fileUrl={fileUrl}
        numPages={numPages}
        scale={scale}
        setNumPages={setNumPages}
      />
    </div>
  );
};

export default PdfRenderer;
