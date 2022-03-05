import React, { useState, useRef } from 'react'
import '@tensorflow/tfjs-backend-webgl';
import "../../styles/home.css";
import TrainingSteps from '../assessment/trainingSteps'; 

/*
# THINGS THAT NEED TO BE CLEANED UP
# 1) Landing is pretty inconsistent. It's getting a lot closer to right on(most of the time it is, but it's not 100%)
# 2) Arm Angles are actually mostly good. Just need to clean up the actual length of body parts before we start, that should help 
# 3) Loosened up set position to allow for a little more consistency, but it's opened the door to slow consisten movements, as well as vigorous movements held in the same position. I'm not sure how to fix at this point. 
*/

function Home(){

    return (
        <div className='home__wrapper'>
             
        </div>
    )
}

export default Home; 