import { ScoredPineconeRecord } from "@pinecone-database/pinecone";
import { getProjectMatchesFromEmbeddings } from "./projectPinecone";
import { getEmbeddings } from './embeddings'

export type Metadata = {
  url: string,
  text: string,
  chunk: string,
}

// The function `getContext` is used to retrieve the context of a given message
export const getProjectContext = async (message: string, namespace: string, maxTokens = 12000, minScore = 0.7, getOnlyText = true): Promise<string | ScoredPineconeRecord[]> => {

  // Get the embeddings of the input message
  const embedding = await getEmbeddings(message);

  // Retrieve the matches for the embeddings from the specified namespace
  const matches = await getProjectMatchesFromEmbeddings(embedding, 1, "zkappumstad-projects");

  // Filter out the matches that have a score lower than the minimum score
  const qualifyingDocs = matches.filter(m => m.score && m.score > minScore);
  console.log("Project docs", qualifyingDocs)

  if (!getOnlyText) {
    // Use a map to deduplicate matches by URL
    return qualifyingDocs
  }

  let docs = matches ? qualifyingDocs.map(match => (match.metadata as Metadata).text) : [];
  console.log("Project", docs)
  // Join all the chunks of text together, truncate to the maximum number of tokens, and return the result
  return docs.join("\n").substring(0, maxTokens)
}