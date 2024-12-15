import React, { useContext } from 'react'
import { AuthContext } from '../Auth/AuthProvider';
import { useNavigate } from 'react-router-dom';
import { Menu} from 'antd';
import Icon, {  HomeOutlined ,SettingOutlined,TeamOutlined,AuditOutlined } from '@ant-design/icons';
export default function Sider() {
   //const { userContext } = useContext(AuthContext);
   const userContext = JSON.parse(localStorage.getItem('usercontext'));
   const navigate = useNavigate();
   const onClick = (e) => {
     const { RouterLink } = e;
     navigate(`${e.item.props.RouterLink}`);
     //console.log(e.item.props.RouterLink +'------------'+'click ', e);
     //navigator()
   };
   const iconMap = {
    "dashboard-icon": <HomeOutlined />,
    "user-icon": <SettingOutlined />,
    "team":<TeamOutlined />,
    "permission":<AuditOutlined />
  };
  const transformMenuData = (menus) => {
    // return menus.map(menu => ({
    //   key: menu.MenuId,
    //   label: menu.MenuName,
    //   icon: iconMap[menu.Icon] || null, // Map icon or set null if not available
    //   children: menu.SubMenu ? transformMenuData(menu.SubMenu) : undefined, // Recursively handle submenus
    //   RouterLink: menu.MenuRoute,
    // }));
    return menus.map(menu => {
      const transformedMenu = {
        key: menu.MenuId,
        label: menu.MenuName,
        icon: iconMap[menu.Icon] || null, // Map icon or set null if not available
        RouterLink: menu.MenuRoute,
      };
      if (menu.SubMenu && menu.SubMenu.length > 0) {
        // Only add `children` if submenus exist
        transformedMenu.children = transformMenuData(menu.SubMenu);
      }
      return transformedMenu;
    });
  }

   const menuItems = transformMenuData(userContext.Menus);
   return (
     <Menu
       onClick={onClick}
       style={{
         width: "100%",
         borderRadius:"0px",
         height:'calc(100vh - 70px)',
         padding:'16px'
       }}
       mode="inline" 
       items={menuItems}
     />
   );
}
