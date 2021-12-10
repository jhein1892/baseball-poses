import React, { useState } from 'react'
import '@tensorflow/tfjs-backend-webgl';
import "../styles/home.css"
import WebcamSample from '../components/webcam'

function Home(){
    const [training, setTraining] = useState([])

    const handleChange = (event) => {
        let targetTraining = event.target.name
        if(!training.includes(targetTraining)){
            setTraining([...training, targetTraining ])
        } else {
            let updatedTraining = training.filter((type) => {
                if(type !== targetTraining){
                    return type;
                }
            })
            setTraining(updatedTraining)
        }
    }


    return (
        <div>
            <h1>Home</h1>
            <WebcamSample training={training} />
            <div>
                <p>Shoulders</p>
                <input type='checkbox' name='shoulders' onChange={handleChange}/>
            </div>           
            <div>
                <p>Front Hip</p>
                <input type='checkbox' name='hip' onChange={handleChange}/>
            </div>
        </div>
    )
}

export default Home; 