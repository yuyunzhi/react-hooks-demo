import React, {createContext, useReducer} from "react";
import Books from './components/Books'
import Movies from "./components/Movies";
import Users from "./components/Users";
import {reducer, initialStore} from './store/index'

export const Context = createContext(null)

function App() {
  const [state, dispatch] = useReducer(reducer, initialStore);
  return (
      <Context.Provider value={{state, dispatch}}>
        <Users/>
        <hr/>
        <Books/>
        <Movies/>
      </Context.Provider>
  );
}

export default App;







