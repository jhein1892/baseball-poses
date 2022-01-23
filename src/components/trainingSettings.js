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
            <h1>Session Settings</h1>
            <div className='settings_inner__wrapper'>
                <div>
                    <h2>Throwing Hand</h2>
                    <div className='inner__setting throwing_section'>
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
                <hr/>
                <div>
                    <h2>Height:</h2>
                    <div className="inner__setting height_section">
                        <div>
                            <h4>Feet</h4>
                            <select name='feet' onChange={handleChange}>
                                <option value={4}>4</option>
                                <option selected value={5}>5</option>
                                <option value={6}>6</option>
                                <option value={7}>7</option>
                            </select>
                        </div>
                        <div>
                            <h4>Inches</h4>
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
                <hr/>
                <div>
                    <h2>Age:</h2>
                    <select name='ago' className='age_select'>
                        <option>9u</option>
                        <option>11u</option>
                        <option>13u</option>
                        <option>15u</option>
                        <option>18u</option>
                        <option>18+</option>
                    </select>
                </div>
                <hr/>
                <div >
                    <h2>Pitching Experience</h2>
                    <select name='ago' className='age_select'>
                        <option>0-1 season</option>
                        <option>1-3 seasons</option>
                        <option>3-5 seasons</option>
                        <option>5+ seasons</option>
                    </select>
                </div>
            </div>
        </div>
    );
}

export default TrainingSettings; 