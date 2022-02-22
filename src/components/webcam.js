import React, { useEffect, useRef, useState, useCallback } from 'react';
import Webcam from 'react-webcam';
import * as poseDetection from '@tensorflow-models/pose-detection'
import '@tensorflow/tfjs-backend-webgl';
import '../styles/webcam.css'
import axios from 'axios';

// 1) I would like to figure out how to gather the results and display some of them below
function WebcamSection({ training, positions, handleChange, setPositions, resetRef, assessmentRef }) {
    let today = new Date().toISOString().slice(0,10); 
    // let backupTraining = useRef(training); 
    let [isShowVideo, setIsShowVideo] = useState(false);
    // let [set, setSet] = useState(false)
    // const [count, setCount] = useState(0); 
    const disabled = useRef(true)
    let [buttonDisabled, setButtonDisabled] = useState(true); 
    const videoElement = useRef(null);
    const canvasRef = useRef(null);
    const PositionsRef = useRef(false); 
    // Change this if we ever add anything else


    const videoConstraints = {
        width: `${'60vw'}`,
        height: '75vh',
        facingMode: "user"
    }

    const startCam = () => {
        let userid = 1; 
        axios.put(`${process.env.REACT_APP_API}/${userid}`, {type:training, date:today})
        .then((response) => {
            assessmentRef.current = response.data;
        })
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

    const handleReset = useCallback(() => {
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
        setPositions(defaultPositions);
        console.log(PositionsRef.current)
        PositionsRef.current = true;
        console.log('handle Reset'); 
        console.log(PositionsRef.current)
    },[PositionsRef, setPositions])



    const runPoseDetector = useCallback(async () => {
        const detectorConfig = {
            // modelType: poseDetection.movenet.modelType.MULTIPOSE_LIGHTNING,
            enableTracking: true,
            trackerType: poseDetection.TrackerType.BoundingBox,
            runtime: 'tfjs', // or 'tfjs'
            modelType: 'full'
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
                        if(poses){
                            handleChange(poses[0].keypoints3D);
                        }
                    }
                }
            } catch {
            }
        }
        const detector = await poseDetection
                        .createDetector(poseDetection.SupportedModels.BlazePose, detectorConfig)
        let detectInterval = setInterval(() => {
            if(resetRef.current){
                console.log('Model Closed'); 
                handleReset(); 
                clearInterval(detectInterval);
                // return; 
            }
            if(disabled.current){
                clearInterval(detectInterval);
            }
                detect(detector);
            }, 100)
    },[resetRef, handleReset, handleChange]); 



    useEffect(() => {
        if(training !== undefined){
            // runPoseDetector();
            disabled.current = false;
            // console.log(training ,training.length)
            if(training.length > 0){
                setButtonDisabled(false)
            } else {
                setButtonDisabled(true);
            }
        }

    }, [training]);

    useEffect(() => {
        if(!positions.set.isTrue && PositionsRef.current){
            resetRef.current = false;
            runPoseDetector().then(() => {
                PositionsRef.current = false;
            })
        }
    }, [positions,runPoseDetector, resetRef])

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
            <div className='button__container'>
                <button className='button__start' onClick={startCam} disabled={buttonDisabled}>Start Assessment</button>
                <button className='button__stop' onClick={() => {stopCam()}}>Stop</button>
                <button className='button__reset' onClick={handleReset}>Reset Model</button>
            </div>
        </div>
    );
};

export default WebcamSection;