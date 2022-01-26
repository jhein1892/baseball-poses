import React, { useEffect } from 'react'
import '../styles/trainingSteps.css'
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import {beep} from '../functions/utils';

function TrainingSteps({positions, throwingDirection, cmeterHeight}){

    const { front, back } = throwingDirection; 
    useEffect(() => {
        // console.log(positions)  
    }, [positions])
    let trainingStep = 'training_subSteps'; 

    function subSteps(key){
        if(key === 'set'){
            let leftShoulder = positions[key].values['left_shoulder'];
            let rightShoulder = positions[key].values['right_shoulder'];
            let leftFoot = positions[key].values['left_ankle'];
            let rightFoot = positions[key].values['right_ankle']; 
            let shouldersClass = trainingStep
            let feetClass = trainingStep
            let pauseClass = trainingStep

            if(positions.set['isReady'] === true){

                let shoulderDistance = Math.abs(leftShoulder['x'] - rightShoulder['x']); 
                let footDistance = Math.abs(leftFoot['x'] - rightFoot['x'])
                // console.log(Math.abs(shoulderDistance - footDistance))
                // console.log(shoulderDistance, footDistance)
                pauseClass += ' active';
                if(Math.abs(shoulderDistance - footDistance) < (shoulderDistance * .2) ){
                    feetClass += ' active'
                } else {
                    feetClass += ' warning'
                }
                // console.log(leftShoulder['y'], rightShoulder['y'])
                if(Math.abs(leftShoulder['y'] - rightShoulder['y']) < 50){
                    shouldersClass += ' active'
                } else {
                    shouldersClass += ' warning'
                }
            }
            return (
            <>
            <div className={shouldersClass}>
                <CheckCircleIcon />
                <h4>Even Shoulders</h4>
            </div>
            <div className={feetClass}>
                <CheckCircleIcon />
                <h4>Feet Shoulder Width</h4>
            </div>
            <div className={pauseClass}>
                <CheckCircleIcon />
                <h4>1 Second Pause</h4>
            </div>
            </>
            )
        }
        else if (key === 'balance'){
            let right_shoulder = positions.balance.peakValues.right_shoulder;
            let left_shoulder = positions.balance.peakValues.left_shoulder;
            let front_hip = positions.balance.peakValues[`${front}_hip`];
            let front_knee = positions.balance.peakValues[`${front}_knee`]; 
            let balanceClass = 'training_subSteps'; 
            let kneeYClass = trainingStep
            let kneeXClass = trainingStep
            let shoulderClass = trainingStep
            if(positions.landing['isLanded'] === true){
                console.log(positions)
                console.log(Math.abs(left_shoulder['y'] - right_shoulder['y']))
                console.log(front_knee['x'], front_hip['x'])
                console.log(front_knee['y'], front_hip['y'])
                console.log(positions.balance.peakVal)
                if(Math.abs(left_shoulder['y'] - right_shoulder['y']) < 0.05){
                    shoulderClass += " active";
                } else {
                    shoulderClass += " warning";
                }
                if(front === 'left'){
                    if(front_knee['x'] < front_hip['x']){
                        kneeXClass += " active"
                    } else {
                        kneeXClass += " warning"
                    }
                } else {
                    if(front_knee['x'] > front_hip['x']){
                        kneeXClass += " active"
                    } else {
                        kneeXClass += " warning"
                    }
                }
                if(positions.balance.peakVal < 0){
                    kneeYClass += " active"
                } else {
                    kneeYClass += " warning"
                }

                // // console.log(positions.balance.values)
                // }
            }
            return (
                <>
                <div className={kneeYClass}>
                    <CheckCircleIcon />
                    <h4>Knee at/above 90</h4>
                </div>
                <div className={kneeXClass}>
                    <CheckCircleIcon />
                    <h4>Knee behind hip</h4>
                </div>
                <div className={shoulderClass}>
                    <CheckCircleIcon />
                    <h4>Even Shoulders</h4>
                </div>
                </>
                )
        } 
        else if (key === 'landing'){
            let strideClass = trainingStep
            let aboveClass = trainingStep;
            let degreeClass = trainingStep;
            let tiltClass = trainingStep;

            let backShoulder = positions.landing.values[`${back}_shoulder`];
            let frontShoulder = positions.landing.values[`${front}_shoulder`]; 
            let backElbow = positions.landing.values[`${back}_elbow`];
            let backWrist = positions.landing.values[`${back}_wrist`];
            let frontFoot = positions.landing.values[`${front}_foot_index`];
            let backFoot = positions.landing.values[`${back}_foot_index`]; 

            let myHeight = 185; 
            
            /*
                 ok, so going to make an imput for height, then we know how many meters they are tall. Then I can take that and compare to the difference between front and back foot for the stride length to height. 
            */

            if(positions.landing['isLanded'] === true){
                // Distance from shoulder to elbow
                let lowArmDist = Math.sqrt(Math.pow(Math.abs((backShoulder['x'] - backElbow['x'])) , 2) + Math.pow(Math.abs((backShoulder['y'] - backElbow['y'])) , 2));
                // Distance from elbow to wrist
                let highArmDist = Math.sqrt(Math.pow(Math.abs((backElbow['x'] - backWrist['x'])) , 2) + Math.pow(Math.abs((backElbow['y'] - backWrist['y'])) , 2));
                // Distance from shoulder to wrist
                let hypoArmDist = Math.sqrt(Math.pow(Math.abs((backShoulder['x'] - backWrist['x'])) , 2) + Math.pow(Math.abs((backShoulder['y'] - backWrist['y'])) , 2));

                let consineElbow = Math.acos(((highArmDist ** 2) + (lowArmDist ** 2 ) - (hypoArmDist ** 2) ) / (2 * highArmDist * lowArmDist));
                let degreeElbow = (consineElbow * 180)/ Math.PI; 
                // console.log(lowArmDist, highArmDist, hypoArmDist, consineElbow, degreeElbow);

                let strideLengthMeters = Math.abs(backFoot['x'] - frontFoot['x']);
                console.log(strideLengthMeters * 100, cmeterHeight); 

            /*******************************************************************
                Getting a proper number now, but the angles are kind of off.
                Might need to find a way to gather initial information about 
                the players height and the distance between body parts before 
                we start. Something like making them stand still in neutral 
                position before starting the session would be good. For now I'm 
                just going to expand the angles a little more than I would like 
                to make up for it. 
            *******************************************************************/

                console.log(positions.landing.values); 
                if(parseFloat(backElbow['y']) < parseFloat(backShoulder['y'])){
                    aboveClass += ' active';
                } else {
                    aboveClass += ' warning';
                }
                if(degreeElbow <= 115 && degreeElbow >= 75){
                    degreeClass += ' active';
                } else {
                    degreeClass += ' warning';
                }
                if(parseFloat(backShoulder['y']) > parseFloat(frontShoulder['y'])){
                    tiltClass += ' active';
                } else {
                    tiltClass += ' warning';
                }
                if(Math.abs(strideLengthMeters - cmeterHeight) < (cmeterHeight * 0.1)){
                    strideClass += ' active'; 
                } else {
                    strideClass += ' warning'; 
                }
            }
            return (
                <>
                    <div className={strideClass}>
                        <CheckCircleIcon />
                        <h4>Stride Length</h4>
                    </div>
                    <div className={aboveClass}>
                        <CheckCircleIcon />
                        <h4>Elbows Above Shoulders</h4>
                    </div>
                    <div className={degreeClass}>
                        <CheckCircleIcon />
                        <h4>Throwing arm from 85&#176;-95&#176;</h4>
                    </div>
                    <div className={tiltClass}>
                        <CheckCircleIcon />
                        <h4>Shoulders tilted back</h4>
                    </div>
                </>
                )
        } 
        else if (key === 'finish') {
            /*
                1) Glove not below either belt?
                   - Can figure out something more specific later but this is a big one
                2) Head looking at target
                3) leg bracing
                4) Not have curl in your back (not sure how I would do this one)
             */

            return (
                <>
                <div className='training_subSteps'>
                    <CheckCircleIcon />
                    <h4>Front Leg Brace</h4>
                </div>
                <div className='training_subSteps'>
                    <CheckCircleIcon />
                    <h4>Feet Shoulder Width</h4>
                </div>
                </>
                )
        }

    }

    const mySteps = () => {
        let myKeys = Object.keys(positions)
        return myKeys.map((key) => {
            let classname; 
            if(positions[key].length > 0){
                console.log('here')
                classname = 'training_steps active'
            } else {
                classname = 'training_steps'
            }
            return(
                <div id={key} className={classname}>
                    <div className='training_steps_icons'>
                        <CheckCircleIcon />
                        <h1>{key}</h1>
                    </div>
                    {subSteps(key)}
                </div>
            )
        })
    }

    let myTrainingSteps = mySteps()
    return (
        <div className='training_steps__wrapper'>
            {/* <h1>Training Steps</h1> */}
            <div className = 'training_steps__inner'>
                {myTrainingSteps}
            </div>
        </div>
    )
}

export default TrainingSteps; 