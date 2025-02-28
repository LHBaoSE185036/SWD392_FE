import React from 'react'
import LogoutButton from '../../../components/Account-Actions/LogoutButton'
import { Layout } from 'antd'
import Sidebar from '../../../components/Sidebar'
import { Content } from 'antd/es/layout/layout'

export default function HomePage() {
  return (
    <div>
      <Layout style={{ minHeight: "100vh" }} className='mainLayout'>
      <div class="shape" /> <div class="shape2" />
      <Sidebar />
      <Layout>
        <Content className='main-hero'>
          
        </Content>
      </Layout>
    </Layout>
    </div>
  )
}
