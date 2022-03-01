const HOOKS = []
function useMemo (fn, deps) {
  const hook = HOOKS[currentIndex]
  const _deps = hook && hook._deps
  const hasChange = _deps ? !deps.every((v, i) => _deps[i] === v) : true
  const memo = hasChange ? fn() : hook.memo
  HOOKS[currentIndex] = { _deps: deps, memo }
  currentIndex++
  return memo
}