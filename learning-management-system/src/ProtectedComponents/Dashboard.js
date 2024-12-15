import React, { useContext } from 'react'
import TeacherDashboard from './TeacherDashboard';
import StudentDashboard from './StudentDashboard';
import AdminDashboard from './AdminDashboard';

export default function Dashboard() {
  const user = localStorage.getItem('role');
  let fragment ;
  if(user === 'Student'){
  fragment = <StudentDashboard></StudentDashboard>
  }
  else if(user === 'Teacher'){
    
    fragment = <TeacherDashboard></TeacherDashboard>
  }
  else if(user === 'Admin'){
    
    fragment = <AdminDashboard></AdminDashboard>
  }
  return (
    <div>{ fragment }</div>
  )
}
