import React from 'react'
import { splitStr } from '../utils/utils.js'

const BaseListItem = ({ onClick, name, value, hidden }) => (
  <div className={`cursor-pointer ${hidden}`} onClick={onClick}>
    <span className="font-semibold capitalize">{splitStr(name)}: </span> {value}
  </div>
)

export default BaseListItem
