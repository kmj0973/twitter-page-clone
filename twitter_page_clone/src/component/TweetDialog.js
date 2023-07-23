import React, { useRef, useState } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputTextarea } from "primereact/inputtextarea";
import { FileUpload } from "primereact/fileupload";
import { dbService, storageService } from "../myBase";
import { ref, uploadString, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import { addDoc, collection } from "firebase/firestore";

const TweetDialog = ({ userObj }) => {
  const [display, setDisplay] = useState(false);
  const [position, setPosition] = useState("center");
  const [tweet, setTweet] = useState("");
  const [fileAttach, setFileAttach] = useState("");
  const fileInput = useRef();
  const onClick = () => {
    setDisplay(true);

    if (position) {
      setPosition(position);
    }
    setTweet("");
  };

  const onHide = () => {
    setDisplay(false);
    setFileAttach("");
    setTweet("");
  };
  const onSubmit = async (event) => {
    event.preventDefault();
    console.log("click");
    let fileUrl = "";
    if (tweet === "") return window.confirm("Write your mind");
    if (fileAttach != "") {
      const fileRef = ref(storageService, `${userObj.uid}/${uuidv4()}`);
      const response = await uploadString(fileRef, fileAttach, "data_url");
      fileUrl = await getDownloadURL(response.ref);
    }
    const tweetObj = {
      text: tweet,
      createdAt: Date.now(),
      creatorId: userObj.uid,
      displayName: userObj.displayName,
      fileUrl,
      photoUrl: userObj.photoURL,
    };
    await addDoc(collection(dbService, "tweets"), tweetObj);
    setTweet("");
    setDisplay(false);
    setFileAttach("");
    fileInput.current.value = null;
  };
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
  };
  const onClear = (event) => {
    fileInput.current.value = null;
    setFileAttach("");
  };
  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setTweet(value);
  };
  const renderFooter = () => {
    return (
      <div>
        <Button
          type="submit"
          label="Post"
          icon="pi pi-check"
          autoFocus
          onClick={onSubmit}
        />
        <Button
          label="Cancel"
          icon="pi pi-times"
          onClick={() => onHide()}
          className="p-button-text"
        />
      </div>
    );
  };

  return (
    <div className="dialog-demo">
      <div className="card">
        <Button icon="pi pi-pencil" label="Tweet" onClick={() => onClick()} />
        <form>
          <Dialog
            header="Tweet"
            visible={display}
            style={{ width: "50vw" }}
            footer={renderFooter()}
            onHide={() => onHide()}
          >
            <InputTextarea
              autoResize
              value={tweet}
              onChange={onChange}
              placeholder="Write your mind!!"
              rows={5}
            />
            <FileUpload
              onSelect={onSelect}
              onUpload={onClear}
              ref={fileInput}
              name="demo[]"
              url="./upload"
              multiple
              accept="image/*"
              mode="basic"
              chooseLabel="Photo"
            />
            {fileAttach && (
              <div>
                <img
                  className="img-styles"
                  src={fileAttach}
                  width="200px"
                  height="200px"
                />
              </div>
            )}
          </Dialog>
        </form>
      </div>
    </div>
  );
};

export default TweetDialog;
