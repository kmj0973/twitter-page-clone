import React, { useEffect, useState } from "react";
import { dbService } from "../myBase";
import { collection, addDoc, getDocs } from "firebase/firestore";

const Home = () => {
  const [tweet, SetTweet] = useState("");
  const [tweets, setTweets] = useState([]);
  const getTweets = async () => {
    const querySnapshot = await getDocs(collection(dbService, "tweets"));
    querySnapshot.forEach((doc) => {
      const TweetObject = {
        ...doc.data(),
        id: doc.id,
      };
      setTweets((prev) => [TweetObject, ...prev]);
    });
  };
  useEffect(() => {
    getTweets();
  }, []);
  const onSubmit = async (event) => {
    event.preventDefault();
    try {
      const docRef = await addDoc(collection(dbService, "tweets"), {
        tweet,
        createdAt: Date.now(),
      });
    } catch (error) {
      console.log(error.message);
    }
    SetTweet("");
  };
  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    SetTweet(value);
  };
  console.log(tweets);
  return (
    <div>
      <form onSubmit={onSubmit}>
        <input
          value={tweet}
          onChange={onChange}
          type="text"
          placeholder="What's on your mind?"
          maxLength={120}
        />
        <input type="submit" value="Tweet" />
      </form>
      <div>
        {tweets.map((tweet) => (
          <div key={tweet.id}>
            <h4>{tweet.tweet}</h4>
          </div>
        ))}
      </div>
    </div>
  );
};
export default Home;
