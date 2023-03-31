import React, { useState, useRef, useEffect } from 'react';
import * as xlsx from 'xlsx';
import Helper from './Helper';
import PdfCreator from './PdfCreator/PdfCreator';
import { getInfoFromSheet, editTemp, editTime, editWater, editProgramName } from './Functions';

export const ExcelImportTool = (props) => {
    const [file, setFile] = useState(null);
    const [fileName, setFileName] = useState('');
    const [data, setData] = useState(null);
    const [sheetNames, setSheetNames] = useState(null);
    const [sheetInJsonArr, setSheetInJsonArr] = useState([]);
    const [isDone, setIsDone] = useState(false);
    const [loading, setLoading] = useState(false);
    const [mainBoardSheet, setMainBoardSheet] = useState(null);
    const [infoSheet, setInfoSheet] = useState(null);
    const [workBook, setWorkBook] = useState(null);
    const [cardObject, setCardObject] = useState(null);
    const [infoArray, setInfoArray] = useState([]);
    const [updatedInfoArray, setUpdatedInfoArray] = useState([]);
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

    const fileRef = useRef();
    const acceptableFileExtension = ['xlsx', 'xls'];

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
        setCardObject(null);

        fileRef.current.value = '';
    };

    const checkFileExtension = (name) => {
        return acceptableFileExtension.includes(name.split('.').pop());
    };

    const fetchData = (cardObject) => {
        setCardObject(() => cardObject);
    };

    const getCardObject = () => {
        return cardObject;
    };

    const getInfoArray = () => {
        return updatedInfoArray;
    };

    const getSheet = (sheetName) => {
        const sheet = workBook.Sheets[sheetName];
        if (sheet == undefined) {
            setLoading(false);
            handleRemove();
            alert(`\"${sheetName}\" sayfası yok.`);
        } else {
            const jsonData = xlsx.utils.sheet_to_json(sheet, {
                blankrows: '',
                header: 1
            });
            return jsonData;
        }
    };

    useEffect(() => {
        if (sheetNames != null) setMainBoardSheet(getSheet('Ana Kart Tablosu'));
    }, [sheetNames]);

    const readDataFromExcel = async (data) => {
        //async neden kısaltıyor?
        var wb = xlsx.read(data);
        setWorkBook(wb); //runned correct??
        setSheetNames(wb.SheetNames);

        // wb = xlsx.read(data, { sheets: 'Ana Kart Tablosu' });
    };

    useEffect(() => {
        if (cardObject == null) {
            return;
        }

        const market = cardObject['PAZAR'];
        var marketKey = '';
        for (const currMarket of markets) {
            if (market.includes(currMarket)) {
                if (currMarket.includes(currMarket)) marketKey = marketKey.concat(currMarket);
            }
        }

        const size = cardObject['Genişlik'].slice(0, 2);
        var sizeKey;
        if (size.includes('45')) {
            sizeKey = '45';
        } else {
            sizeKey = '60';
        }

        const infoSheetName = 'PRG - ' + sizeKey + ' ' + marketKey;
        const infoSheet_ = getSheet(infoSheetName);

        setInfoSheet(() => infoSheet_);
    }, [cardObject]);

    useEffect(() => {
        if (infoSheet == null) {
            return;
        }
        setInfoArray([]);

        let wantedProgramCodes = [];
        Object.entries(cardObject).forEach(([key, value]) => {
            const pattern = /^P(?:[0-9]|10)$/;
            if (pattern.test(key) && value != '') {
                wantedProgramCodes.push(value);
            }
        });

        let wantedColumns = [];
        if (cardObject['PAZAR'].includes('USA')) {
            wantedColumns = [
                'ANA YIKAMA (°C)',
                'ANA YIKAMA (°F)',
                'SON DURULAMA  (°C)',
                'SON DURULAMA (°F)',
                'PROGRAM SÜRESİ (dak)',
                'SU TÜKETİMİ (L)',
                'SU TÜKETİMİ (gal)'
            ];
        } else {
            wantedColumns = ['ANA YIKAMA', 'PROGRAM SÜRESİ (dak)', 'SU TÜKETİMİ (L)'];
        }
        wantedProgramCodes.map((progCode) => {
            let infoObject = {};
            if (progCode.includes('-')) {
                infoObject = { ProgramName: progCode.substring(0, progCode.indexOf('-') - 1) };
                progCode = progCode.slice(progCode.indexOf('-') + 2);
            }

            getInfoFromSheet(infoSheet, 'KOD', progCode, wantedColumns)
                .then((infoArrays) => {
                    infoArrays.map((info, index) => {
                        let currColumn = wantedColumns[index];
                        infoObject = { ...infoObject, [currColumn]: info };
                    });
                    setInfoArray((infoArray) => [...infoArray, infoObject]);
                })
                .catch((error) => {
                    halt(error);
                });
        });
    }, [infoSheet]);

    useEffect(() => {
        if (
            cardObject == null ||
            infoArray == [] ||
            !cardObject.hasOwnProperty('PAZAR') ||
            cardObject['PAZAR'] == null ||
            infoArray.length != Object.keys(cardObject).length - 2
        ) {
            return;
        }
        let infoArrayCP = [...infoArray];
        if (cardObject['PAZAR'].includes('USA')) {
            infoArrayCP.map((infoObject, index) => {
                let programName = editProgramName(infoObject['ProgramName']);
                let washTemp = editTemp(
                    infoObject['ANA YIKAMA (°F)'],
                    infoObject['ANA YIKAMA (°C)']
                );
                let rinseTemp = editTemp(
                    infoObject['SON DURULAMA (°F)'],
                    infoObject['SON DURULAMA (°C)']
                );
                let time = editTime(infoObject['PROGRAM SÜRESİ (dak)'].toString());
                let water = editWater(
                    infoObject['SU TÜKETİMİ (gal)'],
                    infoObject['SU TÜKETİMİ (L)']
                );

                infoArrayCP[index] = {
                    ['Program Name']: programName,
                    ['Dirtiness']: 'High-Medium',
                    ['Wash Temps']: washTemp,
                    ['Rinse Temps']: rinseTemp,
                    ['Time(Approx.)']: time,
                    ['Water']: water
                };
            });
        }

        setUpdatedInfoArray(infoArrayCP);
    }, [infoArray]);

    const halt = (msg) => {
        // setIsRunning(() => false);
        alert(msg);
    };

    return (
        <div className="body" style={{}}>
            {loading && (
                <div className="loader-container">
                    <div className="spinner"></div>
                </div>
            )}

            {/* <p style={{ width: '20em' }}>
                {'CARD:\n' +
                    JSON.stringify(cardObject) +
                    '-------------------OLD:\n' +
                    infoArray.map((obj) => obj['ProgramName']) +
                    '-------------------UPDATED:\n' +
                    updatedInfoArray.map((obj) => obj['Program Name'])}
            </p> */}

            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <div style={{ width: '23em', height: 'fit-content' }}>
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
                    </div>
                </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                {fileName != '' && (
                    <div
                        style={{
                            margin: '1em 0 0 0',
                            maxWidth: '100%',
                            justifyContent: 'space-between'
                        }}>
                        <PdfCreator getInfoArray={getInfoArray} getCardObject={getCardObject} />
                        <button
                            onClick={handleRemove}
                            className="btn btn-light btn-md"
                            style={{ margin: '2em 1em 1em 1em' }}>
                            Dosyayı Kaldır
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};
