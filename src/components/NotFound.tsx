import { PropsWithChildren } from "react";

function NotFoundPage({ children }: PropsWithChildren) {
  return (
    <main className="mt-20 flex w-full flex-col items-center justify-center gap-2">
      <h1 className="text-3xl font-semibold text-zinc-900 md:text-4xl">
        Page not found
      </h1>
      {children}
    </main>
  );
}

export default NotFoundPage;
