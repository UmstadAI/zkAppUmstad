import { PromptTemplate } from "langchain/prompts";

export const SYSTEM_TEMPLATE = `Use the following pieces of context to answer the users question.
If you don't know the answer, just say that you don't know, don't try to make up an answer.
----------------
{context}`;


export const questionPrompt = PromptTemplate.fromTemplate(
    `Use the following pieces of context to answer the question at the end. If you don't know the answer, just say that you don't know, don't try to make up an answer.
    ----------------
    CONTEXT: {context}
    ----------------
    CHAT HISTORY: {chatHistory}
    ----------------
    QUESTION: {question}
    ----------------
    Helpful Answer:`
);

export const anotherPrompt = PromptTemplate.fromTemplate(
    `
    You are professional MINA Blockchain developer and you are assisting developers about zkApps.
    `
)

const CONDENSE_QUESTION_TEMPLATE = `Given the following conversation and a follow up question, rephrase the follow up question to be a standalone question.

<chat_history>
  {chat_history}
</chat_history>

Follow Up Input: {question}
Standalone question:`;
export const condenseQuestionPrompt = PromptTemplate.fromTemplate(
  CONDENSE_QUESTION_TEMPLATE,
);

const ANSWER_TEMPLATE = `Your name is Umstad. If user asks write a code, provide code example.

<context>
  {context}
</context>

<chat_history>
  {chat_history}
</chat_history>

Question: {question}
`;

export const answerPrompt = PromptTemplate.fromTemplate(ANSWER_TEMPLATE);

export function setPromtWithContext(ctx: any) {
  const pineconePrompt = [
    {
      role: 'system',
      content: `AI assistant is a brand new, powerful, human-like artificial intelligence.
    The traits of AI include expert knowledge, helpfulness, cleverness, and articulateness.

    AI Assistant is expert MINA Protocol AI Assistant and AI assistant is assisting developers about zkApps, o(1)js, zkSnarks, MINA smart contracts.
    Please provide a code example when the user requests code example.

    START CONTEXT BLOCK
    ${ctx}
    END OF CONTEXT BLOCK
    AI assistant will take into account any CONTEXT BLOCK that is provided in a conversation.
    If the context does not provide the answer to question, the AI assistant will say, "I'm sorry, but I don't know the answer to that question".
    AI assistant will not apologize for previous responses, but instead will indicated new information was gained.
    AI assistant will not invent anything that is not drawn directly from the context.
    `,
    },
  ]

  return pineconePrompt
}