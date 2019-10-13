export function interceptMethod(object, method, callback) {
  const real = object[method]
  object[method] = function() {
    callback.apply(this, arguments)
    return real.apply(this, arguments)
  }
}
