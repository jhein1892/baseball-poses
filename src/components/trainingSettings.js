import React, {useState} from 'react';
import '../styles/trainingSettings.css'

function TrainingSettings({setSetting}) {
    const [checked, setChecked] = useState('');

    const handleChange = (event) => {
        let targetTraining = event.target.name
        if(event.target.checked === true){
            setSetting(targetTraining);
            setChecked(targetTraining)
        } else {
            setSetting('')
            setChecked('')
        }
    }
    
    return(
        <div className='settings__wrapper'>
            <h2>Which Hand do you throw with?</h2>
            <div className="settings__throwing">
                <div >
                    <h4>Left</h4>
                    <input 
                        type='checkbox'
                        name='left'
                        onClick={handleChange}
                        checked={checked === 'left'}
                    />
                </div>
                <div>
                    <h4>Right</h4>
                    <input
                        type='checkbox'
                        name='right'
                        onChange={handleChange}
                        checked={checked === 'right'}
                    />
                </div>
            </div>
        </div>
    );
}

export default TrainingSettings; 