import { useToast } from "@/components/ui/use-toast";
import { Document, Page, pdfjs } from "react-pdf";
import { useResizeDetector } from "react-resize-detector";

import Skeleton from "react-loading-skeleton";
import SimpleBar from "simplebar-react";

import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import "./style.css";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

interface PdfDisplayProps {
  fileUrl: string;
  currentPage: number;
  numPages: number | null;
  scale: number;
  setNumPages: React.Dispatch<React.SetStateAction<number | null>>;
}

const PdfDisplay = ({
  currentPage,
  fileUrl,
  numPages,
  scale,
  setNumPages,
}: PdfDisplayProps) => {
  const { toast } = useToast();

  const { ref, width } = useResizeDetector();

  const onPdfLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  return (
    <div className="max-h-screen w-full flex-1">
      <SimpleBar autoHide={false} className="max-h-[calc(100vh-10rem)]">
        <div ref={ref}>
          <Document
            loading={PdfLoader}
            error={PfgLoadError({
              title: "Could not read PDF",
              description: "Please try again",
            })}
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
              noData={PfgLoadError({
                title: "Invalid page",
                description: `Please enter page within ${numPages}`,
              })}
              width={width ? width : 1}
              pageNumber={currentPage}
              scale={scale}
            />
          </Document>
        </div>
      </SimpleBar>
    </div>
  );
};

function PdfLoader() {
  return (
    <div className="h-full px-2 pb-3 pt-1">
      <Skeleton count={1} height={810} width="100%" className="h-full w-full" />
    </div>
  );
}

function PfgLoadError({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="mt-10 flex h-full flex-col items-center gap-2">
      <h3 className="text-2xl font-semibold">{title}</h3>
      <p className="text-lg text-zinc-500">{description}</p>
    </div>
  );
}

export default PdfDisplay;
