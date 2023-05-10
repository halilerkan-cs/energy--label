import React from 'react';

const Heading = ({ text }) => {
    return (
        <h1
            style={{
                fontSize: '3em',
                color: 'white',
                textShadow: 'greenyellow'
            }}>
            {text}
        </h1>
    );
};

export default Heading;
