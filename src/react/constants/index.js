export const REACT_ELEMENT = Symbol('react.element')
// 表示这是一个文本类型的元素，在源码中没有这样的类型标识
// 对字符串和文字进行特殊处理
export const REACT_TEXT = Symbol('react.text');
export const REACT_FRAGMENT = Symbol('react.fragment')

export const REACT_MEMO = Symbol('react.memo')

export const REACT_CONTEXT = Symbol('react.context')
export const REACT_PROVIDER = Symbol('react.provider')

// ref转发
export const REACT_FORWARD_REF = Symbol('react.forward_ref')