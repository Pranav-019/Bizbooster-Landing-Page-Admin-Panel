import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './css/Login.css';
import {
  MDBContainer,
  MDBCol,
  MDBRow,
  MDBBtn,
  MDBIcon,
  MDBInput,
  MDBCheckbox,
} from 'mdb-react-ui-kit';

function Login() {
  const [userID, setUserID] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate(); // Hook for navigation

  const handleLogin = async () => {
    if (!userID || !password || !role) {
      setMessage('Please fill in all fields.');
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/users/getUser/${userID}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'User not found.');
      }

      // Check for role mismatch
      if (data.role !== role) {
        setMessage('Invalid role for the provided User ID.');
        return;
      }

      // Validate password
      if (data.password === password) {
        // On successful login, store the auth token in localStorage
        localStorage.setItem('authToken', 'your-auth-token'); // Replace with actual token if needed
        setMessage('Login successful!');
        setTimeout(() => {
          navigate('/'); // Navigate to App.js (Home page) after a short delay
        }, 1000); // Short delay for the user to see the success message
      } else {
        setMessage('Incorrect password. Please try again.');
      }
    } catch (error) {
      setMessage(error.message || 'An error occurred. Please try again.');
    }
  };

  return (
    <MDBContainer fluid className="p-3 my-5 h-custom">
      <MDBRow>
        <MDBCol col="10" md="6">
          <img
            src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp"
            className="img-fluid"
            alt="Login Illustration"
          />
        </MDBCol>

        <MDBCol col="4" md="6">
          <div className="d-flex flex-row align-items-center justify-content-center">
            <p className="lead fw-normal mb-0 me-3">Sign in with</p>
            <MDBBtn floating size="md" tag="a" className="me-2">
              <MDBIcon fab icon="facebook-f" />
            </MDBBtn>
            <MDBBtn floating size="md" tag="a" className="me-2">
              <MDBIcon fab icon="twitter" />
            </MDBBtn>
            <MDBBtn floating size="md" tag="a" className="me-2">
              <MDBIcon fab icon="linkedin-in" />
            </MDBBtn>
          </div>

          <div className="divider d-flex align-items-center my-4">
            <p className="text-center fw-bold mx-3 mb-0">Or</p>
          </div>

          <MDBInput
            wrapperClass="mb-4"
            label="User ID"
            id="userID"
            type="text"
            size="lg"
            value={userID}
            onChange={(e) => setUserID(e.target.value)}
          />
          <MDBInput
            wrapperClass="mb-4"
            label="Password"
            id="password"
            type="password"
            size="lg"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <MDBInput
            wrapperClass="mb-4"
            label="Role (CRM, ADMIN, WEB, etc.)"
            id="role"
            type="text"
            size="lg"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          />

          <div className="d-flex justify-content-between mb-4">
            <MDBCheckbox name="flexCheck" value="" id="flexCheckDefault" label="Remember me" />
            <a href="#!">Forgot password?</a>
          </div>

          <div className="text-center text-md-start mt-4 pt-2">
            <MDBBtn className="mb-0 px-5" size="lg" onClick={handleLogin}>
              Login
            </MDBBtn>
            <p className="small fw-bold mt-2 pt-1 mb-2">
              Don't have an account? <a href="#!" className="link-danger">Register</a>
            </p>
            {message && <p className={`mt-2 ${message.includes('successful') ? 'text-success' : 'text-danger'}`}>{message}</p>}
          </div>
        </MDBCol>
      </MDBRow>

      <div className="d-flex flex-column flex-md-row text-center text-md-start justify-content-between py-4 px-4 px-xl-5 bg-primary">
        <div className="text-white mb-3 mb-md-0">Copyright © 2020. All rights reserved.</div>
        <div>
          <MDBBtn tag="a" color="none" className="mx-3" style={{ color: 'white' }}>
            <MDBIcon fab icon="facebook-f" size="md" />
          </MDBBtn>
          <MDBBtn tag="a" color="none" className="mx-3" style={{ color: 'white' }}>
            <MDBIcon fab icon="twitter" size="md" />
          </MDBBtn>
          <MDBBtn tag="a" color="none" className="mx-3" style={{ color: 'white' }}>
            <MDBIcon fab icon="google" size="md" />
          </MDBBtn>
          <MDBBtn tag="a" color="none" className="mx-3" style={{ color: 'white' }}>
            <MDBIcon fab icon="linkedin-in" size="md" />
          </MDBBtn>
        </div>
      </div>
    </MDBContainer>
  );
}

export default Login;
