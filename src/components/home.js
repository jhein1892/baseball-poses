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
    let front = setting === 'left' ? 'right' : 'left';
    let back = setting === 'left' ? 'left' : 'right'; 
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

    // I want to use handleCHange as a controller, where depending on values we are going to fire off different functions, for example a findset() function. Within that function, I'm going to use an outside updateState function to pass in the key and the value, we want to update. Since all my values are second level this should be easy, it's just a questions on whether it's actually going to work or not. Hopefully this gives me some seperation between the incomming data and the updating work. 

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
            setPositions({...updatedBalance})
        }

        // Logic for finding our peak points
        if(currentDirection > positions.balance.peakDif){
            let updatedBalance = {...positions};
            updatedBalance['balance'].peakDif = currentDirection;
            updatedBalance['balance'].values = key;
        }
    }

    function findLanding(key){
        console.log(key);

    }

    // First check is directional. If our average is moving up, then we know that we haven't hit the peak yet. As soon as our average start moving down, then we know we have hit the peak and we can set balanced to true.
    // Second check is for the actual balance point values. We can just do single value checks for this. If our peak value is lower than current value, then we set the new peak value with the keys. 



    function handleChange(keypoints) {
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