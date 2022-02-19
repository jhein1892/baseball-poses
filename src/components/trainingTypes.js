import React, {useState} from 'react'
import '../styles/trainingType.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons'


function TrainingTypes({setTraining, training}){
    const [checked, setChecked] = useState('')
    
    const handleChange = (type) => {
        setTraining(type);
        setChecked(type);
    }


    return(
        <div className='trainingType__container'>
            <h1>Training Type</h1>
            <div className='trainingType__inner'>
                <div 
                    className='training_selection' 
                    onClick={() => handleChange('full')}
                >
                    <div>
                    <FontAwesomeIcon icon={faCheckCircle} className={checked ==='full' ? 'trainingType__icon active' : 'trainingType__icon'}/>
                        <h3>Full Assessment</h3>
                    </div>
                </div>
                <div 
                    className='training_selection disabled' 
                    // onClick={() => handleChange('legLift')}
                >
                    <div>
                        <FontAwesomeIcon icon={faCheckCircle} className={checked ==='legLift' ? 'trainingType__icon active' : 'trainingType__icon'}/>
                        <h3>Leg Lift</h3>
                    </div>
                </div>
                <div 
                    className='training_selection disabled' 
                    // onClick={() => handleChange('bal-land')}
                >
                    <div>
                        <FontAwesomeIcon icon={faCheckCircle} className={checked ==='bal-land' ? 'trainingType__icon active' : 'trainingType__icon'}/>
                        <h3>Balance-Landing</h3>
                    </div>
                </div>
                <div 
                    className='training_selection disabled' 
                    // onClick={() => handleChange('land-fin')}
                >
                    <div>
                        <FontAwesomeIcon icon={faCheckCircle} className={checked ==='land-fin' ? 'trainingType__icon active' : 'trainingType__icon'}/>
                        <h3>Landing-Finish</h3>
                    </div>
                </div>
                <div 
                    className='training_selection disabled' 
                    // onClick={() => handleChange('shoulders')}
                >
                    <div>
                        <FontAwesomeIcon icon={faCheckCircle} className={checked ==='shoulders' ? 'trainingType__icon active' : 'trainingType__icon'}/>
                        <h3>Shoulders</h3>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TrainingTypes; 