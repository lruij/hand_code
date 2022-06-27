

/**
 * 实现 new
 *
 * @param {*} fn
 * @param {*} args
 * @return {*}
 */
function createNew(fn, ...args) {
  let obj = Object.create(fn.prototype);
  let ret = fn.apply(obj, args)
  return ret instanceof Object ? ret : obj;
}

function Person(name, age) {
  this.name = name
  this.age = age
  return {
    name: this.name,
    age: this.age
  }
}

let test = createNew(Person, 'lishi', 18)
console.log(test)
