

/**
 * 计算数组所有元素的总和
 * https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce
 *
 * @param {*} fn
 * @return {*}
 */
function compose(...fn) {
  return fn.reduce((result, it) => {
    return (...args) => {
      return result(it(...args))
    }
  }, (it) => it)
}

function fn1(x) {
  return x + 1
}

function fn2(x) {
  return x + 2
}

function fn3(x) {
  return x + 3
}
let fnall = compose(fn1, fn2, fn3)
console.log(fnall(4))
