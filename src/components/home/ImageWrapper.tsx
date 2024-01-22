import Image from "next/image";
import { PropsWithChildren } from "react";

const ImageWrapper = ({ children }: PropsWithChildren) => {
  return (
    <div className="mx-auto max-w-6xl px-6 lg:px-8">
      <div className="mt-16 flow-root sm:mt-24">
        <div className="-m-2 rounded-xl bg-gray-900/5 p-2 ring-1 ring-inset ring-gray-900/10 lg:-m-4 lg:rounded-2xl lg:p-4">
          {children}
        </div>
      </div>
    </div>
  );
};

export default ImageWrapper;
