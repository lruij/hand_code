

/**
 * 拦截器
 *
 * @class InterceptorsManage
 */
class InterceptorsManage {
  constructor() {
    this.handlers = []
  }

  use(fullfield, rejected) {
    this.handlers.push({
      fullfield,
      rejected
    })
  }
}


/**
 * 请求封装
 *
 * @class Axios
 */
class Axios {
  constructor() {
    this.interceptors = {
      request: new InterceptorsManage(),
      response: new InterceptorsManage()
    }
  }
  request(config) {
    var chain = [this.sendAjax.bind(this), undefined]

    this.interceptors.request.handlers.forEach(handler => {
      chain.unshift(handler.fullfield, handler.rejected)
    })

    this.interceptors.response.handlers.forEach(handler => {
      chain.push(handler.fullfield, handler.rejected)
    })

    var promise = Promise.resolve(config)
    while (chain.length > 0) {
      promise = promise.then(chain.shift(), chain.shift())
    }
    return promise
  }

  sendAjax(config) {
    return new Promise(resolve => {
      var { url = '', method = 'get', data = {} } = config;
      var xhr = new XMLHttpRequest();
      xhr.open(url, method, true);
      xhr.onload = function () {
        resolve(xhr.responseText)
      }
      xhr.send(data)
    })
  }
}

// 定义get,post...方法，挂在到Axios原型上
const methodsArr = ['get', 'devare', 'head', 'options', 'put', 'patch', 'post'];
methodsArr.forEach(met => {
  Axios.prototype[met] = function () {
    console.log('action ' + met);

    if (['get', 'devare', 'head', 'options'].includes(met)) {
      return this.request({
        method: met,
        url: arguments[0],
        ...arguments[1] || {}
      })
    } else {
      return this.request({
        method: met,
        url: arguments[0],
        data: arguments[1] || {},
        ...arguments[2] || {}
      })
    }
  }
})

const utils = {
  extend(a, b, context) {
    for (var key in b) {
      if (b.hasOwnProperty(key)) {
        if (typeof b[key] === 'function') {
          a[key] = b[key].bind(context)
        } else {
          a[key] = b[key]
        }
      }
    }
  }
}


function CreateAxiosFn() {
  var axios = new Axios()
  var req = axios.request.bind(axios)

  // 请求方法继承
  utils.extend(req, Axios.prototype, axios)
  // 拦截器方法继承
  utils.extend(req, axios)
  return req
}

var ax = CreateAxiosFn()

ax.post('http://www.bilibili.com/video/BV14T4y1z7sw?p=6&spm_id_from=pageDriver').then(res => {

}).catch(err => {
  console.log(err)
})
