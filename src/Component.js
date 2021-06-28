export class Component {
    static isReactComponent = true;
    constructor(props) {
        this.props = props;
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