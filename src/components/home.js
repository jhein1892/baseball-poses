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
    // const [loaded, setLoaded] = useState(true)
    // const video = document.querySelector('video');

    // video.onloadeddata = (event) => {
    //     setLoaded(true)
    // }

    // const detectorConfig = {
    //     modelType: poseDetection.movenet.modelType.MULTIPOSE_LIGHTNING,
    //     enableTracking: true,
    //     trackerType: poseDetection.TrackerType.BoundingBox
    // }
    
    
    // const webcamRef = useRef(null)
    // const canvasRef = useRef(null)
    // const video = document.getElementById('video');
    // const runPoseDetector = async() => {
    //     console.log('here3')
    //     // Detector for Pose Detection
    //     const detector = await poseDetection.createDetector(poseDetection.SupportedModels.MoveNet, detectorConfig);
    //     // Runs detect 10/sec
    //     const poses = await detector.estimatePoses(video);
    //     // console.log(poses[0].keypoints)
    //     let currentPose = poses[0].keypoints
    //     if(canvasRef !== null){
    //         const ctx = canvasRef.current.getContext('2d');
    
    //         drawing(currentPose, ctx)
    //     }

    //     setInterval(() => {runPoseDetector()}, 100)
    // }

    // const detect = async(detector) => {
    //     const video = document.getElementById('video');

    //     if(typeof webcamRef.current !== undefined &&
    //         webcamRef.current !== null && webcamRef.current.stream !== null){
    //             // get video
    //             // pas video into detector
    //             const poses = await detector.estimatePoses(video);

    //             const ctx = canvasRef.current.getContext("2d"); 
    //             // 
    //             drawing(poses, ctx);
    //             // w e output an array of position that we find.
    //             // console.log(poses[0])
    //         }
    // }
    
    // if(video){
    //     video.addEventListener('loadeddata', function() {
    //         console.log('here2')
    //         runPoseDetector()
    //     })
    // }
    // useEffect(() => {
    //     console.log(video)
    // }, [video])
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