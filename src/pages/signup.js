import React from 'react';
import '../styles/signup.css';
import { Link } from 'react-router-dom'; 

function Signup(){

    return (
        <div id='signup_wrapper'>
            <div id='signup_inner_wrapper'>
                <Link
                    className='login_link'
                    to={'/login'}
                >
                    Back to Login
                </Link>
                <h1 className='header_logo_alt'>Benchcoach</h1>

                    <label className='firstname'>First Name:</label>
                    <input className='firstname'></input>

                    <label className='lastname'>Last Name:</label>
                    <input className='lastname'></input>

                    <label className='email'>Email:</label>
                    <input type='email' className='email'></input>

                    <label className='password'>Password:</label>
                    <input type='password' className='password'></input>

                    <label className='throwing_hand'>Throwing Hand:</label>
                    <input className='throwing_hand'></input>

                    <label className='birth_year'>Birthday:</label>
                    <input type='date' className='birth_year'></input>

                    <label className='height'>Height:</label>
                    <input className='height'></input>

                    <button className='button__signup'>Sign Up</button>
            </div>
        </div>
    )
}

export default Signup; 