import { useNavigate } from 'react-router-dom';

function EventForm({ onNext, eventName, setEventName, eventDate, setEventDate, templateFile, setTemplateFile, csvFile, setCsvFile, sendMode, setSendMode }){

    const navigate = useNavigate();

    return(
        <div className="form-card w-140 bg-white flex flex-col p-6 gap-5 rounded-xl shadow-2xl h-auto">
            <h1 className="text-center text-4xl font-bold text-white">Event Information</h1>
            <div className="rounded-full border-2 border-gray-300">
                <input type="text" className="p-3 text-white w-full rounded-full" value={eventName} onChange={(e) => setEventName(e.target.value)} placeholder="Event Name" />
            </div>
            <div className="rounded-full border-2 border-gray-300">
                <input type="date" className="p-3 text-white w-full rounded-full" value={eventDate} onChange={(e) => setEventDate(e.target.value)} placeholdear="Event Date"/>
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

            {/* Send Mode Selection */}
            <div className="flex flex-col gap-3 px-2">
                <p className="text-sm font-semibold text-gray-300">What would you like to do?</p>
                <label className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all border ${sendMode === 'email' ? 'border-purple-500 bg-purple-500/10' : 'border-zinc-600 bg-transparent hover:border-zinc-400'}`}>
                    <input
                        type="radio"
                        name="sendMode"
                        value="email"
                        checked={sendMode === 'email'}
                        onChange={() => setSendMode('email')}
                        className="accent-purple-500 w-4 h-4"
                    />
                    <div>
                        <span className="text-white text-sm font-medium">I want to send via email</span>
                        <p className="text-gray-400 text-xs mt-0.5">Generate certificates and email them to recipients</p>
                    </div>
                </label>
                <label className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all border ${sendMode === 'generate' ? 'border-purple-500 bg-purple-500/10' : 'border-zinc-600 bg-transparent hover:border-zinc-400'}`}>
                    <input
                        type="radio"
                        name="sendMode"
                        value="generate"
                        checked={sendMode === 'generate'}
                        onChange={() => setSendMode('generate')}
                        className="accent-purple-500 w-4 h-4"
                    />
                    <div>
                        <span className="text-white text-sm font-medium">I just want to generate</span>
                        <p className="text-gray-400 text-xs mt-0.5">Generate certificates and save to Google Drive only</p>
                    </div>
                </label>
            </div>

            <div className="flex justify-center items-center gap-4">
                <button onClick={() => navigate('/dashboard')} className="text-gray-300 bg-transparent border border-zinc-600 w-30 p-2 rounded-full font-bold mt-2 hover:bg-zinc-700 transition-colors cursor-pointer">Back</button>
                <button onClick={onNext} className="text-black bg-white w-30 p-2 rounded-full font-bold mt-2 cursor-pointer hover:bg-gray-200 transition-colors">Next Step</button>
            </div>
        </div>
    )

}

export default EventForm;