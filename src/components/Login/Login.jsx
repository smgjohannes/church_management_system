import React, { useState } from 'react';
import './login.css';
import validation from '../../functions/LoginValidation';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [values, setValues] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleInput = (event) => {
    setValues((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validationErrors = validation(values);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length === 0) {
      try {
        const response = await axios.post(
          'http://127.0.0.1:4343/api/v1/login',
          values
        );
        if (response.data.success) {
          const token = response.data.token.access_token;
          localStorage.setItem('token', token);
          navigate('/layout');
        } else {
          setErrors({ server: response.data.message });
        }
      } catch (error) {
        setErrors({ server: 'Login failed. Please try again later.' });
      }
    }
  };

  return (
    <div className='login-container'>
      <div className='content-box'>
        <form className='login-form' onSubmit={handleSubmit}>
          <div className='mb-3'>
            <label htmlFor='email'>
              <strong>Email</strong>
            </label>
            <input
              type='email'
              placeholder='Enter your email'
              name='email'
              value={values.email}
              onChange={handleInput}
            />
            {errors.email && (
              <span className='text-danger'>{errors.email}</span>
            )}
          </div>
          <div className='mb-3'>
            <label htmlFor='password'>
              <strong>Password</strong>
            </label>
            <input
              type='password'
              placeholder='Enter password'
              name='password'
              value={values.password}
              onChange={handleInput}
            />
            {errors.password && (
              <span className='text-danger'>{errors.password}</span>
            )}
          </div>
          {errors.server && (
            <span className='text-danger'>{errors.server}</span>
          )}
          <button type='submit' className='btn btn-success'>
            <strong>Login</strong>
          </button>
          <p>You are agreeing to our terms and policies</p>
          <button className='btn btn-default border'>Create Account</button>
        </form>
      </div>
    </div>
  );
}

export default Login;
