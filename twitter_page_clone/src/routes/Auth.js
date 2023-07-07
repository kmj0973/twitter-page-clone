import React, { useState } from "react";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GithubAuthProvider,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { authService } from "../myBase";
import { Link } from "react-router-dom/cjs/react-router-dom.min";
import twitter_icon from "../img/twitter-icon.png";
import google_icon from "../img/google-icon.png";
import github_icon from "../img/github-icon.png";
const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newAccount, setNewAccount] = useState(true);
  const [error, setError] = useState("");
  const onChange = (event) => {
    const { name, value } = event.target;
    if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    }
    console.log(event.target.name);
  };
  const onLogIn = async (event) => {
    event.preventDefault();
    try {
      let data;
      const auth = getAuth();
      // if (newAccount) {
      //   data = await createUserWithEmailAndPassword(auth, email, password);
      // } else {
      data = await signInWithEmailAndPassword(auth, email, password);
      console.log(data);
      console.log(authService.currentUser);
    } catch (error) {
      setError(error.message.replace("Firebase:", ""));
    }
  };
  const onCreateAccount = async (event) => {
    event.preventDefault();
    try {
      let data;
      const auth = getAuth();
      // if (newAccount) {
      //   data = await createUserWithEmailAndPassword(auth, email, password);
      // } else {
      data = await signInWithEmailAndPassword(auth, email, password);
      console.log(data);
      console.log(authService.currentUser);
    } catch (error) {
      setError(error.message.replace("Firebase:", ""));
    }
  };
  // const toggleAccount = () => setNewAccount((prev) => !prev);
  const onSocialClick = async (event) => {
    console.log(event.target.name);
    let provider;
    try {
      if (event.target.name === "google") {
        provider = new GoogleAuthProvider();
        const result = await signInWithPopup(authService, provider);
      } else if (event.target.name === "github") {
        provider = new GithubAuthProvider();
        const result = await signInWithPopup(authService, provider);
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="login-form">
      <div className="login-form__logo">
        <img src={twitter_icon} alt="twitter" width="30px" />
      </div>
      <form className="login-form__input" onSubmit={onLogIn}>
        <div className="login-form__input_text">
          <input
            name="email"
            type="text"
            placeholder="Email"
            required
            value={email}
            onChange={onChange}
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            required
            value={password}
            onChange={onChange}
          />
        </div>
        <div className="login-form__input_text__button">
          <input
            type="submit"
            // value={newAccount ? "Create Account" : "Log In"}
            value="Log In"
          />
        </div>
      </form>
      <div className="other-auth">
        <button onClick={onSocialClick} name="google">
          <img src={google_icon} alt="goolge" />
        </button>
        <button onClick={onSocialClick} name="github">
          <img src={github_icon} alt="github" />
        </button>
        <Link to="/setAuth" className="create-account">
          <input type="submit" value="Create Account" />
        </Link>
      </div>
      <div className="error-msg">{error}</div>
    </div>
  );
};

export default Auth;
