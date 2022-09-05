export let updateQueue = {
  isBatchingUpdate: false,    // 通过此变量来控制是否批量更新 React15
  updaters: new Set(),   // 存放setState时的更新实例
  batchUpdate() { // 批量更新
    updateQueue.isBatchingUpdate = false;
    for(let updater of updateQueue. updaters) {
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

  emitUpdate = () => {
    if(updateQueue.isBatchingUpdate) {
      updateQueue.updaters.add(this)
    } else {
      this.updateComponent()
    }
  }

  updateComponent = () => {
    const { classInstance, pendingStates } = this
    if(pendingStates.length > 0) {
      shouldUpdate(classInstance, this.getState())
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

function shouldUpdate(classInstance, nextState) {
  let willUpdate = true
  if(classInstance.shouldComponentUpdate && (!classInstance.shouldComponentUpdate())) {
    willUpdate = false
  }

  if(willUpdate && classInstance.componentWillUpdate) {
    classInstance.componentWillUpdate()
  }

  classInstance.state = nextState

  if(willUpdate) {
    classInstance.forceUpdate()
  }
}

