import React, { useEffect, useState } from 'react'
import '@tensorflow/tfjs-backend-webgl';
import "../styles/home.css"
import WebcamSection from '../components/webcam';
import TrainingTypes from '../components/trainingTypes';
import TrainingSteps from '../components/trainingSteps'; 
// import TrainingData from '../components/trainingData'; 
import TrainingSettings from '../components/trainingSettings'; 
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
            isBalanced: false,
            peakDif: 0,
            prevDif: 0,
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

    function findSet(key){
        // console.log(key)
        // Logic for finding set positions
        console.log(positions.set.count)

        // If your hands are together
        if (Math.abs(key.left_wrist['x'] - key.right_wrist['x']) < 70 &&
        Math.abs(key.left_wrist['y'] - key.right_wrist['y']) < 20) {
            console.log('Together')
            // // The first instance of having them together
            if(positions.set.isTrue === false){
                let updatedSet = {...positions};
                updatedSet['set'].isTrue = true;
                updatedSet['set'].count = 1;
                updatedSet['set'].values = key; 
                setPositions({...updatedSet}); 
            } 
            // Else if it's not the first instance
            else {
                let strL_wrist = positions.set.values['left_wrist']
                let strR_wrist = positions.set.values['right_wrist']
                let strX = (strL_wrist['x'] + strR_wrist['x']) / 2;
                let curX = (key.left_wrist['x'] + key.right_wrist['x']) / 2;
                let strY = (strL_wrist['y'] + strR_wrist['y']) / 2;
                let curY = (key.left_wrist['y'] + key.right_wrist['y']) / 2;
                // If it's not the first instance your hands are not moving, and it's been less than a second. 
                if(Math.abs(strX - curX) < (strX/10) && Math.abs(strY - curY) < (strY/10) && positions.set.count < 20){
                    let updatedSet = {...positions};
                    updatedSet['set'].count = updatedSet['set'].count + 1 ;
                    setPositions({...updatedSet}); 
                }
                // if it's been more than a second. 
                if(positions.set.count >= 20){
                    console.log('1 second');
                    let updatedSet = {...positions};
                    updatedSet['set'].values = key;
                    updatedSet['set'].count = updatedSet['set'].count + 1;
                    updatedSet['set'].isReady = true;
                    updatedSet['balance'].values = key;
                    setPositions({...updatedSet}); 
                }
            }                       
            
        } 
        // // If your hands are not together then reset everything. 
        else {
            console.log('not together')
            let updatedSet = {...positions}
            updatedSet['set'].count = 0;
            updatedSet['set'].isTrue = false;
            setPositions({...updatedSet}); 
        } 
    }

    let directionArray = [];
    const Average = arr => arr.reduce((prev, current) => prev + current, 0) / arr.length; 
    
    function findBalance(key){
        
        let currentDirection = key[`${front}_knee`]['y'] - positions.balance.values[`${front}_knee`]['y'];
        currentDirection = Math.round(currentDirection);
        currentDirection = Math.abs(currentDirection);
        if(directionArray.length < 10){
            directionArray.unshift(currentDirection);
        } else {
            directionArray.pop()
            directionArray.unshift(currentDirection);
        }
        // Logic for finding the Direction of our leg.
        let AverageDirection = Average(directionArray); 
        // console.log(AverageDirection,positions.balance.prevDif)
        if(AverageDirection < 10){
            console.log('Leg on Ground')
            let updatedBalance = {...positions};
            updatedBalance['balance'].prevDif = AverageDirection;
            // updatedBalance['balance'].difCount = 0; 
            setPositions({...updatedBalance})
        } else if (AverageDirection > positions.balance.prevDif){
            console.log('Moving Up')
            let updatedBalance = {...positions};
            updatedBalance['balance'].prevDif = AverageDirection;
            setPositions({...updatedBalance})
        } else {
            console.log('Moving Down');
            let updatedBalance = {...positions};
            updatedBalance['balance'].prevDif = AverageDirection;
            updatedBalance['balance'].isBalanced = true;
            updatedBalance['landing'].values = key;  
            setPositions({...updatedBalance})
        }

        // Logic for finding our peak points
        if(currentDirection > positions.balance.peakDif){
            let updatedBalance = {...positions};
            updatedBalance['balance'].peakDif = currentDirection;
            updatedBalance['balance'].values = key;
            setPositions({...updatedBalance})
        }
    }

    function findLanding(key){
        // console.log(key);
        // So I'm going to check and make sure front foot is moving, either horizontally or vertiacally.
        let updatedLanding = {...positions};
        let vertMovement = Math.abs(key[`${front}_ankle`]['y'] - positions.landing.values[`${front}_ankle`]['y']).toFixed(0);
        let horMovement = Math.abs(key[`${front}_ankle`]['x'] - positions.landing.values[`${front}_ankle`]['x']).toFixed(0);
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
            findSet(key);
        } else if (positions.set.isReady === true && positions.balance.isBalanced === false){
            findBalance(key);
        } else if (positions.balance.isBalanced === true && positions.landing.isLanded === false){
            findLanding(key); 
        }
    }

    return (
        <div className='home__wrapper'>
            <div className='home__settings'>
                <TrainingSettings setSetting={setSetting}/>
            </div>
            <div className='home__top'>
                <TrainingTypes setTraining={setTraining}/>
                <WebcamSection positions={positions} handleChange={handleChange} training={training}/>
            </div>
                <TrainingSteps positions={positions}  throwingDirection={throwingDirection}/>
                {/* <TrainingData positions={positions} /> */}
        </div>
    )
}

export default Home; 