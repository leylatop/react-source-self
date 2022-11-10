import { scheduleUpdate } from '../../react-dom/render'
let hookStates = []
let hookIndex = 0

function useReducer (reducer, initialState) {
  // 初始值可以传函数/普通值，若为普通值，则直接存储，若为函数，则为函数的执行结果
  hookStates[hookIndex] = hookStates[hookIndex] || (typeof initialParams === 'function' ? initialParams() : initialParams)
  const currentIndex = hookIndex
  // 调用dispatch，本质上是调用reducer，将老状态和action传给reducer，得到新状态
  function dispatch(action) {
    const oldState = hookStates[currentIndex]
    const newState = reducer(oldState, action)
    hookStates[currentIndex] = newState
    scheduleUpdate(() => {
      hookIndex = 0 // 每次更新时都会把 hookIndex 重置为0， 防止溢出；重置为0 后，为 hookState重新赋值
    })
  }

  return [hookStates[hookIndex++], dispatch]
}

// useState 和useReducer很像，源码中，useState是用useReducer实现的，但这里为了好理解，分开写
function useState(initialParams) {
  // 初始值可以传函数/普通值，若为普通值，则直接存储，若为函数，则为函数的执行结果
  hookStates[hookIndex] = hookStates[hookIndex] || (typeof initialParams === 'function' ? initialParams() : initialParams)
  const currentIndex = hookIndex
  function setState (newParams) { // setXX接收一个变量或一个方法，如果接收一个方法，则新状态为执行完这个方法后的值
    const oldState = hookStates[currentIndex]
    const newState = typeof newParams === 'function' ? newParams(oldState) : newParams
    hookStates[currentIndex] = newState
    scheduleUpdate(() => {
      hookIndex = 0 // 每次更新时都会把 hookIndex 重置为0， 防止溢出；重置为0 后，为 hookState重新赋值
    })
  }
  return [hookStates[hookIndex++], setState]
}

function useMemo(factory, deps) { // factory 工厂函数，执行完之后会返回定义的变量
  // 后面渲染时的
  if(hookStates[hookIndex]) {
    const [ lastMemo, lastDeps] = hookStates[hookIndex]
    const same = deps.every((item, index) => item === lastDeps[index])
    // 依赖一致
    if(same) {
      hookIndex++
      return lastMemo
    } else { // 依赖不一致，则重新渲染
      const newMemo = factory()
      hookStates[hookIndex++] = [newMemo, deps]
      return newMemo
    }
  } else { // 第一次渲染
    const newMemo = factory()
    hookStates[hookIndex++] = [newMemo, deps]
    return newMemo
  }
}

function useCallback(callback, deps) {
  // 后面渲染时的
  if(hookStates[hookIndex]) {
    const [ lastCallback, lastDeps] = hookStates[hookIndex]
    const same = deps.every((item, index) => item === lastDeps[index])
    // 依赖一致
    if(same) {
      hookIndex++
      return lastCallback
    } else { // 依赖不一致，则重新渲染
      hookStates[hookIndex++] = [callback, deps]
      return callback
    }
  } else { // 第一次渲染
    hookStates[hookIndex++] = [callback, deps]
    return callback
  }
}

export {
  useReducer,
  useState,
  useMemo,
  useCallback,
}