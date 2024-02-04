import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronDown, ChevronLeft, ChevronRight, Search } from "lucide-react";
import Skeleton from "react-loading-skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface PdfControlProps {
  numPages: number | null;
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  scale: number;
  setScale: React.Dispatch<React.SetStateAction<number>>;
}

const PdfControl = ({
  numPages,
  currentPage,
  setCurrentPage,
  scale,
  setScale,
}: PdfControlProps) => {
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

  const handlePageSubmit = ({ page }: TCustomPageValidator) => {
    setCurrentPage(Number(page));
    setValue("page", page);
  };

  const scaleList = [
    {
      id: 1,
      value: 1,
    },
    {
      id: 2,
      value: 1.5,
    },
    {
      id: 3,
      value: 2,
    },
    {
      id: 4,
      value: 2.5,
    },
  ];

  return (
    <div className="flex h-14 w-full items-center border-b border-zinc-200 px-2">
      {numPages === null ? (
        <div className="h-full w-full pb-3 pt-1">
          <Skeleton count={1} height="100%" />
        </div>
      ) : (
        <div className="flex h-full w-full items-center justify-between">
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

          <div className="space-x-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  aria-label="zoom"
                  variant="ghost"
                  className="gap-1.5 text-zinc-700"
                >
                  <Search className="h-4 w-4" />
                  <span>{scale * 100}%</span>
                  <ChevronDown className="h-3 w-3 opacity-50" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent>
                {scaleList.map(({ id, value }) => (
                  <DropdownMenuItem key={id} onSelect={() => setScale(value)}>
                    {value * 100}%
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      )}
    </div>
  );
};

export default PdfControl;
