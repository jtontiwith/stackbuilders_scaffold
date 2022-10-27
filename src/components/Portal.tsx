import React from 'react'
import ReactDOM from 'react-dom'
import BaseDropdown from './BaseDropdown'

const Portal = () => {
  return ReactDOM.createPortal(
    <div>portal here</div>,
    document.querySelector('#portal')
  )
}

export default Portal
