import React, { useEffect, useState } from 'react'
import '@tensorflow/tfjs-backend-webgl';
import "../styles/home.css"
import WebcamSection from '../components/webcam';
import TrainingTypes from '../components/trainingTypes';
import TrainingSteps from '../components/trainingSteps'; 
import TrainingData from '../components/trainingData'; 
import { KeyTwoTone } from '@mui/icons-material';
function Home(){
    const [training, setTraining] = useState()
    const [positions, setPositions] = useState({
        set:{
            isTrue: false, 
            values:[],
            count: 0,
            isReady: false
        },
        balance:{
            isTrue: false, 
            values:[]
        },
        landing:{
            isTrue: false, 
            values:[]
        },
        finish:{
            isTrue: false, 
            values:[]
        }
    })

    function handleChange(keypoints){
        let key = {
            nose: keypoints[0],
            L_eye: keypoints[1],
            R_eye: keypoints[2],
            L_ear: keypoints[3],
            R_ear: keypoints[4],
            L_shoulder: keypoints[5],
            R_shoulder: keypoints[6],
            L_elbow: keypoints[7],
            R_elbow: keypoints[8],
            L_wrist: keypoints[9],
            R_wrist: keypoints[10],
            L_hip: keypoints[11],
            R_hip: keypoints[12],
            L_knee: keypoints[13],
            R_knee: keypoints[14],
            L_ankle: keypoints[15],
            R_ankle: keypoints[16]
        }
        if(keypoints === undefined){
            return 0;
        }
            // console.log(keypoints)
       
            if (Math.abs(key.L_wrist['x'] - key.R_wrist['x']) < 70 &&
                Math.abs(key.L_wrist['y'] - key.R_wrist['y']) < 5) { 
                if(positions.set.isTrue === false){
                    console.log('isTrue is false')
                    positions.set.values = keypoints;
                    positions.set.count = 1; 
                    positions.set.isTrue = true; 
                } else {
                    // Starting hand set positions. 
                    let strL_wrist = positions.set.values[9]
                    let strR_wrist = positions.set.values[10]
                    // Average X positions
                    let strX = (strL_wrist['x'] + strR_wrist['x']) / 2;
                    let curX = (key.L_wrist['x'] + key.R_wrist['x']) / 2;
                    // Average Y positions
                    let strY = (strL_wrist['y'] + strR_wrist['y']) / 2;
                    let curY = (key.L_wrist['y'] + key.R_wrist['y']) / 2;
                    if(Math.abs(strX - curX) < (strX/10) && Math.abs(strY - curY) < (strY/10)){
                        setPositions({...positions,
                            set: {
                                ...positions.set,
                                count : positions.set.count++
                            }})
                    }
                    if(positions.set.count >= 20 && positions.set.isReady === false){
                        positions.set.isReady = true;
                    }

                    // console.log(positions.set.isReady); 
                }                       
                
            } else {
                // console.log('not together')
                positions.set.count = 0; 
                positions.set.isTrue = false; 
            }  
    }

    // useEffect(() => {
    //     console.log(positions)
    // }, [positions])
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