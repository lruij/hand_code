


/**
 * 1、初始结构
 * 2、this 指向
 * 3、then 方法
 * 4、执行异常
 * 5、异步
 * 6、回调保存
 * 7、链式使用
 *
 * @class MyPromise
 */
class MyPromise {

  static PENDING = '挂载'; static FULFILLED = '成功'; static REJECTED = '失败';

  constructor(fn) {
    this.status = MyPromise.PENDING
    this.result = undefined;
    this.resolveCallbacks = []
    this.rejectCallbacks = []
    try {
      fn(this.resolve.bind(this), this.reject.bind(this))
    } catch (e) {
      this.reject(e)
    }
  }

  resolve(result) {
    setTimeout(() => {
      if (this.status === MyPromise.PENDING) {
        this.status = MyPromise.FULFILLED;
        this.result = result;
        this.resolveCallbacks.forEach(function (callback) {
          callback(result)
        })
      }
    })
  }


  reject(result) {
    setTimeout(() => {
      if (this.status === MyPromise.PENDING) {
        this.status = MyPromise.REJECTED;
        this.result = result;
        this.rejectCallbacks.forEach(function (callback) {
          callback(result)
        })
      }
    })
  }



  /**
   * 为 promise 添加被兑现和被拒绝状态的回调函数，其以回调函数的返回值兑现 promise。
   * 若不处理已兑现或者已拒绝状态（例如，onFulfilled 或 onRejected 不是一个函数），则返回 promise 被敲定时的值。
   * @param {*} onFulfilled
   * @param {*} onRejected
   * @return {*}
   * @memberof MyPromise
   */
  then(onFulfilled, onRejected) {
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : () => { }
    onRejected = typeof onRejected === 'function' ? onRejected : (reason) => { throw reason }
    return new MyPromise((resolve, reject) => {
      const successFn = (value) => {
        try {
          const result = onFulfilled(value)

          result instanceof MyPromise ? result.then(resolve, reject) : resolve(result)
        } catch (err) {
          reject(err)
        }
      }

      const rejectFn = (value) => {
        try {
          const result = onRejected(value)
          result instanceof MyPromise ? result.then(resolve, reject) : resolve(result)
        } catch (err) {
          reject(err)
        }
      }

      if (this.status === MyPromise.PENDING) {
        this.resolveCallbacks.push(successFn)
        this.rejectCallbacks.push(rejectFn)
      }
      if (this.status === MyPromise.FULFILLED) {
        onFulfilled(this.result);
      }
      if (this.status === MyPromise.REJECTED) {
        onRejected(this.result);
      }
    })
  }


  /**
   * 为 promise 添加一个被拒绝状态的回调函数，并返回一个新的 promise，若回调函数被调用，则兑现其返回值，否则兑现原来的
   * promise 兑现的值。
   *
   * @param {*} onRejected
   * @return {*}
   * @memberof MyPromise
   */
  catch(onRejected) {
    onRejected = typeof onRejected === 'function' ? onRejected : (reason) => { throw reason }
    return new MyPromise((resolve, reject) => {
      const rejectFn = (value) => {
        try {
          const result = onRejected(value)
          result instanceof MyPromise ? result.then(resolve, reject) : resolve(result)
        } catch (err) {
          reject(err)
        }
      }
      if (this.status === MyPromise.PENDING) {
        this.rejectCallbacks.push(rejectFn)
      }
      if (this.status === MyPromise.REJECTED) {
        onRejected(this.result);
      }
    })
  }

  /**
   * 返回一个状态由给定 value 决定的 Promise 对象
   *
   * @static
   * @param {*} value
   * @return {*}
   * @memberof MyPromise
   */
  static resolve(value) {
    return new MyPromise((resolve, reject) => {
      resolve(value);
    })
  }


  /**
   * 返回一个状态为已拒绝的 Promise 对象
   *
   * @static
   * @param {*} value
   * @return {*}
   * @memberof MyPromise
   */
  static reject(value) {
    return new MyPromise((resolve, reject) => {
      reject(value);
    })
  }

  /**
   * 这个方法返回一个新的 promise 对象，等到所有的 promise 对象都成功或有任意一个 promise 失败
   * @static
   * @param {*} promises
   * @return {*}
   * @memberof MyPromise
   */
  static all(promises) {
    return new MyPromise((resolve, reject) => {
      let count = 0;
      let result = [];
      let len = promises.length
      if (len === 0) {
        return resolve([])
      }

      promises.forEach((p, i) => {
        let promise = p instanceof MyPromise ? p : MyPromise.resolve(p)
        promise.then((res) => {
          count += 1
          result[i] = res

          if (count === len) {
            resolve(result)
          }
        }).catch(e => {
          reject(e)
        })
      })
    })
  }


  /**
   * 等到任意一个 promise 的状态变为已敲定。
   *
   * @static
   * @param {*} promises
   * @memberof MyPromise
   */
  static race(promises) {
    return new MyPromise((resolve, reject) => {
      promises.forEach((p, i) => {
        let promise = p instanceof MyPromise ? p : MyPromise.resolve(p)
        promise.then((res) => {
          resolve(res)
        }).catch(e => {
          reject(e)
        })
      })
    })
  }

}

// 1
let p1 = new MyPromise((resolve, reject) => {
  resolve('hello world 1')
})
// p1.then(
//   result => {
//     console.log(result)
//     return result
//   },
//   result => {
//     console.log(result)
//   }
// ).then(
//   result => {
//     console.log(result)
//   },
//   result => {
//     console.log(result)
//   })


// 2
let p2 = new MyPromise((resolve, reject) => {
  resolve('hello world 2')
})


MyPromise.all([p1, p2]).then(
  values => {
    console.log('all', values)
  },
  values => {
    console.log(values)
  }
)

MyPromise.race([p1, p2]).then(
  values => {
    console.log('race', values)
  },
  values => {
    console.log(values)
  }
)
