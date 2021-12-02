import React, {useCallback, useMemo} from "react";

// useMemo&&useCallback 和 useCallback作用是一样,只是写法不一样

/**
 * React.memo的作用是如果组件的props不变，那么该组件不会渲染
 *
 * 但是有一个bug
 *
 * 如果props 里传了函数，父组件执行了创建函数，那么函数的地址变化了，仍然会导致子组件渲染
 *
 * 解决方案：
 *
 * 使用 useMemo&&useCallback 第一个参数是()=>value
 * 第二个参数是依赖[m,n]，当m,n变化的时候才会重新执行useMemo缓存的value
 * 如果依赖不变，就重用之前的value
 * 相当于vue 的 computed
 *
 * 注意：
 * 如果value是一个函数，那么需要写成useMemo(()=>x=>log(x),[m])
 * 挺麻烦的，所以有了useCallback，就是useMemo的语法糖
 * 等价于useCallback(x=>log(x),[m])
 */

function App() {
    const [n, setN] = React.useState(0);
    const [m, setM] = React.useState(0);

    const onClick = () => {
        setN(n + 1);
    };

    const onClick2 = () => {
        setM(m + 1);
    };

    // const onClickChild = useMemo&&useCallback(() => {
    //     const fn = div => {
    //         console.log("on click child, m: " + m);
    //         console.log(div);
    //     };
    //     return fn;
    // }, []); // 这里呃 [m] 改成 [n] 就会打印出旧的 m


  // 函数使用useCallback ,函数内部要使用变量，要注意要绑定[变量]，不然会取不到最新值，
    const onClickChild = useCallback(div => {
      console.log("on click child, m: " + m);
      console.log(div);
    },[m])

    return (
        <div className="App">
            <div>
                <button onClick={onClick}>update n {n}</button>
                <button onClick={onClick2}>update m {m}</button>
            </div>
            <Child2 m={m} onClick={onClickChild} />
        </div>
    );
}

function Child(props) {
    console.log("child 执行了");
    console.log("假设这里有大量代码");
    return <div onClick={e => props.onClick(e.target)}>child: {props.m}</div>;
}

// 使用React.memo包裹组件，意味着如果组件的props没有变化，那么组件不会重新渲染
const Child2 = React.memo(Child);

export default App
