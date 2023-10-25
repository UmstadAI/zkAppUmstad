import { PromptTemplate } from "langchain/prompts";

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

const ANSWER_TEMPLATE = `Your name is Umstad. You are a professional MINA Blockchain developer and you are assisting developers about zkApps and o1js.

<context>
  {context}
</context>

<chat_history>
  {chat_history}
</chat_history>

Question: {question}
`;
export const answerPrompt = PromptTemplate.fromTemplate(ANSWER_TEMPLATE);