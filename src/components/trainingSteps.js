import React, { useEffect } from 'react'
import '../styles/trainingSteps.css'
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

function TrainingSteps({positions}){

    useEffect(() => {
        // console.log(positions)
    }, [positions])


    function subSteps(key){
        if(key === 'set'){
            let leftShoulder = positions[key][5];
            let rightShoulder = positions[key][6];
            let leftFoot = positions[key][15];
            let rightFoot = positions[key][16];
            let shouldersClass;
            let feetClass; 

            if(positions[key].length > 0){
                let shoulderDistance = Math.abs(leftShoulder['x'] - rightShoulder['x']); 
                let footDistance = Math.abs(leftFoot['x'] - rightFoot['x'])
                console.log(Math.abs(shoulderDistance - footDistance))
                console.log(shoulderDistance, footDistance)
                if(Math.abs(shoulderDistance - footDistance) < (shoulderDistance * .1) ){
                    feetClass = 'training_subSteps active'
                } else {
                    feetClass = 'training_subSteps warning'
                }

                if(Math.abs(leftShoulder['y'] - rightShoulder['y']) < 50){
                    shouldersClass = 'training_subSteps active'
                } else {
                    shouldersClass = 'training_subSteps warning'
                }
            } else {
                shouldersClass = 'training_subSteps'
                feetClass = 'training_subSteps'
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
            </>
            )
        }
        else if (key === 'balance'){
            return (
                <>
                <div className='training_subSteps'>
                    <CheckCircleIcon />
                    <h4>Knee at/above 90</h4>
                </div>
                <div className='training_subSteps'>
                    <CheckCircleIcon />
                    <h4>Knee behind hip</h4>
                </div>
                <div className='training_subSteps'>
                    <CheckCircleIcon />
                    <h4>Even Shoulders</h4>
                </div>
                </>
                )
        } 
        else if (key === 'landing'){
            return (
                <>
                <div className='training_subSteps'>
                    <CheckCircleIcon />
                    <h4>Stride Length</h4>
                </div>
                <div className='training_subSteps'>
                    <CheckCircleIcon />
                    <h4>Elbows Above Shoulders</h4>
                </div>
                <div className='training_subSteps'>
                    <CheckCircleIcon />
                    <h4>Throwing arm at 90</h4>
                </div>
                <div className='training_subSteps'>
                    <CheckCircleIcon />
                    <h4>Shoulders tilted back</h4>
                </div>
                </>
                )
        } 
        else {
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