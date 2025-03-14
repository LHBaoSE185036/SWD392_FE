import React from 'react'

import { Button, Layout, Menu, theme, Badge, ConfigProvider, Dropdown } from "antd"
import Sidebar from '../Sidebar';
import UserManagement from '../../pages/Admin/UserManagement/UserManagement';
import './MainLayout.css'

const { Sider, Content } = Layout;

const MainLayout = () => {

  return (
    <Layout style={{ minHeight: "100vh" }} className='mainLayout'>
      <div class="shape" /> <div class="shape2" />
      <Sidebar />
      <Layout>
        <Content className='main-hero'>
          <UserManagement />
        </Content>
      </Layout>
    </Layout>
  )
}

export default MainLayout;