import React, {useState} from 'react'
import '../styles/trainingType.css'

function TrainingTypes({setTraining, training}){
    const [checked, setChecked] = useState('')
    
    const handleChange = (event) => {
        let targetTraining = event.target.name
        if(event.target.checked === true){
            setTraining(targetTraining);
            setChecked(targetTraining)
        } else {
            setTraining('')
            setChecked('')
        }
    }


    return(
        <div className='trainingType__container'>
            <h1>Choose Training Type:</h1>
            <p>The type of training you decide to do depends on the Models that are run on your mechanics. If you would like to switch your training, please stop the video, choose another training type and start the video again</p>
            <div className='trainingType__inner'>
                <div className='training_selection'>
                    <div>
                        <input 
                            key='full' 
                            type='checkbox' 
                            name='full' 
                            onChange={handleChange}
                            checked={checked === 'full'}
                        />
                        <h4>Full Assessment:</h4>
                    </div>
                    <p>A full assessment if your complete delivery will be run.</p>
                </div>
                <div className='training_selection'>
                    <div>
                        <input 
                            type='checkbox' 
                            disabled 
                            name='legLift' 
                            onChange={handleChange}
                            checked={checked === 'legLift'}
                        />
                        <h4>Leg Lift</h4>
                    </div>
                    <p>An assessment of your front leg angle from set to balance point will be run.</p>
                </div>
                <div className='training_selection'>
                    <div>
                        <input 
                            type='checkbox' 
                            disabled 
                            name='bal-land' 
                            onChange={handleChange}
                            checked={checked === 'bal-land'}
                        />
                        <h4>Balance-Landing</h4>
                    </div>
                    <p>An assessment of your mechanics from your balance point to your landing spot will be done</p>
                </div>
                <div className='training_selection'>
                    <div>
                        <input 
                            type='checkbox' 
                            disabled 
                            name='land-fin' 
                            onChange={handleChange}
                            checked={checked === 'land-fin'}
                        />
                        <h4>Landing-Finish</h4>
                    </div>
                    <p>An assessment of your position from your landing spot until your release point will be done</p>
                </div>
                <div className='training_selection'>
                    <div>
                        <input 
                            type='checkbox' 
                            name='shoulders' 
                            onChange={handleChange}
                            checked={checked === 'shoulders'}/>
                        <h4>Shoulders</h4>
                    </div>
                    <p>An assessment of your shoulder position and tilt will be done throughout your entire delivery</p>
                </div>
            </div>
        </div>
    )
}

export default TrainingTypes; 