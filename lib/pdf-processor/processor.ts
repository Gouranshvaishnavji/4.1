import * as pdf from 'pdf-parse';
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

export async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  const data = await (pdf as any)(buffer);
  return data.text;
}

export async function chunkText(text: string): Promise<string[]> {
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  });

  const docs = await splitter.createDocuments([text]);
  return docs.map(doc => doc.pageContent);
}

export interface StructuredContent {
  modules: {
    title: string;
    topics: {
      title: string;
      concepts: string[];
    }[];
  }[];
}

export async function structureContent(text: string): Promise<StructuredContent> {
  return {
    modules: [
      {
        title: "Overview",
        topics: [
          { title: "Introduction", concepts: ["Basics", "Context"] },
          { title: "Key Concepts", concepts: ["Core Idea 1", "Core Idea 2"] }
        ]
      }
    ]
  };
}
