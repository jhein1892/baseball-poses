import React, { useEffect, useState } from 'react'
import '@tensorflow/tfjs-backend-webgl';
import "../styles/home.css"
import WebcamSection from '../components/webcam';
import TrainingTypes from '../components/trainingTypes'
function Home(){
    const [training, setTraining] = useState()
    return (
        <div className='home__wrapper'>
            <TrainingTypes setTraining={setTraining}/>
            <WebcamSection training={training}/>
        </div>
    )
}

export default Home; 