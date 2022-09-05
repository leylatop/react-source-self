import { REACT_TEXT } from "../react/constants";
import createDOM, { updateProps } from "./createDOM";
import { findDOM } from "./findDOM";

export function compareTwoVdom(parentNode, oldVdom, newVdom, nextDOM) {
  if (!oldVdom && !newVdom) {
    return null
  } else if(oldVdom && !newVdom) { // 将老的卸载掉
    unmountVdom(oldVdom)
  } else if(!oldVdom && newVdom) { // 将新的插入到老的里面
    let newDOM = createDOM(newVdom)
    if(nextDOM) {
      parentNode.insertBefore(newDOM, nextDOM)
    } else {
      parentNode.appendChild(newDOM)
    }
  } else if(oldVdom && newVdom && oldVdom.type !== newVdom.type) { // 类型不一致，不能复用=> 卸载老节点，渲染新节点
    unmountVdom(oldVdom)
    let newDOM = createDOM(newVdom)
    if(nextDOM) {
      parentNode.insertBefore(newDOM, nextDOM)
    } else {
      parentNode.appendChild(newDOM)
    }
  } else { // 老节点和新节点类型一致，更新props和儿子，深度DOM-DIFF
    updateElement(oldVdom, newVdom)
  }
}

// dom-diff，更新文本、props、子节点
function updateElement(oldVdom, newVdom) {
  // 文本类型
  if(oldVdom.type === REACT_TEXT) {
    let currentDOM = newVdom.dom = findDOM(oldVdom) // 老vdom对应的真实dom
    if(oldVdom.props !== newVdom.props) {
      currentDOM.textContent = newVdom.props
    }
  } else if(typeof oldVdom.type === 'string') { // 原生节点
    let currentDOM = newVdom.dom = findDOM(oldVdom) // 老vdom对应的真实dom
    updateProps(currentDOM, oldVdom.props, newVdom.props)
    updateChildren(currentDOM, oldVdom.props.children, newVdom.props.children)
  } else if(typeof oldVdom.type === 'function') {
    if(oldVdom.type.isReactComponent) { // 类组件
      updateClassComponent(oldVdom, newVdom)
    } else {
      updateFunctionComponent(oldVdom, newVdom)
    }
  }
}

function updateClassComponent(oldVdom, newVdom) {
  const classInstance = newVdom.classInstance = oldVdom.classInstance
  if(classInstance.componentWillReceiveProps) {
    classInstance.componentWillReceiveProps(newVdom.props)
  }
  classInstance.updater.emitUpdate(newVdom.props)
}

function updateFunctionComponent(oldVdom, newVdom) {
  let currentDOM = findDOM(oldVdom) // 老vdom对应的真实dom
  if(!currentDOM) return 
  let parentDOM = currentDOM.parentNode
  const { type, props } = newVdom
  let newRenderVdom = type(props)
  compareTwoVdom(parentDOM, oldVdom.oldRenderVdom, newRenderVdom)
  newVdom.oldRenderVdom = newRenderVdom
}

// 递归更新子节点
function updateChildren(parentDOM, oldVdomChildren, newVdomChildren) {
  oldVdomChildren = Array.isArray(oldVdomChildren) ? oldVdomChildren : [oldVdomChildren]
  newVdomChildren = Array.isArray(newVdomChildren) ? newVdomChildren : [newVdomChildren]
  let max = Math.max(oldVdomChildren.length, newVdomChildren.length)
  for(let i = 0; i < max; i++) {
    // 找到oldvdom中 位于i位置 后面的节点，然后把新的vdom插入到老的节点前面
    let nextVdom = oldVdomChildren.find((vdom, index) => index > i && findDOM(vdom))
    compareTwoVdom(parentDOM, oldVdomChildren[i], newVdomChildren[i], nextVdom?.dom)
  }
}

// 卸载
export function unmountVdom(vdom) {
  const { props, type, ref } = vdom
  const currentDOM = findDOM(vdom)
  if(vdom.classInstance && vdom.classInstance.componentWillUnmount) {
		vdom.classInstance.componentWillUnmount()
	}

  if(ref) ref.current = null
	if(props.children) {
		let children = Array.isArray(props.children) ? props.children : [ props.children ]
		// 递归卸载儿子
		children.forEach(unmountVdom)
	}
	
  if(currentDOM) currentDOM.remove()
}
