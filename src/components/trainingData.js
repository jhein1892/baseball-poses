import React, { useEffect } from 'react'
import '../styles/trainingData.css'

function TrainingData({positions}){
    let positionKeys = Object.keys(positions)


       let myinfo = positionKeys.map((key) => {   
                return (
                    <tr key={key}>
                        <td>{key}</td>
                        <td>NA</td>
                        <td>NA</td>
                        <td>NA</td>
                        <td>NA</td>
                        <td>NA</td>
                        <td>NA</td>
                        <td>NA</td>
                        <td>NA</td>
                        <td>NA</td>
                        <td>NA</td>
                        <td>NA</td>
                        <td>NA</td>
                    </tr>
                )
            }
        )
    

    let showData; 
    useEffect(() => {

    },[positions])

    return (
        <div className='trainingData_wrapper'>
            <h1>Training Data</h1>
            <table id="training_table">
                <thead>
                    <th>Name</th>
                    <th>Left Shoulder</th>
                    <th>Right Shoulder</th>
                    <th>Left Elbow</th>
                    <th>Right Elbow</th>
                    <th>Left Wrist</th>
                    <th>Right Elbow</th>
                    <th>Left Hip</th>
                    <th>Right Hip</th>
                    <th>Left Knee</th>
                    <th>Right Knee</th>
                    <th>Left Ankle</th>
                    <th>Right Ankle</th>
                </thead>
                <tbody>
                    {myinfo}
                </tbody>
            </table>
        </div>
    )
}

export default TrainingData; 
