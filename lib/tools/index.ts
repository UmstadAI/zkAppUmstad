import { RunnableToolFunction } from 'openai/lib/RunnableFunction'
import { docTool, docToolRunnable } from './doc'
import { codeTool, codeToolRunnable } from './code'
import { projectTool, projectToolRunnable } from './project'
import { issueTool, issueToolRunnable } from './issue'
import { Tool } from './tool'

type ToolMap = {
  [key: string]: Tool
}

export const tools: Tool[] = [docTool, codeTool, projectTool, issueTool]
export const toolMap = tools.reduce((acc: ToolMap, tool: Tool) => {
  acc[tool.name] = tool
  return acc
}, {})

export const runnables: RunnableToolFunction<any>[] = [
  docToolRunnable,
  codeToolRunnable,
  projectToolRunnable,
  issueToolRunnable
]
