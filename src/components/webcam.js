import React, { useEffect, useRef, useState } from 'react';
import Webcam from 'react-webcam';
import * as poseDetection from '@tensorflow-models/pose-detection'
import '@tensorflow/tfjs-backend-webgl';
import {drawing} from '../components/utils'
import { train } from '@tensorflow/tfjs';

function WebcamSample() {
    let backupTraining;
    // console.log(training.length)
    // if(training.length > 0){
    //     backupTraining = training
    // }
    // console.log(backupTraining)
    let [isShowVideo, setIsShowVideo] = useState(false);
    const [training, setTraining] = useState()
    const [disabled, setDisabled] = useState(true);
    const videoElement = useRef(null);
    const canvasRef = useRef(null)
    
    let detector; 

    const detectorConfig = {
        modelType: poseDetection.movenet.modelType.MULTIPOSE_LIGHTNING,
        enableTracking: true,
        trackerType: poseDetection.TrackerType.BoundingBox
    }
    
    
    const videoConstraints = {
        width: 640,
        height: 480,
        facingMode: "user"
    }


    const handleChange = (event) => {
        let targetTraining = event.target.name
        setTraining(targetTraining);
        backupTraining = targetTraining;



        // if we want to have an array
        // if(!training.includes(targetTraining)){
        //     setTraining([...training, targetTraining ])
        // } else {
        //     let updatedTraining = training.filter((type) => {
        //         if(type !== targetTraining){
        //             return type;
        //         }
        //     })
        //     setTraining(updatedTraining)
        // }
    }

    const startCam = () => {
        setIsShowVideo(true)
        console.log('here Cam Start', isShowVideo)
        runPoseDetector()
    }

    const stopCam = () => {
        let stream = videoElement.current.stream;
        const tracks = stream.getTracks();
        tracks.forEach(track => track.stop());
        console.log(detector)
        clearTimeout()
        // setIsShowVideo(false);
    }

    const runPoseDetector = async () => {
        const detector = await poseDetection
                        .createDetector(poseDetection.SupportedModels.MoveNet, detectorConfig)
        console.log('Model loaded')

        setInterval(() => {
            detect(detector);
        }, 100)
    }

    const detect = async (detector) => {
        try{

            if(typeof videoElement.current !== undefined 
                && videoElement.current !== null 
            ) {
                if(videoElement.current.stream !== null){
                    const video = videoElement.current.video;
                    // console.log(video.videoWidth)
                    const videoWidth = videoElement.current.video.videoWidth;
                    const videoHeight = videoElement.current.video.videoHeight;
        
                    videoElement.current.video.width = videoWidth;
                    videoElement.current.video.height = videoHeight;
        
                    canvasRef.current.width = videoWidth; 
                    canvasRef.current.height = videoHeight; 
        
                    const poses = await detector.estimatePoses(video); 
                    let myTraining = training ? training : backupTraining;
                    if(canvasRef.current !== null && training !== undefined){
                        const ctx = canvasRef.current.getContext('2d')
                        console.log(training)
                        drawing(poses, ctx, myTraining)
                    }
                }
            }
        } catch {
            console.log('Not loaded yet')
        }
    }
    // if(training.length > 0){

    //     runPoseDetector();
    // }

    runPoseDetector();

    useEffect(() => {
        console.log(training)
        if(training !== undefined){
            setDisabled(false)
        }
    }, [training])

    // useEffect(() => {
    //     if(training.length > 0){
    //         runPoseDetector();
    //         setDisabled(false)
    //     }
    // }, [backupTraining])
    // console.log(training)
    return (
        <div>
            <div className="camView">
                {isShowVideo &&
                    <>
                    <Webcam id='video' audio={false} ref={videoElement} videoConstraints={videoConstraints} />
                    <canvas
                    id='canvas'
                    ref={canvasRef}
                    height={420}
                    width={640}
                    />
                    </>
                }
            </div>
            <button onClick={startCam} disabled={disabled}>Start Video</button>
            <button onClick={() => {stopCam()}}>Stop Video</button>
            <div>
                <p>Full Assessment</p>
                <input type='checkbox' name='full' onChange={handleChange}/>
            </div>
            <div>
                <p>Shoulders</p>
                <input type='checkbox' name='shoulders' onChange={handleChange}/>
            </div>           
            <div>
                <p>Front Hip</p>
                <input type='checkbox' name='hip' onChange={handleChange}/>
            </div>
        </div>
    );
};

export default WebcamSample;