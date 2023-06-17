import AppRouter from './Router';
import React, { useState } from 'react';
import { authService } from '../myBase';

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const user = authService.currentUser;
    console.log(user);
    return <AppRouter isLoggedIn={isLoggedIn} />;
}

export default App;
