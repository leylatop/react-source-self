import { findDOM, compareTwoVdom } from './react-dom';
// 负责组件的更新调度
class Updater {
    constructor(classInstance) {
        this.classInstance = classInstance;
        this.pendingStates = [];    // 更新队列，保存将要更新的satet的值
        this.callbacks = [];        // 保存将要执行的setState的回调函数
        // pendingStates 和 callbacks不是一一对应的关系
    }

    // 将state和callback存放到对应的队列中
    addState(partialState, callback) {
        this.pendingStates.push(partialState);
        if (typeof callback === 'function') {
            this.callbacks.push(callback);
        }
        this.emitUpdate();  // 存放完毕，触发更新
    }

    // 触发更新（无论是状态还是属性发生变化，都会执行此方法、props、需不需要更新）
    emitUpdate() {
        // 后期会在这里加判断，判断批量更新的变量；如果是异步就先不更新，如果是同步就直接更新
        this.updateComponent();
    }

    // 更新组件
    updateComponent() {
        let { classInstance, pendingStates } = this;
        if (pendingStates.length > 0) {  // 如果有等待更新的话
            shouldUpdate(classInstance, this.getState());   // 调用shouldUpdate进行更新之前，先用getState获取最新的状态
        }
    }

    // 根据老状态和更新队列，计算最新的状态
    getState() {
        let { classInstance, pendingStates, callbacks } = this;
        let { state } = classInstance;    // 原始的组件状态
        // 更新状态
        pendingStates.forEach((nextState) => {  // nextState可能是对象也有可能是个函数；如果是函数，就执行函数拿到函数返回的对象，如果是对象直接进行合并
            if (typeof nextState === 'function') {
                nextState = nextState(state);
            }
            state = { ...state, ...nextState };
        })
        pendingStates.length = 0;   // 清空更新队列

        // 调用回调函数
        callbacks.forEach(callback => callback());
        callbacks.length = 0;

        return state;   // 返回新状态
    }
}

// 第一个参数组件实例
// 第二个参数最新的state
function shouldUpdate(classInstance, nextState) {
    classInstance.state = nextState;    // 修改实例的状态
    classInstance.forceUpdate();    // 调用类组件的updateComponent方法进行更新 
}

export class Component {
    static isReactComponent = true;
    constructor(props) {
        this.props = props;
        this.state = {};
        // 每个类组件的实例都有一个updater更新器负责更新调度
        // Component不关心更新调度，只管更新组件，更新调度由updater负责，将component的实例传过去，在updater中实现更新
        this.updater = new Updater(this);
    }

    setState(partialState, callback) {  // setState的第二个参数回调函数是在更新结束之后才会执行
        this.updater.addState(partialState, callback);  // 在updater中进行处理
    }

    // 强制更新组件（状态、属性都没发生变化，调用这个方法可以强制刷新）
    /**
     * 组件是如何更新的？
     * 1. 获取老的虚拟dom
     * 2. 根据最新的属性和状态计算新的虚拟dom
     * 3. 进行比较，查找新老虚拟dom的差异，将差异同步到真实dom上
     */
    forceUpdate() {
        let oldRenderVdom = this.oldRenderVdom; // 老的vdom
        let newRenderVdom = this.render();      // 新的vdom（state更新结束后，重新执行render得到的vdom）
        // 根据老的vdom，获取真实dom
        // 1. 类组件和函数组件自身是没有vdom的
        // 2. 类组件和函数组件的真实dom，类组件对应的真实dom执行类组件的render的那个虚拟dom的真实dom，函数组件对应的真实dom是执行完函数组件之后的返回结果
        let oldDOM = findDOM(oldRenderVdom);


        compareTwoVdom(oldDOM.parentNode, oldRenderVdom, newRenderVdom);   // 比较新老vdom，并且将计算结果渲染到真实dom
        this.oldRenderVdom = newRenderVdom; // 更新完毕后，将新的vom赋给老的vdom，方便下一次进行diff
    }
}
// 在Component的父级标明这是一个react类组件
// Component.prototype.isReactComponent = {};

// export default function Component(props, context, updater) {
//     this.props = props;
//     this.context = context;
//     // If a component has string refs, we will assign a different object later.
//     // this.refs = emptyObject;
//     // We initialize the default updater but the real one gets injected by the
//     // renderer.
//     // this.updater = updater || ReactNoopUpdateQueue;
//   }

//   Component.prototype.isReactComponent = {};