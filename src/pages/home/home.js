import React, { useState, useRef } from 'react'
import '@tensorflow/tfjs-backend-webgl';
import "../../styles/home.css";
import DailyDrills from './dailyDrills';
import TrainingSteps from '../assessment/trainingSteps';

function Home({ userData }){
    const [showDrills, setShowDrills] = useState(false)

    return (
        <div className='home__wrapper'>
            <h1>Good Morning, {userData.first_name}</h1>
            <h2>Are you ready to start your training session?</h2>
            {!showDrills &&
                <button onClick={() => {setShowDrills(true)}}>Start</button>
            }
            {showDrills &&
                <DailyDrills setShowDrills={setShowDrills} />
            }
        </div>
    )
}

export default Home; 