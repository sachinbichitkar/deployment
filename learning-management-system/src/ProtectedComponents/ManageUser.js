import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../Auth/AuthProvider';
import { Button, Input, Layout, Tooltip, Popconfirm, Table, Typography, Space, Modal, Form, Radio, Select, Flex, Result } from 'antd';
import { Content, Footer, Header } from 'antd/es/layout/layout';
import Icon, { FilterFilled, EditOutlined, DeleteOutlined, FilterOutlined, PlusOutlined } from '@ant-design/icons';
import axios from 'axios';
import CONFIG from '../SampleConfig.json'


export default function AdminDashboard() {
  const { Text, Title } = Typography;
  const { userContext, hasCreatePermission, hasDeletePermission, hasUpdatePermission, hasReadPermission } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [dataRoles, setDataRoles] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [popModalObj, setPopModalObj] = useState({});

  const uniqueLastNames = Array.from(new Set(dataSource.map(item => item.LastName.charAt(0).toUpperCase())));
  const lastNameFilters = uniqueLastNames.map(letter => ({
    text: letter,
    value: letter,
  }));

  const onFinish = async (values) => {
     
    try {
      setLoading(true);
      popModalObj.FirstName = values.FirstName;
      popModalObj.LastName = values.LastName;
      popModalObj.PasswordHash = values.PasswordHash;
      popModalObj.Username = values.Username;
      popModalObj.Email = values.Email;
      popModalObj.IsActive = values.IsActive;
      popModalObj.Roles = values.Roles.map(roleId => ({ RoleId: roleId }));
      // Replace with API call
      const response = await fetch(((popModalObj && popModalObj.UserId > 0) ? 'http://localhost:7182/api/EditUser' : 'http://localhost:7182/api/AddUser'), {
        method: (popModalObj && popModalObj.UserId > 0) ? 'PUT' : "post",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(popModalObj),
      });
      const data = await response.json();
      if (data && data.Data && data.StatusCode == 200) {
        await GetData();
      }
      setPopModalObj({});
      setIsEditModalOpen(false);
      setLoading(false);

    } catch {
      setLoading(false);
    }
  };
  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };
  const handleEdit = (record) => {
    console.log("Edit record:", record);
    setPopModalObj(JSON.parse(JSON.stringify(record)));
    setIsEditModalOpen(true);
  };

  const handleEditAPI = () => {
    console.log("Edit record:", popModalObj);
    setPopModalObj({});
    setIsEditModalOpen(false);
  };

  const handleDelete = async (record) => {
    console.log("Delete record:", record);

    try {
      setLoading(true);
      // Call your delete API
      const response = await axios.delete(`http://localhost:7182/api/DeleteUser?userId=${record.UserId}`);

      if (response.status === 200) {
        // Handle success (e.g., remove the record from the table)
        console.log("Record deleted:", record);
        // You can refresh your data or remove the deleted record from the table
        await GetData();
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.error("Delete failed:", error);
    }
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Input
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => confirm()}
          style={{ marginBottom: 8, display: "block" }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button
            type="primary"
            onClick={() => confirm()}
            icon={<FilterFilled />}
            size="small"
            style={{ width: "40%" }}
          >
            Search
          </Button>
          <Button
            onClick={() => {
              clearFilters(); confirm();
            }}
            size="small"
            style={{ width: "40%" }}
          >
            Reset
          </Button>
        </div>
      </div>
    ),
    filterIcon: (filtered) => <FilterFilled style={{ color: filtered ? "--ant-color-primary" : undefined }} />,
    onFilter: (value, record) =>
      record[dataIndex]
        ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
        : "",
  });
  const columns = [
    {
      title: "User Name",
      dataIndex: "Username",
      key: "Username",
      width: "15%",
      ellipsis: true,
      sorter: (a, b) => b.Username.localeCompare(a.Username),
      ...getColumnSearchProps("Username")
    },
    {
      title: "Email",
      dataIndex: "Email",
      key: "Email",
      ellipsis: true,
      sorter: (a, b) => b.Email.localeCompare(a.Email),
      ...getColumnSearchProps("Email")
    },
    {
      title: "First Name",
      dataIndex: "FirstName",
      key: "FirstName",
      width: "15%",
      ellipsis: true,
      sorter: (a, b) => b.FirstName.localeCompare(a.FirstName),
      ...getColumnSearchProps("FirstName")
    },
    {
      title: "Last Name",
      dataIndex: "LastName",
      key: "LastName",
      width: "15%",
      ellipsis: true,
      sorter: (a, b) => b.LastName.localeCompare(a.LastName),
      ...getColumnSearchProps("LastName")
    },
    {
      title: "Roles",
      dataIndex: "Roles",
      key: "Roles",
      width: "20%",
      ellipsis: true,
      render: (roles) => (
        <span>
          {roles.map((role) => role.RoleName).join(", ")}
        </span>
      ),
      sorter: (a, b) => {
        const roleNamesA = a.Roles.map((role) => role.RoleName).join(", ");
        const roleNamesB = b.Roles.map((role) => role.RoleName).join(", ");
        return roleNamesA.localeCompare(roleNamesB);
      },
      filters: dataRoles,
      onFilter: (value, record) => {
        //console.log("999",value,record);
        return record?.Roles?.some(role => value == role?.RoleId);
      }
    },
    {
      title: "Action",
      key: "action",
      align: "center",
      width: "120px",
      render: (_, record) => (
        <Space>{
          hasUpdatePermission(CONFIG.Entities.USER) && <Tooltip title="Edit">
            <Button
              type="link"
              size='small'
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
            />
          </Tooltip>
        }
          {hasDeletePermission(CONFIG.Entities.USER) && <Tooltip title="Delete">
            <Popconfirm
              title="Are you sure to delete this record?"
              onConfirm={() => handleDelete(record)}
              onCancel={() => console.log("Cancel")}
              okText="Yes"
              cancelText="No"
            >
              <Button
                type="link"
                size='small'
                icon={<DeleteOutlined />}
              />
            </Popconfirm>
          </Tooltip>
          }
        </Space>
      ),
    },
  ];

  const GetData = async () => {
    setLoading(true);
    try {
      let isTeacher = false;
      if (localStorage.getItem('role') === 'Teacher') {
        isTeacher = true;
      }
      const response = await fetch(CONFIG.URL.GetAllUsers + `?isTeacher=${isTeacher}`, {
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

  useEffect(() => {
    const fetchData = async () => {
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

        let isTeacher = false;
        if (localStorage.getItem('role') === 'Teacher') {
          isTeacher = true;
        }
        const response = await fetch(CONFIG.URL.GetAllUsers + `?isTeacher=${isTeacher}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });

        const result = await response.json();
        if (result && result.Data && result.StatusCode === 200) {
          // Ensure the data structure is correct
          const formattedData = result.Data.map((item, index) => ({
            ...item,
            key: index, // Ant Design requires a unique `key` for each row
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

    fetchData();
  }, []);

  return (
    <Layout style={{ backgroundColor: 'white' }}>
      <Header style={{ background: 'white', padding: '0 16px' }}>
        <Flex justify={'space-between'} style={{ alignItems: 'baseline' }}>
          <Title level={3} strong style={{ color: "var(--ant-color-primary)" }}>Manage User</Title>
          <Space>
            {hasCreatePermission(CONFIG.Entities.USER) && <Button type="primary" icon={<PlusOutlined />} onClick={() => {
              setPopModalObj({ "Username": null, "Email": null, "FirstName": null, "LastName": null, "isActive": true, "Roles": null });
              setIsEditModalOpen(true);
            }} />
            }
            {
              hasReadPermission(CONFIG.Entities.USER) && <Button type="primary" icon={<FilterOutlined />} />
            }
          </Space>
        </Flex>
      </Header>
      <Content style={{ padding: '16px' }}>
        {
          hasReadPermission(CONFIG.Entities.USER) && <Table dataSource={dataSource} columns={columns} loading={loading} size="small" bordered />
        }
        {
          !hasReadPermission(CONFIG.Entities.USER) && <Result status="403" title="403" subTitle="Sorry, you are not authorized to access this page." />
        }
      </Content>
      {
        isEditModalOpen &&
        <>
          <Modal
            title={<p>Add / Edit User</p>}
            loading={loading}
            open={isEditModalOpen}
            onCancel={() => { setPopModalObj({}); setIsEditModalOpen(false); }}
            footer={null}
          >
            <Form
              name="basic"
              labelCol={{
                span: 8,
              }}
              wrapperCol={{
                span: 16,
              }}
              style={{
                maxWidth: 600,
              }}
              initialValues={{ ...popModalObj, Roles: popModalObj?.Roles?.map(role => role.RoleId) }}
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              autoComplete="off"
            >
              <Form.Item
                label="User Name"
                name="Username"
                rules={[
                  {
                    required: true,
                    message: 'Please input your username!',
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Email"
                name="Email"
                rules={[
                  {
                    required: true,
                    message: 'Please input your Email!',
                  },
                ]}
              >
                <Input />
              </Form.Item>

              {
                !(popModalObj && popModalObj.UserId > 0) &&
                <Form.Item
                  label="PasswordHash"
                  name="PasswordHash"
                  rules={[
                    {
                      required: true,
                      message: 'Please input your Password!',
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              }
              <Form.Item
                label="First Name"
                name="FirstName"
                rules={[
                  {
                    required: true,
                    message: 'Please input your First Name!',
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="Last Name"
                name="LastName"
                rules={[
                  {
                    required: true,
                    message: 'Please input your Last Name!',
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="IsActive"
                name="IsActive" >
                <Radio.Group >
                  <Radio value={true}>Active</Radio>
                  <Radio value={false}>Disable</Radio>
                </Radio.Group>
              </Form.Item>

              <Form.Item
                label="Roles"
                name="Roles" >
                <Select
                  mode="multiple"
                  allowClear
                  style={{
                    width: '100%',
                  }}
                  placeholder="Please select"
                  options={dataRoles}
                />
              </Form.Item>
              <Form.Item label={null} style={{ textAlign: 'end', marginBottom: '12px' }}>
                <Space>
                  <Button type="default" htmlType="reset" onClick={() => { setPopModalObj({}); setIsEditModalOpen(false); }}>
                    Cancel
                  </Button>
                  {
                    hasUpdatePermission(CONFIG.Entities.USER) && <Button type="primary" htmlType="submit">
                      Save
                    </Button>
                  }

                </Space>
              </Form.Item>
            </Form>
          </Modal>
        </>
      }
    </Layout>
  );
}
