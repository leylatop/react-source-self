import { REACT_TEXT } from './constants'

// 不管原来是什么样的形式，都转成对象的形式，方便后续的dom-diff操作
// 为没有type的字符串和数字进行添加type的处理，并且转化成虚拟dom，其他类型的值默认不进行处理
export function wrapToVdom(element) {
    if(typeof element === 'string' || typeof element === 'number') {
        return {
            type: REACT_TEXT,
            props: {
                content: element
            }
        }
    } else {
        return element;
    }
}

