import React, { useState, useRef, useEffect } from 'react'
import '@tensorflow/tfjs-backend-webgl';
import "../../styles/home.css";
import axios from 'axios'; 
import WebcamSection from '../assessment/webcam';
// import TrainingTypes from '../assessment/trainingTypes';
import TrainingSteps from '../components/trainingSteps'; 
// import TrainingSettings from '../components/trainingSettings'; 
import {beep} from '../../functions/utils';

/*
# THINGS THAT NEED TO BE CLEANED UP
# 1) Landing is pretty inconsistent. It's getting a lot closer to right on(most of the time it is, but it's not 100%)
# 2) Arm Angles are actually mostly good. Just need to clean up the actual length of body parts before we start, that should help 
# 3) Loosened up set position to allow for a little more consistency, but it's opened the door to slow consisten movements, as well as vigorous movements held in the same position. I'm not sure how to fix at this point. 
*/

function Home(){
    const [training, setTraining] = useState();
    const [throwing, setThrowing] = useState();
    const resetRef = useRef(false); 
    const [height, setHeight] = useState({
        feet: 5, 
        inches: 10
    })

    const assessmentRef = useRef(); 

    let front = throwing === 'right' ? 'left' : 'right';
    let back = throwing === 'right' ? 'right' : 'left'; 
    let cmeterHeight = (height.feet * 30) + (height.inches * 2.54); 
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
            // isTrue: false, 
            values:[],
            startingHeight: 0, 
            isBalanced: false,
            peakVal: 0,
            peakValues: []
        },
        landing:{
            // isTrue: false, 
            values:[],
            isLanded: false
        },
        finish:{
            // isTrue: false, 
            isFinshed: false, 
            values:[]
        }
    })

    // function findSet(key3D){
    //     // Logic for finding set positions
    //     console.log(positions.set.count)
    //     // If your hands are together
    //     if(Math.abs(key3D.left_wrist['x'] - key3D.right_wrist['x']) < 0.3 &&
    //         Math.abs(key3D.left_wrist['y'] - key3D.right_wrist['y']) < 0.075){
    //         // The first instance of having them together
    //         if(positions.set.isTrue === false){
    //             let updatedSet = {...positions};
    //             updatedSet['set'].isTrue = true;
    //             updatedSet['set'].count = 1;
    //             updatedSet['set'].values = key3D; 
    //             setPositions({...updatedSet}); 
    //         } 
    //         // Else if it's not the first instance
    //         else {
    //             let strL_wrist = positions.set.values['left_wrist'];
    //             let strR_wrist = positions.set.values['right_wrist'];

    //             if(((Math.abs(strL_wrist['x'] - key3D.left_wrist['x']) < Math.abs(strL_wrist['x']) / 1.75) && (Math.abs(strL_wrist['y'] - key3D.left_wrist['y']) < Math.abs(strL_wrist['y']) / 1.75)) && (Math.abs(strR_wrist['x'] - key3D.right_wrist['x']) < Math.abs(strR_wrist['x']) / 1.75) && (Math.abs(strR_wrist['y'] - key3D.right_wrist['y']) < Math.abs(strR_wrist['y']) / 1.75))
    //             {
    //                 let updatedSet = {...positions};
    //                 updatedSet['set'].count = updatedSet['set'].count + 1 ;
                    
    //                 if(positions.set.count >= 10){
    //                     beep(300, 740, 0.6, 'triangle');
    //                     updatedSet['set'].isReady = true;
    //                     updatedSet['balance'].values = key3D;
    //                     updatedSet['balance'].startingHeight = key3D[`${front}_knee`]['y']; 
    //                     updatedSet['balance'].peakVal = key3D[`${front}_knee`]['y']; 
    //                 }
    //                 setPositions({...updatedSet}); 
    //             } else {
    //                 let updatedSet = {...positions}
    //                 updatedSet['set'].count = 0;
    //                 updatedSet['set'].isTrue = false;
    //                 setPositions({...updatedSet}); 
    //             }
    //         }    
    //     } else {
    //         let updatedSet = {...positions}
    //         updatedSet['set'].count = 0;
    //         updatedSet['set'].isTrue = false;
    //         setPositions({...updatedSet}); 
    //     }
    // }

    // function findBalance(key3D){
    //     let currentVal = parseFloat(key3D[`${front}_knee`]['y'].toFixed(3));
    //     let prevVal = parseFloat(positions.balance.values[`${front}_knee`]['y'].toFixed(3));
    //     let currentAnkleValX = parseFloat(key3D[`${front}_ankle`]['x'].toFixed(3));
    //     let prevAnkleValX = parseFloat(positions.balance.values[`${front}_ankle`]['x'].toFixed(3)); 
    //     let currentAnkleValY = parseFloat(key3D[`${front}_ankle`]['y'].toFixed(3));
    //     let prevAnkleValY = parseFloat(positions.balance.values[`${front}_ankle`]['y'].toFixed(3)); 

    //     if(key3D[`${front}_knee`]['score'] > 0.8){
    //         let updatedBalance = {...positions};
    //             // This is for top of balance. 
    //             if(currentVal < prevVal){
    //                 console.log('Leg Moving Up', currentVal);
    //                 // Setting updated peakVal if current is lower than previous
    //                 if(Math.abs(currentVal - prevVal) > 0.05){
    //                     updatedBalance['balance']['isBalanced'] = true; 
    //                 }
    //                 if(currentVal < updatedBalance['balance']['peakVal']){
    //                     updatedBalance['balance']['peakVal'] = currentVal; 
    //                     updatedBalance['balance']['peakValues'] = key3D;
    //                 }
    //             } else if(currentVal > prevVal){
    //                 console.log('Leg Moving Down');
    //             } 
    //             // This is finding our landing
    //             console.log(positions.set.values[`${front}_ankle`]['x'], currentAnkleValX)
    //             if (positions.balance.isBalanced && (Math.abs(prevAnkleValX - currentAnkleValX) <= 0.01) && (Math.abs(prevAnkleValY - currentAnkleValY) <= 0.01) && positions.balance.startingHeight - currentVal <=0.1 && parseFloat(positions.set.values[`${front}_ankle`]['x']) > currentAnkleValX) { 
    //                 console.log('is Landed');
    //                 updatedBalance['landing']['isLanded'] = true;
    //                 updatedBalance['landing']['values'] = key3D;

    //                 // ***IMPORTANT*** Move this to where we want data to be stored and model reset
    //                 resetRef.current = true; 
    //             }
    //         updatedBalance['balance']['values'] = key3D; 
    //         setPositions({...updatedBalance});
            
    //     } else {
    //         console.log("currentVal:", currentVal, "prevVal:",prevVal);
    //         console.log('unsure')
    //     }
    // }

    // function findFinish(key3D){
        
    // }

    // function handleChange(keypoints3D) {
    //     if(keypoints3D === undefined){
    //         console.log('undefined');
    //         return 0; 
    //     }
    //     let key3D = { 
    //         nose: keypoints3D[0], 
    //         left_eye_inner: keypoints3D[1],
    //         left_eye: keypoints3D[2],
    //         left_eye_outer: keypoints3D[3],
    //         right_eye_inner: keypoints3D[4],
    //         right_eye: keypoints3D[5],
    //         right_eye_outer: keypoints3D[6],
    //         left_ear: keypoints3D[7],
    //         right_ear:keypoints3D[8],
    //         left_mouth: keypoints3D[9],
    //         right_mouth: keypoints3D[10],
    //         left_shoulder: keypoints3D[11],
    //         right_shoulder: keypoints3D[12],
    //         left_elbow:keypoints3D[13],
    //         right_elbow: keypoints3D[14], 
    //         left_wrist: keypoints3D[15],
    //         right_wrist: keypoints3D[16],
    //         left_pinky: keypoints3D[17],
    //         right_pinky: keypoints3D[18],
    //         left_index: keypoints3D[19],
    //         right_index: keypoints3D[20],
    //         left_thumb: keypoints3D[21],
    //         right_thumb: keypoints3D[22],
    //         left_hip: keypoints3D[23],
    //         right_hip: keypoints3D[24],
    //         left_knee: keypoints3D[25],
    //         right_knee: keypoints3D[26],
    //         left_ankle: keypoints3D[27],
    //         right_ankle: keypoints3D[28],
    //         left_heel: keypoints3D[29],
    //         right_heel: keypoints3D[30],
    //         left_foot_index: keypoints3D[31],
    //         right_foot_index: keypoints3D[32]
    //     }

    //     if(resetRef.current){
    //         console.log('here')
    //     }
    //     if(positions.set.isReady === false && !resetRef.current){
    //         findSet(key3D);
    //     } 
    //     else if (positions.set.isReady === true && positions.landing.isLanded === false && !resetRef.current){
    //         findBalance(key3D);
    //     } 
    //     else if (positions.landing.isLanded === true && positions.finish.isFinshed === false){
    //         findFinish(key3D); 
    //     }
    // }

    return (
        <div className='home__wrapper'>
            {/* <TrainingSettings setThrowing={setThrowing} setHeight={setHeight}/> */}
            {/* <div className='assessment__wrapper'>
                <WebcamSection positions={positions} resetRef={resetRef} handleChange={handleChange} assessmentRef={assessmentRef} training={training} setPositions={setPositions}/>
            </div> */}
                <TrainingSteps positions={positions} training={training} throwingDirection={throwingDirection} assessmentRef={assessmentRef} cmeterHeight={cmeterHeight} resetRef={resetRef}/>
                {/* <TrainingData positions={positions} /> */}
        </div>
    )
}

export default Home; 