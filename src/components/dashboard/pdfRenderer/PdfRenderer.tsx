"use client";

import { useResizeDetector } from "react-resize-detector";
import SimpleBar from "simplebar-react";
import PdfControl from "./PdfControl";
import PdfDisplay from "./PdfDisplay";
import PdfRendererContextProvider from "./PrfRendererContext";

interface PdfRendererProps {
  fileUrl: string;
}

const PdfRenderer = ({ fileUrl }: PdfRendererProps) => {
  const { ref, width } = useResizeDetector();

  return (
    <PdfRendererContextProvider fileUrl={fileUrl}>
      <div className="flex h-full w-full flex-col items-center rounded-md bg-white shadow">
        <PdfControl />
        <div className="h-full max-h-screen w-full flex-1">
          <SimpleBar
            autoHide={true}
            className="h-full max-h-[calc(100vh-10rem)]"
          >
            <div ref={ref}>
              <PdfDisplay pageWidth={width} />
            </div>
          </SimpleBar>
        </div>
      </div>
    </PdfRendererContextProvider>
  );
};

export default PdfRenderer;
