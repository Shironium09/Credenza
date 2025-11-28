import React, { useState, useEffect, useRef } from 'react';
import Papa from 'papaparse';

function AlignmentPanel({ eventData, onFinish }){

    const [templateURL, setTemplateURL] = useState('');
    const [sampleName, setSampleName] = useState('Juan De La L. Cruz');

    const [yPosition, setYPosition] = useState(50);
    const [fontSize, setFontSize] = useState(100);
    const [fontStyle, setFontStyle] = useState('Arial');
    const [fontColor, setFontColor] = useState('#000000');

    const [scaleFactor, setScaleFactor] = useState(1);
    const imgRef = useRef(null);

    const fontOptions = [

        {label: 'Arial', value: 'Arial'},
        {label: 'Times New Roman', value: 'Times New Roman'},
        {label: 'Courier New', value: 'Courier New'},
        {label: 'Georgia', value: 'Georgia'},
        {label: 'Verdana', value: 'Verdana'},

    ];

    useEffect(() => {

        let localTemplateURL = '';

        if(eventData.templateFile){

            localTemplateURL = URL.createObjectURL(eventData.templateFile);
            setTemplateURL(localTemplateURL);

        }

        if(eventData.csvFile){

            Papa.parse(eventData.csvFile, {

                header: true,
                complete: (results) => {

                    if(results.data.length > 0){

                        setSampleName(results.data[0].Name || 'Sample Name');

                    }

                }
    
            });

        }

        return () => {

            if(localTemplateURL){

                URL.revokeObjectURL(localTemplateURL);

            }

        };

    }, [eventData]);

    const handleImageLoad = (e) => {

        const naturalWidth = e.target.naturalWidth;
        const displayWidth = e.target.clientWidth;

        const scale = displayWidth / naturalWidth;
        setScaleFactor(scale);

    };

    const handleFinish = () => {

        const formData = new FormData();

        formData.append('eventName', eventData.eventName);
        formData.append('eventDate', eventData.eventDate);
        formData.append('templateFile', eventData.templateFile);
        formData.append('csvFile', eventData.csvFile);

        formData.append('yPosition', yPosition);
        formData.append('fontSize', fontSize);
        formData.append('fontColor', fontColor);
        formData.append('fontStyle', fontStyle);

    onFinish(formData);
    };

    return(
        
        <div className="flex flex-col items-center p-8 form-card rounded-xl shadow-2xl mt-40">
            <h2 className="text-3xl font-bold text-white mb-6">Certificate Alignment</h2>

            <div className="w-full max-w-lg p-4 bg-gray-800 rounded-lg mb-6">
                <div>
                    <label className="block text-sm font-medium text-white mb-2">
                        Vertical Position: {yPosition}%
                    </label>
                    <input 
                        type="range"
                        min="0"
                        max="100"
                        value={yPosition}
                        onChange={(e) => setYPosition(e.target.value)}
                        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-white mb-2">
                        Font Size: {fontSize}px
                    </label>
                    <input
                        type="range"
                        min="20"
                        max="200"
                        value={fontSize}
                        onChange={(e) => setFontSize(e.target.value)}
                        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                    />
                </div>

                <div className="flex gap-4">
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-white mb-2">Font Style</label>
                        <select
                            value={fontStyle}
                            onChange={(e) => setFontStyle(e.target.value)}
                            className="w-full p-2 rounded bg-gray-700 text-white border-none outline-none"
                        >
                            {fontOptions.map(font => <option key={font.value} value={font.value}>{font.label}</option>)}
                        </select>
                    </div>
                    <div className="flex flex-col justify-center align-center">
                        <label className="text-sm font-medium text-white mb-2">
                            Font Color
                        </label>
                        <input
                            type="color"
                            value={fontColor}
                            onChange={(e) => setFontColor(e.target.value)}
                            className="ms-3 w-10 h-10 rounded cursor-pointer"
                        />
                    </div>
                </div>

            </div>
            <div className="w-full max-w-2xl p-4 bg-white rounded max-h-[60vh] overflow-y-auto">
                <div className="relative w-full shadow-lg">
                    <img 
                        ref={imgRef}
                        src={templateURL} 
                        alt="Certificate Template" 
                        className="w-full h-auto block"
                        onLoad={handleImageLoad}
                    />
                    <p 
                        className="absolute left-1/2 -translate-x-1/2 w-full text-center p-0 m-0 leading-none"
                        style={{
                            top: `${yPosition}%`,
                            fontSize: `${fontSize * scaleFactor}px`,
                            color: fontColor,
                            fontFamily: fontStyle,
                            fontWeight: 'bold',
                            transform: 'translate(0%, -50%)',
                            pointerEvents: 'none'
                        }}
                    >{sampleName}</p>
                </div>
            </div>
            <button onClick={handleFinish} className="mt-6 px-10 py-3 bg-white text-black font-semibold rounded-full shadow hover:bg-gray-200 transition-colors">Finish</button>
        </div>
    )

}

export default AlignmentPanel;