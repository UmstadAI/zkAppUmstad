import { RunnableToolFunction } from 'openai/lib/RunnableFunction'
import { docTool, docToolRunnable } from './doc'
import { protoTool, protoToolRunnable } from './proto'
import { codeTool, codeToolRunnable } from './code'
import { projectTool, projectToolRunnable } from './project'
import { issueTool, issueToolRunnable } from './issue'
import { explorerTool, explorerToolRunnable } from './explorer'
import {
  checkDeprecatedTool,
  checkDeprecatedToolRunnable
} from './checkDeprecated'
import { Tool } from './tool'
import { searchTool, searchToolRunnable } from './search'

type ToolMap = {
  [key: string]: Tool
}

export const tools: Tool[] = [
  docTool,
  protoTool,
  codeTool,
  projectTool,
  issueTool,
  explorerTool,
  checkDeprecatedTool,
]

export const searcherTool: Tool[] = [
  searchTool
]
export const toolMap = tools.reduce((acc: ToolMap, tool: Tool) => {
  acc[tool.name] = tool
  return acc
}, {})

export const runnables: RunnableToolFunction<any>[] = [
  docToolRunnable,
  protoToolRunnable,
  codeToolRunnable,
  projectToolRunnable,
  issueToolRunnable,
  explorerToolRunnable,
  checkDeprecatedToolRunnable,
]

export const searchRunnable: RunnableToolFunction<any>[] = [
  searchToolRunnable
]
