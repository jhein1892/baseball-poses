import React, { useEffect, useRef, useState } from 'react';
import Webcam from 'react-webcam';
import * as poseDetection from '@tensorflow-models/pose-detection'
import '@tensorflow/tfjs-backend-webgl';
import {drawing} from '../components/utils'


// 1) Should be able to switch between the options and have different lines be set
// 2) I would like to figure out how to gather the results and display some of them below
// 3) Figure out how to tell when someone is going to be set, and know that this
// is when we need to start keeping track

function WebcamSample() {
    let backupTraining;
    let [isShowVideo, setIsShowVideo] = useState(false);
    const [training, setTraining] = useState()
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
        width: 640,
        height: 480,
        facingMode: "user"
    }


    const handleChange = (event) => {
        let targetTraining = event.target.name
        setTraining(targetTraining);
        backupTraining = targetTraining;
    }

    const startCam = () => {
        setIsShowVideo(true)
        // if(videoElement.current !== null){
        //     videoElement.current.stream.active = true
        // }
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
        
        //Will need to fix this later
        document.getElementById('canvas').display = 'none';
    }

    const runPoseDetector = async () => {
        const detector = await poseDetection
                        .createDetector(poseDetection.SupportedModels.MoveNet, detectorConfig)

        let detectInterval = setInterval(() => {
                                if(disabled.current === false){
                                   
                                    detect(detector);
                                } else {
                                    console.log('Model Closed'); 
                                    detect(detector);
                                    clearInterval(detectInterval);
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
                    let myTraining = training ? training : backupTraining;
                    if(canvasRef.current !== null && training !== undefined){
                        const ctx = canvasRef.current.getContext('2d')
                        if(disabled.current === true){
                            ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
                        }
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
            setButtonDisabled(false);
        }
    }, [training])

    return (
        <div className='webcam__container'>
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
            <button onClick={startCam} disabled={buttonDisabled}>Start Video</button>
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