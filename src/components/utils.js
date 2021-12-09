// points for model

// const poses


export const drawing = (predictions, ctx) => {
    if(predictions.length > 0){
        // console.log(predictions[0].keypoints)
        let keypoints = predictions[0].keypoints
        for(let i = 0; i < keypoints.length; i++){
            // console.log(keypoints[i])
            let x = keypoints[i]['x']
            let y = keypoints[i]['y']

            ctx.beginPath();
            ctx.arc(x, y, 5, 0, 3*Math.PI);
            ctx.fillStyle = 'red';
            ctx.fill();
        }
    }
    // if (predictions.length > 0){
    //     for(let i = 0; i < predictions[0].length; i++){
    //         console.log(predictions[0][i])
    //         // let x = predictions[i]['x'];
    //         // let y = predictions[i]['y'];

    //         // ctx.beginPath();
    //         // ctx.arc(x, y, 5, 0, 3 * Math.PI);
    //         // ctx.fillStyle = 'indigo';
    //         // ctx.fill();
    //     }
    // }
    // if(predictions.length > 0) {
        
    //     predictions.forEach((prediction) => {
    //         // console.log(prediction)
    //         const landmarks = prediction.keypoints
    //         let x;
    //         let y; 
    //         for (let i = 0; i < landmarks.length; i++){
    //             x = landmarks[i]['x'];
    //             // console.log(x)
    //             y = landmarks[i]['y'];
    //             // const name = landmarks[i]['name'];
                
    //             ctx.beginPath();
    //             // console.log(ctx.arc(x,y,5,0,3*Math.PI))
    //             ctx.arc(x, y, 5, 0, 3 * Math.PI);

    //             // ctx.fillStyle = 'indigo';
    //             ctx.fill();
                
    //         }

    //     })
    //     ctx.closePath()
       
    // }
}