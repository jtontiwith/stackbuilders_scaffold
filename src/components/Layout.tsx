import React, { FC } from 'react'
// import AppHeader from '../components/AppHeader'

type LayoutProps = {
  children: any
}

const Layout: FC<LayoutProps> = ({ children, ...props }) => {
  return (
    <>
      <div id="main-layout" className="px-6 mx-auto max-w-7xl lg:px-8 mt-10">
        {' '}
        {/* <AppHeader /> */}
        {children}
      </div>
    </>
  )
}

export default Layout
