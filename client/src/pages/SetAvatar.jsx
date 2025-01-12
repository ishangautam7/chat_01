import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import loader from '../assests/loader.gif';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { setAvatarRoute } from '../utils/APIRoutes';

function SetAvatar() {
    const api = 'https://api.multiavatar.com/45678945';
    const navigate = useNavigate();
    const [avatars, setAvatars] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedAvatar, setSelectedAvatar] = useState(undefined);

    const toastOptions = {
        position: 'bottom-right',
        autoClose: 4000,
        pauseOnHover: true,
        draggable: true,
        theme: 'dark',
    };

    useEffect(() => {
        const checkUser = async () => {
            const userData = localStorage.getItem('accessToken');

            if(!userData){
                navigate('/login')
            }
            try {
                const parsedUser = JSON.parse(userData);

                if (parsedUser.user.isAvatarImageSet) {
                    navigate('/');
                }else if (!parsedUser.user.isAvatarImageSet) {
                    navigate('/setAvatar');
                }
            } catch (error) {
                console.error("Error parsing user data:", error);
                navigate('/login'); // Redirect to login on parse failure
            }
        };
        checkUser();
    }, [navigate]);

    const setProfilePicture = async () => {
        if (selectedAvatar === undefined) {
            toast.error('Please select an avatar', toastOptions);
            return;
        }

        const userData = localStorage.getItem('accessToken');
        if (!userData) {
            toast.error('User not found');
            navigate('/login');
            return;
        }

        try {
            const newUser = JSON.parse(userData);
            const { data } = await axios.post(`${setAvatarRoute}/${newUser.user._id}`, {
                image: avatars[selectedAvatar],
            });

            if (data.isSet) {
                newUser.isAvatarImageSet = data.isSet;
                newUser.avatarImage = data.image;
                localStorage.setItem('accessToken', JSON.stringify(newUser));
                navigate('/');
            } else {
                toast.error('Error setting avatar. Please try again', toastOptions);
            }
        } catch (err) {
            toast.error('Error setting avatar. Please try again', toastOptions);
        }
    };

    useEffect(() => {
        const fetchAvatars = async () => {
            const requests = Array.from({ length: 4 }, () =>
                axios.get(`${api}/${Math.round(Math.random() * 1000)}`)
            );

            try {
                const responses = await Promise.all(requests);
                const data = responses.map((res) => res.data);
                setAvatars(data);
            } catch (error) {
                console.error('Error fetching avatars:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAvatars();
    }, []);

    return (
        <>
            {isLoading ? (
                <Container>
                    <img src={loader} alt="loader" className="loader" />
                </Container>
            ) : (
                <Container>
                    <div className="title-container">
                        <h1>Pick an avatar as your profile picture</h1>
                    </div>

                    <div className="avatars">
                        {avatars.map((avatar, index) => (
                            <div
                                key={index}
                                className={`avatar ${selectedAvatar === index ? 'selected' : ''}`}
                            >
                                <div
                                    dangerouslySetInnerHTML={{ __html: avatar }}
                                    onClick={() => setSelectedAvatar(index)}
                                />
                            </div>
                        ))}
                    </div>

                    <button className="submit-btn" onClick={setProfilePicture}>
                        Set as Profile Picture
                    </button>
                </Container>
            )}
            <ToastContainer />
        </>
    );
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
    width: 5rem;
    height: 5rem;
    animation: spin 2s linear infinite;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
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

      div {
        height: 6rem;
        width: 6rem;
        cursor: pointer;
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
      background-color: #3b08cc;
    }
  }
`;

export default SetAvatar;
