"use client";

import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { Document, Page, pdfjs } from "react-pdf";
import { useResizeDetector } from "react-resize-detector";
import { useToast } from "../ui/use-toast";

import { useState } from "react";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import Skeleton from "react-loading-skeleton";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

const PdfLoader = () => (
  <div className="mt-10 flex h-full justify-center">
    <Loader2 className="h-8 w-8 animate-spin" />
  </div>
);

const PfgLoadError = () => (
  <div className="mt-10 flex h-full flex-col items-center gap-2">
    <h3 className="text-2xl font-semibold">Could not read PDF</h3>
    <p className="text-lg text-zinc-500">Please try again</p>
  </div>
);

interface PdfRendererProps {
  fileUrl: string;
}

const PdfRenderer = ({ fileUrl }: PdfRendererProps) => {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const { toast } = useToast();

  const { ref, width } = useResizeDetector();

  const onPdfLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  return (
    <div className="flex h-full w-full flex-col items-center rounded-md bg-white shadow">
      <div className="flex h-14 w-full items-center justify-between border-b border-zinc-200 px-2">
        {numPages === null ? (
          <div className="w-full h-full pb-3 pt-1">
            <Skeleton count={1} height="100%" />
          </div>
        ) : (
          <div className="flex items-center gap-1.5">
            <Button
              variant="ghost"
              aria-label="previous page"
              disabled={currentPage === 1}
              onClick={() =>
                setCurrentPage((prevPage) => {
                  if (prevPage === 1) return 1;
                  return prevPage - 1;
                })
              }
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <div className="flex items-center gap-1.5">
              <Input
                value={currentPage}
                onChange={({ currentTarget }) =>
                  setCurrentPage(currentTarget.valueAsNumber)
                }
                type="number"
                className="h-8 w-14"
                min={1}
                max={numPages}
              />
              <p className="space-x-1 text-sm text-zinc-700">
                <span>/</span>
                <span>{numPages}</span>
              </p>
            </div>

            <Button
              variant="ghost"
              aria-label="next page"
              disabled={currentPage === numPages}
              onClick={() =>
                setCurrentPage((prevPage) => {
                  if (prevPage >= numPages) return numPages;
                  return prevPage + 1;
                })
              }
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      <div className="max-h-screen w-full flex-1">
        <div ref={ref}>
          <Document
            loading={PdfLoader}
            error={PfgLoadError}
            onLoadSuccess={onPdfLoadSuccess}
            onLoadError={() => {
              toast({
                title: "Error loading PDF",
                description: "Please try again later",
                variant: "destructive",
              });
            }}
            file={fileUrl}
            className="max-h-full"
          >
            <Page
              loading={PdfLoader}
              width={width ? width : 1}
              pageNumber={currentPage}
            />
          </Document>
        </div>
      </div>
    </div>
  );
};

export default PdfRenderer;
