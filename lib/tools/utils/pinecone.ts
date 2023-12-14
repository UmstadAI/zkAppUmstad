import { Pinecone, type ScoredPineconeRecord } from "@pinecone-database/pinecone";

export type Metadata = {
  url: string,
  text: string,
  chunk: string,
  hash: string
}

type VectorType = 'docs' | 'code' | 'project' | 'issue';

function getVectorType(vector_type: string): string | undefined {
  if (!isVectorType(vector_type)) {
      throw new Error('Invalid vector type');
  }
  const vectorTypeMap: Record<VectorType, string | undefined> = {
    docs: process.env.DOCS_VECTOR_TYPE,
    code: process.env.CODE_VECTOR_TYPE,
    project: process.env.PROJECT_VECTOR_TYPE,
    issue: process.env.ISSUE_VECTOR_TYPE
  };

  return vectorTypeMap[vector_type];
}

function isVectorType(type: string): type is VectorType {
  return ['docs', 'code', 'project', 'issue'].includes(type);
}

const getMatchesFromEmbeddings = async (
  embeddings: number[], 
  topK: number, 
  namespace: string, 
  vector_type: string
): Promise<ScoredPineconeRecord<Metadata>[]> => {
  const pinecone = new Pinecone(
    {
      environment: process.env.PINECONE_ENVIRONMENT as string,     
      apiKey: process.env.PINECONE_API_KEY as string,      
    }
  );

  const vectorType = getVectorType(vector_type);

  const indexName: string = process.env.PINECONE_INDEX || '';
  if (indexName === '') {
    throw new Error('PINECONE_INDEX environment variable not set')
  }

  const indexes = await pinecone.listIndexes()
  if (indexes.filter(i => i.name === indexName).length !== 1) {
    throw new Error(`Index ${indexName} does not exist`)
  }

  const index = pinecone!.Index<Metadata>(indexName);
  const pineconeNamespace = index.namespace(namespace ?? '')

  try {
    const queryResult = await pineconeNamespace.query({
      vector: embeddings,
      topK,
      filter: {
        vector_type: vectorType
      },
      includeMetadata: true,
    })
    return queryResult.matches || []
  } catch (e) {
    console.log("Error querying embeddings: ", e)
    throw new Error(`Error querying embeddings: ${e}`)
  }
}

export { getMatchesFromEmbeddings }