import React from 'react'

const ListItemControl = ({ onClick, children }) => {
  return (
    <a href="#" onClick={onClick}>
      {children}
    </a>
  )
}

export default ListItemControl
