// import React, { useState } from 'react';
//
// function Example() {
//     // 声明一个新的叫做 “count” 的 state 变量
//     const [count, setCount] = useState(1);
//
//     return (
//         <div>
//             <p>You clicked {count} times</p>
//             <button onClick={() => setCount(()=>{
//                 console.log(count);
//                 let temp = count
//                 if(temp > 10){
//                     temp = count + 10
//                 }else{
//                     temp = count + 2
//                 }
//                 return temp
//             })}>
//                 Click me
//             </button>
//         </div>
//     );
// }
// export default Example


import React, { useState, useEffect } from 'react';

function Example() {
    const [count, setCount] = useState(0);

    //相当于 componentDidMount 和 componentDidUpdate:
    useEffect(() => {
        // 使用浏览器的 API 更新页面标题
        document.title = `You clicked ${count} times`;
    });

    const testClick = ()=>{
        console.log(1);
    }

    return (
        <div>
            <p>You clicked {count} times</p>
            <button onClick={testClick}>
                Click me
            </button>
        </div>
    );
}

export default Example
