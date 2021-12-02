import React, {useContext} from "react";
import {Context} from "../index";

function ChildB() {
  const {setTheme} = useContext(Context)
  return (
      <div>
        <button onClick={() => setTheme("blue")}>blue</button>
      </div>
  )
}

export default ChildB
