import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { useNavigate } from 'react-router-dom'
import loader from '../assests/loader.gif'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios"
import { setAvatarRoute } from "../utils/APIRoutes.js"
import { Buffer } from 'buffer'

function SetAvatar() {

    const api = 'https://api.multiavatar.com/45678945'
    const navigate = useNavigate();
    const [avatars, setAvatars] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [selectedAvatar, setSelectedAvatar] = useState(undefined)

    const toastOptions = {
        position: 'bottom-right',
        autoClose: 4000,
        pauseOnHover: true,
        draggable: true,
        theme: "dark"
    }

    useEffect(() => {
        const checkUser = async () => {
            if (!localStorage.getItem("chat-app-user")) {
                navigate("/login");
            }
        };
    
        checkUser();
    }, [navigate]);

    const setProfilePicture = async () => {
        if (selectedAvatar === undefined) {
            toast.error("Please Select an Avatar", toastOptions)
        }
        else{
            const userData = localStorage.getItem("chat-app-user")

            if(!userData){
                toast.error("User not found");
                navigate('/login');
                return;
            }

            try{
                const user = JSON.parse(userData);
                const { data } = await axios.post(`${setAvatarRoute}/${user._id}`, {
                    image: avatars[selectedAvatar]
                });

                if(data.isSet){
                    user.isAvatarImageSet = true;
                    user.avatarImage = data.image;
                    localStorage.setItem("chat-app-user", JSON.stringify(user))
                    navigate('/')
                }else{
                    toast.error("Error setting avatar. Please try again", toastOptions)
                }
            }catch(err){
                toast.error("User not found");
                navigate('/login');
                return;
            }


        }
    }

    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    useEffect(() => {
        const fetchAvatars = async () => {
            const data = [];
            for (let i = 0; i < 4; i++) {
                try {
                    const image = await axios.get(`${api}/${Math.round(Math.random() * 1000)}`);
                    const buffer = Buffer.from(image.data);
                    data.push(buffer.toString('base64'));
                    await delay(1000);
                } catch (error) {
                    console.error('Error fetching avatar:', error);
                }
            }
            setAvatars(data);
            setIsLoading(false);
        };

        fetchAvatars();
    }, []);


    return (
        <>
            {
                isLoading ? <Container><img src={loader} alt={loader}></img></Container> :

                    <Container>
                        <div className='title-container'>
                            <h1>
                                Pick an avatar as your profile picture
                            </h1>
                        </div>

                        <div className='avatars'>
                            {
                                avatars.map((avatar, index) => {
                                    return (
                                        <div key={index} className={`avatar ${selectedAvatar === index ? "selected" : ""}`}>
                                            <img src={`data:image/svg+xml;base64,${avatar}`} alt="avatar" onClick={() => setSelectedAvatar(index)} />
                                        </div>
                                    )
                                })
                            }
                        </div>

                        <button className='submit-btn' onClick={setProfilePicture}>Set as Profile Picture</button>
                    </Container>
            }
            <ToastContainer></ToastContainer>
        </>
    )
}

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 3rem;
  background-color: #131324;
  height: 100vh;
  width: 100vw;

  .loader {
    max-inline-size: 100%;
  }

  .title-container {
    h1 {
      color: white;
    }
  }
  .avatars {
    display: flex;
    gap: 2rem;

    .avatar {
      border: 0.4rem solid transparent;
      padding: 0.4rem;
      border-radius: 5rem;
      display: flex;
      justify-content: center;
      align-items: center;
      transition: 0.5s ease-in-out;
      img {
        height: 6rem;
        transition: 0.5s ease-in-out;
      }
    }
    .selected {
      border: 0.4rem solid #4e0eff;
    }
  }
  .submit-btn {
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
`;

export default SetAvatar

