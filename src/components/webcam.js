import React, { useEffect, useRef, useState } from 'react';
import Webcam from 'react-webcam';
import * as poseDetection from '@tensorflow-models/pose-detection'
import '@tensorflow/tfjs-backend-webgl';
import {drawing} from '../functions/utils'

// 1) I would like to figure out how to gather the results and display some of them below
// 2) Figure out how to tell when someone is going to be set, and know that this
// is when we need to start keeping track
// 3) Add in form control for the buttons in Training Types so that only one can be picked at a time
function WebcamSection({training}) {
    let backupTraining;
    let [isShowVideo, setIsShowVideo] = useState(false);
    let [set, setSet] = useState(false)
    const [count, setCount] = useState(0); 
    const disabled = useRef(true)
    let [buttonDisabled, setButtonDisabled] = useState(true); 
    const videoElement = useRef(null);
    const canvasRef = useRef(null);

    const detectorConfig = {
        modelType: poseDetection.movenet.modelType.MULTIPOSE_LIGHTNING,
        enableTracking: true,
        trackerType: poseDetection.TrackerType.BoundingBox
    }
    const videoConstraints = {
        width: `${'60vw'}`,
        height: '75vh',
        facingMode: "user"
    }

    const startCam = () => {
        setIsShowVideo(true)
        disabled.current = false; 
        runPoseDetector()
    }

    const stopCam = () => {
        setIsShowVideo(false)
        let stream = videoElement.current.video.srcObject;
        const tracks = stream.getTracks();
        tracks.forEach(track => track.stop());
        videoElement.current.video.srcObject = null;
        disabled.current = true; 
    }

    const runPoseDetector = async () => {
        const detector = await poseDetection
                        .createDetector(poseDetection.SupportedModels.MoveNet, detectorConfig)

        let detectInterval = setInterval(() => {
                                if(disabled.current === false){
                                   
                                    detect(detector);
                                } else {
                                    console.log('Model Closed'); 
                                    clearInterval(detectInterval);
                                    const ctx = canvasRef.current.getContext('2d')
                                    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
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
                    const videoWidth = videoElement.current.video.videoWidth;
                    const videoHeight = videoElement.current.video.videoHeight;
        
                    videoElement.current.video.width = videoWidth;
                    videoElement.current.video.height = videoHeight;
        
                    canvasRef.current.width = videoWidth; 
                    canvasRef.current.height = videoHeight; 
        
                    const poses = await detector.estimatePoses(video); 
                    if(Math.abs(poses[0].keypoints[9]['x'] - poses[0].keypoints[10]['x']) < 70 &&
                    Math.abs(poses[0].keypoints[9]['y'] - poses[0].keypoints[10]['y']) < 5){
                        setSet(true);
                    } else {
                        setCount(0); 
                        console.log(count)
                    }
                    let myTraining = training ? training : backupTraining;
                    if(canvasRef.current !== null && training !== undefined){
                        const ctx = canvasRef.current.getContext('2d')
                        drawing(poses, ctx, myTraining)
                    }
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
                {isShowVideo &&
                    
                    <Webcam id='video' audio={false} ref={videoElement} videoConstraints={videoConstraints} />
                }
                        <canvas
                        id='canvas'
                        ref={canvasRef}
                        height={550}
                        width={875}
                        />
            
            </div>
            <div>
                <button onClick={startCam} disabled={buttonDisabled}>Start Video</button>
                <button onClick={() => {stopCam()}}>Stop Video</button>
            </div>
            {set &&
                <>
                <h1>SET</h1>
                <p>{count}</p>
                </>
            }
        </div>
    );
};

export default WebcamSection;