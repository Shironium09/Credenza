import { useState } from 'react';

function EventForm({ onNext }){

    const [eventName, setEventName] = useState('');
    const [eventDate, setEventDate] = useState('');
    const [templateFile, setTemplateFile] = useState(null);
    const [csvFile, setCsvFile] = useState(null);

    const handleNext = () => {

        onNext({ eventName, eventDate, templateFile, csvFile });

    };

    return(
        <div className="form-card w-140 bg-white flex flex-col p-6 gap-5 rounded-xl shadow-2xl h-110">
            <h1 className="text-center text-4xl font-bold text-white">Event Information</h1>
            <div className="rounded-full border-2 border-gray-300">
                <input type="text" className="p-3 text-white w-full rounded-full" onChange={(e) => setEventName(e.target.value)} placeholder="Event Name" />
            </div>
            <div className="rounded-full border-2 border-gray-300">
                <input type="date" className="p-3 text-white w-full rounded-full" onChange={(e) => setEventDate(e.target.value)} placeholdear="Event Date"/>
            </div>
        <div className="rounded-full border-2 border-gray-300 relative overflow-hidden">
            <label className="block p-3 text-white cursor-pointer">
                {templateFile ? templateFile.name : "Certificate Template (PNG, JPEG, SVG)"}
                <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => setTemplateFile(e.target.files[0])}/>
            </label>
        </div>
        <div className="rounded-full border-2 border-gray-300 relative overflow-hidden">
            <label className="block p-3 text-white cursor-pointer">
                {csvFile ? csvFile.name : "Upload Participant List (CSV)"}
                    <input type="file" accept=".csv" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => setCsvFile(e.target.files[0])}/>
                </label>
            </div>
            <div className="flex justify-center items-center">
                <button onClick={handleNext} className="text-black bg-white w-30 p-2 rounded-full font-bold mt-2">Next Step</button>
            </div>
        </div>
    )

}

export default EventForm;