import React, {useEffect} from "react";
import { googleLogin } from "../utils/APIRoutes";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { app } from "../firebase";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f3f4f6;
  padding: 0 1.5rem;
`;

const Card = styled.div`
  background: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border-radius: 0.5rem;
  padding: 2rem;
  width: 100%;
  max-width: 24rem;
`;

const Button = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 0.75rem 1rem;
  background-color: #3b82f6;
  color: white;
  font-weight: 500;
  border: none;
  border-radius: 0.375rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #2563eb;
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.3);
  }
`;

const Icon = styled.svg`
  width: 1.5rem;
  height: 1.5rem;
  margin-right: 0.75rem;
`;

function Login() {
  const navigate = useNavigate();
  const auth = getAuth(app);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token && token !== "undefined") {
      navigate('/');
    }
  }, [localStorage]);

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });

    try {
      const resultFromGoogle = await signInWithPopup(auth, provider);
      const idToken = await resultFromGoogle.user.getIdToken();
      const response = await axios.post(googleLogin, { idToken });
      const { user, accessToken } = response.data;
      localStorage.setItem("accessToken", JSON.stringify({ user, accessToken }));
    } catch (err) {
      if (err.response?.status === 429) {
        alert("Too many login attempts. Please try again later.");
      } else {
        console.error(err);
        alert("An error occurred during login. Please try again.");
      }
    }
  };

  return (
    <Container>
      <Card>
        <Button onClick={handleLogin}>
          <Icon xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
            <path
              fill="#FFC107"
              d="M43.611 20.083h-2.08v-.083H24v8.417h11.185c-1.342 4.35-5.34 7.5-10.185 7.5a11.75 11.75 0 0 1 0-23.5c2.826 0 5.397 1.026 7.403 2.704l6.186-6.186C34.315 5.513 29.419 3.5 24 3.5 12.766 3.5 3.5 12.766 3.5 24S12.766 44.5 24 44.5c11.847 0 21.5-9.653 21.5-21.5 0-1.383-.142-2.734-.389-4.083z"
            />
            <path
              fill="#FF3D00"
              d="M6.306 14.691l6.76 4.955A11.747 11.747 0 0 1 24 12.5c2.826 0 5.397 1.026 7.403 2.704l6.186-6.186C34.315 5.513 29.419 3.5 24 3.5c-7.709 0-14.37 4.208-17.694 10.191z"
            />
            <path
              fill="#4CAF50"
              d="M24 44.5c5.285 0 10.085-2.03 13.693-5.33l-6.49-5.447a11.663 11.663 0 0 1-17.187-5.937l-6.79 5.234C9.731 39.093 16.34 44.5 24 44.5z"
            />
            <path
              fill="#1976D2"
              d="M43.611 20.083h-2.08v-.083H24v8.417h11.185c-1.017 3.298-3.175 6.075-6.297 7.85l.002-.001 6.49 5.447c-.459.426 8.594-6.247 8.594-17.713 0-1.383-.142-2.734-.389-4.083z"
            />
          </Icon>
          Continue with Google
        </Button>
      </Card>
    </Container>
  );
}

export default Login;
