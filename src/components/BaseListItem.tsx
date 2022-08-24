import React from 'react'
import { splitStr } from '../utils/utils.js'

const BaseListItem = ({ name, value }) => {
  return (
    <div className="cursor-pointer">
      <span className="font-semibold capitalize">{splitStr(name)}: </span>{' '}
      {value}
    </div>
  )
}

export default BaseListItem
