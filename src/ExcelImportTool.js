import React, { useState, useRef, useEffect } from 'react';
import * as xlsx from 'xlsx';
import Helper from './Helper';
import PdfCreator from './PdfCreator';

export const ExcelImportTool = (props) => {
    const [file, setFile] = useState(null);
    const [fileName, setFileName] = useState('');
    const [data, setData] = useState(null);
    const [sheetNames, setSheetNames] = useState(null);
    const [sheetData, setSheetData] = useState({});
    const [sheetInJsonArr, setSheetInJsonArr] = useState([]);
    const [isDone, setIsDone] = useState(false);
    const [loading, setLoading] = useState(false);
    const [mainBoardSheet, setMainBoardSheet] = useState(null);
    const [cardInfo, setCardInfo] = useState(null);
    const [shouldReadSheet, setShouldReadSheet] = useState(false);
    const [markets, setMarkets] = useState([
        'AU',
        'EU',
        'USA',
        'CN',
        'TW',
        'SD',
        'ANGORA',
        'ATLANTİS',
        'DORA',
        'MISIR',
        'UAE',
        'DE'
    ]);
    const [sizes, setSizes] = useState(['45', '60', '90']);
    const [sheetValues, setSheetValues] = useState([]);

    const fileRef = useRef();
    const acceptableFileExtension = ['xlsx', 'xls'];

    const checkFileExtension = (name) => {
        return acceptableFileExtension.includes(name.split('.').pop());
    };

    const isThereMainBoardSheet = () => {
        const tempIndex = sheetNames.indexOf('Ana Kart Tablosu');

        if (tempIndex == -1) {
            setLoading(false);
            handleRemove();
            return false;
        }
        return true;
    };

    const getSheet = (sheetName) => {
        var tempIndex = -1;

        for (let i = 0; i < sheetNames.length; i++) {
            if (sheetNames[i].includes(sheetName[0]) && sheetNames[i].includes(sheetName[1])) {
                tempIndex = i;
                break;
            }
        }

        if (tempIndex == -1) {
            if (sheetName == 'Ana Kart Tablosu') {
                setLoading(false);
                handleRemove();
                alert(`\"Ana Kart Tablosu\" sayfası yok.`);
            } else {
                alert(`\"${sheetName}\" sayfası yok.`);
            }

            return;
        }

        return tempIndex;
    };

    useEffect(() => {
        if (sheetNames != null) getSheet('Ana Kart Tablosu');
    }, [sheetNames]);

    const readDataFromExcel = async (data) => {
        //async neden kısaltıyor?
        var wb = xlsx.read(data, { bookSheets: true });

        setSheetNames(wb.SheetNames);

        wb = xlsx.read(data, { sheets: 'Ana Kart Tablosu' });
        const mainBoardSheet_ = wb.Sheets['Ana Kart Tablosu'];

        const jsonData = xlsx.utils.sheet_to_json(mainBoardSheet_, {
            blankrows: '',
            header: 1
        });
        setMainBoardSheet(jsonData);
    };

    async function handleFileAsync(e) {
        await handleFile(e);
    }

    const handleFile = async (e) => {
        setLoading(true);

        const myFile = e.target.files[0];
        if (!myFile) {
            setLoading(false);
            return;
        }

        if (!checkFileExtension(myFile.name)) {
            alert('XLSX veya XLS uzantılı dosya yükleyiniz.');
            setLoading(false);
            return;
        }

        //read xlsx metadata
        const data = await myFile.arrayBuffer();
        setData(data);
        readDataFromExcel(data);

        setFile(myFile);
        setFileName(myFile.name);

        setLoading(false);
    };

    const handleRemove = () => {
        setFile(null);
        setFileName('');
        setIsDone(false);
        setCardInfo(null);

        fileRef.current.value = '';
    };

    const fetchData = (cardInfo) => {
        setCardInfo(() => cardInfo);
        setShouldReadSheet(() => true);
    };

    useEffect(() => {
        // console.log(cardInfo);
    }, [cardInfo]);

    const fetchUpdatedData = () => {
        return cardInfo;
    };

    useEffect(() => {
        if (cardInfo == null) {
            console.log('no sir');
            return;
        }
        console.log('yes sir');

        const market = cardInfo['PAZAR'];
        var marketKey = '';
        for (const currMarket of markets) {
            if (market.includes(currMarket)) {
                marketKey = marketKey.concat(currMarket);
            }
        }

        const size = cardInfo['Genişlik'].slice(0, 2);
        var sizeKey = '';
        for (const currSize of sizes) {
            if (size.includes(currSize)) {
                sizeKey = sizeKey.concat(currSize);
            }
        }
        alert(sizeKey + ', ' + marketKey);

        // const indexSheet = getSheet([market, sizeVal]);
        // alert(indexSheet);

        setShouldReadSheet(() => false);
    }, [cardInfo]);

    const readSheet = () => {
        setShouldReadSheet(() => true);
    };

    return (
        <div className="body">
            {loading && (
                <div className="loader-container">
                    <div className="spinner"></div>
                </div>
            )}

            <h5>{JSON.stringify(cardInfo)}</h5>

            {
                <Helper
                    mainBoardSheet={mainBoardSheet}
                    sheetInJsonArr={sheetInJsonArr}
                    fetchData={fetchData}
                    // readSheet={readSheet}
                />
            }

            <div className="file-container">
                <input
                    type="file"
                    accept="xlsx, xls"
                    id="file-input"
                    multiple={false}
                    onChange={(e) => handleFileAsync(e)}
                    ref={fileRef}
                    className="file-input"></input>
                <label htmlFor="file-input" className="file-info">
                    <i className="fa fa-upload" aria-hidden="true"></i>
                    {fileName == '' ? '\u00A0Dosya Yüklenmedi' : '\u00A0' + fileName}
                </label>

                {fileName != '' && (
                    <div style={{ marginLeft: '4.1em' }}>
                        <button
                            onClick={handleRemove}
                            id="remove-button"
                            className="btn btn-warning btn-md"
                            style={{ display: 'inline-block', marginRight: '0.9em' }}>
                            Dosyayı Kaldır
                        </button>
                        <PdfCreator cardInfo={cardInfo} fetchUpdatedData={fetchUpdatedData} />
                    </div>
                )}
            </div>
        </div>
    );
};
