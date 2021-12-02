import React, {useState} from 'react';
import ChildA from './components/ChildA.jsx'
import ChildB from "./components/ChildB";

export const Context = React.createContext(null)

function App() {
  const [theme, setTheme] = useState('red')

  return (
      <Context.Provider value={{theme, setTheme, a: 123}}>
        <div className={`App ${theme}`}>
          <p>{theme}</p>
          <div>
            <ChildA/>
          </div>
          <div>
            <ChildB/>
          </div>
        </div>
      </Context.Provider>
  );
}


export default App
