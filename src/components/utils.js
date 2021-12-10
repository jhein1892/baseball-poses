// points for model
const bodyParts = {
    head:[3,1,0,2,4],
    upper:[9,7,5,6,8,10],
    lowerLeft:[11,13,15],
    lowerRight:[12,14,16]
}

// const poses


export const drawing = (predictions, ctx, training) => {
    console.log(training)
    if(predictions.length > 0){
        // console.log(predictions[0].keypoints)
        let keypoints = predictions[0].keypoints
        
        // loop through body parts
        for(let j = 0; j < Object.keys(bodyParts).length; j++){
            // console.log(Object.keys(bodyParts)[j])
            let part = Object.keys(bodyParts)[j];
            for(let k = 0; k < bodyParts[part].length - 1; k++){
                const firstConnectionIndex = bodyParts[part][k];
                
                const secondConnectionIndex = bodyParts[part][k+1]
                    
                // console.log(keypoints[firstConnectionIndex]['x'])
                ctx.beginPath();
                ctx.moveTo(
                    keypoints[firstConnectionIndex]['x'],
                    keypoints[firstConnectionIndex]['y']
                )
                ctx.lineTo(
                    keypoints[secondConnectionIndex]['x'],
                    keypoints[secondConnectionIndex]['y']
                )

                if()



                if(secondConnectionIndex === 6){
                    if(keypoints[firstConnectionIndex]['y'] < keypoints[secondConnectionIndex]['y']){
                        ctx.strokeStyle = 'red'
                    } else {
                        ctx.strokeStyle = 'green'
                    }
                } else if (secondConnectionIndex === 14) {
                    if(keypoints[firstConnectionIndex]['x'] < keypoints[secondConnectionIndex]['x']){
                        ctx.strokeStyle = 'green'
                    } else {
                        ctx.strokeStyle = 'red'
                    }
                    
                } else {
                    ctx.strokeStyle = 'black'
                }
                ctx.lineWidth = 4;
                ctx.stroke()
            }
        }
        // console.log(keypoints)
        for(let i = 0; i < keypoints.length; i++){
            // console.log(keypoints[i])
            let x = keypoints[i]['x']
            let y = keypoints[i]['y']
            if(i < 11){
                ctx.beginPath();
                ctx.arc(x, y, 5, 0, 3*Math.PI);
                ctx.fillStyle = 'red';
                ctx.fill();
            }
        }
    }
}

// // My Keypoints are:
// 0: nose
// 1: left_eye
// 2: right_eye
// 3: left_ear
// 4: right_ear
// 5: left_shoulder
// 6: right_shoulder
// 7: left_elbow
// 8: right_elbow
// 9: left_wrist
// 10:right_wrist
// 11: left_hip
// 12: right_hip
// 13:left_knee
// 14: right_knee
// 15: left_ankle
// 16: right_ankle
