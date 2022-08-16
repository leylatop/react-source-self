import {
	REACT_TEXT
} from './constants';
import {
	addEvent
} from './event';

// 把虚拟dom转化成真实dom并且插入到容器中
function render(vdom, container) {
	// {
	// 	key: undefined
	// 	props: {children: undefined}
	// 	ref: undefined
	// 	type: class 
	// }
	// 1. 根据虚拟dom转化成真实dom
	const dom = createDOM(vdom);
	// 2. 将真实dom添加到容器中去
	container.appendChild(dom)
}

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
			render(props.children, dom); // 把儿子挂载到自己身上
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

// 解析类组件
function mountClassComponent(vdom) {
	let {
		type,
		props,
		ref
	} = vdom; // 组件是类组件，所以需要实例化

	// 若有默认属性，需要与传入的属性进行合并
	let defaultProps = type.defaultProps || {};
	let componentProps = {
		...defaultProps,
		...props
	}

	let classInstance = new type(componentProps);
	// render之前执行componentWillMount
	if (classInstance.componentWillMount) {
		classInstance.componentWillMount();
	}

	// 执行render函数，得到组件内部的reactvdom
	let renderVdom = classInstance.render();

	// render之后执行componentWillMount
	if (classInstance.componentDidMount) {
		classInstance.componentDidMount();
	}

	// 在挂载时，将执行render函数后真实dom对应的虚拟dom挂载到类组件的实例上；
	classInstance.oldRenderVdom = vdom.oldRenderVdom = renderVdom;

	// 如果类组件有ref，就让ref的current指向类组件的实例
	if (ref) {
		ref.current = classInstance;
	}
	return createDOM(renderVdom);
}

// 解析函数组件
function mountFunctionComponent(vdom) {
	let {
		type,
		props
	} = vdom;
	let renderVdom = type(props); // 执行函数，返回组件内部的reactvdom

	// 在挂载时，将执行函数组件后真实dom对应的虚拟dom挂载到类组件的实例上；
	vdom.oldRenderVdom = renderVdom;
	return createDOM(renderVdom); // 将vdom转化成真实dom返回

}

// 解析儿子（儿子是多个）
function renconcileChildren(childrenVdom, parentVdom) {
	for (let i = 0; i < childrenVdom.length; i++) {
		let childVdom = childrenVdom[i];
		render(childVdom, parentVdom)
	}
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
			addEvent(dom, key.toLocaleLowerCase(), newProps[key]);
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


// 根据vdom获取真实dom
export function findDOM(vdom) {
	let {
		type
	} = vdom;
	let dom;
	// 对vdom的type进行判断，如果type是类组件或函数组件，它们没有真实dom，只能取render或者执行函数组件的虚拟dom对应的真实dom
	if (typeof type === 'function') { // vdom是组件
		dom = findDOM(vdom.oldRenderVdom); // 递归获取真实dom，不可以直接使用.dom获取，避免组件套组件的情况， 通过组件的虚拟dom，获取内层的虚拟dom，再获取虚拟dom身上的dom属性
	} else {
		dom = vdom.dom;
	}
	return dom;
}

// 比较新旧虚拟dom找出差异，更新到真实dom上
export function compareTwoVdom(parentDOM, oldVdom, newVdom) {
	let oldDOM = findDOM(oldVdom);
	let newDOM = createDOM(newVdom);
	// TODO... 
	// 先强行替换，后续进行diff
	parentDOM.replaceChild(newDOM, oldDOM);
}

const ReactDOM = {
	render,
}

export default ReactDOM;