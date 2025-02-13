import React from 'react'
import { Button, Layout, Menu, theme, Badge, ConfigProvider, Dropdown } from "antd"
import Sidebar from '../Sidebar';
import UserManagement from '../../pages/Admin/UserManagement/UserManagement';
import './MainLayout.css'

const { Sider, Content } = Layout;

const MainLayout = () => {
  return (
    <Layout style={{ minHeight: "100vh" }} className='mainLayout'>
      <Sidebar />
      <Layout>
        <Content style={{ marginLeft: "200px" }}>
          <UserManagement />
        </Content>
      </Layout>
    </Layout>
  )
}

export default MainLayout;