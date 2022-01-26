import { train } from "@tensorflow/tfjs";
const audioCtx = new (window.AudioContext || window.webkitAudioContext || window.audioContext);
// points for model
const bodyParts = {
    head:[3,1,0,2,4],
    upper:[9,7,5,6,8,10],
    lowerLeft:[11,13,15],
    lowerRight:[12,14,16]
}

// const poses


export const drawing = (predictions, ctx, training) => {
    // console.log(training)
    // if(predictions.length === 0){
    //     return
    // }

    if(predictions.length > 0){
        // console.log(predictions[0].keypoints)
        let keypoints = predictions[0].keypoints
        for(let i = 0; i < keypoints.length; i++){
            ctx.beginPath();
            ctx.moveTo(
                keypoints[i]['x'],
                keypoints[i]['y']
            )
            ctx.strokeStyle = 'black';
            ctx.lineWidth = 1;
            ctx.stroke();
        }
    }
}



//All arguments are optional:

//duration of the tone in milliseconds. Default is 500
//frequency of the tone in hertz. default is 440
//volume of the tone. Default is 1, off is 0.
//type of tone. Possible values are sine, square, sawtooth, triangle, and custom. Default is sine.
//callback to use on end of tone
export function beep(duration, frequency, volume, type, callback) {
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    if (volume){gainNode.gain.value = volume;}
    if (frequency){oscillator.frequency.value = frequency;}
    if (type){oscillator.type = type;}
    if (callback){oscillator.onended = callback;}
    oscillator.start(audioCtx.currentTime);
    oscillator.stop(audioCtx.currentTime + ((duration || 500) / 1000));
};

