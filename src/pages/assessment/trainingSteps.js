import React, { useEffect, useState } from 'react'
import '../../styles/trainingSteps.css';
import AssessmentPitch from './assessmentPitch';
import axios from 'axios';
import { useCookies } from 'react-cookie';

function TrainingSteps({positions, training, throwingDirection, assessmentRef, cmeterHeight, resetRef, assessmentComplete }){
    const [cookies, setCookie] = useCookies('userid'); 
    const [assessmentData, setAssessmentData] = useState([]);
    const [movementData, setMovementData] = useState({
        balance: true,
        landing: true,
        arm: false,
        set: true,
        finish: false
    });
    const [assessment, setAssessment] = useState([]); 
    const { front, back } = throwingDirection; 
    let newData = {}

    function createData(){
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
            setMovementData(prev => ({...prev, ['set']: false}));
        }
        if(Math.abs(leftShoulderSet['y'] - rightShoulderSet['y']) < 50){
            newData['set_even_shoulders'] = true; 
        } else {
            newData['set_even_shoulders'] = false; 
            setMovementData(prev => ({...prev, ['set']: false}));
        }
        if(Math.abs(leftShoulderBalance['y'] - rightShoulderBalance['y']) < 0.05){
            newData['balance_even_shoulders'] = true; 
        } else {
            newData['balance_even_shoulders'] = false;
            setMovementData(prev => ({...prev, ['balance']: false}));
        }
        if(front === 'left'){
            if(frontKneeBalance['x'] < frontHipBalance['x']){
                newData['balance_knee_x'] = true; 
            } else {
                newData['balance_knee_x'] = false;
                setMovementData(prev => ({...prev, ['balance']: false}));
            }
        } else {
            if(frontKneeBalance['x'] > frontHipBalance['x']){
                newData['balance_knee_x'] = true; 
            } else {
                newData['balance_knee_x'] = false;
                setMovementData(prev => ({...prev, ['balance']: false}));
            }
        }
        if(positions.balance.peakVal < 0){
            newData['balance_knee_y'] = true; 
        } else {
            newData['balance_knee_y'] = false;
            setMovementData(prev => ({...prev, ['balance']: false}));
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
            setMovementData(prev => ({...prev, ['arm']: false}));
        }
        newData['arm_angle'] = degreeElbow; 
        if(parseFloat(backShoulderLanding['y']) > parseFloat(frontShoulderLanding['y'])){
            newData['shoulder_tilt'] = true; 
        } else {
            newData['shoulder_tilt'] = false;
            setMovementData(prev => ({...prev, ['arm']: false}));
        }
        if(Math.abs((strideLengthMeters * 100) - cmeterHeight) > (cmeterHeight * 0.1)){
            setMovementData(prev => ({...prev, ['landing']: false})); 
        }
 
        newData['stride_length'] = strideLengthMeters; 
        newData['assessment_id'] = assessmentRef.current;

        submitNewPitch(newData); 
    }

    function submitNewPitch(data){
        let userid = cookies.userid; 
        axios.put(`${process.env.REACT_APP_API}/pitch/${userid}`,{data})
        .then((response) => {
            if(response.error){
                console.log(response.error)
            } 
            data['userid'] = userid;
            console.log(data);
            setAssessmentData([...assessmentData, data])
        })
    }

    function previousPitches(id) {
        // console.log(id)
        let displayData = assessmentData.filter(pitch => pitch.assessment_id === id);
        // console.log(displayData)
        return displayData.map((pitch, index) => {
            return (
                <AssessmentPitch key={`${index}-${pitch.id}`} pitch={pitch} height={cmeterHeight}/>
            )
        })
    }

    function previousAssessments(){
        if(assessment.length > 0){
            return assessment.map((assess, index) => {
                let d = new Date(assess.assessment_date);
                d = d.toDateString();
                return (
                    <table key={`${assess.id}-assessment`} id="assessment__table">
                        {/* <colgroup span='5'></colgroup>
                        <colgroup span='5'></colgroup> */}
                            <thead>
                                <tr className='assessment_info'>
                                    {/* <th colSpan='5'>Assessment Type: {assess.type}</th> */}
                                    <th colSpan='10'>{d}</th>
                                </tr>
                            </thead>
                            <thead>
                                <tr className='assessment_data_head'>
                                    <th colSpan='1'>Even Shoulders</th>
                                    <th colSpan='1'>Feet Shoulder Width</th>
                                    <th colSpan='1'>1 Second Pause</th>
                                    <th colSpan='1'>Knee at/above 90</th>
                                    <th colSpan='1'>Knee behind hip</th>
                                    <th colSpan='1'>Even Shoulders</th>
                                    <th colSpan='1'>Stride Length</th>
                                    <th colSpan='1'>Elbows Above Shoulders</th>
                                    <th colSpan='1'>Throwing arm from 85&#176;-95&#176;</th>
                                    <th colSpan='1'>Shoulders tilted back</th>
                                </tr>
                            </thead>
                        <tbody>
                            { assessmentData &&
                                previousPitches(assess.id)
                            }
                        </tbody>
                    </table>
                )
            })
        }
    }

    function fetchAssessmentData() {
        let userid = cookies.userid;
         axios.get(`${process.env.REACT_APP_API}/assessments/current/${userid}`)
         .then((response) => {
             setAssessmentData(response.data.pitches);
             setAssessment(response.data.assessments); 
         })
    }                                                                 

    function updatedMovementData(){
        let assessmentID = assessmentRef.current; 
        axios.patch(`${process.env.REACT_APP_API}/assessments/current/${assessmentID}`, {movements:movementData, userid:cookies.userid})
        .then((response) => {
            let data = response.data;
            if(data['error_patch']){
                console.log("An error occured")
            } else {
                console.log(response); 
            }
        })
    }

     useEffect(() => {
         console.log(assessmentRef.current, resetRef.current)
         if(assessmentRef.current){
            fetchAssessmentData();              
         }
     },[assessmentRef.current]);

     useEffect(() => {
        console.log('pitch added');
     },[assessmentData])

     useEffect(() => {
        if(assessmentComplete){
            updatedMovementData(); 
        }
     },[assessmentComplete])

    useEffect(() => {
        if(resetRef.current){
            console.log('reset ref')
            // createData(); 
        }
    },[resetRef.current])

    return (
        <div className='training_steps__wrapper'>
            {assessment && 
                previousAssessments()
            }
        </div>
    )
}

export default TrainingSteps; 
