import React from 'react';

function Loading ({name,age,family}){

    return (
        <div className="wrapper">
            <div>你好:{name}</div>
            {age>10? <div>你的年龄是：{age}</div>:<div>你的年龄是小于10岁</div>}
            <div>你有{family}</div>
        </div>
    )

}

export default Loading
