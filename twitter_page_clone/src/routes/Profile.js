import React, { useEffect, useState } from 'react';
import { authService, dbService } from '../myBase';
import { signOut, updateProfile } from 'firebase/auth';
import { collection, where, getDocs, query, orderBy, doc, updateDoc } from 'firebase/firestore';

export default ({ refreshUser, userObj }) => {
    const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);
    const [cid, setCid] = useState(false);
    const onLogOutClick = () => {
        try {
            const ok = window.confirm('Are you sure?');
            if (ok) {
                signOut(authService);
                refreshUser();
            }
        } catch (error) {
            console.log(error.message);
        }
    };
    const getMyTweets = async () => {
        const q = query(
            collection(dbService, 'tweets'),
            where('creatorId', '==', `${userObj.uid}`),
            orderBy('createdAt', 'desc')
        );
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            console.log(doc.id, ' => ', doc.data());
        });
    };
    const onSubmit = async (event) => {
        event.preventDefault();
        if (userObj.displayName !== newDisplayName) {
            await updateProfile(userObj, {
                displayName: newDisplayName,
            });
            refreshUser();
        }
        const q = query(collection(dbService, 'tweets'));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach(async (docs) => {
            if (docs.data().displayName == newDisplayName)
                // doc.data() is never undefined for query doc snapshots
                console.log(docs.id, ' => ', docs.data());
            if (userObj.uid == docs.data().creatorId) {
                await updateDoc(doc(dbService, 'tweets', `${docs.id}`), {
                    displayName: newDisplayName,
                });
            }
        });
    };
    const onChange = (event) => {
        const {
            target: { value },
        } = event;
        setNewDisplayName(value);
    };
    useEffect(() => {
        getMyTweets();
    }, []);
    return (
        <>
            <form onSubmit={onSubmit}>
                <input onChange={onChange} value={newDisplayName} type="text" placeholder="Display Name" />
                <input type="submit" placeholder="Update Profile" />
            </form>
            <button onClick={onLogOutClick} name="Logout">
                logout
            </button>
        </>
    );
};
