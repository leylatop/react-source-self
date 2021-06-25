/*
 * @Author: your name
 * @Date: 2021-06-25 21:50:25
 * @LastEditTime: 2021-06-25 23:06:13
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \react-source-self\src\react-dom.js
 */
import {REACT_TEXT} from './constants'

// 把虚拟dom转化成真实dom并且插入到容器中
function render(vdom, container) {
	// 1. 根据虚拟dom转化成真实dom
	const dom = createDOM(vdom);
	container.appendChild(dom)

}

// 创建真实dom，并且返回
function createDOM(vdom) {
	let {type, props} = vdom;
	let dom;	// 真实dom
	// 如果节点是文本节点，就用createTextNode方法创建节点
	if(type === REACT_TEXT) {
		dom = document.createTextNode(props.content);
	} else if(typeof type === 'function') { // 函数组件或类组件
		// 这里直接return真实dom，是因为函数组件的props是传参使用的，没有必要挂载到真实dom上面；也没有儿子
		// 所以就不需要走下面updateProps和reconcileChildren的流程
		console.log(type);
		// 函数组件
		if(type.isReactComponent) {		// 说明是个类组件
			return mountClassComponent(vdom);
		} else {	// 说明是函数组件
			return mountFunctionComponent(vdom);
		}
	} else {
		dom = document.createElement(type)
	};

	if(props) {
		updateProps(dom, {}, props);
	}

	if(props.children) {
		// 此时dom是一个真实的dom

		// 如果只有一个儿子，并且儿子是对象
		if(typeof props.children === 'object' && props.children.type) {
			render(props.children, dom);
		} else if(Array.isArray(props.children)) {	// 如果是一个数组，就说明有多个儿子，就依次遍历加载
			renconcileChildren(props.children, dom);
		}
	}
	// 让虚拟dom的 dom属性指向它自己的真实dom
	vdom.dom = dom;
	return dom;
}

// 解析类组件
function mountClassComponent(vdom) {
	let {type, props} = vdom;	// 组件是类组件，所以需要实例化
	let classInstance = new type(props);
	// 执行render函数，得到组件内部的reactvdom
	let renderVdom = classInstance.render();
	return createDOM(renderVdom);
}

// 解析函数组件
function mountFunctionComponent(vdom) {
	let {type, props} = vdom;
	let renderVdom = new type(props);	// 返回组件内部的reactvdom
	return createDOM(renderVdom);	// 将vdom转化成真实dom返回

}

// 解析儿子（儿子是多个）
function renconcileChildren(childrenVdom, parentVdom) {
	for(let i = 0; i < childrenVdom.length; i++) {
		let childVdom = childrenVdom[i];
		render(childVdom, parentVdom)
	}
}
// 设置props 文本、属性、事件、style
// 根据虚拟dom中的属性，更新真实dom中的属性
function updateProps(dom, oldProps, newProps) {
	for(let key in newProps) {
		if (key === 'children') {continue;}	// 后面会单独处理children属性，所以此处先跳过
		// 对style进行单独处理
		if(key === 'style') {
			let styleObj = newProps[key];
			for(let attr in styleObj) {
				dom.style[attr] = styleObj[attr]; 
			}
		} else {
			dom[key] = newProps[key];
		}
	}
}

const ReactDOM = {
	render,
}

export default ReactDOM;