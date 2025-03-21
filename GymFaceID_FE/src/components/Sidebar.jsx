import React, { useState } from "react";
import { Layout, Menu } from "antd";
import { UserOutlined, DashboardOutlined, SettingOutlined, ArrowLeftOutlined, ArrowRightOutlined } from "@ant-design/icons";
import { CalendarMonthOutlined, DriveFileRenameOutline, FreeBreakfastOutlined, SmsOutlined } from '@mui/icons-material';
import { useNavigate } from "react-router-dom";
import { useSwipeable } from 'react-swipeable';

import Logo from '../assets/LightMainLogo.png'
import './styles/Sidebar.css'
import LogoutButton from "./Account-Actions/LogoutButton";
const { Sider } = Layout

const Sidebar = () => {
    const [collapsed, setCollapsed] = useState(false);
    const navigate = useNavigate();

    const handlers = useSwipeable({
        onSwipedLeft: () => setCollapsed(true),
        onSwipedRight: () => setCollapsed(false),
        preventDefaultTouchmoveEvent: true,
        trackMouse: false,
    });

    return (
        <Sider collapsible
            collapsed={collapsed}
            onCollapse={setCollapsed}
            trigger={null}
            className="mainLaySidebar" style={{ minHeight: "100vh" }}>
            <div className="logo">
                {collapsed ? "Gym" : <img src={Logo} alt="Logo" />}
            </div>

            <Menu theme="dark" mode="inline" defaultSelectedKeys={["1"]} onClick={(e) => navigate(e.key)}>
                <Menu.Item key="/AdminPage/UserManagement" icon={<FreeBreakfastOutlined style={{ fontSize: "24px" }} />}>
                    User Management
                </Menu.Item>
                <Menu.Item key="/AdminPage/Membershipmanagement" icon={<FreeBreakfastOutlined style={{ fontSize: "24px" }} />}>
                    Membership Management
                </Menu.Item>
                {/*<Menu.Item key="/" icon={<DriveFileRenameOutline style={{ fontSize: "24px" }}/>}>*/}
                {/*  Func 2*/}
                {/*</Menu.Item>*/}
                {/*<Menu.Item key="/" icon={<UserOutlined style={{ fontSize: "24px" }}/>}>*/}
                {/*  Func 3*/}
                {/*</Menu.Item>*/}
                {/*<Menu.Item key="/" icon={<CalendarMonthOutlined style={{ fontSize: "24px" }}/>}>*/}
                {/*  Func 4*/}
                {/*</Menu.Item>*/}
                {/*<Menu.Item key="/" icon={<SmsOutlined style={{ fontSize: "24px" }}/>}>*/}
                {/*  Func 5*/}
                {/*</Menu.Item>*/}
            </Menu>

            <LogoutButton />
            <div
                className="collapseBtn"
                onClick={() => setCollapsed(!collapsed)}
            >
                {collapsed ? <ArrowRightOutlined /> : <ArrowLeftOutlined />}
            </div>
        </Sider>
    )
}

export default Sidebar;