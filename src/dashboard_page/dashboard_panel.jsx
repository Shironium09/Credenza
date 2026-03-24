import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import LogoutButton from './logout.jsx';

const apiFetch = (url) => {

    return fetch(url, {

        method: 'GET',
        credentials: 'include',

    })
    .then(res => {

        if(!res.ok){
            throw new Error('Not authenticated');
        }

    return res.json();
    })

}

function Dashboard_panel(){

    const [user, setUser] = useState(null);
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [showModal, setShowModal] = useState(false);
    const [eventToDelete, setEventToDelete] = useState(null);

    const API_URL = import.meta.env.VITE_API_URL;

    useEffect(() => {

        const userUrl = `${API_URL}/api/me`;
        const eventUrl = `${API_URL}/api/events`;

        Promise.all([
            apiFetch(userUrl),
            apiFetch(eventUrl)
        ])
        .then(([userData, eventsData]) => {

            setUser(userData.user);
            setEvents(eventsData);
            setLoading(false);

        })
        .catch(err => {

            console.error(err);
            setError('Failed to load dashboard. Please log in again.');
            setLoading(false);

        });

    }, []);

    const handleDeleteClick = (id) => {

        setEventToDelete(id);
        setShowModal(true);

    };

    const confirmDelete = () => {

        if(!eventToDelete) return;

        fetch(`${API_URL}/api/events/${eventToDelete}`, {

                method: 'DELETE',
                credentials: 'include',

        })
        .then(res => {

            if(!res.ok){

                throw new Error('Failed to delete');

            }

            setEvents(events.filter(event => event.id !== eventToDelete));
            setShowModal(false);
            setEventToDelete(null);

        })
        .catch(err => {

            console.error("Error deleting: ", err),
            alert("Could not delete event");
            setShowModal(false);

        });

    };

    const cancelDelete = () => {

        setShowModal(false);
        setEventToDelete(null);

    }

    if(loading){
        return <div className="text-white w-70 h-40 form-card text-center mt-10 p-10"><h1>Loading your dashboard...</h1></div>
    }

    if(error){
        return <div className="text-white w-70 h-40 form-card text-center mt-10 p-10"><h1>Error: {error}</h1></div>
    }

    return( 
        <div className="w-full h-screen flex flex-col p-6 gap-4">

            <div className="flex justify-between items-center">
                <div>
                    {user && (
                        <h1 className="text-white text-2xl font-bold">
                            Welcome, <span className="text-purple-400">{user.name}</span>
                        </h1>
                    )}
                </div>
                <div className="flex items-center gap-3">
                    <Link 
                        to="/event" 
                        className="bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors"
                    >
                        + New Event
                    </Link>
                    <div className="border border-gray-600 hover:border-gray-500 rounded-lg px-4 py-2 transition-colors">
                        <LogoutButton/>
                    </div>
                </div>
            </div>
            <div className="flex-1 overflow-hidden flex flex-col">
                <h2 className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-3">Your Events</h2>
                <div className="flex-1 overflow-y-auto flex flex-col gap-2 pr-1">
                    {events.length > 0 ? (
                        [...events].reverse().map(event => (
                            <div key={event.id} className="flex justify-between items-center bg-neutral-950 border border-gray-600 rounded-xl px-4 py-3 hover:bg-zinc-950 hover:border-white transition-all">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-purple-500/15 border border-purple-500/25 rounded-lg flex flex-col items-center justify-center shrink-0">
                                        <span className="text-purple-400 text-sm font-bold leading-none">
                                            {new Date(event.eventDate).getDate()}
                                        </span>
                                        <span className="text-purple-300/70 text-[10px] uppercase">
                                            {new Date(event.eventDate).toLocaleString('default', { month: 'short' })}
                                        </span>
                                    </div>
                                    <div>
                                        <h3 className="text-white font-semibold">{event.eventName}</h3>
                                        <p className="text-gray-500 text-xs mt-0.5">
                                            {new Date(event.eventDate).toLocaleDateString('en-US', {
                                                weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
                                            })}
                                        </p>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => handleDeleteClick(event.id)}
                                    className="bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/25 hover:border-red-500 hover:text-red-300 text-xs font-semibold px-4 py-1.5 rounded-lg transition-all cursor-pointer"
                                >
                                    Delete
                                </button>
                            </div>
                        ))
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20">
                            <p className="text-white text-lg font-semibold">No events yet</p>
                            <p className="text-gray-500 text-sm mt-1">Create your first event to get started</p>
                            <Link to="/event" className="mt-4 bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors">
                                + Create Event
                            </Link>
                        </div>
                    )}
                </div>
            </div>
            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50">
                    <div className="bg-[#1e1e1e] border border-white/10 rounded-2xl p-8 w-96 text-center shadow-2xl">
                        <h3 className="text-white text-lg font-bold mb-2">Delete Event?</h3>
                        <p className="text-gray-400 text-sm mb-6">This action cannot be undone.</p>
                        <div className="flex justify-center gap-3">
                            <button 
                                onClick={cancelDelete}
                                className="px-5 py-2.5 bg-white/10 border border-white/15 hover:bg-white/15 text-gray-300 rounded-lg font-semibold text-sm transition-colors cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={confirmDelete}
                                className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold text-sm transition-colors cursor-pointer"
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>      
    );

}

export default Dashboard_panel;