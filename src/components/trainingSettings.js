import { op } from '@tensorflow/tfjs';
import React, {useState} from 'react';
import '../styles/trainingSettings.css'

function TrainingSettings({setThrowing, setHeight}) {
    const [checked, setChecked] = useState('left');

    const handleChange = (event) => {
        let targetTraining = event.target.name
        if(event.target.type === 'checkbox'){
            if(event.target.checked === true){
                setThrowing(targetTraining);
                setChecked(targetTraining)
            } else {
                setThrowing('')
                setChecked('')
            }
        } else {
            let targetName = event.target.name;
            let targetValue = parseInt(event.target.value);
            setHeight(prev => ({...prev, [`${targetName}`]:targetValue }));
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
            <div className='settings__height'>
                <h4>Please Enter your Height:</h4>
                <div>
                    <label>Feet</label>
                    <select name='feet' onChange={handleChange}>
                        <option value={4}>4</option>
                        <option selected value={5}>5</option>
                        <option value={6}>6</option>
                        <option value={7}>7</option>
                    </select>
                </div>
                <div>
                    <label>Inches</label>
                    <select name='inches' onChange={handleChange}>
                        <option value={1}>1</option>
                        <option value={2}>2</option>
                        <option value={3}>3</option>
                        <option value={4}>4</option>
                        <option value={5}>5</option>
                        <option value={6}>6</option>
                        <option value={7}>7</option>
                        <option value={8}>8</option>
                        <option value={9}>9</option>
                        <option selected value={10}>10</option>
                        <option value={11}>11</option>
                        <option value={12}>12</option>
                    </select>
                </div>
            </div>
        </div>
    );
}

export default TrainingSettings; 