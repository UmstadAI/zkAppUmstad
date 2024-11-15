import {
  Pinecone,
  type ScoredPineconeRecord
} from '@pinecone-database/pinecone'

export type Metadata = {
  url: string
  text: string
  chunk: string
  hash: string
}

type VectorType = 'docs' | 'code' | 'project' | 'issue' | 'search' | 'demoSearch' | 'proto'

function getVectorType(vector_type: string): string | undefined {
  if (!isVectorType(vector_type)) {
    throw new Error('Invalid vector type')
  }
  const vectorTypeMap: Record<VectorType, string | undefined> = {
    docs: process.env.DOCS_VECTOR_TYPE,
    code: process.env.CODE_VECTOR_TYPE,
    project: process.env.PROJECT_VECTOR_TYPE,
    issue: process.env.ISSUE_VECTOR_TYPE,
    search: process.env.SEARCH_VECTOR_TYPE,
    demoSearch: process.env.DEMO_SEARCH_VECTOR_TYPE,
    proto: 'proto'
  }

  return vectorTypeMap[vector_type]
}

function isVectorType(type: string): type is VectorType {
  return ['docs', 'code', 'project', 'issue', 'search', 'demoSearch', 'proto'].includes(type)
}

const getMatchesFromEmbeddings = async (
  embeddings: number[],
  topK: number,
  vector_type: string,
  project_name?: string
): Promise<ScoredPineconeRecord<Metadata>[]> => {
  const pinecone = new Pinecone({
    environment: process.env.PINECONE_ENVIRONMENT as string,
    apiKey: process.env.PINECONE_API_KEY as string
  })

  const vectorType = getVectorType(vector_type)

  const indexName: string = process.env.PINECONE_INDEX || ''
  
  if (indexName === '') {
    throw new Error('PINECONE_INDEX environment variable not set')
  }
  const indexes = await pinecone.listIndexes()
  if (indexes.filter(i => i.name === indexName).length !== 1) {
    throw new Error(`Index ${indexName} does not exist`)
  }

  const index = pinecone!.Index<Metadata>(indexName)

  if (project_name) {
    try {
      const queryResult = await index.query({
        vector: embeddings,
        topK,
        filter: {
          vector_type: vectorType,
          project_name: {
            $in: [`Project Name: ${project_name}`, project_name]
          }
        },
        includeMetadata: true
      })
      return queryResult.matches || []
    } catch (e) {
      console.log('Error querying embeddings: ', e)
      throw new Error(`Error querying embeddings: ${e}`)
    }
  } else {
    try {
      const queryResult = await index.query({
        vector: embeddings,
        topK,
        filter: {
          vector_type: vectorType
        },
        includeMetadata: true
      })
      return queryResult.matches || []
    } catch (e) {
      console.log('Error querying embeddings: ', e)
      throw new Error(`Error querying embeddings: ${e}`)
    }
  }
}

export { getMatchesFromEmbeddings }
