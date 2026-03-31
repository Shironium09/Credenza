import { useState } from 'react';

function EmailComposer({ eventData, alignmentData, onFinish, isSending }){

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [subject, setSubject] = useState(`Certificate for ${eventData?.eventName || ''}`);
    const [body, setBody] = useState(
        `Hello {name},

        We are presenting this certificate of recognition for attending the event {eventName}. Below is your attached certificate, once again, thank you for your participation, we hope you learned something and we wish to see you again in future events!

        Happy Coding!`
    );

    const handleFinish = () => {

        if (isSubmitting || isSending) return;

        setIsSubmitting(true);

        const formData = new FormData();

        formData.append('eventName', eventData.eventName);
        formData.append('eventDate', eventData.eventDate);
        formData.append('templateFile', eventData.templateFile);
        formData.append('csvFile', eventData.csvFile);

        formData.append('yPosition', alignmentData.yPosition);
        formData.append('fontSize', alignmentData.fontSize);
        formData.append('fontColor', alignmentData.fontColor);
        formData.append('fontStyle', alignmentData.fontStyle);

        formData.append('emailSubject', subject);
        formData.append('emailBody', body);

        onFinish(formData);

    };

    const placeholders = [
        { tag: '{name}', desc: "Recipient's name from CSV" },
        { tag: '{eventName}', desc: 'Name of the event' },
    ];

    return(
        <div className="form-card flex flex-col p-6 rounded-xl shadow-2xl w-[700px] max-h-[90vh] overflow-y-auto">

            <h2 className="text-3xl font-bold text-white mb-5 text-center">Compose Email</h2>

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
                        <span className="text-xs text-gray-300">{'{name}'}_{eventData?.eventName || 'event'}_certificate.png</span>
                    </div>
                </div>

            </div>

            <button
                onClick={handleFinish}
                disabled={isSubmitting || isSending}
                className={`mt-5 px-10 py-3 font-semibold rounded-full shadow transition-colors self-center ${
                    isSubmitting || isSending
                        ? 'bg-gray-500 text-gray-300 cursor-not-allowed'
                        : 'bg-white text-black hover:bg-gray-200 cursor-pointer'
                }`}
            >
                {isSubmitting || isSending ? 'Processing...' : 'Send Certificates'}
            </button>

        </div>
    );

}

export default EmailComposer;