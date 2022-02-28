import React, { useState } from 'react';
import '../styles/login.css';
import { Link } from 'react-router-dom'; 
import axios from 'axios';
import { useNavigate } from "react-router-dom";



function Login({ setIsLoggedIn }){
    let navigate = useNavigate();

    const [user, setUser] = useState({
        email:'',
        password: ''
    })

    const [currentError, setCurrentError] = useState('')

    function handleChange(event){
        setCurrentError('');
        let name = event.target.name;
        let value = event.target.value

        setUser(prev => ({...prev, [name]: value})); 
    }

    function handleLogin(){
        axios.get(`${process.env.REACT_APP_API}/users/login`, {params: {email: user.email, password: user.password}} )
        .then((response) => {
            let data = response.data;
            if(data['error_password'] || data['error_email']){
                let myError = data['error_password'] ? 'error_password' : 'error_email';
                setCurrentError(myError);
                console.log('No pass Go')
            } else {
                setIsLoggedIn(true);
                navigate('/'); 
            }
        })
    }
 
    return (
        <div id='login_wrapper'>
            <div id='login_inner_wrapper'>
                <h1 className='header_logo_alt'>Benchcoach</h1>
                <h4>Sign in to continue with your personalized program. Or if you don't have an account, make one now!</h4>
                <h2>Login</h2>
                <div className='input_wrapper'>
                    <div className='input_box'>
                        <label>Email</label>
                        <input name='email' onChange={handleChange}></input>
                        { currentError === 'error_email' &&
                            <p>Email address not correct</p>
                        }
                    </div>
                    <div className='input_box'>
                        <label>Password</label>
                        <input type='password' name='password' onChange={handleChange}></input>
                        { currentError === 'error_password' &&
                            <p>Password incorrect</p>
                        }
                    </div>
                </div>
                <Link
                    className='signup_link'
                    to={'/signup'}
                >
                    Signup
                </Link>
                <button onClick={handleLogin} className='button__login'>Login</button>
            </div>
        </div>
    )
}

export default Login; 