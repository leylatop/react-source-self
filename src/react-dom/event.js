import { updateQueue } from '../react/Updater'
// 第一个参数 要绑定函数的dom
// 第二个参数 要绑定的事件的类型
// 第三个参数 handler函数
// 实现事件委托，把所有事件都绑定到document上
export function addEvent(dom, eventType, handler) {
    // dom相当于event.target对象
    let store = dom.store || (dom.store = {});  // 这里是一个对象，里面存放了此dom上对应的事件处理函数，是dom的自定义属性
    // 同以下写法
    // if (dom.store) {
    //     store = dom.store;
    // } else {
    //     dom.store = {}
    //     store = dom.store;
    // }
    
    store[eventType] = handler; // store.onclick = handler

    // 判断document上有没有挂载相同类型的函数，如果已经挂载过就不要再进行绑定了，不然会被覆盖
    // 点击的时候会执行dispatchEvent
    if (!document[eventType]) {
        document[eventType] = dispatchEvent;
    }
}

// 此处的event是原生dom属性自带的target
// 虽然事件绑定在document上，但是event依然是被点击的那个dom元素
function dispatchEvent(event) {
    // 执行事件之前，先把批量更新标识置为true
    updateQueue.isBatchingUpdate = true;    // 切换为批量更新模式

    let { target, type } = event;
    let eventType = `on${type}`;

    // 基于原来的event创建一个合成事件对象
    let syntheticEvent = createSyntheticEvent(event);

    // 模拟事件冒泡的过程
    while (target) {
        let { store } = target;   //在addEvent阶段时，将store作为属性传给了dom，所以target上面也会有target属性
        let handler = store && store[eventType];    //获取handler事件
        handler && handler.call(target, syntheticEvent);    // 执行handler
        target = target.parentNode; // 执行完当前dom之后，将target置为父节点，模拟事件冒泡
    }
    
    updateQueue.batchUpdate();  //进行批量更新
}

// 在源码中此处做了一些浏览器兼容的视频
// 比如阻止默认事件不同浏览器有不同表现
function createSyntheticEvent(event) {
    let syntheticEvent = {};
    for(let key in event) {
        syntheticEvent[key] = event[key];

    }
    return syntheticEvent;
}