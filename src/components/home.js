import React, { useEffect, useState } from 'react'
import '@tensorflow/tfjs-backend-webgl';
import "../styles/home.css"
import WebcamSection from '../components/webcam';
import TrainingTypes from '../components/trainingTypes';
import TrainingSteps from '../components/trainingSteps'; 
import TrainingData from '../components/trainingData'; 
function Home(){
    const [training, setTraining] = useState()
    const [positions, setPositions] = useState({
        set:[],
        balance:[],
        landing:[],
        finish:[]
    })


    // I think I need to deal with the set length in here, since the other one is async, and adding additional functions to that page is going to slow it down. I would like to add something of a timeout, where we compare previous values against current one, and if they are within like 10% for 10X in a row (1 second) then its considered 'set'. And if we get front leg vertical movement before we get that set positions then it was done wrong. 
    function handleChange(keypoints, name){
        // console.log(keypoints, name)
        setPositions({...positions, [name]:keypoints})
    }
    return (
        <div className='home__wrapper'>
            <div className='home__top'>
                <TrainingTypes setTraining={setTraining}/>
                <WebcamSection positions={positions} handleChange={handleChange} training={training}/>
            </div>
                <TrainingSteps positions={positions} />
                {/* <TrainingData positions={positions} /> */}
        </div>
    )
}

export default Home; 