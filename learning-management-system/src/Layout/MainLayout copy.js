import React from 'react';
import { Layout } from 'antd';
impo
const { Header, Content } = Layout;

const MainLayout = ({ children }) => {
  return (
    <Layout style={{ minHeight: '100vh' }}>
        <Header>Header Content</Header>
      <Layout>
      <Sider />
        <Content style={{ padding: '16px' }}>{children}</Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
