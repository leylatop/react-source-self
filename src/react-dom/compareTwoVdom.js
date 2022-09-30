import { REACT_CONTEXT, REACT_FRAGMENT, REACT_PROVIDER, REACT_TEXT } from "../react/constants";
import createDOM, { updateProps } from "./createDOM";
import { findDOM } from "./findDOM";
import { MOVE, PLACEMENT } from "./flags";

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
  // Provider
  if(oldVdom.type.$$typeof === REACT_PROVIDER) {
    updateProviderComponent(oldVdom, newVdom)
  } 
  // Consumer
  else if(oldVdom.type.$$typeof === REACT_CONTEXT) {
    updateContextComponent(oldVdom, newVdom)
  }
  // 文档片段
  else if(oldVdom.type === REACT_FRAGMENT) {
    const currentDOM = newVdom.dom = findDOM(oldVdom)
    updateChildren(currentDOM, oldVdom.props.children, newVdom.props.children)
  }
  // 文本类型
  else if(oldVdom.type === REACT_TEXT) {
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

function updateContextComponent(oldVdom, newVdom) {
  const currentDOM = findDOM(oldVdom)
  const parentDOM = currentDOM.parentNode
  const { type, props } = newVdom
  // ****** core *************
  const context = type._context
  const renderVdom = props.children(context._currentValue)
  // ****** core *************
  compareTwoVdom(parentDOM, oldVdom.oldRenderVdom, renderVdom)
  newVdom.oldRenderVdom = renderVdom
}

function updateProviderComponent(oldVdom, newVdom) {
  const currentDOM = findDOM(oldVdom)
  const parentDOM = currentDOM.parentNode
  const { type, props } = newVdom
  // ****** core *************
  const context = type._context
  context._currentValue = props.value
  const renderVdom = props.children
  // ****** core *************
  compareTwoVdom(parentDOM, oldVdom.oldRenderVdom, renderVdom)
  newVdom.oldRenderVdom = renderVdom
}

function updateClassComponent(oldVdom, newVdom) {
  const classInstance = newVdom.classInstance = oldVdom.classInstance
  if(classInstance.componentWillReceiveProps) {
    classInstance.componentWillReceiveProps(newVdom.props)
  }
  // ****** core *************
  classInstance.updater.emitUpdate(newVdom.props) // 类组件的更新会在forceUpdate中处理
  // ****** core *************
}

function updateFunctionComponent(oldVdom, newVdom) {
  let currentDOM = findDOM(oldVdom) // 老vdom对应的真实dom
  if(!currentDOM) return 
  let parentDOM = currentDOM.parentNode
  const { type, props } = newVdom
  // ****** core *************
  let newRenderVdom = type(props)
  // ****** core *************
  compareTwoVdom(parentDOM, oldVdom.oldRenderVdom, newRenderVdom)
  newVdom.oldRenderVdom = newRenderVdom
}

// 递归更新子节点
function updateChildren(parentDOM, oldVChildren, newVChildren) {
  // filter 过滤掉null
  oldVChildren = (Array.isArray(oldVChildren) ? oldVChildren : [oldVChildren]).filter(Boolean)
  newVChildren = (Array.isArray(newVChildren) ? newVChildren : [newVChildren]).filter(Boolean)
  // 若老节点的mountIndex 比 lastPlacedIndex 大，则老节点不需要移动，直接进行复用；否则需要移动元素
  let lastPlacedIndex = -1 
  let keyedOldMap = {}
  // 遍历老节点，将老节点放到map中
  oldVChildren.forEach((vChild, index) => {
    const oldKey = vChild.key ? vChild.key : index
    keyedOldMap[oldKey] = vChild
  })
  const patch = []
  newVChildren.forEach((newVChild, index) => {
    newVChild.mountIndex = index // 挂载索引
    const newKey = newVChild.key ? newVChild.key : index
    let oldVChild = keyedOldMap[newKey]
    // 找到了此key对应的老节点
    if(oldVChild) {
      // 1. 更新能用的节点
      updateElement(oldVChild, newVChild)
      // 需要移动元素
      if(oldVChild.mountIndex < lastPlacedIndex) {
        patch.push({
          type: MOVE,
          oldVChild,
          newVChild,
          mountIndex: index // 需要被插入的节点
        })
      }
      delete keyedOldMap[newKey]
      lastPlacedIndex = Math.max(lastPlacedIndex, oldVChild.mountIndex)
    } else {
      patch.push({
        type: PLACEMENT,
        newVChild,
        mountIndex: index
      })
    }
  })

  // 打补丁
  // 获取需要移动的老节点（将需要移动的老节点删掉，然后在新的地方插入）
  let moveChildren = patch.filter((action) => action.type === MOVE).map((action) => action.oldVChild)
  // 没有被复用到的老节点 + 需要移动的老节点，将之删除掉
  Object.values(keyedOldMap).concat(moveChildren).forEach((oldVChild) => {
    const currentDOM = findDOM(oldVChild)
    currentDOM.remove() // 将需要移动的节点从页面上删掉，但是内存中依然存在
  })
  
  patch.forEach((action) => {
    const {type, oldVChild, newVChild, mountIndex} = action
    // 删除没有被复用到的老节点和需要移动的老节点之后，真实dom
    const childrenNodes = parentDOM.childNodes 
    if(type === PLACEMENT) {
      let newDOM = createDOM(newVChild)
      let childNode = childrenNodes[mountIndex]
      if(childNode) {
        parentDOM.insertBefore(newDOM, childNode)
      } else {
        parentDOM.appendChild(newDOM)
      }
    } else {
      let oldDOM = findDOM(oldVChild) // 在页面中已经被移除掉了，但是内存中依然可以找到
      let childNode = childrenNodes[mountIndex]
      if(childNode) {
        parentDOM.insertBefore(oldDOM, childNode)
      } else {
        parentDOM.appendChild(oldDOM)
      }
    }
  })
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
