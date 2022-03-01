import React from 'react'
import { useHistory } from 'react-router-dom'

const Component2 = () => {
  const history = useHistory()
  return (
    <div onClick={() => {
      history.push('/')
    }}>
      页面2
    </div>
  )
}

export default Component2
