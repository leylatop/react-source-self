import { mount } from "./render";
import {REACT_FORWARD_REF, REACT_TEXT, REACT_FRAGMENT, REACT_PROVIDER, REACT_CONTEXT} from '../react/constants/index'
import { addEvent } from './event'

// 创建真实dom，并且返回
function createDOM(vdom) {
	let {
		type,
		props,
		ref
	} = vdom;
	let dom; // 真实dom
  if(type.$$typeof === REACT_PROVIDER) {
    return mountProviderComponent(vdom)
  } else if(type.$$typeof === REACT_CONTEXT) {
    return mountContextComponent(vdom)
  } else if(type === REACT_FRAGMENT) {
    dom = document.createDocumentFragment()
  } else if(type && type.$$typeof === REACT_FORWARD_REF) { // 如果type 的 $$typeof 属性为 REACT_FORWARD_REF，则渲染forward转发的组件
		return mountForwardComponent(vdom)
	} else if (type === REACT_TEXT) { // 如果节点是文本节点，就用createTextNode方法创建节点
		dom = document.createTextNode(props);
	} else if (typeof type === 'function') { // 函数组件或类组件
		// 这里直接return真实dom，是因为函数组件的props是传参使用的，没有必要挂载到真实dom上面；也没有儿子
		// 所以就不需要走下面 updateProps 和reconcileChildren的流程

		// 函数组件
		if (type.isReactComponent) { // 说明是个类组件
			return mountClassComponent(vdom);
		} else { // 说明是函数组件
			return mountFunctionComponent(vdom);
		}
	} else {
		dom = document.createElement(type)
	};

	if (props) {
		// 处理属性
		updateProps(dom, {}, props);

		// 处理儿子 
		// 如果只有一个儿子，并且儿子是对象
		if (typeof props.children === 'object' && props.children.type) {
      props.children.mountIndex = 0
			mount(props.children, dom); // 把儿子挂载到自己身上
		} else if (Array.isArray(props.children)) { // 如果是一个数组，就说明有多个儿子，就依次遍历加载
			reconcileChildren(props.children, dom);
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
export function updateProps(dom, oldProps = {}, newProps = {}) {
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
			// 原因：通过事件劫持，添加isBatchingUpdate的标识
			addEvent(dom, key.toLocaleLowerCase(), newProps[key]);
		}
		// 3. 普通属性（虚拟dom属性和真实属性的dom属性命名相同，都是驼峰式写法）
		else {
			dom[key] = newProps[key];
			// dom.serAttribute(key, newProps[key])
		}
	}

	for(let key in oldProps) {
		if(!newProps.hasOwnProperty(key)) { // 若老属性在新属性中不存在，则将dom上的老属性删除
			dom[key] = null
		}
	}
}

// 挂载儿子（儿子是多个）
function reconcileChildren(childrenVdom, parentVdom) {
	for (let i = 0; i < childrenVdom.length; i++) {
		let childVdom = childrenVdom[i];
    childVdom.mountIndex = i
		mount(childVdom, parentVdom)
	}
}

function mountFunctionComponent(vdom) {
  const { type: FunctionComponent, props } = vdom
  const renderVdom = FunctionComponent(props)
	// 把本次的renderVdom放到vdom上
	vdom.oldRenderVdom = renderVdom
  return createDOM(renderVdom)
}

function mountClassComponent(vdom) {
  const { type: ClassComponent, props, ref } = vdom
	const classInstance = new ClassComponent(props)
  // 类组件兼容context
  if(ClassComponent.contextType) {
    classInstance.context = ClassComponent.contextType._currentValue
  }
	if(classInstance.componentWillMount) classInstance.componentWillMount()
	const renderVdom = classInstance.render()
	// 如果组件上有ref属性，就将实例本身赋给该类组件的ref
	if(ref) ref.current = classInstance

	// 把本次的renderVdom放到vdom上
	classInstance.oldRenderVdom = renderVdom
	vdom.classInstance = classInstance
	const dom = createDOM(renderVdom)
	if(classInstance.componentDidMount) classInstance.componentDidMount()
	return dom
}

function mountProviderComponent(vdom) {
  // Provider vdom 结构
  // {
  //   $$typeof: Symbol(react.element)
  //   key: null
  //   props: {
  //    children: {$$typeof: Symbol(react.element), type: 'div', key: null, ref: null, props: {…}, …},
  //    value: {color: 'black', changeColor: ƒ}
  //   },
  //   ref: null
  //   type: {$$typeof: Symbol(react.provider), _context: {…}, _currentValue}
  // }
  const { type, props } = vdom
  const context = type._context
  context._currentValue = props.value
  // Provider 的渲染本质上是直接获取它的儿子的vdom
  const renderVdom = props.children
  vdom.oldRenderVdom = renderVdom
  return createDOM(renderVdom)
}

function mountContextComponent(vdom) {
  // Consumer vdom结构
  // {
  //   $$typeof: Symbol(react.element)
  //   key: null
  //   props: {children:  contextValue => {…}}
  //   ref: null
  //   type: {$$typeof: Symbol(react.context), _context: {…}, _calculateChangedBits: null, …}
  // }
  const { type, props } = vdom
  const context = type._context
  // Consumer 的渲染本质上是调用consumer内部的方法，将contextValue传进去，方法调用结束后得到vdom
  const renderVdom = props.children(context._currentValue)
  vdom.oldRenderVdom = renderVdom
  return createDOM(renderVdom)
}

function mountForwardComponent(vdom) {
  // forward vdom结构
  // {
  //   type: { $$typeof: REACT_FORWARD_REF, render: FunctionComponent}
  //   props: {}
  //   ref: {}
  // }
	const { type, props, ref } = vdom
	const renderVdom = type.render(props, ref) // 调用原函数组件，将props和ref作为参数传递过去
	// renderVdom结构：
	// $$type: Symbol(react.element)
	// key: undefined
	// props: {ref: {…}, children: undefined, onClick: ƒ}
	// ref: {current: null}
	// type: "input"
	vdom.oldRenderVdom = renderVdom
	// 创建完 renderVdom 的真实dom后，renderVdom.ref 就拥有了值
	return createDOM(renderVdom)
}

export default createDOM