import React from 'react';
import '../../styles/header.css';
import { Link } from 'react-router-dom'; 
import { useNavigate } from "react-router-dom";
import { useCookies } from 'react-cookie';

function Header({ setIsLoggedIn }){
    const [cookies, setCookie, removeCookie] = useCookies(['userid'])
    let navigate = useNavigate();

    function handleLogout(){
        setIsLoggedIn(false); 
        removeCookie('userid', {path:'/'});
        navigate('/login');
    }; 

    return(
        <div className='header__wrapper'>
            <h2 className='header_logo'><Link to='/'>BenchCoach</Link></h2>
            <h3 id='header_profile'><Link to='/profile'>Profile</Link></h3>
            <h3><Link to='/assessment'>Assessment</Link></h3>
            <h3 onClick={handleLogout}>Logout</h3>
        </div>
    )
}

export default Header;