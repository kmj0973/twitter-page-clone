import AppRouter from "./Router";
import React, { useEffect, useState } from "react";
import { authService } from "../myBase";

function App() {
  const [init, setInit] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => {
    authService.onAuthStateChanged((user) => {
      if (user) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
      setInit(true);
    });
  }, []);
  console.log(authService.currentUser);
  return (
    <>{init ? <AppRouter isLoggedIn={isLoggedIn} /> : "Initializing..."}</>
  );
}

export default App;
