import {
  REACT_TEXT
} from '../constants/index'

// 不管原来是什么样的形式，都转成对象的形式，方便后续的dom-diff操作
// 为没有type的字符串和数字进行添加type的处理，并且转化成虚拟dom，其他类型的值默认不进行处理
export function wrapToVdom(element) {
  if (typeof element === 'string' || typeof element === 'number') {
    return {
      type: REACT_TEXT,
      props: element
    }
  } else {
    return element;
  }
}

/**
 * 对两个对象进行浅比较，用于shouldComponentUpdate 判断是否更新
 * @param {*} obj1 
 * @param {*} obj2 
 */
export function shallowEqual(obj1, obj2) {
  if (obj1 === obj2) return true
  if (typeof obj1 != "object" || obj1 === null || typeof obj2 != "object" || obj2 === null) return false
  let keys1 = Object.keys(obj1)
  let keys2 = Object.keys(obj2)
  if(keys1.length !== keys2.length) return false

  for( let key of keys1) {
    console.log(obj1[key] !== obj2[key])
    if(!obj2.hasOwnProperty(key) || obj1[key] !== obj2[key]) return false
  }

  return true
}
