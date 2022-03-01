const lastDepsBox = []
const lastReturnCallbacks = []
let index = 0


//  当初始 数组会变化，
const useEffect = (callback, deps) => {
  const lastDeps = lastDepsBox[index]

  //  第一次或者 无依赖，!lastDeps
  //  依赖为 [],!deps
  const noDeps = !lastDeps || !deps

  // [a,b]依赖发生变化
  const depsChanged = deps.some((dep, index) => dep !== lastDeps[index])

  if (depsChanged || noDeps) {
    lastDepsBox[index] = deps
    if (lastReturnCallbacks[index]) {
      lastReturnCallbacks[index]()
    }
    lastReturnCallbacks[index] = callback()
  }
  index++
}

