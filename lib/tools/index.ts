import { RunnableToolFunction } from 'openai/lib/RunnableFunction'
import { docTool, docToolRunnable } from './doc'
import { codeTool, codeToolRunnable } from './code'
import { projectTool, projectToolRunnable } from './project'
import { Tool } from './tool'

type ToolMap = {
  [key: string]: Tool
}

export const tools: Tool[] = [docTool, codeTool, projectTool]

export const runnables: RunnableToolFunction<any>[] = [docToolRunnable, codeToolRunnable, projectToolRunnable]
