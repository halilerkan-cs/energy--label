import React, { useState, useEffect } from 'react';
import { getInfoFromSheet } from './functions';
import Heading from './components/UpperBody/Heading';
import SearchBar from './components/UpperBody/SearchBar';

const Helper = (props) => {
    const [mainBoardSheet, setMainBoardSheet] = useState(null);
    const [cardObject, setCardObject] = useState(null);
    const [isRunning, setRunning] = useState(false);
    const [wantedMainBoard, setWantedMainBoard] = useState(null);
    const [wantedBoardRow, setWantedBoardRow] = useState(null);
    const [found, setFound] = useState(false);

    useEffect(() => {
        if (isRunning == false) {
            props.fetchData(cardObject);
            // props.readSheet();
        }
    }, [isRunning]);

    useEffect(() => {
        if (found == true) {
            props.fetchData({});
            setFound(() => false);
        }
    }, [found]);

    useEffect(() => {
        setMainBoardSheet(props.mainBoardSheet);
    }, [props.mainBoardSheet]);

    useEffect(() => {
        if (isRunning == false) {
            return;
        }

        if (mainBoardSheet == null) {
            //should not alert when not uploaded file. alert another error.
            halt("Excel dosyasında Main Board Sheet'i bulunamadı.");
            return;
        }

        if (wantedMainBoard == null) {
            halt('Kart kodu girmediniz.');
            return;
        }

        let wantedColumns = [
            'Genişlik',
            'PAZAR',
            'P0',
            'P1',
            'P2',
            'P3',
            'P4',
            'P5',
            'P6',
            'P7',
            'P8',
            'P9',
            'P10'
        ];
        let updatedCardObject = { 'Range - Türev Kartlar Kodu': wantedMainBoard };
        getInfoFromSheet(
            mainBoardSheet,
            'Range - Türev Kartlar (Yeni Etiket Geçişi)',
            wantedMainBoard,
            wantedColumns
        )
            .then((columnValues) => {
                columnValues.map((val, index) => {
                    if (val != '' && val != '-') {
                        let currColumn = wantedColumns[index];
                        updatedCardObject = { ...updatedCardObject, [currColumn]: val };
                    }
                });
                setCardObject(() => updatedCardObject);
            })
            .catch((error) => {
                halt(error);
            });

        setRunning(() => false);
    }, [isRunning]);

    useEffect(() => {
        if (wantedBoardRow == null) return;

        findInfo('Genişlik');
        findInfo('PAZAR');

        // setRunning(() => false);
        setWantedBoardRow(() => null);
    }, [wantedBoardRow]);

    const run = (text) => {
        if (isRunning == true) console.log('already tr 1 ');
        setWantedMainBoard(text);

        setRunning(() => {
            true;
        });
    };

    const halt = (msg) => {
        console.log('halting');
        setRunning(() => false);
        alert(msg);
    };

    const findInfo = (columnName) => {
        const index = findColumn(columnName);
        const info = wantedBoardRow[index];

        if (wantedBoardRow == null) halt('no wanted board row');

        setCardObject((cardObject) => {
            const newState = { ...cardObject, [columnName]: info };
            return newState;
        });
    };

    const findIndex = (arr, wantedColumn) => {
        const index = arr.findIndex((columnName) => columnName == wantedColumn);

        if (index == -1) {
            halt(`Kolon bulunamadı: ${wantedColumn}!`);
        }

        return index;
    };

    const findColumn = (wantedColumn) => {
        var columnNames = [];

        if (mainBoardSheet != null) columnNames = mainBoardSheet['0'];
        else halt('no main sheet 2');

        return findIndex(columnNames, wantedColumn);
    };

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.2em'
            }}>
            <Heading text={'ANAKART BUL'} />
            <SearchBar run={run} />
        </div>
    );
};

export default Helper;
