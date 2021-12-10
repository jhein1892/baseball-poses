import React, { useEffect, useRef, useState } from 'react';
import Webcam from 'react-webcam';
import * as poseDetection from '@tensorflow-models/pose-detection'
import '@tensorflow/tfjs-backend-webgl';
import {drawing} from '../components/utils'
import { train } from '@tensorflow/tfjs';


// Try circling the outside process of detector through a non-async function
// then we might be able to catch the value for disabled

// 1) Should be able to switch between the options and have different lines be set
// 2) I would like to figure out how to gather the results and display some of them below
// 3) Figure out how to tell when someone is going to be set, and know that this
// is when we need to start keeping track



function WebcamSample() {
    let backupTraining;
    // console.log(training.length)
    // if(training.length > 0){
    //     backupTraining = training
    // }
    // console.log(backupTraining)
    let [isShowVideo, setIsShowVideo] = useState(false);
    const [training, setTraining] = useState()
    let [disabled, setDisabled] = useState(true); 
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
        setDisabled(true)
    }

    const runPoseDetector = async () => {
        const detector = await poseDetection
                        .createDetector(poseDetection.SupportedModels.MoveNet, detectorConfig)
        console.log('Model loaded')

        // process.nextTick(() => {
                detect(detector);
        //         console.log(disabled)
        // })
    }

    const isDiabled = function() {
        return disabled
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
                        // console.log(training)
                        drawing(poses, ctx, myTraining)
                    }
                }
            }
        } catch {
            console.log('Not loaded yet')
        }
        if(!disabled){
            setImmediate(() => {
                detect(detector)
                console.log(disabled)
            })
        }
    }
    // if(training.length > 0){

    //     runPoseDetector();
    // }

    

    useEffect(() => {
        console.log(training)
        if(training !== undefined){
            // runPoseDetector();
            setDisabled(false)
        }
    }, [training])

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