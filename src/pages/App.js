import React, {forwardRef, useMemo, useRef} from "react";
import useList from '../useList/useList'

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
  const [list, addItem, deleteIndex] = useList()
  console.log('list', list);

  const onClick = () => {
    setN(n + 1);
  };

  const onClick2 = () => {
    setM(m + 1);
  };
  const onClickChild = useMemo(() => {
    const fn = div => {
      console.log("on click child, m: " + m);
      console.log(div);
    };
    return fn;
  }, [m]); // 这里呃 [m] 改成 [n] 就会打印出旧的 m

  return (
      <div className="App">
        <div>
          {list}
          <button onClick={onClick}>update n {n}</button>
          <button onClick={onClick2}>update m {m}</button>
        </div>
        <Child2 data={m} onClick={onClickChild}/>
      </div>
  );
}

function Child(props) {
  console.log("child 执行了");
  return <div onClick={e => props.onClick(e.target)}>child: {props.data}</div>;
}

const Child2 = React.memo(Child);
export default App
