import React, { useEffect, useRef, useState } from 'react';
import Webcam from 'react-webcam';
import * as poseDetection from '@tensorflow-models/pose-detection'
import '@tensorflow/tfjs-backend-webgl';
import {drawing, beep} from '../functions/utils';
import '../styles/webcam.css'

// 1) I would like to figure out how to gather the results and display some of them below
function WebcamSection({ training, positions, handleChange, setPositions }) {
    let backupTraining;
    let [isShowVideo, setIsShowVideo] = useState(false);
    // let [set, setSet] = useState(false)
    // const [count, setCount] = useState(0); 
    const disabled = useRef(true)
    let [buttonDisabled, setButtonDisabled] = useState(true); 
    const videoElement = useRef(null);
    const canvasRef = useRef(null);
    const mySet = useRef(null);
    // Change this if we ever add anything else
    const defaultPositions = {
        set:{
            isTrue: false, 
            values:[],
            count: 0,
            isReady: false,

        },
        balance:{
            isTrue: false, 
            values:[],
            startingHeight: 0, 
            isBalanced: false,
            peakVal: 0,
            peakValues: []
        },
        landing:{
            isTrue: false, 
            values:[],
            isLanded: false
        },
        finish:{
            isTrue: false, 
            values:[]
        }
    }
    const detectorConfig = {
        // modelType: poseDetection.movenet.modelType.MULTIPOSE_LIGHTNING,
        enableTracking: true,
        trackerType: poseDetection.TrackerType.BoundingBox,
        runtime: 'tfjs', // or 'tfjs'
        modelType: 'full'
    }
    const videoConstraints = {
        width: `${'60vw'}`,
        height: '75vh',
        facingMode: "user"
    }

    const startCam = () => {

        setIsShowVideo(true)
        disabled.current = false; 
        runPoseDetector();
    }

    const stopCam = () => {
        setIsShowVideo(false)
        if(videoElement.current){
            let stream = videoElement.current.video.srcObject;
            const tracks = stream.getTracks();
            tracks.forEach(track => track.stop());
            videoElement.current.video.srcObject = null;
            disabled.current = true; 
        }
        

    }

    const handleReset = () => {
        console.log('handle Reset'); 

        setPositions(defaultPositions);
    }

    const runPoseDetector = async () => {
        const detector = await poseDetection
                        .createDetector(poseDetection.SupportedModels.BlazePose, detectorConfig)
        console.log(detector)
        let detectInterval = setInterval(() => {
            if(disabled.current === false){
                
                detect(detector);
            } else {
                console.log('Model Closed'); 
                clearInterval(detectInterval);
                // const ctx = canvasRef.current.getContext('2d')
                // ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
            }
            }, 100)
    }

    const detect = async (detector) => {
        
        try{
            
            if(typeof videoElement.current !== undefined 
                && videoElement.current !== null 
            ) {
                if(videoElement.current.stream !== null){

                    const video = videoElement.current.video;
                    console.log(videoElement.current.video)
                    const videoWidth = videoElement.current.video.videoWidth;
                    const videoHeight = videoElement.current.video.videoHeight;
                    videoElement.current.video.width = videoWidth;
                    videoElement.current.video.height = videoHeight;
                    
                    canvasRef.current.width = videoWidth; 
                    canvasRef.current.height = videoHeight; 
                    
                    const poses = await detector.estimatePoses(video); 
                    console.log('here')
                    if(poses){
                        // console.log(poses)
                        handleChange(poses[0].keypoints3D);
                    }
                    // let myTraining = training ? training : backupTraining;
                    // if(canvasRef.current !== null && myTraining !== undefined){
                    //     const ctx = canvasRef.current.getContext('2d')
                    //     drawing(poses, ctx, myTraining)
                    // }
                }
            }
        } catch {
            console.log('Not loaded yet')
        }
    }

    useEffect(() => {
        if(training !== undefined){
            backupTraining = training;
            runPoseDetector();
            disabled.current = false;
            // console.log(training ,training.length)
            if(training.length > 0){
                setButtonDisabled(false)
            } else {
                setButtonDisabled(true);
            }
        }

    }, [training])

    return (
        <div className='webcam__container'>
            <div className="cam__view">
                {/* {isShowVideo && */}
                    
                    <Webcam id='video' audio={false} ref={videoElement} videoConstraints={videoConstraints} />
            
                        <canvas
                        id='canvas'
                        ref={canvasRef}
                        height={550}
                        width={875}
                        />
            
            </div>
            <div className='button__container'>
                <button className='button__start' onClick={startCam} disabled={buttonDisabled}>Start Assessment</button>
                <button className='button__stop' onClick={() => {stopCam()}}>Stop</button>
                <button className='button__reset' onClick={handleReset}>Reset Model</button>
            </div>
        </div>
    );
};

export default WebcamSection;