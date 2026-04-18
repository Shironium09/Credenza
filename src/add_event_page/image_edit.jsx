import React, { useState, useEffect, useRef } from 'react';
import Papa from 'papaparse';

function AlignmentPanel({ eventData, onNext, onBack, yPosition, setYPosition, fontSize, setFontSize, fontStyle, setFontStyle, fontColor, setFontColor }){

    const [templateURL, setTemplateURL] = useState('');
    const [sampleName, setSampleName] = useState('Juan De La L. Cruz');

    const [scaleFactor, setScaleFactor] = useState(1);
    const imgRef = useRef(null);

    const fontOptions = [

        {label: 'Poppins', value: 'Poppins'},
        {label: 'Montserrat', value: 'Montserrat'},
        {label: 'Raleway', value: 'Raleway'},
        {label: 'Arimo (≈ Arial)', value: 'Arimo'},
        {label: 'Playfair Display', value: 'Playfair Display'},
        {label: 'EB Garamond', value: 'EB Garamond'},
        {label: 'Lora', value: 'Lora'},
        {label: 'Tinos (≈ Times New Roman)', value: 'Tinos'},
        {label: 'Cousine (≈ Courier New)', value: 'Cousine'},
        {label: 'Great Vibes', value: 'Great Vibes'},

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

    const handleNext = () => {

        onNext();

    };

    useEffect(() => {

        if (!imgRef.current) return;

        const observer = new ResizeObserver(() => {
            if (imgRef.current) {
                const displayWidth = imgRef.current.clientWidth;
                const naturalWidth = imgRef.current.naturalWidth;
                if (naturalWidth > 0) {
                    setScaleFactor(displayWidth / naturalWidth);
                }
            }
        });

        observer.observe(imgRef.current);
        return () => observer.disconnect();

    }, [templateURL]);

    return(
        <div className="form-card flex flex-col rounded-xl shadow-2xl w-[90vw] max-w-[1100px] h-[85vh] p-6 overflow-hidden">

            <h2 className="text-2xl font-bold text-white mb-4 text-center">Certificate Alignment</h2>

            <div className="flex gap-5 flex-1 overflow-hidden">

                <div className="w-72 shrink-0 flex flex-col gap-4">

                    <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-4 flex flex-col gap-4">

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
                                className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
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
                                className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
                            />
                        </div>

                    </div>

                    <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-4">

                        <label className="block text-sm font-medium text-white mb-2">Font Style</label>
                        <select
                            value={fontStyle}
                            onChange={(e) => setFontStyle(e.target.value)}
                            className="w-full p-2 rounded bg-zinc-700 text-white border-none outline-none cursor-pointer"
                        >
                            {fontOptions.map(font => <option key={font.value} value={font.value}>{font.label}</option>)}
                        </select>

                    </div>

                    <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-4 flex items-center justify-between">

                        <label className="text-sm font-medium text-white">Font Color</label>
                        <input
                            type="color"
                            value={fontColor}
                            onChange={(e) => setFontColor(e.target.value)}
                            className="w-10 h-10 rounded cursor-pointer border-none"
                        />

                    </div>

                    <div className="mt-auto flex gap-3">
                        <button onClick={onBack} className="flex-1 px-6 py-3 bg-transparent border border-zinc-600 text-gray-300 font-semibold rounded-full shadow hover:bg-zinc-700 transition-colors cursor-pointer">
                            Back
                        </button>
                        <button onClick={handleNext} className="flex-1 px-6 py-3 bg-white text-black font-semibold rounded-full shadow hover:bg-gray-200 transition-colors cursor-pointer">
                            Next Step
                        </button>
                    </div>

                </div>

                <div className="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg p-4 overflow-auto flex items-center justify-center">

                    <div className="relative w-full max-h-full">

                        <img 
                            ref={imgRef}
                            src={templateURL} 
                            alt="Certificate Template" 
                            className="w-full h-auto block rounded"
                            onLoad={handleImageLoad}
                        />

                        <p 
                            className="absolute left-1/2 w-full text-center p-0 m-0 leading-none"
                            style={{
                                top: `${yPosition}%`,
                                fontSize: `${fontSize * scaleFactor}px`,
                                color: fontColor,
                                fontFamily: fontStyle,
                                fontWeight: 'bold',
                                transform: 'translate(-50%, -50%)',
                                pointerEvents: 'none'
                            }}
                        >{sampleName}</p>

                    </div>

                </div>

            </div>

        </div>
    )

}

export default AlignmentPanel;