import React, {useContext} from "react";
import {Context} from "../index";

function ChildA() {
  const args= useContext(Context)
  console.log(args);
  const {theme,setTheme,a} = args
  return (
      <div>
        <button onClick={() => setTheme("red")}>red</button>
      </div>
  )
}

export default ChildA
