"use server";

import { PDFLoader } from "langchain/document_loaders/fs/pdf";

export const getPageLevelDocs = async (fileUrl: string) => {
  const res = await fetch(fileUrl);
  const blob = await res.blob();

  const loader = new PDFLoader(blob);
  const pageLevelDocs = await loader.load();

  return { pageLevelDocs };
};
