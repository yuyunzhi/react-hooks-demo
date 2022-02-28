function useReducer (reducer, initialState) {
  
  const [state, setState] = useState(initialState)

  const update = (state, action) => {
    const result = reducer(state, action)
    setState(result)
  }

  const dispatch = update.bind(null, state)

  return [state, dispatch]
}
