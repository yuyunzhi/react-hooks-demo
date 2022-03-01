import React from "react";
import useAsync from '../hooks/useAsync'


function Users() {
  const {state} = useAsync('/user', (response) => {
    return {type: "setUser", user: response}
  })

  return (
      <div>
        <h1>个人信息</h1>
        <div>name: {state.user ? state.user.name : ""}</div>
      </div>
  );
}

export default Users
