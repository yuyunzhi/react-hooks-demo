import React, {useEffect, useRef, useState} from 'react';

/**
 * 注意useRef 只有一个current，并且赋值后不会更新App
 * 所以<p>nRef.current</p>是不会变的，如果需要变化，制造一个update API
 *      const update = useState(null)[1]
 *      update(每次传一个不一样的值即可)
 *
 *  当页面有useState执行了，就会渲染更新useRef的值
 */
function App(props) {

    const nRef = useRef(0)  // {current:0}
    const  [n,setN] = useState(0)

    useEffect(()=>{
        console.log('nRef:',nRef);
        console.log('n:',n);
    })

  useEffect(()=>{
    let timer = setInterval(()=>{
      console.log('setInterval[nRef]',nRef)
    },1000)

    return ()=>{
      console.log('当页面离开的时候执行这段代码');
      clearInterval(timer)
      timer = null
    }
  },[nRef.current])

    return (
        <div className="App">
            <p>nRf</p>
            <p>{nRef.current}</p>
            <p>
                <button onClick={()=>nRef.current=nRef.current + 1}>+1</button>
            </p>
          <br/>
          <p>n</p>
            <p>{n}</p>
            <p>
                <button onClick={()=>setN(n+1)}>+1</button>
            </p>
        </div>
    );
}

export default App;

