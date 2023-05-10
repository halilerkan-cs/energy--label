import React, { useState, useId } from 'react';

const FileInput = ({ textField, onUpload, isMultiple }) => {
    const [fileArray, setFileArray] = useState([]);
    const id = useId();

    const changeHandler = (e) => {
        let arrayLength = e.target.files.length;
        let localFileArray = [...Array(arrayLength).keys()];

        localFileArray.forEach((item, index) => {
            localFileArray[index] = e.target.files[item];
        });

        setFileArray(localFileArray);
        onUpload(localFileArray);
    };

    const removeFiles = () => {
        if (confirm('Dosyayı kaldırmak ister misiniz?')) setFileArray([]);
    };

    return (
        <div
            className="main-board-uploader"
            style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
            <input
                type="file"
                accept="xlsx, xls"
                id={id}
                multiple={isMultiple}
                onChange={changeHandler}
            />
            <label htmlFor={id} className="file-info">
                {!fileArray.length ? (
                    <>
                        <i className="fa fa-upload" aria-hidden="true" style={{}}></i>
                        &nbsp;
                        {textField}
                    </>
                ) : (
                    <>
                        {fileArray.length == 1 ? (
                            <ul>{<li key={0}>{fileArray[0].name}</li>}</ul>
                        ) : (
                            <ol>
                                {fileArray.map((file, index) => (
                                    <li key={index}>{file.name}</li>
                                ))}
                            </ol>
                        )}

                        <button
                            className="fa fa-times"
                            aria-hidden="true"
                            style={{
                                background: 'transparent',
                                border: '0',
                                position: 'absolute',
                                top: '0.5em',
                                right: '0.5em'
                            }}
                            onClick={(e) => {
                                removeFiles();
                            }}
                        />
                    </>
                )}
            </label>
        </div>
    );
};

export default FileInput;
