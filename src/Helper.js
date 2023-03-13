import { React, useState, useEffect } from 'react';

const Helper = (props) => {
    const [mainBoardSheet, setMainBoardSheet] = useState(null);
    const [cardInfo, setCardInfo] = useState(null);
    const [isRunning, setIsRunning] = useState(false);
    const [wantedMainBoard, setWantedMainBoard] = useState(null);
    const [wantedBoardRow, setWantedBoardRow] = useState(null);
    const [found, setFound] = useState(true);

    useEffect(() => {
        if (isRunning == false) {
            props.fetchData(cardInfo);
            // props.readSheet();
        }
    }, [isRunning]);

    useEffect(() => {
        if (found == false) {
            props.fetchData({});
            setFound(() => true);
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
            halt('no main sheet');
            return;
        }

        if (wantedMainBoard == null) {
            halt('no main board');
            return;
        }

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
            setFound(() => false);
            halt(`Kart Bulunamadı: <${wantedMainBoard}>`);
        }
    }, [isRunning]);

    useEffect(() => {
        if (wantedBoardRow == null) return;

        findInfo('Genişlik');
        findInfo('PAZAR');

        setIsRunning(() => false);
        setWantedBoardRow(() => null);
    }, [wantedBoardRow]);

    const saveMainBoard = (e) => {
        setWantedMainBoard(() => e.target.value);
    };

    const run = () => {
        if (isRunning == true) console.log('already tr 1 ');

        setIsRunning(() => true);
    };

    const runWithEnter = (e) => {
        if (e.key !== 'Enter') return;
        if (isRunning == true) console.log('already tr 2 ');

        setIsRunning(() => true);
    };

    const halt = (msg) => {
        setIsRunning(() => false);
        alert(msg);
    };

    const findInfo = (columnName) => {
        const index = findColumn(columnName);
        const info = wantedBoardRow[index];

        if (wantedBoardRow == null) halt('no wanted board row');

        setCardInfo((cardInfo) => {
            const newState = { ...cardInfo, [columnName]: info };
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
        <div>
            <h1 className="h1">ANAKART BUL</h1>
            <div className="search-box">
                <i
                    className="fa fa-search"
                    aria-hidden="true"
                    onClick={run}
                    style={{ cursor: 'pointer' }}></i>
                <input
                    type="text"
                    name=""
                    onChange={saveMainBoard}
                    onKeyDown={runWithEnter}
                    placeholder="Kart kodunu giriniz"
                />
            </div>
        </div>
    );
};

export default Helper;
