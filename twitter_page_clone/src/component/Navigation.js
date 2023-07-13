import React from "react";
import { Link } from "react-router-dom";
import twitter_icon from "../img/twitter-icon.png";
import user_icon from "../img/user-icon.png";
import menu_icon from "../img/menu-icon.png";
import DialogDemo from "./TweetDialog";
const Navigation = ({ userObj }) => {
  const onClick = () => {};
  return (
    <nav className="navigation">
      <ul>
        <li>
          <button type="click">
            <img src={menu_icon} alt="menu" width="30px" />
          </button>
        </li>
        <li>
          <Link to="/">
            <img src={twitter_icon} alt="twitter" width="30px" />
          </Link>
        </li>
        <li>
          <Link to="/profile">
            <img src={user_icon} alt="user" width="30px" />
            {/* {userObj.displayName}의 My profile */}
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;
