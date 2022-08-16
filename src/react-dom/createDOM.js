import { mount } from "./render";
import {REACT_TEXT} from '../react/constants/index'
// import { addEvent } from './event'

// 创建真实dom，并且返回
function createDOM(vdom) {
	let {
		type,
		props,
		ref
	} = vdom;
	let dom; // 真实dom
	// 如果节点是文本节点，就用createTextNode方法创建节点
	if (type === REACT_TEXT) {
		dom = document.createTextNode(props.content);
	} else if (typeof type === 'function') { // 函数组件或类组件
		// 这里直接return真实dom，是因为函数组件的props是传参使用的，没有必要挂载到真实dom上面；也没有儿子
		// 所以就不需要走下面 updateProps 和reconcileChildren的流程

		// 函数组件
		// if (type.isReactComponent) { // 说明是个类组件
		// 	return mountClassComponent(vdom);
		// } else { // 说明是函数组件
		// 	return mountFunctionComponent(vdom);
		// }
	} else {
		dom = document.createElement(type)
	};

	if (props) {
		// 处理属性
		updateProps(dom, {}, props);

		// 处理儿子 
		// 如果只有一个儿子，并且儿子是对象
		if (typeof props.children === 'object' && props.children.type) {
			mount(props.children, dom); // 把儿子挂载到自己身上
		} else if (Array.isArray(props.children)) { // 如果是一个数组，就说明有多个儿子，就依次遍历加载
			renconcileChildren(props.children, dom);
		}
	}

	// 让虚拟dom的 dom属性指向它自己的真实dom
	// 只有原生的dom元素才会被赋dom属性；
	// 函数组件和类组件已经在上面执行mountClassComponent和mountFunctionComponent，递归到真实dom的时候，才会被赋值
	vdom.dom = dom;
	// 如果存在ref的话，让ref.current指向真实dom的实例
	if (ref) {
		ref.current = dom;
	}
	return dom;
}


/**
 * 根据虚拟dom中的属性，更新真实dom中的属性（设置props 文本、属性、事件、style）
 * @param {*} dom 真实dom
 * @param {*} oldProps 老属性对象
 * @param {*} newProps 新属性对象
 */
function updateProps(dom, oldProps = {}, newProps = {}) {
	for (let key in newProps) {
		// 外面会单独处理children属性，所以此处先跳过
		if (key === 'children') {
			continue;
		} 
		// 1. 对style属性进行单独处理
		if (key === 'style') {
			let styleObj = newProps[key];
			for (let attr in styleObj) {
				dom.style[attr] = styleObj[attr];
			}
		} 
		//2.对事件属性，进行单独处理，即事件绑定(onClick) dom.onclick=handleClick
		else if (key.startsWith('on')) {
			// dom[key.toLocaleLowerCase()] = newProps[key];
			// 废弃上面那种写法；不再将事件直接绑定到dom上，而是通过addEvent事件保存事件
			// addEvent(dom, key.toLocaleLowerCase(), newProps[key]);
		}
		// 3. 普通属性（虚拟dom属性和真实属性的dom属性命名相同，都是驼峰式写法）
		else {
			dom[key] = newProps[key];
			// dom.serAttribute(key, newProps[key])
		}
	}

	for(let key in oldProps) {
		if(!newProps.hasOwnProoerty(key)) { // 若老属性在新属性中不存在，则将dom上的老属性删除
			dom[key] = null
		}
	}
}

// 挂载儿子（儿子是多个）
function renconcileChildren(childrenVdom, parentVdom) {
	for (let i = 0; i < childrenVdom.length; i++) {
		let childVdom = childrenVdom[i];
		mount(childVdom, parentVdom)
	}
}

export default createDOM