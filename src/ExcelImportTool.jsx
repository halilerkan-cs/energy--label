import React, { useState, useRef, useEffect } from 'react';
import * as xlsx from 'xlsx';
import Helper from './Helper';
import FileInput from './components/FileInputs/FileInput';
import PdfCreator from './PdfCreator/PdfCreator';
import {
    getInfoFromSheet,
    editTemp,
    editTime,
    editWater,
    editProgramName,
    getSheetFromWorkbook,
    getSheetFromFile,
    getInfoFromOptionSheets,
    editOptionObjectStructure,
    combineOptionObjects
} from './functions';

const MARKETS = [
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
];

export const ExcelImportTool = () => {
    const [workBook, setWorkBook] = useState(null);
    const [optionFiles, setOptionFiles] = useState([]);
    const [mainBoardSheet, setMainBoardSheet] = useState(null);
    const [infoSheet, setInfoSheet] = useState(null);
    const [sheetNames, setSheetNames] = useState(null);

    const [allUploaded, setAllUploaded] = useState(null);
    const [loading, setLoading] = useState(false);
    const [cardObject, setCardObject] = useState(null);
    const [infoArray, setInfoArray] = useState([]);
    const [optionInfo, setOptionInfo] = useState([]);
    const [updatedInfoArray, setUpdatedInfoArray] = useState([]);
    const [programCodes, setProgramCodes] = useState([]);

    const mainFileHandler = async (fileArray) => {
        setLoading(true);

        const [file] = fileArray;
        if (file) {
            let data;
            await file
                .arrayBuffer()
                .then((d) => (data = d))
                .catch((err) => {
                    console.log(err);
                });

            readDataFromExcel(data); //??+
        } else {
            handleRemove();
        }
        setLoading(false);
    };

    const optionFilesHandler = async (fileArray) => {
        setLoading(true);
        setAllUploaded(false);
        setOptionFiles(fileArray);
        setLoading(false);
    };

    useEffect(() => {
        if (optionFiles.length != 0 && programCodes.length != 0) {
            let uploadedFiles = optionFiles.map((file) => file.name).join(',');
            let allCodes = programCodes.map((code) => code.substring(code.indexOf(' - ') + 3));
            let anyMissFile = false;

            allCodes.map((code) => {
                if (!uploadedFiles.includes(code)) {
                    anyMissFile = true;
                }
            });

            setAllUploaded(!anyMissFile);
        }
    }, [optionFiles, programCodes]);

    useEffect(() => {
        if (optionFiles.length == 0 && optionFiles.length != programCodes.length) {
            return;
        }

        setOptionInfo(() => []);
        let optionInfoObject = {};

        optionFiles.map(async (file) => {
            let sheet;
            await getSheetFromFile(file, file.name.substring(0, file.name.indexOf('_')))
                .then((result) => {
                    sheet = result;
                })
                .catch((err) => console.log(err));

            //Ornek kart kodu: uE934800_(TA)
            let localOptionInfo = {};
            await getInfoFromOptionSheets(sheet)
                .then((infoArray) => {
                    const cycleName = file.name.substring(
                        file.name.indexOf('_') + 1,
                        file.name.indexOf('_', file.name.indexOf('_') + 1)
                    );
                    localOptionInfo = { ...localOptionInfo, [cycleName]: [...infoArray] };
                    console.log(localOptionInfo);
                })
                .catch((error) => {
                    halt(error);
                });

            // debugger;
            if (localOptionInfo !== undefined) {
                let updatedOptionInfo = editOptionObjectStructure(programCodes, localOptionInfo);
                // console.log(updatedOptionInfo);
                updatedOptionInfo = combineOptionObjects(optionInfoObject, updatedOptionInfo);
            } else console.log('undefined');
            setOptionInfo(updatedOptionInfo);
        });
    }, [optionFiles]);

    const handleRemove = () => {
        setCardObject(null);
        setOptionFiles([]);
        setInfoSheet(null);
        setProgramCodes(() => []);
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

    const getOptionInfoArray = () => {
        return optionInfo;
    };

    useEffect(() => {
        if (sheetNames != null) {
            try {
                const mainSheet = getSheetFromWorkbook(workBook, 'Ana Kart Tablosu');
                setMainBoardSheet(mainSheet);
            } catch (error) {
                console.log(error);
                setLoading(false);
                handleRemove();
                alert(`Ana Kart Tablosu sayfası yok.`);
            }
        }
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
        for (const currMarket of MARKETS) {
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
        try {
            const infoSheet_ = getSheetFromWorkbook(workBook, infoSheetName);
            setInfoSheet(() => infoSheet_);
        } catch (error) {
            setLoading(false);
            alert(`${infoSheetName} sayfası yok`);
            return;
        }
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
        setProgramCodes(wantedProgramCodes);

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
        //||        infoArray.length != Object.keys(cardObject).length - 2
        if (cardObject == null || infoArray == [] || cardObject['PAZAR'] == null) {
            return;
        }
        let infoArrayCP = [...infoArray];
        // console.log(infoArray.length);
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
        <div
            className="body"
            style={{ display: 'flex', flexDirection: 'column', gap: '1.5em', padding: '3em' }}>
            {loading && (
                <div className="loader-container">
                    <div className="spinner"></div>
                </div>
            )}

            <div id="upper-body" style={{ display: 'flex', marginLeft: '9em' }}>
                {programCodes.length != 0 ? (
                    <div
                        style={{
                            display: 'flex',
                            flexBasis: '22.5%',
                            alignItems: 'end',
                            justifyContent: 'center'
                        }}>
                        <div
                            style={{
                                flexBasis: '85%',
                                backgroundColor: 'rgba(216, 216, 216, 0.2)',
                                color: 'white',
                                borderRadius: '0.4em',
                                fontFamily: 'unset'
                            }}>
                            <u
                                style={{
                                    fontSize: '1.3em',
                                    fontWeight: '700',
                                    color: 'ghostwhite'
                                }}>
                                Program Codes:
                            </u>
                            <ol>
                                {programCodes?.map((code, index) => (
                                    <li key={index}>{code}</li>
                                ))}
                            </ol>
                            {allUploaded != null && (
                                <div
                                    style={{
                                        backgroundColor: 'rgba(255, 255, 255, 0.2)',
                                        borderRadius: '0.4em',
                                        fontWeight: '800',
                                        fontSize: '1em',
                                        padding: '4px',
                                        color: allUploaded
                                            ? 'rgb(37, 255, 37)'
                                            : 'rgba(255, 0, 0, 0.75)'
                                    }}>
                                    {allUploaded
                                        ? '✓ Tüm dosyalar yüklendi.'
                                        : '× Eksik dosyalar var.'}
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <div style={{ flexBasis: '22.5%' }}></div>
                )}
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexDirection: 'column',
                        gap: '1em',
                        justifySelf: 'center'
                    }}>
                    <Helper mainBoardSheet={mainBoardSheet} fetchData={fetchData} />

                    <div className="file-container">
                        <FileInput
                            textField={'Anakart Dosyasını Yükleyiniz'}
                            onUpload={mainFileHandler}
                            isMultiple={false}
                        />

                        <FileInput
                            textField={'Option Dosyalarını Yükleyiniz'}
                            onUpload={optionFilesHandler}
                            isMultiple={true}
                        />
                    </div>
                </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center' }}>
                {mainBoardSheet && (
                    <div
                        style={{
                            margin: '1em 0 0 0',
                            maxWidth: '100%',
                            justifyContent: 'space-between'
                        }}>
                        <PdfCreator
                            getInfoArray={getInfoArray}
                            getOptionInfoArray={getOptionInfoArray}
                            getCardObject={getCardObject}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};
