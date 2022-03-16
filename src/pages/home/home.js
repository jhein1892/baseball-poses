import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import '@tensorflow/tfjs-backend-webgl';
import "../../styles/home.css";
import DailyDrills from './dailyDrills';
import { useCookies } from 'react-cookie';
import TrainingSteps from '../assessment/trainingSteps';

function Home({ userData }){
    const [cookies, setCookie] = useCookies(['userid']);
    const [showDrills, setShowDrills] = useState(false);
    const [drillData, setDrillData] = useState([])
    useEffect(() => {
        function getDailyDrills(){
            axios.get(`${process.env.REACT_APP_API}/drills/daily/${cookies.userid}`)
            .then((response) => {
                let data = response.data;
                setDrillData(data);
            })
        }
        getDailyDrills()
    },[])

    return (
        <div className='home__wrapper'>
            <h1>Good Morning, {userData.first_name}</h1>
            <h2>Are you ready to start your training session?</h2>
            {!showDrills &&
                <button onClick={() => {setShowDrills(true)}}>Start</button>
            }
            {showDrills &&
                <DailyDrills drillData={drillData} setShowDrills={setShowDrills} />
            }
        </div>
    )
}

export default Home; 