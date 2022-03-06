import React, {useState, useRef} from 'react';
import '../../styles/dailyDrills.css';

let drills = {
    armCare: [
        {
            name:'bands 1',
            description:'This is one where we use the bands in the first way we use bands.',
            reps: 8
        }, 
        {
            name:'bands 2',
            description:'This is one where we use the bands in the second way we use bands.',
            reps: 8
        }
    ],
    drills: [
        {
            name:'Drill 1',
            description: 'This is where we have a description of the first drill that we are goign to want to do today based on the strengths and weakensses of the player',
            reps: 8
        },
        {
            name:'Drill 1',
            description: 'This is where we have a description of the second drill that we are goign to want to do today based on the strengths and weakensses of the player',
            reps: 8
        }
    ]
}

function DailyDrills({ setShowDrills }){

    function findArmCareRoutine(){
        return drills.armCare.map((element, index) => {
            return (
                <div className='drill_wrapper'>
                    <h4 className='drill_name'>{element.name}</h4>
                    <h3>{element.description}</h3>
                    <h4 className='drill_reps'>0/{element.reps}</h4>
                    <button >Log</button>
                </div>
            )
        })
    }

    function findDailyDrills(){
        return drills.drills.map((element, index) => {
            return (
                <div className='drill_wrapper'>
                    <h4 className='drill_name'>{element.name}</h4>
                    <h3>{element.description}</h3>
                    <h4 className='drill_reps'>0/{element.reps}</h4>
                    <button >Log</button>
                </div>
            )
        })
    }



    return (
        <div id="drills_wrapper">
            <h1>Drills</h1>
            <div className='section__wrapper'>
                <h3>Arm Care Routine</h3>
                {
                    findArmCareRoutine()
                }
            </div>
            <br/>
            <div className='section__wrapper'>
                <h3>Daily Drills</h3>
                {
                    findDailyDrills()
                }
            </div>
            <button onClick={() => {setShowDrills(false)}}>Stop</button>
        </div>
    )
}

export default DailyDrills; 