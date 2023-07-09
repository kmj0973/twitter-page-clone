import React, { useState } from "react";
import { doc, deleteDoc, updateDoc } from "firebase/firestore";
import { getStorage, ref, deleteObject } from "firebase/storage";
import { dbService } from "../myBase";

const Tweet = ({ tweetObj, isOwner }) => {
  const [editing, setEditing] = useState(false);
  const [newTweet, setNewTweet] = useState(tweetObj.text);
  const onDeleteClick = async (event) => {
    const ok = window.confirm("Are you sure you want to delete this tweet?");
    console.log(ok);
    if (ok) {
      await deleteDoc(doc(dbService, "tweets", `${tweetObj.id}`));
      if (tweetObj.fileUrl) {
        await deleteObject(ref(getStorage(), tweetObj.fileUrl));
      }
    }
  };
  const toggleEditing = () => {
    setEditing((prev) => !prev);
  };
  const onSubmit = async (event) => {
    event.preventDefault();
    await updateDoc(doc(dbService, "tweets", `${tweetObj.id}`), {
      text: newTweet,
    });
    setEditing(false);
  };
  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setNewTweet(value);
  };
  console.log(tweetObj);
  return (
    <div>
      {editing ? (
        <>
          <div className="tweet">
            <form onSubmit={onSubmit}>
              <input
                type="text"
                placeholder="Edit your Tweet"
                value={newTweet}
                required
                onChange={onChange}
              />
              <input type="file" accept="image/*" />
              <input type="submit" value="Update Tweet" />
            </form>
            <button onClick={toggleEditing}>Cancel</button>
          </div>
        </>
      ) : (
        <>
          <div className="tweet">
            <div>{tweetObj.displayName}</div>
            <h3>{tweetObj.text} </h3>
            {tweetObj.fileUrl && <img src={tweetObj.fileUrl} />}

            {isOwner && (
              <>
                <button onClick={onDeleteClick}>Delete Tweet</button>
                <button onClick={toggleEditing}>Edit Tweet</button>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Tweet;
