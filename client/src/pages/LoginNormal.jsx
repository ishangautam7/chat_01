import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { Link, useNavigate } from 'react-router-dom'
import Logo from '../assests/logo.svg'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios"
import {loginRoute} from "../utils/APIRoutes.js"

function Login() {
  const navigate = useNavigate();
  const [values, setValues] = useState({
    username: '',
    email: '',
    password: '',
    confirmpassword: ''
  })
  const toastOptions = {
    position: 'bottom-right',
    autoClose: 4000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark"
  }

  useEffect(()=>{
    const token = localStorage.getItem('accessToken').accessToken
    if(token && token!=="undefined"){
      navigate('/')
    }
  },[])
  
  const handleSubmit = async (event) => {
    event.preventDefault();
    if(handleValidation()){
      const { password, username } = values;
      const {data} = await axios.post(loginRoute, {
        username, password
      })
      if(data.status === false){
        toast.error(data.msg, toastOptions)
      }
      else if(data.status === true){
        localStorage.setItem('accessToken', JSON.stringify(data.user))
        navigate('/')
      }
    }
  }

  const handleChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value })
  }

  const handleValidation = () => {
    const { password, username } = values;

    if(username === ""){
      toast.error("Username cannot be empty", toastOptions)
      return false;
    }
    else if(password === "" ){
      toast.error("Password cannot be empty", toastOptions)
      return false
    }
    return true
  }

  return (
    <div>
      <FormContainer>
        <form onSubmit={(event) => handleSubmit(event)}>
          <div className="brand">
            <img src={Logo} alt="Logo" />
            <h1>Snappy</h1>
          </div>

          <input type="text" name="username" id="username" placeholder='Username' min="3" onChange={e => handleChange(e)} />
          <input type="text" name="password" id="passwword" placeholder='Passwword' min="8" onChange={e => handleChange(e)} />
          <button type="submit">Login</button>
          <span>Dont Have an account ? <Link to='/register'>Create One</Link></span>
        </form>
      </FormContainer>

      <ToastContainer></ToastContainer>
    </div>
  )
}

const FormContainer = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background-color: #131324;
  .brand {
    display: flex;
    align-items: center;
    gap: 1rem;
    justify-content: center;
    img {
      height: 5rem;
    }
    h1 {
      color: white;
      text-transform: uppercase;
    }
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    background-color: #00000076;
    border-radius: 2rem;
    padding: 3rem 5rem;
  }
  input {
    background-color: transparent;
    padding: 1rem;
    border: 0.1rem solid #4e0eff;
    border-radius: 0.4rem;
    color: white;
    width: 100%;
    font-size: 1rem;
    &:focus {
      border: 0.1rem solid #997af0;
      outline: none;
    }
  }
  button {
    background-color: #4e0eff;
    color: white;
    padding: 1rem 2rem;
    border: none;
    font-weight: bold;
    cursor: pointer;
    border-radius: 0.4rem;
    font-size: 1rem;
    text-transform: uppercase;
    &:hover {
      background-color: #4e0eff;
    }
  }
  span {
    color: white;
    text-transform: uppercase;
    a {
      color: #4e0eff;
      text-decoration: none;
      font-weight: bold;
    }
  }
`;

export default Login