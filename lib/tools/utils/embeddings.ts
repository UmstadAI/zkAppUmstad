import { OpenAI } from 'openai'

const config = {
  apiKey: process.env.OPENAI_API_KEY_EMBEDDING
}


const openai = new OpenAI(config)

export async function getEmbeddings(input: string) {
  try {
    const response = await openai.embeddings.create({
      model: 'text-embedding-ada-002',
      input: input.replace(/\n/g, ' ')
    })

    const result = response.data[0].embedding
    return result
  } catch (e) {
    console.log('Error calling OpenAI embedding API: ', e)
    throw new Error(`Error calling OpenAI embedding API: ${e}`)
  }
}
