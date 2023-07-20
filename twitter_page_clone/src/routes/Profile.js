import React, { useEffect, useState, useRef } from "react";
import { authService, dbService } from "../myBase";
import { signOut, updateProfile } from "firebase/auth";
import { collection, where, getDocs, query, orderBy, doc, updateDoc } from "firebase/firestore";
import { InputText } from "primereact/inputtext";
import profile_user_icon from "../img/profile-user-icon.png";
import { Button } from "primereact/button";

export default ({ refreshUser, userObj }) => {
  const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);
  const [profile, setProfile] = useState(profile_user_icon);
  let fileInput = useRef();
  const onLogOutClick = () => {
    try {
      const ok = window.confirm("Are you sure?");
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
      collection(dbService, "tweets"),
      where("creatorId", "==", `${userObj.uid}`),
      orderBy("createdAt", "desc")
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      // console.log(doc.id, ' => ', doc.data());
    });
  };
  const onSubmit = async (event) => {
    event.preventDefault();
    const ok = window.confirm("Do you want to change username?");
    if (ok) {
      if (userObj.displayName !== newDisplayName) {
        await updateProfile(userObj, {
          displayName: newDisplayName,
        });
        refreshUser();
      }
      const q = query(collection(dbService, "tweets"));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach(async (docs) => {
        if (docs.data().displayName === newDisplayName)
          // doc.data() is never undefined for query doc snapshots
          console.log(docs.id, " => ", docs.data());
        if (userObj.uid === docs.data().creatorId) {
          await updateDoc(doc(dbService, "tweets", `${docs.id}`), {
            displayName: newDisplayName,
          });
        }
      });
    }
  };
  const onSelect = (event) => {
    console.log(event.target.files);
    const {
      target: { files },
    } = event;
    const theFile = files[0];
    const reader = new FileReader();
    reader.onloadend = (finishedEvent) => {
      const {
        currentTarget: { result },
      } = finishedEvent;
      setProfile(result);
    };
    if (theFile) {
      reader.readAsDataURL(theFile);
    }
  };
  const onClick = (event) => {
    setProfile(profile_user_icon);
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
    <div className="profile-form">
      <div>
        <img src={profile} alt="user" width="100px" height="100px" />
        <label className="profile-file" for="input-file">
          file
        </label>
        <input
          type="file"
          id="input-file"
          accept="image/*"
          style={{ display: "none" }}
          ref={fileInput}
          onChange={onSelect}
        />
        <label for="clear-file" className="profile-clear-btn">
          clear
        </label>
        <input type="button" id="clear-file" style={{ display: "none" }} onClick={onClick} />
      </div>

      <form onSubmit={onSubmit}>
        <label htmlFor="username">Username</label>
        <div>
          <InputText
            id="username"
            onChange={onChange}
            value={newDisplayName}
            placeholder="Display Name"
            style={{ width: "200px" }}
          />
          <Button type="submit" icon="pi pi-check" />
          {/* <input type="submit" placeholder="Update Profile" /> */}
        </div>
      </form>
      {/* <button onClick={onLogOutClick} name="Logout">
        logout
      </button> */}
      <div className="logout-btn">
        <Button onClick={onLogOutClick} label="logout" size="small" />
      </div>
    </div>
  );
};
