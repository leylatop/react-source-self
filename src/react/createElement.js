import { REACT_ELEMENT }  from './constants'
import {wrapToVdom}  from './utils/index'

// 创建虚拟节点
// 第一个参数，dom元素的类型
// 第二个参数，props 包含属性、样式、事件等
// 第三个参数，子元素
// 如果有3+个参数，后面的参数都是子元素
function createElement(type, config, children) {
  // ref和key较为特殊
  // ref是用来获取虚拟dom实例的
  // key是用来标识唯一的
  let ref, key;
  if (config) {
    delete config.__source;
    delete config.__self;
    ref = config.ref;
    // delete config.ref;
    key = config.key;
    delete config.key;
  }

  // 展开config props中不包含ref和key，ref和key将会与props同级别
  let props = {
    ...config
  };
  // 如果参数大于3个，则后面的都是children， 从下标为2的参数开始往后截取
  if (arguments.length > 3) {
    children = Array.prototype.slice.call(arguments, 2).map(wrapToVdom);
  } else {
    children = wrapToVdom(children); //wrapToVdom对字符串和数字进行加工处理
  }
  // 将children放在props中 children放在props中
  // children的值可能是
  // 1. 字符串
  // 2. 数字
  // 3. undefined
  // 4. null
  // 5. 数组
  props.children = children;

  // {
  //     "type": "div",
  //     "key": null,
  //     "ref": null,
  //     "props": {
  //     "className": "title",
  //     "style": {
  //         "color": "red"
  //     },
  //     "children": [
  //         {
  //         "type": "span",
  //         "key": null,
  //         "ref": null,
  //         "props": {
  //             "children": "hello "
  //         }
  //         },
  //         " world"
  //     ]
  //     },
  // }
  return {
    $$type: REACT_ELEMENT,
    type,
    props,
    ref,
    key
  }
}

export default createElement