import React, { useState } from 'react';
import smoke_bg from '../assets/smoke_bg.svg';
import { useNavigate } from 'react-router-dom';
import EventPage from './event_add.jsx';
import AlginmentPanel from './image_edit.jsx';
import EmailComposer from './email_message.jsx';

function Event(){

    const [step, setStep] = useState('form');
    const [eventData, setEventData] = useState(null);
    const [alignmentData, setAlignmentData] = useState(null);
    const [isSending, setIsSending] = useState(false);
    const navigate = useNavigate();

    const handleNextStep = (data) => {

        setEventData(data);
        setStep('align');

    };

    const handleAlignNext = (data) => {

        setAlignmentData(data);
        setStep('email');

    };

    const handleFinish = (formData) => {

        const API_URL = import.meta.env.VITE_API_URL;

        setIsSending(true);

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
        .catch(err => {

            console.error('Error: ', err);
            setIsSending(false);

        });

    };

    return(
    <>
        <div className="flex flex-col justify-center items-center w-full h-screen">
            { step === 'form' && (<EventPage onNext={handleNextStep}/>)}
            { step === 'align' && (<AlginmentPanel eventData={eventData} onNext={handleAlignNext}/>)}
            { step === 'email' && (<EmailComposer eventData={eventData} alignmentData={alignmentData} onFinish={handleFinish} isSending={isSending}/>)}
        </div>
    </>
    );

}

export default Event;