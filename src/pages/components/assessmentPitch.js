import React from 'react';

function AssessmentPitch({ pitch, height }){
    let strideClass; 
    let elbowClass; 
    if(height - (pitch.stride_length * 100) < height * 0.1){
        strideClass = 'active'; 
    } else {
        strideClass = 'warning'; 
    }

    if(pitch.arm_angle > 80 && pitch.arm_angle < 120){
        elbowClass = 'active'; 
    } else {
        elbowClass = 'warning'; 
    }

    return (
        <tr className='assessment_pitch_data'>
            <td className={pitch.set_even_shoulders ? 'active' : 'warning'}>{pitch.set_even_shoulders ? 'true' : 'false'}</td>
            <td className={pitch.set_feet_width ? 'active' : 'warning'}>{pitch.set_feet_width ? 'true' : 'false'}</td>
            <td className={pitch.pause ? 'active' : 'warning'}>{pitch.pause ? 'true' : 'false'}</td>
            <td className={pitch.balance_knee_y ? 'active' : 'warning'}>{pitch.balance_knee_y ? 'true' : 'false'}</td>
            <td className={pitch.balance_knee_x ? 'active' : 'warning'}>{pitch.balance_knee_x ? 'true' : 'false'}</td>
            <td className={pitch.balance_even_shoulders ? 'active' : 'warning'}>{pitch.balance_even_shoulders ? 'true' : 'false'}</td>
            <td className={strideClass}>{pitch.stride_length.toFixed(2)}m</td>
            <td className={pitch.elbows_above_shoulders ? 'active' : 'warning'}>{pitch.elbows_above_shoulders ? 'true' : 'false'}</td>
            <td className={elbowClass}>{pitch.arm_angle.toFixed(2)}&#176;</td>
            <td className={pitch.shoulder_tilt ? 'active' : 'warning'}>{pitch.shoulder_tilt ? 'true' : 'false'}</td>
        </tr>
    )
}

export default AssessmentPitch; 