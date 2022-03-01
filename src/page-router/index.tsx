import React from 'react';
import { BrowserRouter as Router, Switch, Route,useHistory} from 'react-router-dom'
import Component1 from './component1'
import Component2 from './component2'


function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <Component1/>
        </Route>
        <Route exact path="/page">
          <Component2 />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;

