import { wrapToVdom } from "./utils"

// 本质上是把新的props和老的props进行合并，然后如果有新的儿子，就把新儿子替换掉老儿子
export function cloneElement(element, newProps, ...newChildren) {
  let children = element.props && element.props.children
  if(newChildren.length > 0) {
    children = newChildren.map(wrapToVdom)
  }

  if(children.length === 1) children = children[0]
  let props = {
    ...element.props,
    ...newProps,
    children
  }

  return {
    ...element, 
    props
  }
}
