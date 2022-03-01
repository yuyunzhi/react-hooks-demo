import React, { useEffect, useRef, useState } from 'react';
import { HashRouter as Router, Switch, Route} from 'react-router-dom'

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
        <Route path="/">
          <div>页面1</div>
        </Route>
        <Route path="/page">
          <div>页面2</div>
        </Route>
      </Switch>
    </Router>
  );
}

export default App;

