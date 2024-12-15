// import React, { useState, useContext } from 'react';
// import { AuthContext } from './AuthProvider';
// import { useNavigate } from 'react-router-dom';

// const Login = () => {
//   const navigate = useNavigate();
//   const { login } = useContext(AuthContext);
//   const [credentials, setCredentials] = useState({ Username: '', PasswordHash: '' });

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     // console.log(e.target,credentials.username);
//     setCredentials((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     let result = await login(credentials);
//     if (result.StatusCode === 200) {
//       navigate('/');
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit}>
//       <div>
//         <label>Username:</label>
//         <input name="Username" value={credentials.Username} onChange={handleChange} />
//       </div>
//       <div>
//         <label>Password:</label>
//         <input name="PasswordHash" type="password" value={credentials.PasswordHash} onChange={handleChange} />
//       </div>
//       <button type="submit">Login</button>
//     </form>
//   );
// };

// export default Login;
import React, { useState, useContext } from 'react';
import { AuthContext } from './AuthProvider';
import { useNavigate } from 'react-router-dom';
import './Login.css'

const Login = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [credentials, setCredentials] = useState({ Username: '', PasswordHash: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let result = await login(credentials);
    if (result.StatusCode === 200) {
      navigate('/');
    }
  };

  return (
    <div className="login-page">
      <form className="login-form" onSubmit={handleSubmit}>
        <h1>Login</h1>
        <div className="form-group">
          <label>Username:</label>
          <input
            name="Username"
            value={credentials.Username}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Password:</label>
          <input
            name="PasswordHash"
            type="password"
            value={credentials.PasswordHash}
            onChange={handleChange}
          />
        </div>
        <button className="login-button" type="submit">
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
