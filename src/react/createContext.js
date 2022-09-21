import { REACT_CONTEXT, REACT_PROVIDER } from "./constants"

/**
 * 创建出的context格式，其本质是循环引用
 * const context = {
 *    $$typeof: Symbol(react.context)
 *    Consumer: {$$typeof: Symbol(react.context), _context: context, _calculateChangedBits: null, …}
 *    Provider: {$$typeof: Symbol(react.provider), _context: context}
 *    _calculateChangedBits: null
 *    _currentRenderer: {}
 *    _currentValue: undefined
 * }
 */
export function createContext() {
  const context = { $$typeof: REACT_CONTEXT, _currentValue: undefined }
  context.Provider = {
    $$typeof: REACT_PROVIDER,
    _context: context
  }

  context.Consumer = {
    $$typeof: REACT_CONTEXT,
    _context: context
  }
  return context
}