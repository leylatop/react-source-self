import { compareTwoVdom } from '../react-dom/compareTwoVdom';
import { findDOM } from '../react-dom/findDOM'
import { Updater } from './Updater'

export default class Component {
  static isReactComponent = true;
  constructor(props) {
    this.props = props;
    this.state = {};
    // 每个类组件的实例都有一个updater更新器负责更新调度
    // Component不关心更新调度，只管更新组件，更新调度由updater负责，将component的实例传过去，在updater中实现更新
    this.updater = new Updater(this);
  }

  setState = (pendingState) => {
    this.updater.addState(pendingState)
  }

  forceUpdate = () => {
    const oldRenderVdom = this.oldRenderVdom
    const oldDOM = findDOM(oldRenderVdom)
    if(this.constructor.getDerivedStateFromProps) {
      // 将最新的props和老的state结合，父组件传进来的props更新子组件的state
      let newState = this.constructor.getDerivedStateFromProps(this.props, this.state)
      if(newState) {
        this.state = { ...this.state, newState }
      }
    }

    const snapshot = this.getSnapshotBeforeUpdate() // 更新前的存一下快照，更新完成后传入 componentDidUpdate
    const newRenderVdom = this.render()
    compareTwoVdom(oldDOM.parentNode, oldRenderVdom, newRenderVdom)
    this.oldRenderVdom = newRenderVdom
    if(this.componentDidUpdate) {
      this.componentDidUpdate(this.props, this.state, snapshot)
    }
  }
}
