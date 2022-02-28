
let _state = []

let index = 0

function myUseState (initialValue) {

  let currentIndex = index

  _state[currentIndex] = _state[currentIndex] === undefined ? initialValue : _state[currentIndex]

  function setState (newState) {

    _state[currentIndex] = newState

    render()
  }
  index++
  return [_state[currentIndex], setState]
}


