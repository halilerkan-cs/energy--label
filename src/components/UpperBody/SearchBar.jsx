import React, { useState } from 'react';

const SearchBar = ({ run }) => {
    const [text, setText] = useState('');

    const changeHandler = (e) => {
        setText(e.target.value);
    };

    const clickHandler = () => {
        run(text);
    };

    return (
        <div
            className="search-box"
            style={{
                display: 'flex',
                height: '6vh',
                width: '23em',
                alignItems: 'center',
                backgroundColor: 'white',
                borderRadius: '30px',
                padding: '20px'
            }}>
            <button
                className="fa fa-search"
                style={{
                    border: '0',
                    color: 'rgba(0,0,0,0.6)',
                    backgroundColor: 'white'
                }}
                onClick={clickHandler}></button>
            <input
                className=""
                style={{
                    flex: '1',
                    height: '40px',
                    width: '100%',
                    border: 'none',
                    outline: 'none',
                    fontSize: '1em',
                    paddingLeft: '10px'
                }}
                type="text"
                name=""
                onChange={changeHandler}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') clickHandler();
                }}
                placeholder="Kart kodunu giriniz"
            />
        </div>
    );
};

export default SearchBar;
