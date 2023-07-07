import React, { useEffect, useState, useRef } from 'react';
import { authService, dbService, storageService } from '../myBase';
import { ref, uploadString, getDownloadURL } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';
import Tweet from '../component/Tweet';
import { collection, addDoc, getDocs, onSnapshot, query, orderBy } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

const Home = ({ userObj }) => {
    const [tweet, setTweet] = useState('');
    const [tweets, setTweets] = useState([]);
    const [fileAttach, setFileAttach] = useState('');
    const fileInput = useRef();
    useEffect(() => {
        const q = query(collection(dbService, 'tweets'), orderBy('createdAt', 'desc'));
        onSnapshot(q, (snapshot) => {
            const TweetArr = snapshot.docs.map((doc) => {
                return { id: doc.id, ...doc.data() };
            });
            setTweets(TweetArr);
        });

        // onAuthStateChanged(authService, (user) => {
        //   if (user != null) {
        //     unsubscribe();
        //   }
        // });
    }, []);
    const onSubmit = async (event) => {
        event.preventDefault();
        let fileUrl = '';
        if (tweet === '') return window.confirm('Write your mind');
        if (fileAttach != '') {
            const fileRef = ref(storageService, `${userObj.uid}/${uuidv4()}`);
            const response = await uploadString(fileRef, fileAttach, 'data_url');
            fileUrl = await getDownloadURL(response.ref);
        }
        const tweetObj = {
            text: tweet,
            createdAt: Date.now(),
            creatorId: userObj.uid,
            fileUrl,
        };
        await addDoc(collection(dbService, 'tweets'), tweetObj);
        setTweet('');
        setFileAttach('');
        fileInput.current.value = null;
    };
    const onChange = (event) => {
        const {
            target: { value },
        } = event;
        setTweet(value);
    };
    const onFileChange = (event) => {
        const {
            target: { files },
        } = event;
        const theFile = files[0];
        const reader = new FileReader();
        reader.onloadend = (finishedEvent) => {
            const {
                currentTarget: { result },
            } = finishedEvent;
            setFileAttach(result);
        };
        if (theFile) {
            reader.readAsDataURL(theFile);
        }
    };
    const onClear = () => {
        fileInput.current.value = null;
        setFileAttach('');
    };
    return (
        <div className="main-home">
            <form onSubmit={onSubmit} className="tweet-form__input">
                <input
                    value={tweet}
                    onChange={onChange}
                    type="text"
                    placeholder="What's on your mind?"
                    maxLength={120}
                />
                <input type="file" accept="image/*" onChange={onFileChange} ref={fileInput} />
                {fileAttach && (
                    <div>
                        <img src={fileAttach} width="50px" height="50px" />
                        <button onClick={onClear}>Clear</button>
                    </div>
                )}
                <input type="submit" value="Tweet" />
            </form>
            <div className="tweet-form">
                {tweets.map((tweet) => (
                    <Tweet key={tweet.id} tweetObj={tweet} isOwner={tweet.creatorId === userObj.uid} />
                ))}
            </div>
        </div>
    );
};
export default Home;
