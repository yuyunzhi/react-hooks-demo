import React, {useState} from 'react';
import "./chess-board.css"

const Cell = function (props) {
    // let [text ,setText] = React.useState("")
    // const onClickButton = () =>{
    //     setText('x')
    // }
    return (
        <div className="cell" onClick={props.onClick}> {props.text}</div>
    )
}


function ChessBoard () {
    const [cells,setCells] = useState([
        [1,2,3],
        [4,5,6],
        [7,8,9],
    ])
    const [n , setN] = useState(0)
    const [finish,setFinsih] = useState(false)
    const tell = (cells)=> {

        for(let i=0;i<3;i++){
            if(cells[i][0] === cells[i][1] && cells[i][1]===cells[i][2] && cells[i][0]!==null){
                console.log(cells[i][0],'赢了');
                setFinsih(true)
                break;
            }
        }
        for(let i=0;i<3;i++){
            if(cells[0][i] === cells[1][i] && cells[1][i]===cells[2][i] && cells[0][i]!==null){
                console.log(cells[0][i],'赢了');
                setFinsih(true)
                break;
            }
        }

    }
    const onClick = (row,col) =>{

        setN(n+1)

        const copy = JSON.parse(JSON.stringify(cells))
        copy[row][col] = n%2 ===0 ?'x':'o'
        setCells(copy)

        tell(copy)
    }
    return (
        <div>
            <div>n:{n}</div>
            {
                cells.map((items,row)=>{
                    return (<div className="row">
                        {items.map((cell,col)=>{
                            return (<Cell text={cell} onClick={()=>onClick(row,col)}/>  )
                        })}
                    </div>)

                })
            }
            {
                finish?<div>game over</div>:null
            }

        </div>
    )
}


export default ChessBoard
