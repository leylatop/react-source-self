// 模拟批量更新的逻辑
let isBatchingUpdate = false;   // 是否批量更新，当在生命周期函数内部或者钩子函数内部时，这个变成true
let state = {number: 0};
let queue = [];     // 异步更新的队列
function setState(newState) {
    if(isBatchingUpdate) {
        queue.push(newState);
    } else {
        state = {...state, ...newState};
    }
}

function handleClick() {
    isBatchingUpdate = true;

    // 我们自己的逻辑
    setState({number: state.number + 1})
    console.log(state)
    setState({number: state.number + 1})
    console.log(state)
    // 我们自己的逻辑

    state =  queue.reduce((newState, action)=> {
        return {...newState, ...action};
    }, state)
    isBatchingUpdate = false;
}
handleClick()

console.log(state)