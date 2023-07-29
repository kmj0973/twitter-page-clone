import React, { useState } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputTextarea } from "primereact/inputtextarea";
import {
  doc,
  deleteDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  query,
  collection,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";
import { dbService, storageService } from "../myBase";
const CommnetDialog = ({ userObj, tweetObj }) => {
  const [visi, setVisi] = useState(false);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [commenting, setCommenting] = useState({
    comment: comment,
    userUid: userObj.uid,
    userUrl: userObj.photoURL,
    userName: userObj.displayName,
    timestamps: {
      year: new Date().getFullYear(),
      mon: new Date().getMonth() + 1,
      date: new Date().getDate(),
      hour: new Date().getHours(),
      min: new Date().getMinutes(),
    },
  });
  const onClick = () => {
    setVisi((e) => !e);
  };
  const onHide = () => {
    setVisi((e) => !e);
  };
  const onAddClick = async () => {
    if (comment != "") {
      setComments([...comments, comment]);
      await updateDoc(doc(dbService, "tweets", `${tweetObj.id}`), {
        commentArray: [
          ...tweetObj.commentArray,
          {
            comment: commenting.comment,
            userUid: commenting.userUid,
            userUrl: commenting.userUrl,
            userName: commenting.userName,
            timestamp: commenting.timestamps,
          },
        ],
      });
      setCommenting((cmt) => {
        return { ...cmt, comment: "" };
      });
      setComment("");
    }
  };
  const onChange = (event) => {
    setCommenting({
      comment: comment,
      userUid: userObj.uid,
      userUrl: userObj.photoURL,
      userName: userObj.displayName,
      timestamps: {
        year: new Date().getFullYear(),
        mon: new Date().getMonth() + 1,
        date: new Date().getDate(),
        hour: new Date().getHours(),
        min: new Date().getMinutes(),
      },
    });
    const {
      target: { value },
    } = event;
    setComment(value);
    setCommenting((cmt) => {
      return { ...cmt, comment: value };
    });
  };
  const footer = (
    <div>
      <Button label="add" icon="pi pi-check" onClick={onAddClick} />
      <Button label="cancel" icon="pi pi-times" onClick={onHide} />
    </div>
  );

  return (
    <>
      <div onClick={onClick} style={{ fontSize: "15px" }}>
        댓글을 입력하세요...
      </div>

      <Dialog
        header="Comments"
        headerStyle={{ alignContent: "center" }}
        draggable={false}
        dismissableMask={true}
        footer={footer}
        visible={visi}
        style={{ width: "50vw", height: "100vw" }}
        onHide={onHide}
        position="bottom"
      >
        <div className="comment-dialog-body">
          <div className="comments-body">
            {tweetObj.commentArray ? (
              tweetObj.commentArray.map((c, idx) => {
                let time = c.timestamp;
                let timeString = `${time.year}/${time.mon}/${time.date} ${
                  time.hour < 10 ? "0" + time.hour : time.hour
                }:${time.min < 10 ? "0" + time.min : time.min}`;
                return (
                  <div className="comment" key={idx++}>
                    <div className="comment-info-main">
                      <div className="comment-info">
                        <img className="tweet-profile-img" src={c.userUrl} />
                        <div className="comment-info__name">{c.userName}</div>
                      </div>
                      <div>{timeString}</div>
                    </div>
                    <div className="comment-value">{c.comment}</div>
                  </div>
                );
              })
            ) : (
              <div>현재 달린 댓글이 없습니다.</div>
            )}
          </div>
          <div className="dialog-body__add-comment">
            <div>댓글 추가</div>
            <InputTextarea
              autoResize
              value={comment}
              onChange={onChange}
              placeholder="Enter comments"
              rows={3}
            />
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default CommnetDialog;
