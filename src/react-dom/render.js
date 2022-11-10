import { compareTwoVdom } from './compareTwoVdom'
import createDOM from './createDOM'
let scheduleUpdate
let scheduleUpdated = false
/**
 * 虚拟dom结构
 * {
 *  key: undefined
 *  props: {children: undefined}
 *  ref: undefined
 *  type: class 
 * }
 */

// 把虚拟dom转化成真实dom并且插入到容器中
function render(vdom, container) {
  mount(vdom, container)
  scheduleUpdate = (callback) => {
    if(!scheduleUpdated) {
      scheduleUpdated = true
      queueMicrotask(() => {
        scheduleUpdated = false
        callback()
        compareTwoVdom(container, vdom, vdom)
      })
    }
  }
}

// 渲染
function mount(vdom, container) {
  // 1. 根据虚拟dom转化成真实dom
  const dom = createDOM(vdom);
  if(!dom) return
  // 2. 将真实dom添加到容器中去
  container.appendChild(dom)
}

export {
  render,
  mount,
  scheduleUpdate
}