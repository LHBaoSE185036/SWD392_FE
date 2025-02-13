import React, { useState } from "react";
import { Layout, Menu } from "antd";
import { UserOutlined, DashboardOutlined, SettingOutlined, ArrowLeftOutlined, ArrowRightOutlined } from "@ant-design/icons";
import { CalendarMonthOutlined, DriveFileRenameOutline, FreeBreakfastOutlined, SmsOutlined } from '@mui/icons-material';
import { useNavigate } from "react-router-dom";
import { useSwipeable } from 'react-swipeable';

import Logo from '../assets/MainLogo.png'
import './styles/Sidebar.css'
const {Sider} = Layout

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
        {collapsed ? "Gym" : <img src={Logo} alt="Logo" /> }
      </div>

      <Menu theme="dark" mode="inline" defaultSelectedKeys={["1"]} onClick={(e) => navigate(e.key)}>
        <Menu.Item key="/" icon={<FreeBreakfastOutlined style={{ fontSize: "24px" }}/>}>
          Func 1
        </Menu.Item>
        <Menu.Item key="/2" icon={<DriveFileRenameOutline style={{ fontSize: "24px" }}/>}>
          Func 2
        </Menu.Item>
        <Menu.Item key="/3" icon={<UserOutlined style={{ fontSize: "24px" }}/>}>
          Func 3
        </Menu.Item>
        <Menu.Item key="/4" icon={<CalendarMonthOutlined style={{ fontSize: "24px" }}/>}>
          Func 4
        </Menu.Item>
        <Menu.Item key="/5" icon={<SmsOutlined style={{ fontSize: "24px" }}/>}>
          Func 5
        </Menu.Item>
      </Menu>

      <div 
        className="collapseBtn"
        onClick={() => setCollapsed(!collapsed)}
      >
        {collapsed ?  <ArrowRightOutlined /> : <ArrowLeftOutlined /> }
      </div>
    </Sider>
  )
}

export default Sidebar;