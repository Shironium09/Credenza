import React from 'react';

function LogoutButton(){

    const logout = () => {

        const API_URL = import.meta.env.VITE_API_URL;

        fetch(`${API_URL}/auth/logout`, {

            method: 'GET',
            credentials: 'include'
            
        })
        .then(res => res.json())
        .then(data => {

            console.log(data.message);
            window.location.href = 'http://localhost:5173/';

        })
        .catch(err => {
            console.error('Logout Failed', err);
        });

    }

    return(<button onClick={logout} className="text-white">Logout</button>)

}

export default LogoutButton;