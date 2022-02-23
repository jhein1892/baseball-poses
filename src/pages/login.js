import React from 'react';
import '../styles/login.css'


function Login(){
 
    return (
        <div id='login_wrapper'>
            <div id='login_inner_wrapper'>
                <h1 className='header_logo_alt'>Benchcoach</h1>
                <h4>Sign in to continue with your personalized program. Or if you don't have an account, make one now!</h4>
                <h2>Login</h2>
                <div className='input_wrapper'>
                    <div className='input_box'>
                        <label>Username</label>
                        <input></input>
                    </div>
                    <div className='input_box'>
                        <label>Password</label>
                        <input></input>
                    </div>
                </div>
                <button className='button__signup'>Login</button>
            </div>
        </div>
    )
}

export default Login; 