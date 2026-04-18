import React, { useState } from 'react';
import smoke_bg from '../assets/smoke_bg.svg';
import { useNavigate } from 'react-router-dom';
import EventPage from './event_add.jsx';
import AlginmentPanel from './image_edit.jsx';
import EmailComposer from './email_message.jsx';

function Event(){

    const [step, setStep] = useState('form');
    const [isSending, setIsSending] = useState(false);
    const [progress, setProgress] = useState({ current: 0, total: 0 });
    const navigate = useNavigate();

    // ── Lifted state: Event Form ──
    const [eventName, setEventName] = useState('');
    const [eventDate, setEventDate] = useState('');
    const [templateFile, setTemplateFile] = useState(null);
    const [csvFile, setCsvFile] = useState(null);
    const [sendMode, setSendMode] = useState('email');

    // ── Lifted state: Alignment ──
    const [yPosition, setYPosition] = useState(50);
    const [fontSize, setFontSize] = useState(100);
    const [fontStyle, setFontStyle] = useState('Poppins');
    const [fontColor, setFontColor] = useState('#000000');

    // ── Lifted state: Email ──
    const [emailSubject, setEmailSubject] = useState('');
    const [emailBody, setEmailBody] = useState(
        `Hello {name},

        We are presenting this certificate of recognition for attending the event {eventName}. Below is your attached certificate, once again, thank you for your participation, we hope you learned something and we wish to see you again in future events!

        Happy Coding!`
    );
    const [subjectInitialized, setSubjectInitialized] = useState(false);

    const handleNextStep = () => {

        // Initialize email subject with event name on first pass
        if (!subjectInitialized) {
            setEmailSubject(`Certificate for ${eventName}`);
            setSubjectInitialized(true);
        }
        setStep('align');

    };

    const handleAlignNext = () => {

        setStep('email');

    };

    // Back handlers
    const handleBackToForm = () => setStep('form');
    const handleBackToAlign = () => setStep('align');

    const handleFinish = () => {

        const API_URL = import.meta.env.VITE_API_URL;

        setIsSending(true);
        setProgress({ current: 0, total: 0 });

        const formData = new FormData();

        formData.append('eventName', eventName);
        formData.append('eventDate', eventDate);
        formData.append('templateFile', templateFile);
        formData.append('csvFile', csvFile);

        formData.append('yPosition', yPosition);
        formData.append('fontSize', fontSize);
        formData.append('fontColor', fontColor);
        formData.append('fontStyle', fontStyle);

        formData.append('sendMode', sendMode);
        formData.append('emailSubject', emailSubject);
        formData.append('emailBody', emailBody);

        // Use fetch with streaming to read SSE progress events
        fetch(`${API_URL}/api/generate`, {

            method: 'POST',
            credentials: 'include',
            body: formData,

        })
        .then(res => {

            if (!res.ok) {
                throw new Error(`Server error: ${res.status}`);
            }

            const reader = res.body.getReader();
            const decoder = new TextDecoder();
            let buffer = '';

            const processStream = () => {
                return reader.read().then(({ done, value }) => {

                    if (done) {
                        // Stream ended — parse any remaining buffer
                        if (buffer.trim()) {
                            parseSSEBuffer(buffer);
                        }
                        // Navigate to dashboard when done
                        navigate('/dashboard');
                        return;
                    }

                    buffer += decoder.decode(value, { stream: true });

                    // Process complete SSE messages (separated by double newlines)
                    const parts = buffer.split('\n\n');
                    buffer = parts.pop(); // Keep incomplete part in buffer

                    for (const part of parts) {
                        parseSSEBuffer(part);
                    }

                    return processStream();

                });
            };

            return processStream();

        })
        .catch(err => {

            console.error('Error: ', err);
            setIsSending(false);
            setProgress({ current: 0, total: 0 });

        });

    };

    const parseSSEBuffer = (text) => {
        const lines = text.split('\n');
        for (const line of lines) {
            if (line.startsWith('data: ')) {
                try {
                    const data = JSON.parse(line.slice(6));
                    if (data.done) {
                        // Will be handled by stream end
                        return;
                    }
                    if (data.total !== undefined) {
                        setProgress(prev => ({
                            current: data.current !== undefined ? data.current : prev.current,
                            total: data.total
                        }));
                    }
                    if (data.current !== undefined) {
                        setProgress(prev => ({
                            ...prev,
                            current: data.current
                        }));
                    }
                } catch (e) {
                    // Ignore parse errors for incomplete data
                }
            }
        }
    };

    return(
    <>
        <div className="flex flex-col justify-center items-center w-full h-screen">
            { step === 'form' && (
                <EventPage
                    onNext={handleNextStep}
                    eventName={eventName} setEventName={setEventName}
                    eventDate={eventDate} setEventDate={setEventDate}
                    templateFile={templateFile} setTemplateFile={setTemplateFile}
                    csvFile={csvFile} setCsvFile={setCsvFile}
                    sendMode={sendMode} setSendMode={setSendMode}
                />
            )}
            { step === 'align' && (
                <AlginmentPanel
                    eventData={{ eventName, eventDate, templateFile, csvFile, sendMode }}
                    onNext={handleAlignNext}
                    onBack={handleBackToForm}
                    yPosition={yPosition} setYPosition={setYPosition}
                    fontSize={fontSize} setFontSize={setFontSize}
                    fontStyle={fontStyle} setFontStyle={setFontStyle}
                    fontColor={fontColor} setFontColor={setFontColor}
                />
            )}
            { step === 'email' && (
                <EmailComposer
                    eventName={eventName}
                    onFinish={handleFinish}
                    isSending={isSending}
                    onBack={handleBackToAlign}
                    sendMode={sendMode}
                    progress={progress}
                    subject={emailSubject} setSubject={setEmailSubject}
                    body={emailBody} setBody={setEmailBody}
                />
            )}
        </div>
    </>
    );

}

export default Event;