import { link } from 'fs'
import React from 'react'
import { useState } from 'react'

const BaseList = ({ children }) => {
  return <dl>{children}</dl>
}

export default BaseList
