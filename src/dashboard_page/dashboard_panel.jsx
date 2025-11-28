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
        <div className="form-card w-[90%] h-[95%] p-2 flex justify-center items-center flex-col">
            <div className="w-[95%] flex justify-between items-center p-2">
                <div className="flex items-center p-2 border-2 border-white rounded-full mini_info">
                    {user && (<h1 className="text-white ">{user.name}</h1>)}
                </div>
                <div className="flex items-center p-2 border-2 border-white rounded-full button">
                    <LogoutButton/>
                </div>
            </div>
            <div className="w-full h-[70%] flex justify-center items-center">
                <div className="w-[95%] h-[95%] form-card">
                    <div className='w-full h-full dashboard-container p-3'>
                        {events.length > 0 ? (
                        <ul className="flex flex-col flex-col-reverse gap-3">
                            {events.map(event => (
                                <div className="w-full mini-info round-white-border">
                                    <li key={event.id} className="flex w-fuill justify-between text-white">
                                    <div>
                                        <h1 className="text-2 font-bold">{event.eventName}</h1>
                                        <h5 clasName="text-[0.2%]">{event.eventDate}</h5>
                                    </div>
                                    <div>
                                        <button 
                                            onClick={() => handleDeleteClick((event.id))}
                                            className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 rounded text-sm transition-colors h-[70%] mt-2 cursor-pointer"
                                        >
                                        Delete
                                        </button>
                                    </div>
                                    </li>
                                </div>
                            ))}
                        </ul>
                        ) : (
                            <p className="text-white text-center mt-10 mb-10 font-bold text-2xl">You haven't created any events yet...</p>
                        )}
                    </div>
                </div>
            </div>
            <div className="w-[95%] flex justify-between items-center p-1">
                <div className="flex items-center p-2 border-2 border-white rounded-full button">
                    <Link to="/event" className="text-white">Create Event</Link>
                </div>       
            </div>

            {showModal && (
                <div className="absolute inset-0 flex items-center justify-center bg-opacity-70 backdrop-blur-sm bg-white/30 p-6 rounded-xl z-50">
                    <div className="bg-black p-6 rounded-lg shadow-xl w-80 text-center p-2 border-2 border-white">
                        <h3 className="text-white text-xl font-bold mb-2 text-gray-800">Delete Event?</h3>
                        <p className="text-white mb-6">Are you sure you want to delete this event? This cannot be undone.</p>
                        
                        <div className="flex justify-center gap-4">
                            <button 
                                onClick={cancelDelete}
                                className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded font-semibold transition-colors cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={confirmDelete}
                                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded font-semibold transition-colors cursor-pointer"
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