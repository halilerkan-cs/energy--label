import React, { useState, useRef, useEffect } from 'react';
import PdfCreator from './PdfCreator';

const Helper = (props) => {
    // const [columnNames, setColumnNames] = useState([]);

    const [isReady, setIsReady] = useState(false);
    const [runAgain, setRunAgain] = useState(0);
    const [cardInfo, setCardInfo] = useState(null);
    const [isChanged, setIsChanged] = useState(false);
    const [wantedMainBoard, setWantedMainBoard] = useState(null);
    const [wantedBoardRow, setWantedBoardRow] = useState(null);
    const [mainBoardSheet, setMainBoardSheet] = useState(null);
    const [start, setStart] = useState(false);
    const [success, setSuccess] = useState(null);

    useEffect(() => {
        props.fetchData(cardInfo);
    }, [cardInfo]);

    useEffect(() => {
        if (mainBoardSheet == null || wantedMainBoard == null || isReady == true) {
            console.log('banned');
            return;
        }
        console.log('passed');

        // var mainBoardSheet = props.mainBoardSheet;
        const indexTicket = findColumn('Range - Türev Kartlar (Yeni Etiket Geçişi)');

        var wantedRow = -1;

        for (let i = 0; i < mainBoardSheet.length; i++) {
            const currentRow = mainBoardSheet[i.toString()];
            const ticket = currentRow[indexTicket];

            if (ticket == wantedMainBoard) {
                wantedRow = i;
                break;
            }
        }

        if (wantedRow != -1) {
            setWantedBoardRow(mainBoardSheet[wantedRow.toString()]);
        } else {
            halt();
            alert('Kart Bulunamadı');
        }
    }, [isReady]);

    useEffect(() => {
        if (wantedBoardRow == null || isReady == true) {
            return;
        }

        findInfo('Genişlik');
        findInfo('PAZAR');
        findInfo('P1');
        findInfo('ÜRETİM ONAYI ');
        findInfo('Yeni_Ürün tipi (Product Type)');

        setIsReady(() => {
            return true;
        });
        setStart(() => {
            return false;
        });
    }, [wantedBoardRow]);

    useEffect(() => {
        if (isReady == true) console.log(JSON.stringify(cardInfo));
    }, [isReady]);

    //Boş string ile çalıştırma hatası
    const run = () => {
        alert('run');
        setMainBoardSheet(() => props.mainBoardSheet);
        setIsReady(() => {
            return false;
        });
        setStart(() => {
            return true;
        });
    };

    const halt = () => {
        setIsReady(() => true);
        setSuccess(() => false);
    };

    const saveMainBoard = (e) => {
        setWantedMainBoard(() => e.target.value);
    };

    useEffect(() => {
        setCardInfo(() => {
            const newState = { rangeCode: wantedMainBoard };
            return newState;
        });
    }, [wantedMainBoard]);

    const findInfo = (columnName) => {
        const index = findColumn(columnName);
        const info = wantedBoardRow[index];

        setCardInfo((cardInfo) => {
            const newState = { ...cardInfo, [columnName]: info };
            return newState;
        });
    };

    const findIndex = (arr, wantedColumn) => {
        const index = arr.findIndex((columnName) => columnName == wantedColumn);

        //gecici cozum
        if (index == -1) {
            halt();
            alert(`Kolon bulunamadı: ${wantedColumn}!`);
        }

        return index;
    };

    const findColumn = (wantedColumn) => {
        var columnNames = [];

        if (mainBoardSheet != null) columnNames = mainBoardSheet['0'];

        return findIndex(columnNames, wantedColumn);
    };

    return (
        <div>
            <h1 className="h1">ANAKART BUL</h1>
            <div className="search-box">
                <i
                    className="fa fa-search"
                    aria-hidden="true"
                    onClick={run}
                    style={{ cursor: 'pointer' }}
                ></i>
                <input
                    type="text"
                    name=""
                    onChange={saveMainBoard}
                    placeholder="Kart kodunu giriniz"
                />
            </div>
            {isReady && success && <h5>{/* {JSON.stringify(cardInfo)} */}</h5>}
        </div>
    );
};

export default Helper;
