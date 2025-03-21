import React from 'react';
import { Layout } from "antd";
import Sidebar from '../Sidebar';
import { Outlet } from 'react-router-dom';
import './MainLayout.css';

const { Content } = Layout;

const MainLayout = () => {
    return (
        <Layout style={{ minHeight: "100vh" }} className='mainLayout'>
            <div className="shape" />
            <div className="shape2" />
            <Sidebar />
            <Layout>
                <Content className='main-hero'>
                    <Outlet />
                </Content>
            </Layout>
        </Layout>
    );
};

export default MainLayout;
