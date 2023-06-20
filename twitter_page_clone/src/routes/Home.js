import React from 'react';

const Home = () => {
    const onSubmit = (event) => {
        event.preventDefualt();
    };
    <from onSubmit={onSubmit}>
        <input type="text" placeholder="What's on your mind?" maxLength={120} />
        <input type="submit" value="tweet" />
    </from>;
};
export default Home;
