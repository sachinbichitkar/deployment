import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../Auth/AuthProvider';
import { Button, Input, Layout, Tooltip, Result, Table, Typography, Space, Modal, Form, Radio, Select, Flex, Checkbox } from 'antd';
import { Content, Footer, Header } from 'antd/es/layout/layout';
import Icon, { FilterFilled, EditOutlined, DeleteOutlined, FilterOutlined, PlusOutlined } from '@ant-design/icons';
import axios from 'axios';
import CONFIG from '../SampleConfig.json';


export default function Permissions() {
  const { Text, Title } = Typography;
  const { userContext, hasUpdatePermission, hasReadPermission } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [dataRoles, setDataRoles] = useState([]);
  const [selectedRoleId, setSelectedRoleId] = useState(1);

  const permissionNames = ["CREATE", "READ", "UPDATE", "DELETE"];
  const columns = [
    {
      title: "Entity Name",
      dataIndex: "EntityName",
      key: "EntityName",
      ellipsis: true
    },
    ...permissionNames.map((permission) => ({
      title: permission,
      dataIndex: permission,
      width: "15%",
      key: permission,
      align: "center",
      render: (_, record) => {
        // Check if the permission exists in the record's Permissions array
        const hasPermission = record.Permissions?.some(
          (perm) => perm.PermissionName === permission && perm.IsEnabled
        );
        return (
          hasUpdatePermission(CONFIG.Entities.PERMISSION) && <Checkbox checked={hasPermission} onChange={(e) => handleCheckboxPermissionChange(e.target.checked, record.EntityName, permission)} disabled={('PERMISSION' === record.EntityName)}>
          </Checkbox>
        );
      },
    })),
  ];
  const handleCheckboxPermissionChange = async (value, EntityName, permission) => {
    let reqObj = {
      RoleId: selectedRoleId,
      IsEnabled: value,
      PermissionType: permission,
      EntityName: EntityName
    };
    const response = await fetch(CONFIG.URL.SetRolePermission, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reqObj),
    });
    const data = await response.json();
    if (data.Data) {
      GetData(selectedRoleId);
    }
  };
  const GetData = async (val) => {
    setLoading(true);
    try {
      console.log("selectedRoleId ", val);
      const response = await fetch(CONFIG.URL.GetRolePermission + `?roleId=${val}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      const result = await response.json();
      if (result && result.Data && result.StatusCode === 200) {
        const formattedData = result.Data.map((item, index) => ({
          ...item,
          key: index,
        }));
        console.warn(formattedData);
        setDataSource(formattedData);
      } else {
        alert('Error fetching data from API');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const FetchRoles = async () => {
    setLoading(true);
    try {
      const roleresponse = await fetch(CONFIG.URL.GetAllRoles, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      const roleresult = await roleresponse.json();
      if (roleresult && roleresult.Data && roleresult.StatusCode === 200) {
        const formattedData = roleresult.Data.map((item, index) => ({
          RoleId: item.RoleId,
          label: item.RoleName,
          text: item.RoleName,
          value: item.RoleId, // Ant Design requires a unique `key` for each row
        }));
        setDataRoles(formattedData);
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

    FetchRoles();
    GetData(selectedRoleId);
  }, []);

  return (
    <Layout style={{ backgroundColor: 'white' }}>
      <Header style={{ background: 'white', padding: '0 16px' }}>
        <Flex justify={'space-between'} style={{ alignItems: 'baseline' }}>
          <Title level={3} strong style={{ color: "var(--ant-color-primary)" }}>Manage Permissions</Title>
          {
            hasReadPermission(CONFIG.Entities.PERMISSION) && <Select placeholder="Select Role" defaultValue={selectedRoleId} options={dataRoles} onChange={(val) => { setSelectedRoleId(val); GetData(val); }} />
          }
        </Flex>
      </Header>
      <Content style={{ padding: '16px' }}>
        {
          hasReadPermission(CONFIG.Entities.PERMISSION) && <Table dataSource={dataSource} columns={columns} loading={loading} size="small" bordered rowKey={(record) => record.EntityId} />
        }
        {
          !hasReadPermission(CONFIG.Entities.PERMISSION) && <Result status="403" title="403" subTitle="Sorry, you are not authorized to access this page." />
        }
      </Content>
    </Layout>
  );
}
