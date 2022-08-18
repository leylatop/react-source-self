import { wrapToVdom } from "./utils";
import {Component} from './Component';

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
    if(config) {
        delete config.__source;
        delete config.__self;
        ref = config.ref;
        // delete config.ref;
        key = config.key;
        delete config.key;
    }

    // 展开config props中不包含ref和key，ref和key将会与props同级别
    let props = {...config};
    // 如果参数大于3个，则后面的都是children， 从下标为2的参数开始往后截取
    if(arguments.length > 3) {
        children = Array.prototype.slice.call(arguments, 2).map(wrapToVdom);
    } else {
        children = wrapToVdom(children);          //wrapToVdom对字符串和数字进行加工处理
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
        type,
        props,
        ref, 
        key
    }
}

// 创建一个ref，ref是一个对象
// current的熟悉值 是对应的真实dom的实例
function createRef() {
    return {
        current: null,
    }
}

// ref转化，将函数组件转化成包一层类组件，因为只有类组件才可以添加ref
function forwardRef(FunctionComponent) {
    return class extends Component {
        render() {
            // 将props和ref改回去
            // this指向调用它的对象
            return FunctionComponent(this.props, this.props.ref); // 返回函数组件的调用结果
        }
    }
}
let Children = {
    forEach(children, handler) {
        // 如果children是数组直接使用children；如果 children 不是数组（字符串，null等），就把它包装成数组；然后再使用forEach方法进行循环
        children = Array.isArray(children) ? children : [ children ]
        children.forEach(handler)
    }
}
const React = {
    createElement,
    Component,
    createRef,
    forwardRef,
    Children
}

export default React;