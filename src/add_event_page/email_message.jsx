function EmailComposer({ eventName, onFinish, isSending, onBack, sendMode, progress, subject, setSubject, body, setBody }){

    const placeholders = [
        { tag: '{name}', desc: "Recipient's name from CSV" },
        { tag: '{eventName}', desc: 'Name of the event' },
    ];

    const isProcessing = isSending;

    // Build the button label
    let buttonLabel;
    if (isProcessing) {
        if (progress && progress.total > 0) {
            buttonLabel = `Processing... ${progress.current}/${progress.total}`;
        } else {
            buttonLabel = 'Processing...';
        }
    } else {
        buttonLabel = sendMode === 'generate' ? 'Generate Certificates' : 'Send Certificates';
    }

    return(
        <div className="form-card flex flex-col p-6 rounded-xl shadow-2xl w-[700px] max-h-[90vh] overflow-y-auto">

            <h2 className="text-3xl font-bold text-white mb-5 text-center">
                {sendMode === 'generate' ? 'Confirm Generation' : 'Compose Email'}
            </h2>

            {sendMode === 'generate' ? (
                /* Generate-only mode: show a summary instead of the email composer */
                <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-5 mb-4">
                    <p className="text-gray-300 text-sm leading-relaxed">
                        Certificates will be generated for all participants in your CSV and uploaded to a
                        <span className="text-amber-400 font-semibold"> "{eventName}"</span> folder in your Google Drive.
                    </p>
                    <p className="text-gray-400 text-xs mt-3">No emails will be sent.</p>
                </div>
            ) : (
                /* Email mode: show the full email composer */
                <>
                    <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-3 mb-4">

                        <p className="text-sm text-gray-400 mb-2 font-semibold">Available Placeholders</p>

                        <div className="flex flex-wrap gap-3">

                            {placeholders.map(p => (
                                <span key={p.tag} className="text-xs text-gray-300">
                                    <code className="bg-zinc-700 px-1.5 py-0.5 rounded text-amber-400">{p.tag}</code>
                                    <span className="ml-1">— {p.desc}</span>
                                </span>
                            ))}

                        </div>

                    </div>

                    <div className="bg-zinc-800 border border-zinc-700 rounded-lg overflow-hidden flex flex-col flex-1">

                        <div className="flex items-center border-b border-zinc-700 px-4 py-3">
                            <span className="text-gray-400 text-sm w-16 shrink-0">From</span>
                            <span className="text-gray-300 text-sm">Your Google Account</span>
                        </div>

                        <div className="flex items-center border-b border-zinc-700 px-4 py-3">
                            <span className="text-gray-400 text-sm w-16 shrink-0">To</span>
                            <span className="text-gray-300 text-sm">Recipients from CSV</span>
                        </div>

                        <div className="flex items-center border-b border-zinc-700 px-4 py-3">
                            <label htmlFor="email-subject" className="text-gray-400 text-sm w-16 shrink-0">Subject</label>
                            <input
                                id="email-subject"
                                type="text"
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                                className="bg-transparent text-white text-sm w-full outline-none"
                                placeholder="Email subject..."
                            />
                        </div>

                        <div className="p-4 flex-1">
                            <textarea
                                id="email-body"
                                value={body}
                                onChange={(e) => setBody(e.target.value)}
                                className="w-full h-56 bg-transparent text-white text-sm outline-none resize-none leading-relaxed"
                                placeholder="Write your email message here..."
                            />
                        </div>

                        <div className="border-t border-zinc-700 px-4 py-3">
                            <div className="flex items-center gap-2 bg-zinc-700 rounded-lg px-3 py-2 w-fit">
                                <svg className="w-4 h-4 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                                </svg>
                                <span className="text-xs text-gray-300">{'{name}'}_{eventName || 'event'}_certificate.png</span>
                            </div>
                        </div>

                    </div>
                </>
            )}

            {/* Progress bar */}
            {isProcessing && progress && progress.total > 0 && (
                <div className="mt-4">
                    <div className="w-full bg-zinc-700 rounded-full h-2 overflow-hidden">
                        <div
                            className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${(progress.current / progress.total) * 100}%` }}
                        />
                    </div>
                    <p className="text-gray-400 text-xs mt-1 text-center">
                        {progress.current} of {progress.total} certificates processed
                    </p>
                </div>
            )}

            <div className="flex justify-center items-center gap-4 mt-5">
                <button
                    onClick={onBack}
                    disabled={isProcessing}
                    className={`px-10 py-3 font-semibold rounded-full shadow transition-colors ${
                        isProcessing
                            ? 'bg-zinc-700 text-gray-500 cursor-not-allowed'
                            : 'bg-transparent border border-zinc-600 text-gray-300 hover:bg-zinc-700 cursor-pointer'
                    }`}
                >
                    Back
                </button>
                <button
                    onClick={onFinish}
                    disabled={isProcessing}
                    className={`px-10 py-3 font-semibold rounded-full shadow transition-colors ${
                        isProcessing
                            ? 'bg-gray-500 text-gray-300 cursor-not-allowed'
                            : 'bg-white text-black hover:bg-gray-200 cursor-pointer'
                    }`}
                >
                    {buttonLabel}
                </button>
            </div>

        </div>
    );

}

export default EmailComposer;