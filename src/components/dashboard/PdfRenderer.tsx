"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Document, Page, pdfjs } from "react-pdf";
import { useResizeDetector } from "react-resize-detector";
import z from "zod";
import { useToast } from "../ui/use-toast";

import { cn } from "@/lib/utils";
import Skeleton from "react-loading-skeleton";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

const PdfLoader = () => (
  <div className="h-full px-2 pb-3 pt-1">
    <Skeleton count={1} height={810} width="100%" className="h-full w-full" />
  </div>
);

const PfgLoadError = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => (
  <div className="mt-10 flex h-full flex-col items-center gap-2">
    <h3 className="text-2xl font-semibold">{title}</h3>
    <p className="text-lg text-zinc-500">{description}</p>
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

  const CustomPageValidator = z.object({
    page: z
      .string()
      .refine((number) => Number(number) > 0 && Number(number) <= numPages!),
  });
  type TCustomPageValidator = z.infer<typeof CustomPageValidator>;

  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
  } = useForm<TCustomPageValidator>({
    defaultValues: {
      page: "1",
    },
    resolver: zodResolver(CustomPageValidator),
  });

  const onPdfLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  const handlePageSubmit = ({ page }: TCustomPageValidator) => {
    setCurrentPage(Number(page));
    setValue("page", page);
  };

  return (
    <div className="flex h-full w-full flex-col items-center rounded-md bg-white shadow">
      <div className="flex h-14 w-full items-center justify-between border-b border-zinc-200 px-2">
        {numPages === null ? (
          <div className="h-full w-full pb-3 pt-1">
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

                  setValue("page", String(prevPage - 1));
                  return prevPage - 1;
                })
              }
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <div className="flex items-center gap-1.5">
              <Input
                {...register("page")}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    handleSubmit(handlePageSubmit)();
                  }
                }}
                className={cn(
                  "h-8 w-14 focus-visible:ring-0 focus-visible:ring-offset-0",
                  {
                    "border border-red-800": !!errors.page,
                  },
                )}
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

                  setValue("page", String(prevPage + 1));
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
            />
          </Document>
        </div>
      </div>
    </div>
  );
};

export default PdfRenderer;
