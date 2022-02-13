import React, { useEffect } from 'react'
import '../styles/trainingSteps.css';
import AssessmentPitch from '../components/assessmentPitch';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import axios from 'axios';

const Data = 
[
    {
        pitch_number: 1,
        set_even_shoulders: true, 
        set_feet_width: true, 
        pause: true, 
        balance_knee_y: true, 
        balance_knee_x: false,
        balance_even_shoulders: true, 
        stride_length: 1.1, 
        elbows_above_shoulders: false, 
        arm_angle: 115,
        shoulder_tilt: true
    },
    {
        pitch_number: 2,
        set_even_shoulders: true, 
        set_feet_width: true, 
        pause: true, 
        balance_knee_y: true, 
        balance_knee_x: false,
        balance_even_shoulders: true, 
        stride_length: 1.3, 
        elbows_above_shoulders: false, 
        arm_angle: 90,
        shoulder_tilt: true
    },
    {
        pitch_number: 3,
        set_even_shoulders: true, 
        set_feet_width: true, 
        pause: true, 
        balance_knee_y: true, 
        balance_knee_x: false,
        balance_even_shoulders: true, 
        stride_length: 1.2, 
        elbows_above_shoulders: false, 
        arm_angle: 100,
        shoulder_tilt: true
    },

]


function TrainingSteps({positions, throwingDirection, cmeterHeight, resetRef}){

    const { front, back } = throwingDirection; 

    function createData(){
        let newData = {}
        newData['pause'] = true; 
        let leftShoulderSet = positions['set'].values['left_shoulder'];
        let rightShoulderSet = positions['set'].values['right_shoulder'];
        let leftFootSet = positions['set'].values['left_ankle'];
        let rightFootSet = positions['set'].values['right_ankle'];
        let rightShoulderBalance = positions.balance.peakValues.right_shoulder;
        let leftShoulderBalance = positions.balance.peakValues.left_shoulder;
        let frontHipBalance = positions.balance.peakValues[`${front}_hip`];
        let frontKneeBalance = positions.balance.peakValues[`${front}_knee`]; 
        let backShoulderLanding = positions.landing.values[`${back}_shoulder`];
        let frontShoulderLanding = positions.landing.values[`${front}_shoulder`]; 
        let backElbowLanding = positions.landing.values[`${back}_elbow`];
        let frontElbowLanding = positions.landing.values[`${front}_elbow`];
        let backWristLanding = positions.landing.values[`${back}_wrist`];
        let frontFootLanding = positions.landing.values[`${front}_foot_index`];
        let backFootLanding = positions.landing.values[`${back}_foot_index`]; 

        console.log(positions);

        let shoulderDistance = Math.abs(leftShoulderSet['x'] - rightShoulderSet['x']); 
        let footDistance = Math.abs(leftFootSet['x'] - rightFootSet['x']);
        // Distance from shoulder to elbow
        let lowArmDist = Math.sqrt(Math.pow(Math.abs((backShoulderLanding['x'] - backElbowLanding['x'])) , 2) + Math.pow(Math.abs((backShoulderLanding['y'] - backElbowLanding['y'])) , 2));
        // Distance from elbow to wrist
        let highArmDist = Math.sqrt(Math.pow(Math.abs((backElbowLanding['x'] - backWristLanding['x'])) , 2) + Math.pow(Math.abs((backElbowLanding['y'] - backWristLanding['y'])) , 2));
        // Distance from shoulder to wrist
        let hypoArmDist = Math.sqrt(Math.pow(Math.abs((backShoulderLanding['x'] - backWristLanding['x'])) , 2) + Math.pow(Math.abs((backShoulderLanding['y'] - backWristLanding['y'])) , 2));

        let consineElbow = Math.acos(((highArmDist ** 2) + (lowArmDist ** 2 ) - (hypoArmDist ** 2) ) / (2 * highArmDist * lowArmDist));
        let degreeElbow = (consineElbow * 180)/ Math.PI; 
        // console.log(lowArmDist, highArmDist, hypoArmDist, consineElbow, degreeElbow);

        let strideLengthMeters = Math.abs(backFootLanding['x'] - frontFootLanding['x']);
        console.log(strideLengthMeters * 100, cmeterHeight); 

        if(Math.abs(shoulderDistance - footDistance) < (shoulderDistance * .2) ){
            newData['set_feet_width'] = true; 
        } else {
            newData['set_feet_width'] = false;
        }
        if(Math.abs(leftShoulderSet['y'] - rightShoulderSet['y']) < 50){
            newData['set_even_shoulders'] = true; 
        } else {
            newData['set_even_shoulders'] = false; 
        }
        if(Math.abs(leftShoulderBalance['y'] - rightShoulderBalance['y']) < 0.05){
            newData['balance_even_shoulders'] = true; 
        } else {
            newData['balance_even_shoulders'] = false;
        }
        if(front === 'left'){
            if(frontKneeBalance['x'] < frontHipBalance['x']){
                newData['balance_knee_x'] = true; 
            } else {
                newData['balance_knee_x'] = false; 
            }
        } else {
            if(frontKneeBalance['x'] > frontHipBalance['x']){
                newData['balance_knee_x'] = true; 
            } else {
                newData['balance_knee_x'] = false; 
            }
        }
        if(positions.balance.peakVal < 0){
            newData['balance_knee_y'] = true; 
        } else {
            newData['balance_knee_y'] = false; 
        }
    /*******************************************************************
        Getting a proper number now, but the angles are kind of off.
        Might need to find a way to gather initial information about 
        the players height and the distance between body parts before 
        we start. Something like making them stand still in neutral 
        position before starting the session would be good. For now I'm 
        just going to expand the angles a little more than I would like 
        to make up for it. 
    *******************************************************************/
        if(parseFloat(frontElbowLanding['y']) < parseFloat(frontShoulderLanding['y'])){
            newData['elbows_above_shoulders'] = true; 
        } else {
            newData['elbows_above_shoulders'] = false; 
        }
        newData['arm_angle'] = degreeElbow; 
        if(parseFloat(backShoulderLanding['y']) > parseFloat(frontShoulderLanding['y'])){
            newData['shoulder_tilt'] = true; 
        } else {
            newData['shoulder_tilt'] = false; 
        }
 
        newData['stride_length'] = strideLengthMeters; 

        console.log(newData);

        Data.push(newData);
    }

    useEffect(() => {
       function fetchAssessmentData() {
           let userid = 1
            axios.get(`http://localhost:3001/assessments/${userid}`)
            .then((response) => {
                console.log(response.data)
            })
        }
        fetchAssessmentData();
    },[])

    useEffect(() => {
        if(resetRef.current){
            createData(); 
        }
    },[resetRef.current])


    function previousPitches() {

        return Data.map((pitch) => {
            return (
                <AssessmentPitch pitch={pitch}/>
            )
        })
    }

    return (
        <div className='training_steps__wrapper'>
            <table id="assessment__table">
                <thead>
                    <tr>
                        <th></th>
                        <th>Even Shoulders</th>
                        <th>Feet Shoulder Width</th>
                        <th>1 Second Pause</th>
                        <th>Knee at/above 90</th>
                        <th>Knee behind hip</th>
                        <th>Even Shoulders</th>
                        <th>Stride Length</th>
                        <th>Elbows Above Shoulders</th>
                        <th>Throwing arm from 85&#176;-95&#176;</th>
                        <th>Shoulders tilted back</th>
                    </tr>
                </thead>
                <tbody>
                    {previousPitches()}
                </tbody>
            </table>
        </div>
    )
}

export default TrainingSteps; 