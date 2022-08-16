// 创建一个ref，ref是一个对象
// current的熟悉值 是对应的真实dom的实例
function createRef() {
  return {
    current: null,
  }
}

export default createRef