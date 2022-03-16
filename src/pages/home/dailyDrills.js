import React, {useState, useRef, useEffect} from 'react';
import { useCookies } from 'react-cookie';
import '../../styles/dailyDrills.css';


function DailyDrills({ setShowDrills, drillData }){
    const [armCare, setArmCare] = useState([]);
    const [showDescription, setShowDescription] = useState()
    const [coreDrills, setCoreDrills] = useState([]);
    const [pitchingDrills, setPitchingDrills] = useState([]);    
    

    useEffect(() => {
        setArmCare(drillData.armCare);
        setCoreDrills(drillData.core);
        setPitchingDrills(drillData.pitching);
        console.log(drillData)
    },[])

    function handleShowDescription(event){
        event.preventDefault();
        let id = event.target.id; 
        if(showDescription === id){
            setShowDescription('');
        } else {
            setShowDescription(id);
        }
    }

    function findArmCare(){
        return armCare.map((drill, index) => {
            return (
                <>
                <div className='drill__wrapper'>
                    <div className='drill__top'>
                        <h4 className='drill__name'>{drill.name}</h4>
                        <p className='drill__reps'>Reps:{drill.reps}</p>
                        <p className='drill__arms'>Arms:{drill.numberOfArms}</p>
                        <button id={`${drill.drillID}-armCare`} className='drill__button' onClick={(event) => handleShowDescription(event)}>Show Description</button>
                    </div>
                    {showDescription === `${drill.drillID}-armCare` &&
                        <p className='drill__description'>{drill.description}</p>
                    }
                </div>
                </>
            )
        })
    }


    return (
        <div id="drills_wrapper">
            <h1>Drills</h1>
            <div className='section__wrapper'>
                <h3>Arm Care Routine</h3>
                {armCare && 
                        findArmCare()
  
                }
            </div>
            <div className='section__wrapper'>
                <h3>Daily Drills</h3>
            </div>
            <div className='section__wrapper'>
                <h3>Daily Core</h3>
            </div>
            <button onClick={() => {setShowDrills(false)}}>Stop</button>
        </div>
    )
}

export default DailyDrills; 