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
import { addDoc, collection, doc, updateDoc } from "firebase/firestore";

const EditTweet = ({ tweetObj, editing }) => {
  const [edit, setEditing] = useState(false);
  const [newTweet, setNewTweet] = useState("");
  const [fileAttach, setFileAttach] = useState("");
  const fileInput = useRef();

  const toggleEditing = () => {
    setEditing((editing) => !editing);
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    await updateDoc(doc(dbService, "tweets", `${tweetObj.id}`), {
      text: newTweet,
    });
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
  const onClear = () => {
    fileInput.current.value = null;
    setFileAttach("");
  };
  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setNewTweet(value);
  };

  return (
    <div>
      <div className="tweet">
        <form>
          <InputTextarea
            autoResize
            value={newTweet}
            visible="true"
            onChange={onChange}
            placeholder="Write a content"
            rows={5}
          />
          <FileUpload
            onSelect={onSelect}
            // onUpload={onClear}
            ref={fileInput}
            name="demo[]"
            url="./upload"
            multiple
            accept="image/*"
            mode="basic"
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
    </div>
  );
};

export default EditTweet;
