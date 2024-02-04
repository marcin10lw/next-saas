import {
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from "react";

interface PdfRendererContextProps {
  numPages: number | null;
  setNumPages: Dispatch<SetStateAction<number | null>>;
  currentPage: number;
  setCurrentPage: Dispatch<SetStateAction<number>>;
  scale: number;
  setScale: Dispatch<SetStateAction<number>>;
  rotation: number;
  setRotation: Dispatch<SetStateAction<number>>;
  fileUrl: string;
}

const PdfRendererContext = createContext({} as PdfRendererContextProps);

const PdfRendererContextProvider = ({
  children,
  fileUrl,
}: PropsWithChildren<{ fileUrl: string }>) => {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);

  const value: PdfRendererContextProps = {
    numPages,
    setNumPages,
    currentPage,
    setCurrentPage,
    scale,
    setScale,
    rotation,
    setRotation,
    fileUrl,
  };

  return (
    <PdfRendererContext.Provider value={value}>
      {children}
    </PdfRendererContext.Provider>
  );
};

export const usePdfRendererContext = () => {
  return useContext(PdfRendererContext);
};

export default PdfRendererContextProvider;
