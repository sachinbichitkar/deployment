import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../Auth/AuthProvider';
import { Button, Input, Layout, Tooltip, Popconfirm, Table, Typography, Space, Modal, Form, Result, Select, Flex, Row, Col, Card, Statistic, Calendar, Descriptions } from 'antd';
import { Content, Footer, Header } from 'antd/es/layout/layout';
import Icon, { TeamOutlined, BookOutlined, SolutionOutlined } from '@ant-design/icons';
import CONFIG from '../SampleConfig.json'


export default function AdminDashboard() {
  const { Text, Title } = Typography;
  const { userContext, hasCreatePermission, hasDeletePermission, hasUpdatePermission, hasReadPermission } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [dashboardData, setDashboardData] = useState({});
  const [descriptionData, setDescriptionData] = useState([{}]);

  const GetData = async () => {
    try {
      setLoading(true);
      const url = new URL(CONFIG.URL.GetAdminDashboardData);
      const queryParams = { userId: JSON.parse(userContext).UserDetail.UserId };
      Object.keys(queryParams).forEach(key => {
        if (queryParams[key] !== undefined && queryParams[key] !== null) {
          url.searchParams.append(key, queryParams[key]);
        }
      });
      const response = await fetch(url, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });

      const result = await response.json();
      if (result && result.Data && result.StatusCode === 200) {
        //console.log("88888888888",result.Data);
        setDashboardData(result.Data);
        let itemstoupdate = [];
        Object.keys(result.Data.UserModal).forEach(key => {
          if (result.Data.UserModal[key] !== undefined && result.Data.UserModal[key] !== null && key != "Roles") {
            itemstoupdate.push({
              key: `desc-key-${key}`,
              label: key.replace(/([a-z])([A-Z])/g, '$1 $2'),
              children: key === "IsActive" ? JSON.stringify(result.Data.UserModal[key]) : result.Data.UserModal[key], // Convert objects to strings
            });
          }
        });
        setDescriptionData(itemstoupdate);
      } else {
        alert('Error fetching data from API');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    GetData();
  }, []);
  const colors = ["#6C757D", "#20C997", "#FD7E14"];
  const icons = [<TeamOutlined />, <BookOutlined />, <SolutionOutlined />];
  return (
    <Layout style={{ backgroundColor: 'white' }}>
      <Header style={{ background: 'white', padding: '0 16px' }}>
        <Flex justify={'space-between'} style={{ alignItems: 'baseline' }}>
          <Title level={3} strong style={{ color: "var(--ant-color-primary)" }}>Dashboard</Title>
        </Flex>
      </Header>
      <Content style={{ padding: '16px' }}>
        {
          !hasReadPermission(CONFIG.Entities.DASHBOARD) && <Result status="403" title="403" subTitle="Sorry, you are not authorized to access this page." />
        }
        {
          hasReadPermission(CONFIG.Entities.DASHBOARD) && <Row gutter={[24, 32]}>
            {
              dashboardData && dashboardData.AdminUserDetail && dashboardData.AdminUserDetail.map((x, i) => {
                return <Col span={8}>
                  <Card bordered={false} key={'card' + i}>
                    <Statistic
                      title={<Text strong>{x.RoleName}</Text>}
                      value={x.UserCount}
                      valueStyle={{
                        color: colors[i % 3],
                      }}
                      suffix={icons[i % 3]}
                    />
                  </Card>
                </Col>
              })
            }
            <Col span={24}>
              <Descriptions title="User Info" bordered>
                {descriptionData.map((item) => (
                  <Descriptions.Item key={item.key} label={item.label}>
                    {item.children}
                  </Descriptions.Item>
                ))}
              </Descriptions>
            </Col>
          </Row>
        }
      </Content>
    </Layout>
  );
}
