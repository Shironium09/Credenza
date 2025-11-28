import React, { useState } from 'react';
import smoke_bg from '../assets/smoke_bg.svg';
import { useNavigate } from 'react-router-dom';
import EventPage from './event_add.jsx';
import AlginmentPanel from './image_edit.jsx';

function Event(){

    const [step, setStep] = useState('form');
    const [eventData, setEventData] = useState(null);
    const navigate = useNavigate();

    const handleNextStep = (data) => {

        setEventData(data);
        setStep('align');

    };

    const handleFinish = (formData) => {

        const API_URL = import.meta.env.VITE_API_URL;

        fetch(`${API_URL}/api/generate`, {

            method: 'POST',
            credentials: 'include',
            body: formData,

        })
        .then(res => res.json())
        .then(data => {

            console.log('Server: ', data);
            navigate('/dashboard');

        })
        .catch(err => [

            console.error('Error: ', err)

        ]);

    };

    return(
    <>
        <div className="flex flex-col justify-center items-center w-full h-screen">
            { step === 'form' && (<EventPage onNext={handleNextStep}/>)}
            { step === 'align' && (<AlginmentPanel eventData={eventData} onFinish={handleFinish}/>)}
        </div>
    </>
    );

}

export default Event;