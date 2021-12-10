import React, { useEffect, useState } from 'react'
import '@tensorflow/tfjs-backend-webgl';
import "../styles/home.css"
import WebcamSample from '../components/webcam'

function Home(){
    // const [training, setTraining] = useState([])

    // const handleChange = (event) => {
    //     let targetTraining = event.target.name
    //     if(!training.includes(targetTraining)){
    //         setTraining([...training, targetTraining ])
    //     } else {
    //         let updatedTraining = training.filter((type) => {
    //             if(type !== targetTraining){
    //                 return type;
    //             }
    //         })
    //         setTraining(updatedTraining)
    //     }
    // }

    // let myTraining = training;

    // useEffect(() => {
    //     myTraining = training
    // }, [training])
    // console.log('Home')
    return (
        <div>
            <h1>Home</h1>
            <WebcamSample/>

        </div>
    )
}

export default Home; 