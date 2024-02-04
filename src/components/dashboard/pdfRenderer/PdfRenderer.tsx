"use client";

import PdfControl from "./PdfControl";
import PdfDisplay from "./PdfDisplay";
import PdfRendererContextProvider from "./PrfRendererContext";

interface PdfRendererProps {
  fileUrl: string;
}

const PdfRenderer = ({ fileUrl }: PdfRendererProps) => {
  return (
    <PdfRendererContextProvider>
      <div className="flex h-full w-full flex-col items-center rounded-md bg-white shadow">
        <PdfControl />
        <PdfDisplay fileUrl={fileUrl} />
      </div>
    </PdfRendererContextProvider>
  );
};

export default PdfRenderer;
