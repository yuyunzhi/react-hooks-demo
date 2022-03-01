import React from 'react'
import {useHistory} from 'react-router-dom'

const Component1 = () => {
  const history = useHistory()
  return (
    <div onClick={() => {
      history.push('/page')
    }}>
      页面1
    </div>
  )
}

export default Component1
