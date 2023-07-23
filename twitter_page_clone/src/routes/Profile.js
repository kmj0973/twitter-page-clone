import React, { useEffect, useState, useRef } from "react";
import { authService, dbService, storageService } from "../myBase";
import { signOut, updateProfile } from "firebase/auth";
import { v4 as uuidv4 } from "uuid";
import {
  getStorage,
  ref,
  deleteObject,
  uploadString,
  getDownloadURL,
} from "firebase/storage";
import {
  collection,
  where,
  getDocs,
  query,
  orderBy,
  doc,
  updateDoc,
} from "firebase/firestore";
import { InputText } from "primereact/inputtext";
import profile_user_icon from "../img/profile-user-icon.png";
import { Button } from "primereact/button";
import attach_icon from "../img/attachments-icon.png";
import reset_icon from "../img/reset-icon.png";

export default ({ refreshUser, userObj }) => {
  const [newDisplayName, setNewDisplayName] = useState(
    userObj.displayName || ""
  );
  const [profile, setProfile] = useState("");
  let fileInput = useRef();
  let fileUrl = "";
  useEffect(() => {
    if (userObj.photoURL != null) setProfile(userObj.photoURL);
    else setProfile(profile_user_icon);
  }, []);
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
      if (profile != profile_user_icon) {
        const fileRef = ref(storageService, `${userObj.uid}/${userObj.email}`);
        const response = await uploadString(fileRef, profile, "data_url");
        fileUrl = await getDownloadURL(response.ref);
        await updateProfile(userObj, {
          photoURL: fileUrl,
        });
        refreshUser();
      }
      const q = query(collection(dbService, "tweets"));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach(async (docs) => {
        if (docs.data().displayName === newDisplayName)
          if (userObj.uid === docs.data().creatorId) {
            // doc.data() is never undefined for query doc snapshots
            // console.log(docs.id, " => ", docs.data());
            await updateDoc(doc(dbService, "tweets", `${docs.id}`), {
              displayName: newDisplayName,
              photoUrl: fileUrl,
            });
          }
      });
    }
  };
  const onSelect = async (event) => {
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
    console.log(userObj);
  };

  const onClear = async (event) => {
    setProfile(profile_user_icon);
    const ok = window.confirm("Are you sure you want to reset your profile?");
    if (ok) {
      await updateProfile(userObj, {
        displayName: newDisplayName,
        photoURL: profile_user_icon,
      });
      refreshUser();
      // await deleteDoc(doc(dbService, "tweets", `${tweetObj.id}`));
      if (userObj.photoURL) {
        await deleteObject(
          ref(getStorage(), `${userObj.uid}/${userObj.email}`)
        );
      }
      const q = query(collection(dbService, "tweets"));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach(async (docs) => {
        if (docs.data().displayName === newDisplayName)
          if (userObj.uid === docs.data().creatorId) {
            // doc.data() is never undefined for query doc snapshots
            // console.log(docs.id, " => ", docs.data());
            await updateDoc(doc(dbService, "tweets", `${docs.id}`), {
              photoUrl: profile_user_icon,
            });
          }
      });
    }
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
      <div className="profile-form__photo">
        <img
          className="profile-img"
          src={profile}
          alt="user"
          width="100px"
          height="100px"
        />
        <label className="profile-file" htmlFor="input-file">
          <img src={attach_icon} />
        </label>
        <input
          type="file"
          id="input-file"
          accept="image/*"
          style={{ display: "none" }}
          ref={fileInput}
          onChange={onSelect}
        />
        <label htmlFor="clear-file" className="profile-clear-btn">
          <img src={reset_icon} />
        </label>
        <input
          type="button"
          id="clear-file"
          style={{ display: "none" }}
          onClick={onClear}
        />
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
{
  /* <a href="https://www.flaticon.com/kr/free-icons/" title="붙이다 아이콘">붙이다 아이콘  제작자: Freepik - Flaticon</a> */
}
{
  /* <a href="https://www.flaticon.com/kr/free-icons/-" title="- 아이콘">- 아이콘  제작자: Tanah Basah - Flaticon</a> */
}
//기본 이미지를 다시 세팅해야함
