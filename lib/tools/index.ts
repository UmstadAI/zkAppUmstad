import { RunnableToolFunction } from 'openai/lib/RunnableFunction'
import { docTool, docToolRunnable } from './doc'
import { Tool } from './tool'

type ToolMap = {
  [key: string]: Tool
}

export const tools: Tool[] = [docTool]

export const runnables: RunnableToolFunction<any>[] = [docToolRunnable]
