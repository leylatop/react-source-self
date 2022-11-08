import { REACT_MEMO } from "./constants";
import { shallowEqual } from "./utils";

/**
 * 接收老的函数组件，返回一个新的对象
 * @param {*} type 老的函数组件
 * @param {*} compare 对比函数
 * @returns 
 */
function memo (type, compare = shallowEqual) {
  return {
    $$typeof: REACT_MEMO,
    type,
    compare
  }
}

export default memo