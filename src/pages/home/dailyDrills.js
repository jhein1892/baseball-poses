import React, {useState, useRef, useEffect, useCallback} from 'react';
import { useCookies } from 'react-cookie';
import ReactPlayer from 'react-player'
import '../../styles/dailyDrills.css';


function DailyDrills({ setShowDrills, drillData }){
    const [armCare, setArmCare] = useState([]);
    const [drillShowing, setDrillShowing] = useState([0, 'armCare']);
    const [coreDrills, setCoreDrills] = useState([]);
    const [pitchingDrills, setPitchingDrills] = useState([]);    
    

    useEffect(() => {
        setArmCare(drillData.armCare);
        setCoreDrills(drillData.core);
        setPitchingDrills(drillData.pitching);
    },[])

function handleCompletedTask(event, index){
    event.preventDefault();
    let newDrillShowing;
    if(event.target.id.includes('armCare')){
        if(index === 6){
            newDrillShowing = [0, 'pitching'];
        } else {
            newDrillShowing = [(drillShowing[0]+1), drillShowing[1]];
        }
    } else if (event.target.id.includes('pitching')){
        if(index === 4){
            newDrillShowing = [0, 'core'];
        } else {
            newDrillShowing = [(drillShowing[0]+1), drillShowing[1]];
        }
    } else {
        newDrillShowing = [(drillShowing[0]+1), drillShowing[1]];
    }
    setDrillShowing(newDrillShowing);
}

    useEffect(() => {
        console.log(drillShowing)
    }, [drillShowing])

    const findArmCare = () => {
            return armCare.map((drill, index) => {
                let drillSet = drillShowing[1] === 'armCare' ? true: false;
                let wrapperClass = 'drill__wrapper';
                if(drillShowing[0] - index >= 1 || !drillSet){
                    wrapperClass += " drillcomplete"
                }
                else if(drillShowing[0] === index && drillSet){
                    wrapperClass += " open"
                } else if (drillShowing[0] === index-1 && drillSet){
                    wrapperClass += " next"
                } else if (drillShowing[0] - index < 2 && drillSet){
                    wrapperClass += " hole"
                }

                return (
                    <>
                        <div className={wrapperClass}>
                            <div className='drill__top'>
                                <h3>{drill.name}</h3>
                                <h4>Reps: {drill.reps}</h4>
                            </div>
                            <div className='drill__lower'>
                                <div>
                                    <h4 className='drill__subheader'>Description</h4>
                                    <p>{drill.description}</p>
                                </div>
                                <ReactPlayer 
                                    url='https://www.youtube.com/embed/pIcDbF-KjMs?start=60&end=93'
                                    playing={true}
                                    light={true}
                                    />
                            </div>
                            <button
                                id ={`armCare-${index}`}
                                onClick={(event) => handleCompletedTask(event, index)}>Completed</button>
                        </div>
                    </>
                )
            })
        }

    const findPitchingDrills = () => {
        return pitchingDrills.map((drill, index) => {
            let drillSet = drillShowing[1] === 'pitching' ? true: false;
            let wrapperClass = 'drill__wrapper';
            if((drillShowing[0] - index >= 1 && drillSet) || drillShowing[1] === 'core'){
                wrapperClass += " drillcomplete"
            }
            else if(drillShowing[0] === index && drillSet){
                wrapperClass += " open"
            } else if (drillShowing[0] === index-1 && drillSet){
                wrapperClass += " next"
            } else if (drillShowing[0] - index < 2 || (!drillSet && drillShowing[1] !== 'armCare')){
                wrapperClass += " hole"
            }
            return (
                <>
                    <div className={wrapperClass}>
                        <div className='drill__top'>
                            <h3>{drill.name}</h3>
                            <h4>Reps: {drill.reps}</h4>
                            <h4>Sets: {drill.sets}</h4>
                        </div>
                        <div className='drill__lower'>
                            <div>
                                <h4 className='drill__subheader'>Description</h4>
                                <p>{drill.description}</p>
                            </div>
                            {/* <p>{drill.description}</p> */}
                        </div>
                        <button
                            id ={`pitching-${index}`}
                            onClick={(event) => handleCompletedTask(event, index)}>Completed</button>
                    </div>
                </>
            )
        })
    }

    const findCoreDrills = () => {
        return coreDrills.map((drill, index) => {
            let drillSet = drillShowing[1] === 'core' ? true: false;
            let wrapperClass = 'drill__wrapper';
            if((drillShowing[0] - index >= 1 && drillSet)){
                wrapperClass += " drillcomplete"
            }
            else if(drillShowing[0] === index && drillSet){
                wrapperClass += " open"
            } else if (drillShowing[0] === index-1 && drillSet){
                wrapperClass += " next"
            } else if (drillShowing[0] - index < 2 || (!drillSet && (drillShowing[1] !== 'armCare' || drillShowing[1] !== 'pitching'))){
                wrapperClass += " hole"
            }
            return (
                <>
                    <div className={wrapperClass}>
                        <div className='drill__top'>
                            <h3>{drill.name}</h3>
                            <h4>Reps: {drill.reps}</h4>
                            <h4>Sets: {drill.sets}</h4>
                        </div>
                        <div className='drill__lower'>
                            <div>
                                <h4 className='drill__subheader'>Description</h4>
                                <p>{drill.description}</p>
                            </div>
                            {/* <p>{drill.description}</p> */}
                        </div>
                        <button
                            id ={`core-${index}`}
                            onClick={(event) => handleCompletedTask(event, index)}>Completed</button>
                    </div>
                </>
            )
        })
    }

    return (
        <div id="drills_wrapper">
            <div className='section__wrapper'>
                { drillShowing[1] === 'armCare' && drillShowing[0] !== 7 &&
                    <h2>Arm Care Routine</h2>
                }
                {armCare && 
                    findArmCare()
                }
            </div>
            <div className='section__wrapper'>
                { drillShowing[1] !== 'core' &&
                    <h2>Daily Drills</h2>
                }
                {pitchingDrills &&
                    findPitchingDrills()
                }
            </div>
            <div className='section__wrapper'>
                {(drillShowing[1] === 'core'|| drillShowing[1] === 'pitching') && drillShowing[0] !== 3 &&
                    <h2>Daily Core</h2>
                }
                {coreDrills &&
                    findCoreDrills()
                }
            </div>
            {drillShowing[1] === 'core' && drillShowing[0] === 3 &&
                <h2>Woohoo! You've finished todays Training! </h2>
            }
            <button onClick={() => {setShowDrills(false)}}>Stop</button>
        </div>
    )
}

export default DailyDrills; 