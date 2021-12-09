import React, { useCallback, useEffect, useRef, useState } from 'react'
import Webcam from "react-webcam"
import * as poseDetection from '@tensorflow-models/pose-detection'
import '@tensorflow/tfjs-backend-webgl';
import "../styles/home.css"
import WebcamSample from '../components/webcam'

import {drawing} from '../components/utils'

const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: "user"
}



function Home(){

    return (
        <div>
            <h1>Home</h1>
            <WebcamSample />
            {/* <Webcam
                id="video"
                audio={false}
                height={720}
                ref={webcamRef}
                width={1280}
                preload={'none'}
                onLoad={console.log(video !== null)}
                videoConstraints={videoConstraints}
            /> */}
                {/* <button onClick={() => runPoseDetector()}>start detection</button> */}
                {/* <button onClick={() => setLoaded(false)}>stop detection</button> */}

        </div>
    )
}

export default Home; 