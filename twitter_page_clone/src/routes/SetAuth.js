import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import { getAuth, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { authService } from '../myBase';

const SetAuth = ({ refreshUser }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const history = useHistory();
    const onCancel = (event) => {
        event.preventDefault();
        history.push('/');
    };
    const onSubmit = async (event) => {
        event.preventDefault();
        try {
            let data;
            const auth = getAuth();
            // if (newAccount) {
            //   data = await createUserWithEmailAndPassword(auth, email, password);
            // } else {
            data = await createUserWithEmailAndPassword(auth, email, password);
            signOut(auth);
            refreshUser();
            console.log(data);
            console.log(authService.currentUser);
        } catch (error) {
            setError(error.message.replace('Firebase:', ''));
        }
    };
    const onChange = (event) => {
        const { name, value } = event.target;
        if (name === 'email') {
            setEmail(value);
        } else if (name === 'password') {
            setPassword(value);
        }
        console.log(event.target.name);
    };
    return (
        <div className="auth-form">
            회원가입
            <form className="auth-form__input" onSubmit={onSubmit}>
                <div>
                    Email <br />
                    <input name="email" type="text" placeholder="Email" required value={email} onChange={onChange} />
                    <br />
                    Password
                    <br />
                    <input
                        name="password"
                        type="password"
                        placeholder="Password"
                        required
                        value={password}
                        onChange={onChange}
                    />
                </div>
                <div className="auth-form__button">
                    <button type="submit">Join</button>
                    <button onClick={onCancel} type="button">
                        Cancel
                    </button>
                </div>
            </form>
            <div className="error-msg">{error}</div>
        </div>
    );
};

export default SetAuth;
