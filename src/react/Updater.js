export let updateQueue = {
  isBatchingUpdate: false,    // 通过此变量来控制是否批量更新 React15
  updaters: new Set(),   // 存放setState时的更新实例
  batchUpdate() { // 批量更新
    updateQueue.isBatchingUpdate = false;
    for(let updater of updateQueue.updaters) {
        updater.updateComponent();
    }
    updateQueue.updaters.clear();
  },
}

export class Updater {
  constructor(classInstance) {
    this.classInstance = classInstance
    this.pendingStates = []
  }

  addState = (pendingState) => {
    this.pendingStates.push(pendingState)
    this.emitUpdate()
  }

  emitUpdate = (newProps) => {
    this.newProps = newProps
    if(updateQueue.isBatchingUpdate) {
      updateQueue.updaters.add(this)
    } else {
      this.updateComponent()
    }
  }

  updateComponent = () => {
    const { newProps, classInstance, pendingStates } = this
    if(newProps || pendingStates.length > 0) {
      shouldUpdate(classInstance, newProps, this.getState())
    }
  }

  getState = () => {
    const { classInstance, pendingStates } = this
    let { state } = classInstance 
    pendingStates.forEach(pendingState => {
      state = { ...state, ...pendingState }
    })
    pendingStates.length = 0
    return state
  }
}

function shouldUpdate(classInstance, newProps, nextState) {
  let willUpdate = true
  if(classInstance.shouldComponentUpdate && (!classInstance.shouldComponentUpdate(newProps, nextState))) {
    willUpdate = false
  }
  if(willUpdate && classInstance.componentWillUpdate) {
    classInstance.componentWillUpdate(newProps, nextState)
  }

  // 如果有新属性，则把新属性，放到类实例的props中
  if(newProps) {
    classInstance.props = newProps
  }

  // 无论 shouldComponentUpdate 返回值是 false还是 true， state都会更新，只不过当 shouldComponentUpdate返回值 为true的时候才会真正去更新页面
  classInstance.state = nextState
  if(willUpdate) {
    classInstance.forceUpdate()
  }
}

