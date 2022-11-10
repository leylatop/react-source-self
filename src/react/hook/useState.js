import { scheduleUpdate } from '../../react-dom/render'
let hookStates = []
let hookIndex = 0
function useState(initialState) {
  hookStates[hookIndex] = hookStates[hookIndex] || initialState
  const currentIndex = hookIndex
  function setState (newState) {
    hookStates[currentIndex] = newState
    scheduleUpdate(() => {
      hookIndex = 0
    })
  }
  return [hookStates[hookIndex++], setState]
}

export {
  useState
}