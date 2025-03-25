import React, { useState } from "react";
import { Layout, Menu } from "antd";
import { UserOutlined, DashboardOutlined, SettingOutlined, ArrowLeftOutlined, ArrowRightOutlined } from "@ant-design/icons";
import PersonIcon from '@mui/icons-material/Person';
import CardMembershipIcon from '@mui/icons-material/CardMembership';
import SupervisedUserCircleIcon from '@mui/icons-material/SupervisedUserCircle';
import BusinessIcon from '@mui/icons-material/Business';
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

    const handleLogoClick = () => {
        navigate("/");
    };

    return (
        <Sider
            collapsible
            collapsed={collapsed}
            onCollapse={setCollapsed}
            trigger={null}
            className="mainLaySidebar"
            style={{ minHeight: "100vh" }}
        >
            <div
                className="logo"
                onClick={handleLogoClick}
                style={{ cursor: 'pointer' }}
            >
                {collapsed ? "Gym" : <img src={Logo} alt="Logo" />}
            </div>
            <Menu
                theme="dark"
                mode="inline"
                defaultSelectedKeys={["1"]}
                onClick={(e) => navigate(e.key)}
            >
                <Menu.Item key="/AdminPage/UserManagement" icon={<PersonIcon style={{ fontSize: "24px" }} />}>
                    User Management
                </Menu.Item>
                <Menu.Item key="/AdminPage/MembershipManagement" icon={<CardMembershipIcon style={{ fontSize: "24px" }} />}>
                    Membership Management
                </Menu.Item>
                <Menu.Item key="/AdminPage/AccountManagement" icon={<SupervisedUserCircleIcon style={{ fontSize: "24px" }} />}>
                    Account Management
                </Menu.Item>
                <Menu.Item key="/AdminPage/CustomerMembershipManagement" icon={<BusinessIcon style={{ fontSize: "24px" }} />}>
                    Customer Membership Managment
                </Menu.Item>
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