import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import Robot from '../assests/robot.gif'

function Welcome({ currentUser }) {
    const [userName, setUserName] = useState('');
    useEffect(() => {
        try {
            const fetchUserName = async () => {
                const user = JSON.parse(localStorage.getItem("accessToken")).user.username;
                setUserName(user)
            }
            fetchUserName();
        }
        catch (err) {
            console.error('Error fetching user data:', err);
        }
    }, [])
    return (

        <Container>
            <img src={Robot} alt="robot" />
            <h1>
                Welcome, <span>{userName}</span>
            </h1>
            <h3>Please select a chat to Start messaging.</h3>
        </Container>
    )
}

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  flex-direction: column;
  img {
    height: 20rem;
  }
  span {
    color: #4e0eff;
  }
`;

export default Welcome