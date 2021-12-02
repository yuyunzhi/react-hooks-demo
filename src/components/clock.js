import React from 'react';

class Clock extends React.Component{
    constructor(props){
        super(props)
        this.state = {date:new Date()}
    }
    componentDidMount() {
        console.log('初始化')

        this.timerID=setInterval(()=>{
            this.tick()
        },1000)
    }

    componentWillUnmount() {
        console.log('结束')
        clearInterval(this.timerID);
    }
    tick(){
        this.setState({date:new Date()})
    }
    render(){
        return (
            <div>
                <h1>Hello, world!</h1>
                <h2>It is {this.state.date.toLocaleTimeString()}</h2>
            </div>
        )
    }
}

export default Clock
