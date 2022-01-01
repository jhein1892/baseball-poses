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
            difCount: 0
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

    // I want to use handleCHange as a controller, where depending on values we are going to fire off different functions, for example a findset() function. Within that function, I'm going to use an outside updateState function to pass in the key and the value, we want to update. Since all my values are second level this should be easy, it's just a questions on whether it's actually going to work or not. Hopefully this gives me some seperation between the incomming data and the updating work. 

    function findSet(key){
        // Logic for finding set positions
        console.log(positions.set.count)

        // If your hands are together
        if (Math.abs(key.L_wrist['x'] - key.R_wrist['x']) < 70 &&
        Math.abs(key.L_wrist['y'] - key.R_wrist['y']) < 5) {

            // The first instance of having them together
            if(positions.set.isTrue === false){
                let updatedSet = {...positions};
                updatedSet['set'].isTrue = true;
                updatedSet['set'].count = 1;
                updatedSet['set'].values = key; 
                setPositions({...updatedSet}); 
            } 
            // Else if it's not the first instance
            else {
                let strL_wrist = positions.set.values['L_wrist']
                let strR_wrist = positions.set.values['R_wrist']
                let strX = (strL_wrist['x'] + strR_wrist['x']) / 2;
                let curX = (key.L_wrist['x'] + key.R_wrist['x']) / 2;
                let strY = (strL_wrist['y'] + strR_wrist['y']) / 2;
                let curY = (key.L_wrist['y'] + key.R_wrist['y']) / 2;
                // If it's not the first instance your hands are not moving, and it's been less than a second. 
                if(Math.abs(strX - curX) < (strX/10) && Math.abs(strY - curY) < (strY/10) && positions.set.count < 20){
                    console.log('Getting here'); 
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
        // If your hands are not together then reset everything. 
        else {
            console.log('not together')
            let updatedSet = {...positions}
            updatedSet['set'].count = 0;
            updatedSet['set'].isTrue = false;
            setPositions({...updatedSet}); 
        } 
    }

    function findBalance(key){
        // Logic for finding balance point
        let currentDirection = key.R_knee['y'] - positions.balance.values['R_knee']['y'];
        currentDirection = Math.round(currentDirection);
        currentDirection = Math.abs(currentDirection);
        
        // If we have a small difference, I'm assuming that it's just the model jumping around, so we are going to just ignore that one. 
        if(Math.abs(currentDirection - positions.balance.prevDif) < 2){
            let updatedBalance = {...positions};
            updatedBalance['balance'].prevDif = currentDirection;
            updatedBalance['balance'].difCount = 0; 
            setPositions({...updatedBalance})
        }
        else if(currentDirection > positions.balance.peakDif){
            let updatedBalance = {...positions};
            updatedBalance['balance'].peakDif = currentDirection;
            updatedBalance['balance'].values = key;
            updatedBalance['balance'].difCount = 0; 
            setPositions({...updatedBalance})
        } 
        else if (currentDirection < positions.balance.peakDif ){
            let updatedBalance = {...positions};
            updatedBalance['balance'].difCount = updatedBalance['balance'].difCount + 1;
            if(updatedBalance['balance'].difCount > 3){
                updatedBalance['balance'].isBalanced = true; 
            }
            setPositions({...updatedBalance})
        } 
        if(positions.balance.isBalanced === true){
            console.log('Balance Point');
        }
    }



    function handleChange(keypoints) {
        if(keypoints === undefined){
            console.log('undefined');
            return 0; 
        }
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

        if(positions.set.isReady === false){
            // Need to make this function
            findSet(key);
        } else if (positions.set.isReady === true && positions.balance.isBalanced === false){
            findBalance(key);
        } 
    }

























    // function handleChange(keypoints){
    //     if(keypoints === undefined){
    //         console.log('undefined')
    //         return 0;
    //     }

    //     // Pre Set position
    //     if(positions.set.isReady === false){
 
    //     }
    //     // Set Position established. Ready to move to balance point.

    //     // As soon as we hit this value to detection glitches out. 
    //     //  I wonder if moving these to outside functions is going to help this out. 
    //     else if (positions.set.isReady === true && positions.balance.isBalanced === false){

    //     } else if (positions.balance.isBalanced === true){
    //         console.log('BALANCE POINT'); 
    //     } else {
    //         console .log('Nothing')
    //     }

    // }

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