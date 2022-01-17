import React, { useEffect, useState } from 'react'
import '@tensorflow/tfjs-backend-webgl';
import "../styles/home.css"
import WebcamSection from '../components/webcam';
import TrainingTypes from '../components/trainingTypes';
import TrainingSteps from '../components/trainingSteps'; 
// import TrainingData from '../components/trainingData'; 
import TrainingSettings from '../components/trainingSettings'; 
import { math } from '@tensorflow/tfjs';

/*
# THINGS THAT NEED TO BE CLEANED UP
# 1) Landing is pretty inconsistent. It's getting a lot closer to right on(most of the time it is, but it's not 100%)
# 2) Arm Angles are actually mostly good. Just need to clean up the actual length of body parts before we start, that should help 
# 3) Loosened up set position to allow for a little more consistency, but it's opened the door to slow consisten movements, as well as vigorous movements held in the same position. I'm not sure how to fix at this point. 
# 4) Need to be able to reset everything without breaking the video.
*/




function Home(){
    const [training, setTraining] = useState();
    const [setting, setSetting] = useState();
    // Set default to being left handed. Will need to
    let front = setting === 'right' ? 'left' : 'right';
    let back = setting === 'right' ? 'right' : 'left'; 
    let throwingDirection = {
        front,
        back
    }
    const [positions, setPositions] = useState({
        set:{
            isTrue: false, 
            values:[],
            count: 0,
            isReady: false,

        },
        balance:{
            isTrue: false, 
            values:[],
            startingHeight: 0, 
            isBalanced: false,
            peakVal: 0,
            peakValues: []
        },
        landing:{
            isTrue: false, 
            values:[],
            isLanded: false
        },
        finish:{
            isTrue: false, 
            values:[]
        }
    })

    function findSet(key3D){
        // Logic for finding set positions
        console.log(positions.set.count)
        // If your hands are together
        if(Math.abs(key3D.left_wrist['x'] - key3D.right_wrist['x']) < 0.3 &&
            Math.abs(key3D.left_wrist['y'] - key3D.right_wrist['y']) < 0.075){
            console.log('together');
            // The first instance of having them together
            if(positions.set.isTrue === false){
                let updatedSet = {...positions};
                updatedSet['set'].isTrue = true;
                updatedSet['set'].count = 1;
                updatedSet['set'].values = key3D; 
                setPositions({...updatedSet}); 
            } 
            // Else if it's not the first instance
            else {
                let strL_wrist = positions.set.values['left_wrist'];
                let strR_wrist = positions.set.values['right_wrist'];

                // This seems to be working. 
                if(((Math.abs(strL_wrist['x'] - key3D.left_wrist['x']) < Math.abs(strL_wrist['x']) / 1.75) && (Math.abs(strL_wrist['y'] - key3D.left_wrist['y']) < Math.abs(strL_wrist['y']) / 1.75)) && (Math.abs(strR_wrist['x'] - key3D.right_wrist['x']) < Math.abs(strR_wrist['x']) / 1.75) && (Math.abs(strR_wrist['y'] - key3D.right_wrist['y']) < Math.abs(strR_wrist['y']) / 1.75))
                {
                    console.log('Same Spot');
                    // do the normal stuff from below
                    let updatedSet = {...positions};
                    // updatedSet['set'].values = key3D;
                    updatedSet['set'].count = updatedSet['set'].count + 1 ;
                    if(positions.set.count >= 25){
                        console.log('1 second');
                        updatedSet['set'].isReady = true;
                        updatedSet['balance'].values = key3D;
                        updatedSet['balance'].startingHeight = key3D[`${front}_knee`]['y']; 
                        updatedSet['balance'].peakVal = key3D[`${front}_knee`]['y']; 
                    }
                    setPositions({...updatedSet}); 
                } else {
                    console.log('Not the same spot');
                    let updatedSet = {...positions}
                    updatedSet['set'].count = 0;
                    updatedSet['set'].isTrue = false;
                    setPositions({...updatedSet}); 
                    // remember to set a new set of positions in here. 
                }
            }    
        } else {
            console.log('Not together');
            let updatedSet = {...positions}
            updatedSet['set'].count = 0;
            updatedSet['set'].isTrue = false;
            setPositions({...updatedSet}); 
        }
    }

    let directionArray = [];
    const Average = arr => arr.reduce((prev, current) => prev + current, 0) / arr.length; 
    
    function findBalance(key, key3D){
        let currentVal = parseFloat(key3D[`${front}_knee`]['y'].toFixed(3));
        let prevVal = parseFloat(positions.balance.values[`${front}_knee`]['y'].toFixed(3));
        let currentAnkleValX = parseFloat(key3D[`${front}_ankle`]['x'].toFixed(3));
        let prevAnkleValX = parseFloat(positions.balance.values[`${front}_ankle`]['x'].toFixed(3)); 
        let currentAnkleValY = parseFloat(key3D[`${front}_ankle`]['y'].toFixed(3));
        let prevAnkleValY = parseFloat(positions.balance.values[`${front}_ankle`]['y'].toFixed(3)); 
        // console.log('current Ankle values: ', currentAnkleValY, currentAnkleValX)

        if(key3D[`${front}_knee`]['score'] > 0.8){
            let updatedBalance = {...positions};
                // This is for top of balance. 
                if(currentVal < prevVal){
                    console.log('Leg Moving Up', currentVal);
                    // Setting updated peakVal if current is lower than previous
                    if(Math.abs(currentVal - prevVal) > 0.05){
                        updatedBalance['balance']['isBalanced'] = true; 
                    }
                    if(currentVal < updatedBalance['balance']['peakVal']){
                        updatedBalance['balance']['peakVal'] = currentVal; 
                        updatedBalance['balance']['peakValues'] = key3D;
                    }
                } else if(currentVal > prevVal){
                    console.log('Leg Moving Down');
                } 
                // This is finding our landing
                console.log(positions.set.values[`${front}_ankle`]['x'], currentAnkleValX)
                if (positions.balance.isBalanced && (Math.abs(prevAnkleValX - currentAnkleValX) <= 0.01) && (Math.abs(prevAnkleValY - currentAnkleValY) <= 0.01) && positions.balance.startingHeight - currentVal <=0.1 && parseFloat(positions.set.values[`${front}_ankle`]['x']) > currentAnkleValX) { 
                    console.log('is Landed');
                    updatedBalance['landing']['isLanded'] = true;
                    updatedBalance['landing']['values'] = key3D;
                }
            updatedBalance['balance']['values'] = key3D; 
            setPositions({...updatedBalance});
            
        } else {
            console.log("currentVal:", currentVal, "prevVal:",prevVal);
            console.log('unsure')
        }
    }

    function findLanding(key, key3D){
        // console.log(key);
        // So I'm going to check and make sure front foot is moving, either horizontally or vertiacally.
        let updatedLanding = {...positions};
        let vertMovement = Math.abs(key[`${front}_ankle`]['y'] - positions.landing.values[`${front}_ankle`]['y']).toFixed(0);
        let horMovement = Math.abs(key[`${front}_ankle`]['x'] - positions.landing.values[`${front}_ankle`]['x']).toFixed(0);
        console.log(horMovement, vertMovement); 
        if(vertMovement == 0 && horMovement == 0){
            console.log('foot not moving');
            updatedLanding['landing'].isLanded = true; 
        } else if(vertMovement === 0 && horMovement !== 0){
            console.log('foot moving horizontally')
        } else {
            console.log('foot moving vertiacally')
        }
        
        updatedLanding['landing'].values = key; 
        setPositions({...updatedLanding}); 
    }

    function handleChange(keypoints, keypoints3D) {
        if(keypoints === undefined){
            console.log('undefined');
            return 0; 
        }
        // console.log(keypoints);
        let key = { 
            nose: keypoints[0], 
            left_eye_inner: keypoints[1],
            left_eye: keypoints[2],
            left_eye_outer: keypoints[3],
            right_eye_inner: keypoints[4],
            right_eye: keypoints[5],
            right_eye_outer: keypoints[6],
            left_ear: keypoints[7],
            right_ear:keypoints[8],
            left_mouth: keypoints[9],
            right_mouth: keypoints[10],
            left_shoulder: keypoints[11],
            right_shoulder: keypoints[12],
            left_elbow:keypoints[13],
            right_elbow: keypoints[14], 
            left_wrist: keypoints[15],
            right_wrist: keypoints[16],
            left_pinky: keypoints[17],
            right_pinky: keypoints[18],
            left_index: keypoints[19],
            right_index: keypoints[20],
            left_thumb: keypoints[21],
            right_thumb: keypoints[22],
            left_hip: keypoints[23],
            right_hip: keypoints[24],
            left_knee: keypoints[25],
            right_knee: keypoints[26],
            left_ankle: keypoints[27],
            right_ankle: keypoints[28],
            left_heel: keypoints[29],
            right_heel: keypoints[30],
            left_foot_index: keypoints[31],
            right_foot_index: keypoints[32]
        }
        let key3D = { 
            nose: keypoints3D[0], 
            left_eye_inner: keypoints3D[1],
            left_eye: keypoints3D[2],
            left_eye_outer: keypoints3D[3],
            right_eye_inner: keypoints3D[4],
            right_eye: keypoints3D[5],
            right_eye_outer: keypoints3D[6],
            left_ear: keypoints3D[7],
            right_ear:keypoints3D[8],
            left_mouth: keypoints3D[9],
            right_mouth: keypoints3D[10],
            left_shoulder: keypoints3D[11],
            right_shoulder: keypoints3D[12],
            left_elbow:keypoints3D[13],
            right_elbow: keypoints3D[14], 
            left_wrist: keypoints3D[15],
            right_wrist: keypoints3D[16],
            left_pinky: keypoints3D[17],
            right_pinky: keypoints3D[18],
            left_index: keypoints3D[19],
            right_index: keypoints3D[20],
            left_thumb: keypoints3D[21],
            right_thumb: keypoints3D[22],
            left_hip: keypoints3D[23],
            right_hip: keypoints3D[24],
            left_knee: keypoints3D[25],
            right_knee: keypoints3D[26],
            left_ankle: keypoints3D[27],
            right_ankle: keypoints3D[28],
            left_heel: keypoints3D[29],
            right_heel: keypoints3D[30],
            left_foot_index: keypoints3D[31],
            right_foot_index: keypoints3D[32]
        }

        if(positions.set.isReady === false){
            // Need to make this function
            findSet(key3D);
        } 
        else if (positions.set.isReady === true && positions.landing.isLanded === false){
            findBalance(key, key3D);
        } 
        // else if (positions.balance.isBalanced === true && positions.landing.isLanded === false){
        //     findLanding(key, key3D); 
        // }
    }

    return (
        <div className='home__wrapper'>
            <div className='home__settings'>
                <TrainingSettings setSetting={setSetting}/>
            </div>
            <div className='home__top'>
                <TrainingTypes setTraining={setTraining}/>
                <WebcamSection positions={positions} handleChange={handleChange} training={training} setPositions={setPositions}/>
            </div>
                <TrainingSteps positions={positions}  throwingDirection={throwingDirection}/>
                {/* <TrainingData positions={positions} /> */}
        </div>
    )
}

export default Home; 