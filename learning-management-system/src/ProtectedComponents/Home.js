import React, { useContext } from 'react'
import { AuthContext } from '../Auth/AuthProvider';
import './Home.css';
import { useNavigate } from 'react-router-dom';
import { Button } from 'antd';

const Card = ({roleId, imgSrc, title }) => {
  const navigate = useNavigate();
  const { UpdateUserContext,user } = useContext(AuthContext);
  async function navigateUser() {
    localStorage.setItem('role', title);

    const url = new URL('http://localhost:7182/api/SelectRole');
    const queryParams = { roleId:roleId, userId: JSON.parse(user).UserDetal.UserId };
    Object.keys(queryParams).forEach(key => {
      if (queryParams[key] !== undefined && queryParams[key] !== null) {
        url.searchParams.append(key, queryParams[key]);
      }
    });
    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' } 
    });
    const data = await response.json();
    console.log(data);
    if (data && data.StatusCode == 200 && data.Data) { 
      console.log(data.Data);
      UpdateUserContext(JSON.stringify(data.Data));
    } 
    navigate('/dashboard');
  }
  return (
    <div className="card" onClick={navigateUser}>
      <img src={imgSrc} alt={title} className="card-img" />
      <h3 className="card-title">{title}</h3>
    </div>
  );
};

export default function Home() {
  const { user,logout } = useContext(AuthContext);
  const parsedUser = JSON.parse(user);
  return (<React.Fragment>
    <Button onClick={()=>logout()} type='primary' >Logout</Button>
    <div className="card-container">
      {parsedUser && parsedUser.UserRoles && parsedUser.UserRoles.map((card, index) => (
        <Card key={card.RoleId} roleId={card.RoleId} imgSrc={card.Description} title={card.RoleName} />
      ))}
    </div>
    </React.Fragment>
  );
}
