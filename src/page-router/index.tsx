import React, { useEffect, useRef, useState } from 'react';
import { BrowserRouter as Router, Switch, Route,useHistory} from 'react-router-dom'
import Component1 from './component1'
import Component2 from './component2'
/**
 * 注意useRef 只有一个current，并且赋值后不会更新App
 * 所以<p>nRef.current</p>是不会变的，如果需要变化，制造一个update API
 *      const update = useState(null)[1]
 *      update(每次传一个不一样的值即可)
 *
 *  当页面有useState执行了，就会渲染更新useRef的值
 */
function App(props: any) {
  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <Component1/>
        </Route>
        <Route exact path="/page">
          <Component2></Component2>
        </Route>
      </Switch>
    </Router>
  );
}

export default App;

