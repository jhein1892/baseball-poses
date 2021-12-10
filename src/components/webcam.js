import React, { useRef, useState } from 'react';
import Webcam from 'react-webcam';
import * as poseDetection from '@tensorflow-models/pose-detection'
import '@tensorflow/tfjs-backend-webgl';
import {drawing} from '../components/utils'

function WebcamSample({ training }) {
    let [isShowVideo, setIsShowVideo] = useState(false);
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

    const startCam = () => {
        setIsShowVideo(true)
        console.log('here Cam Start', isShowVideo)
        runPoseDetector(detector)
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

                    if(canvasRef.current !== null){
                        const ctx = canvasRef.current.getContext('2d')
                        drawing(poses, ctx, training)
                    }
                }
            }
        } catch {
            console.log('Not loaded yet')
        }
    }

    runPoseDetector();

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
            <button onClick={startCam}>Start Video</button>
            <button onClick={() => {
                                    stopCam()}}>Stop Video</button>
        </div>
    );
};

export default WebcamSample;