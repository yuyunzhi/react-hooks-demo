import React, {useEffect, useState} from 'react';

/**
 * 每次render后都会运行useEffect
 *
 * 用途：
 * componentDidMount使用，[]作第二个参数
 * componentDidUpdate使用，可指定依赖
 * componentWillUnmount使用,通过return
 * 以上三种用途同时存在
 *
 * 多个useEffect按照顺序依次执行
 *
 * 注意：useLayoutEffect的区别在于
 * useLayoutEffect在渲染页面 前执行 0->1不闪烁，
 * useEffect在渲染页面后 执行  0->1用户会看到0，然后变成1
 * 由于前端应该尽早给用户看到页面，所以建议使用 useEffect&&useLayoutEffect
 */

function App() {

    const [n,setN] = useState(0)

    const onClick = ()=>{
        setN(i=>i+1)
    }

    useEffect(()=>{
        console.log("只在第一次渲染后执行这句话")
    },[])

    useEffect(()=>{
        console.log("任何一个state状态变化，第一、二、三……次渲染后执行这句话")
    })

    useEffect(()=>{
        console.log("第一次，及n变化了才执行这句话")
    },[n])

    useEffect(()=>{
        let timer = setInterval(()=>{
            console.log('setInterval',n)
        },1000)

        return ()=>{
            console.log('当页面离开的时候执行这段代码');
            clearInterval(timer)
            timer = null
        }
    },[n])
    return (
        <div>
            n:{n}
            <button onClick={onClick}>+1</button>
        </div>
    );
}

export default App
