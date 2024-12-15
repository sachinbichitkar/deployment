import React, { useContext, useState } from 'react';
import { Button, Layout } from 'antd';
import Sider from './Sider';
import { AuthContext } from '../Auth/AuthProvider';

const { Header, Content } = Layout;

const MainLayout = ({ children }) => {
   const { user ,logout } = useContext(AuthContext);
   const parsedUser = JSON.parse(user);
  const [isSiderOpen,setIsSiderOpen] = useState(true);
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <div style={{height: '46px',padding: '0 50px',color: 'rgba(0, 0, 0, 0.88)'}}>
<Button type='primary' onClick={logout}>logout</Button>
{/* {parsedUser.UserDetal }  */}
      </div>
      <Layout>
        <div style={{ display: "flex" }}>
          <div style={{ width: isSiderOpen? "350px" : "55px" ,margin:'8px 0px 16px 16px'}}>
            <Sider />
          </div>
          <div style={{ width:isSiderOpen ? "calc(100vw - 350px)" : "calc(100vw - 55px)" }}>
            <Content style={{ 
              padding:'8px 16px',
        overflow: 'auto',
        height: 'calc(100vh - 50px)',
      }}>{children}</Content>
          </div>
        </div>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
