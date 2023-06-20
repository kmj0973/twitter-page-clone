import React from 'react';
import { authService } from '../myBase';
import { signOut } from 'firebase/auth';
import { Link } from 'react-router-dom';
export default () => {
    const onLogOutClick = () => {
        try {
            signOut(authService);
        } catch (error) {
            console.log(error.message);
        }
    };
    return (
        <>
            <button onClick={onLogOutClick} name="Logout">
                Logout
            </button>
        </>
    );
};
