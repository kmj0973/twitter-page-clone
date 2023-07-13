import React, { useState } from "react";
import { doc, deleteDoc, updateDoc } from "firebase/firestore";
import { getStorage, ref, deleteObject } from "firebase/storage";
import { dbService } from "../myBase";
import { SpeedDial } from "primereact/speeddial";

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
  const items = [
    {
      label: "Delete",
      icon: "pi pi-trash",
      command: async (event) => {
        const ok = window.confirm(
          "Are you sure you want to delete this tweet?"
        );
        console.log(ok);
        if (ok) {
          await deleteDoc(doc(dbService, "tweets", `${tweetObj.id}`));
          if (tweetObj.fileUrl) {
            await deleteObject(ref(getStorage(), tweetObj.fileUrl));
          }
        }
      },
    },
    {
      label: "Edit",
      icon: "pi pi-file-edit",
      command: () => {
        setEditing((prev) => !prev);
      },
    },
  ];
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
            <div className="info-style">
              <div>{tweetObj.displayName}</div>
              {isOwner && (
                <SpeedDial
                  model={items}
                  showIcon="pi pi-cog"
                  direction="left"
                  //   style={{ left: "calc(50% - 2rem)", top: 0 }}
                />
              )}
            </div>
            <h3>{tweetObj.text} </h3>
            {tweetObj.fileUrl && <img src={tweetObj.fileUrl} />}
          </div>
        </>
      )}
    </div>
  );
};

export default Tweet;
