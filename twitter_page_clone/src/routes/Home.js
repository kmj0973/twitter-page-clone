import React, { useEffect, useState, useRef } from "react";
import { authService, dbService, storageService } from "../myBase";
import { ref, uploadString, getDownloadURL } from "firebase/storage";

import { v4 as uuidv4 } from "uuid";
import Tweet from "../component/Tweet";
import TweetDialog from "../component/TweetDialog";
import { collection, addDoc, getDocs, onSnapshot, query, orderBy } from "firebase/firestore";
import { onAuthStateChanged, updateProfile } from "firebase/auth";

const Home = ({ userObj }) => {
  const [tweet, setTweet] = useState("");
  const [tweets, setTweets] = useState([]);
  const [fileAttach, setFileAttach] = useState("");
  const fileInput = useRef();
  useEffect(() => {
    const q = query(collection(dbService, "tweets"), orderBy("createdAt", "desc"));
    onSnapshot(q, (snapshot) => {
      const TweetArr = snapshot.docs.map((doc) => {
        return { id: doc.id, ...doc.data() };
      });
      setTweets(TweetArr);
    });
    //console.log(userObj);
    // onAuthStateChanged(authService, (user) => {
    //   if (user != null) {
    //     unsubscribe();
    //   }
    // });
  }, []);
  return (
    <div className="main-home">
      <TweetDialog userObj={userObj} />
      <div className="tweet-form">
        {tweets.map((tweet) => (
          <Tweet key={tweet.id} userObj={userObj} tweetObj={tweet} isOwner={tweet.creatorId === userObj.uid} />
        ))}
      </div>
    </div>
  );
};
export default Home;
