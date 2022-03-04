import axios from 'axios';
import React, {useState} from 'react';
import '../styles/profile.css'
// import { useCookies } from 'react-cookie';

function Profile({ userData, setUserData }){
    const [userInfo, setUserInfo] = useState(userData);
    const [inputError, setInputError] = useState(false); 
    const [inputSuccess, setInputSuccess] = useState(false); 
    // const [cookies] = useCookies(['userid']); 
    let birthday =  userData.birth_year.slice(0, 10);

    function handleChange(event){
        setInputSuccess(false); 
        setInputError(false); 
        let name = event.target.name;
        let value = event.target.value;

        setUserInfo(prev => ({...prev, [name]: value}));
    }

    function handleSubmit(event){
        event.preventDefault(); 
        axios.patch(`${process.env.REACT_APP_API}/users`, {userInfo})
        .then((response) => {
            let data = response.data; 
            if (Object.keys(data).includes('error_update')){
                console.log('error found');
                setInputError(true); 
            } else {
                setUserData(userInfo);
                setInputSuccess(true)
            }
        })
    }

    return(
        <div id='profile_wrapper'>
            <h1 >{`Welcome ${userData.first_name}`}</h1>

            <form id='profile_form' onSubmit={handleSubmit}>
                {/* <label>Username</label>
                <input defaultValue={userData.username}></input> */}
                {inputError &&
                    <p>Error on Input</p>
                }
                {inputSuccess &&
                    <h3> Success!</h3>
                }
                <label>First Name</label>
                <input name='first_name' onChange={handleChange} defaultValue={userData.first_name}></input>
                <label>Last Name</label>
                <input name='last_name' onChange={handleChange} defaultValue={userData.last_name}></input>
                <label>Birthday</label>
                <input type='date' name='birth_year' onChange={handleChange} defaultValue={birthday}></input>
                <div className='height'>
                            <div>
                                <label>Feet: </label>
                                <select name='height_feet' onChange={handleChange} defaultValue={userData.height_feet} >
                                    <option value={4}>4</option>
                                    <option value={5}>5</option>
                                    <option value={6}>6</option>
                                    <option value={7}>7</option>
                                </select>
                            </div>
                            <div>
                                <label>Inches: </label>
                                <select name='height_inches' onChange={handleChange} defaultValue={userData.height_inches}>
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
                <label>Throwing Hand</label>
                <input name='throwing_hand' defaultValue={userData.throwing_hand}></input>
                <label>Reset Password</label>
                <input name='password' onChange={handleChange}></input>

                <button type='submit'>Submit</button>
            </form>
        </div>
    );
}

export default Profile; 