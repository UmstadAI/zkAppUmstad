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