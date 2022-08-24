import React, { FC } from 'react'

type NestedLayoutProps = {
  children: any
}

const NestedLayout: FC<NestedLayoutProps> = ({ children }) => (
  <div className="flex justify-center">
    <div className="w-11/12 lg:w-7/12">{children}</div>
  </div>
)
export default NestedLayout
