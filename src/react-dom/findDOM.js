// 根据虚拟dom查找真实dom
export function findDOM(vdom) {
  if(!vdom) return null
  // 如果vdom上有dom则表明该vdom是真实的节点（div，span），否则是组件，需要拿到组件的旧的虚拟dom递归找到真实dom
  if(vdom.dom) {
    return vdom.dom
  } else {
    const oldRenderVdom = vdom.classInstance ? vdom.classInstance.oldRenderVdom : vdom.oldRenderVdom
    return findDOM(oldRenderVdom)
  }
}