import React from "react";
import { Link } from "react-router-dom";
import twitter_icon from "../img/twitter-icon.png";
import user_icon from "../img/user-icon.png";
import bell_icon from "../img/bell-icon.png";

const Navigation = ({ userObj }) => {
  return (
    <nav className="navigation">
      <ul>
        <li>
          <img src={bell_icon} alt="menu" width="32px" />
        </li>
        <li>
          <Link to="/">
            <img src={twitter_icon} alt="twitter" width="32px" />
          </Link>
        </li>
        <li>
          <Link to="/profile">
            <img src={user_icon} alt="user" width="32px" />
            {/* {userObj.displayName}의 My profile */}
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;
{
  /* <a href="https://www.flaticon.com/kr/free-icons/" title="종 아이콘">종 아이콘  제작자: Mayor Icons - Flaticon</a> */
}
