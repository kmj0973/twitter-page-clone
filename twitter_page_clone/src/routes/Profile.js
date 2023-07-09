import React, { useEffect, useState } from "react";
import { authService, dbService } from "../myBase";
import { signOut, updateProfile } from "firebase/auth";
import {
  collection,
  where,
  getDocs,
  query,
  orderBy,
  doc,
  updateDoc,
} from "firebase/firestore";

export default ({ refreshUser, userObj }) => {
  const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);
  const onLogOutClick = () => {
    try {
      signOut(authService);
      refreshUser();
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
      console.log(doc.id, " => ", doc.data());
      console.log(doc.data().displayName);
      console.log(userObj.displayName);
      userObj.displayName = newDisplayName;
      doc.data().displayName = newDisplayName;
    });
  };
  const onSubmit = async (event) => {
    event.preventDefault();
    if (userObj.displayName !== newDisplayName) {
      await updateProfile(userObj, {
        displayName: newDisplayName,
      });
      await updateDoc(doc(dbService, "tweets", `${userObj.uid}`), {
        displayName: newDisplayName,
      });
      refreshUser();
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
    <>
      <form onSubmit={onSubmit}>
        <input
          onChange={onChange}
          value={newDisplayName}
          type="text"
          placeholder="Display Name"
        />
        <input type="submit" placeholder="Update Profile" />
      </form>
      <button onClick={onLogOutClick} name="Logout">
        logout
      </button>
    </>
  );
};
