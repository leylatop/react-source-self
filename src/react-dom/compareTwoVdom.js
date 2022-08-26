import createDOM from "./createDOM";
import { findDOM } from "./findDOM";

export function compareTwoVdom(parentNode, oldRenderVdom, newRenderVdom) {
  const oldDOM = findDOM(oldRenderVdom)
  const newDOM = createDOM(newRenderVdom)
  parentNode.replaceChild(newDOM,oldDOM)
}