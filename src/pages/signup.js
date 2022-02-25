import React, { useState } from 'react';
import '../styles/signup.css';
import { Link } from 'react-router-dom'; 
import axios from 'axios';

function Signup(){

    const [newUser, setNewUser] = useState({
        throwing_hand:'left',
        height_feet: 5,
        height_inches: 9
    }); 

    const [displayError, setDisplayError] = useState(false); 

    function handleChange(event){
        setDisplayError(false);
        let name = event.target.name;
        let value = event.target.value; 
        setNewUser(prev => ({...prev, [name]: value}))
    }

    function handleSubmit(event){
        event.preventDefault(); 
        axios.put(`${process.env.REACT_APP_API}/users`, {newUser})
        .then((response) => {
            let data = response.data; 
            if(data['error_exists'] ){
                console.log('error')
                setDisplayError(true)
            } else {
                console.log('No error')
                console.log(response.data); 
            }
        })
    }

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
                    <form id='signup_form' onSubmit={handleSubmit}>
                        <label className='firstname'>First Name:</label>
                        <input required name='first_name' value={newUser.first_name} className='firstname' onChange={handleChange}></input>
                        <label className='lastname'>Last Name:</label>
                        <input required name='last_name' className='lastname' value={newUser.last_name} onChange={handleChange}></input>
                        <label className='email'>Email:</label>
                        <input required type='email' name='email' className='email' value={newUser.email} onChange={handleChange}></input>
                        <label className='password'>Password:</label>
                        <input required type='password' name='password' className='password' value={newUser.password} onChange={handleChange}></input>
                        <label className='throwing_hand'>Throwing Hand:</label>
                        <select name='throwing_hand' defaultValue={newUser.throwing_hand} className='throwing_hand' onChange={handleChange}>
                            <option value={'left'}>Left</option>
                            <option value={'right'}>Right</option>
                            <option value={'both'}>Both</option>
                        </select>
                        <label className='birth_year'>Birthday:</label>
                        <input required type='date' name='birth_year' className='birth_year' value={newUser.birth_year} onChange={handleChange}></input>
                        <label className='height'>Height:</label>
                        <div className='height'>
                            <div>
                                <label>Feet: </label>
                                <select name='height_feet' defaultValue={newUser.height_feet} onChange={handleChange}>
                                    <option value={4}>4</option>
                                    <option value={5}>5</option>
                                    <option value={6}>6</option>
                                    <option value={7}>7</option>
                                </select>
                            </div>
                            <div>
                                <label>Inches: </label>
                                <select name='height_inches' defaultValue={newUser.height_inches} onChange={handleChange}>
                                    <option value={0}>0</option>
                                    <option value={1}>1</option>
                                    <option value={2}>2</option>
                                    <option value={3}>3</option>
                                    <option value={4}>4</option>
                                    <option value={5}>5</option>
                                    <option value={6}>6</option>
                                    <option value={7}>7</option>
                                    <option value={8}>8</option>
                                    <option value={9}>9</option>
                                    <option value={10}>10</option>
                                    <option value={11}>11</option>
                                </select>
                            </div>
                        </div>
                        <button className='button__signup' type='submit'>Sign Up</button>
                    </form>
                {displayError &&
                    <p id='email_alert'>An account for this email already exists</p>
                }
            </div>
        </div>
    )
}

export default Signup; 