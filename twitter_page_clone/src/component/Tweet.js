import { doc, deleteDoc, updateDoc, arrayUnion, arrayRemove, query, collection, getDocs } from "firebase/firestore";
import { getStorage, ref, deleteObject, uploadString, getDownloadURL } from "firebase/storage";
import { SpeedDial } from "primereact/speeddial";
import React, { useEffect, useRef, useState } from "react";
import { Button } from "primereact/button";
import { InputTextarea } from "primereact/inputtextarea";
import { FileUpload } from "primereact/fileupload";
import { dbService, storageService } from "../myBase";
import { v4 as uuidv4 } from "uuid";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import profile_user_icon from "../img/profile-user-icon.png";
import CommentDialog from "../component/CommentDialog";

const Tweet = ({ userObj, tweetObj, isOwner }) => {
  const [editing, setEditing] = useState(false);
  const [newTweet, setNewTweet] = useState(tweetObj.text);
  const [fileAttach, setFileAttach] = useState(tweetObj.fileUrl);
  const fileInput = useRef();
  const [editingHearts, setEditingHearts] = useState(false);
  const [comments, setComments] = useState(1);

  useEffect(() => {
    tweetObj.heartArray.forEach((uid) => {
      if (uid == userObj.uid) {
        setEditingHearts(true);
      }
    });
  }, []);
  const onSelect = (event) => {
    console.log(event.files);
    const { files: files } = event;
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
    console.log(theFile);
  };
  const toggleEditing = () => {
    setEditing((prev) => !prev);
    console.log(tweetObj);
  };
  const onSubmit = async (event) => {
    event.preventDefault();
    let fileUrl = "";
    if (fileAttach != "") {
      if (tweetObj.fileUrl) {
        await deleteObject(ref(getStorage(), tweetObj.fileUrl));
      }
      const fileRef = ref(storageService, `${tweetObj.creatorId}/${uuidv4()}`);
      const response = await uploadString(fileRef, fileAttach, "data_url");
      fileUrl = await getDownloadURL(response.ref);

      await updateDoc(doc(dbService, "tweets", `${tweetObj.id}`), {
        fileUrl: fileUrl,
      });
    }
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
  const onHeartClick = async () => {
    setEditingHearts((prev) => !prev);
    if (!editingHearts) {
      await updateDoc(doc(dbService, "tweets", `${tweetObj.id}`), {
        hearts: tweetObj.hearts + 1,
        heartArray: arrayUnion(userObj.uid),
      });
    } else {
      await updateDoc(doc(dbService, "tweets", `${tweetObj.id}`), {
        hearts: tweetObj.hearts - 1,
        heartArray: arrayRemove(userObj.uid),
      });
    }
  };
  const onClickComment = (event) => {
    //console.log(event);
  };
  const items = [
    {
      label: "Delete",
      icon: "pi pi-trash",
      command: async (event) => {
        const ok = window.confirm("Are you sure you want to delete this tweet?");
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
            <form>
              <InputTextarea
                autoResize
                value={newTweet}
                visible="true"
                onChange={onChange}
                placeholder="Write your mind!!"
                rows={5}
              />
              <FileUpload
                onSelect={onSelect}
                ref={fileInput}
                name="demo[]"
                url="./upload"
                multiple
                accept="image/*"
                mode="basic"
                chooseLabel="Photo"
              />
              {fileAttach && (
                <div className="img-div">
                  <img className="img-styles" src={fileAttach} width="100px" height="100px" />
                </div>
              )}
              <div className="edit-btn">
                <Button
                  type="submit"
                  label="Post"
                  icon="pi pi-check"
                  autoFocus
                  style={{ marginRight: "2px" }}
                  onClick={onSubmit}
                />
                <Button
                  label="Cancel"
                  icon="pi pi-times"
                  onClick={() => toggleEditing()}
                  className="p-button-text"
                  style={{ marginLeft: "2px" }}
                />
              </div>
            </form>
          </div>
        </>
      ) : (
        <>
          <div className="tweet">
            <div className="info-style">
              <div className="tweet-info">
                {tweetObj.photoUrl != null ? (
                  <img className="tweet-profile-img" src={tweetObj.photoUrl} alt="user" />
                ) : (
                  <img className="tweet-profile-img" src={profile_user_icon} alt="user" />
                )}

                {tweetObj.displayName != null ? tweetObj.displayName : "undefined"}
              </div>
              {isOwner && (
                <SpeedDial
                  model={items}
                  showIcon="pi pi-cog"
                  direction="down"
                  //   style={{ left: "calc(50% - 2rem)", top: 0 }}
                />
              )}
            </div>
            <h3 style={{ marginLeft: "5px" }}>{tweetObj.text} </h3>

            {tweetObj.fileUrl && (
              <div className="tweet_img">
                <img className="tweet_img_input" src={tweetObj.fileUrl} />
              </div>
            )}
            <div className="tweet-footer">
              <div className="tweet-footer__heart">
                {editingHearts ? (
                  <i className="pi pi-heart-fill" onClick={onHeartClick}></i>
                ) : (
                  <i className="pi pi-heart" onClick={onHeartClick}></i>
                )}
                {tweetObj.hearts >= 1 ? (
                  <div style={{ marginLeft: "5px" }}>{tweetObj.hearts}명이 이 글을 좋아합니다.</div>
                ) : (
                  ""
                )}
              </div>
              <div style={{ marginLeft: "5px", fontSize: "12px" }}>댓글 {tweetObj.commentArray.length}개</div>
              <div className="comment-form" onClick={onClickComment} style={{ marginLeft: "5px" }}>
                <CommentDialog userObj={userObj} tweetObj={tweetObj} />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Tweet;
