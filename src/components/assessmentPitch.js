import React from 'react';

function AssessmentPitch({ pitch }){

    return (
        <tr >
            <td>{pitch.pitch_number ? pitch.pitch_number : '---' }</td>
            <td>{pitch.set_even_shoulders ? 'true' : 'false'}</td>
            <td>{pitch.set_feet_width ? 'true' : 'false'}</td>
            <td>{pitch.pause ? 'true' : 'false'}</td>
            <td>{pitch.balance_knee_y ? 'true' : 'false'}</td>
            <td>{pitch.balance_knee_x ? 'true' : 'false'}</td>
            <td>{pitch.balance_even_shoulders ? 'true' : 'false'}</td>
            <td>{pitch.stride_length.toFixed(2)}m</td>
            <td>{pitch.elbows_above_shoulders ? 'true' : 'false'}</td>
            <td>{pitch.arm_angle.toFixed(2)}&#176;</td>
            <td>{pitch.shoulder_tilt ? 'true' : 'false'}</td>
        </tr>
    )
}

export default AssessmentPitch; 