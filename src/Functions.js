import * as xlsx from 'xlsx';

export const getInfoFromRow = (row, index) => {
    let info = null;

    if (row != null) {
        info = row[index];
    } else {
        return 'Error001: no wanted board row';
    }

    return info;
};

export const getColumnIndexFromSheet = (sheet, columnName) => {
    let index;

    if (sheet != null) {
        let columnNames = [];
        for (let i = 0; i < 10; i++) {
            columnNames.push(sheet[i.toString()]);
        }
        columnNames.map((arr) => {
            let i = arr.findIndex((column) => column == columnName);
            if (i != -1) index = i;
        });
    } else {
        return 'Error002: Not passed Sheet!';
    }

    if (index == -1) {
        return `Error003: Not found the column: ${columnName}!`;
    }

    return index;
};

const getRowFromSheet = (sheet, columnName, code) => {
    let columnIndex = getColumnIndexFromSheet(sheet, columnName);
    if (typeof columnIndex == 'string' && columnIndex.includes('Error')) return columnIndex;

    for (let i = 0; i < sheet.length; i++) {
        const currentRow = sheet[i.toString()];
        const currCode = currentRow[columnIndex];

        if (currCode == code) {
            return currentRow;
        }
    }

    return `Error004: Could not found "${code}" in the column "${columnName}"!`;
};

export const getInfoFromSheet = (sheet, columnName, code, wantedColumns) => {
    return new Promise((resolve, reject) => {
        if (wantedColumns.length == 0) {
            resolve('Error005: No any wanted columns!');
            return;
        }

        let foundColumns = [];
        let error = null;
        let anyError = false;

        let wantedRow = getRowFromSheet(sheet, columnName, code);
        // console.log(wantedRow);
        if (typeof wantedRow == 'string' && wantedRow.includes('Error')) {
            reject(wantedRow);
            return;
        }

        wantedColumns.forEach((wantedColumn) => {
            let wantedColumnIndex = getColumnIndexFromSheet(sheet, wantedColumn);
            if (typeof wantedColumnIndex == 'string' && wantedColumnIndex.includes('Error')) {
                error = wantedColumnIndex;
                anyError = true;
            } else {
                let info = getInfoFromRow(wantedRow, wantedColumnIndex);
                if (typeof info == 'string' && info.includes('Error')) {
                    error = info;
                    anyError = true;
                } else {
                    foundColumns.push(info);
                }
            }
        });

        if (anyError) {
            reject(error);
        } else {
            resolve(foundColumns);
        }
    });
};

export const getInfoFromOptionSheets = async (sheet) => {
    return new Promise((resolve, reject) => {
        if (sheet == null || sheet === undefined) {
            reject('Error002: Not passed Sheet!');
        }

        let columnNames = sheet['0'];

        if (columnNames === undefined) {
            reject(`Error007: Not found column names in Option Sheet!`);
        }

        columnNames = columnNames.filter((column) => {
            if (!column.startsWith('X') && !column.includes('Rej')) {
                return column;
            }
        });

        getInfoFromSheet(sheet, 'KONTROL', 'SURE', columnNames)
            .then((infoArray) => {
                infoArray = infoArray.map((time, index) => {
                    return { optionName: columnNames[index], leftTime: time };
                });
                infoArray.shift();
                resolve(infoArray);
            })
            .catch((err) => reject(err));
    });
};

export const getSheetFromWorkbook = (wb, sheetName) => {
    const sheet = wb.Sheets[sheetName];
    if (sheet == undefined) {
        throw Error('Not found sheet');
    } else {
        const jsonData = xlsx.utils.sheet_to_json(sheet, {
            blankrows: '',
            header: 1
        });
        return jsonData;
    }
};

export const getSheetFromFile = async (file, sheetName) => {
    const fileData = await file.arrayBuffer();
    let wb = xlsx.read(fileData, { sheets: sheetName });
    const sheet = wb.Sheets[sheetName];

    if (sheet == undefined) {
        throw Error('Not found sheet');
    } else {
        const jsonData = xlsx.utils.sheet_to_json(sheet, {
            blankrows: '',
            header: 1
        });
        return jsonData;
    }
};

export const editTime = (time) => {
    time.replaceAll(' ', '');
    if (time.includes('-') && time.includes('/'));
    else if (time.includes('/')) {
        let time1 = time.substring(0, time.indexOf('/'));
        let time2 = time.substring(time.indexOf('/') + 1);
        time1 = parseInt(time1 / 60, 10).toString() + ':' + parseInt(time1 % 60, 10).toString();
        time2 = parseInt(time2 / 60, 10).toString() + ':' + parseInt(time2 % 60, 10).toString();

        time = time1 + '-' + time2;
    } else if (time.includes('-')) {
        let time1 = time.substring(0, time.indexOf('-'));
        let time2 = time.substring(time.indexOf('-') + 1);
        time1 = parseInt(time1 / 60, 10).toString() + ':' + parseInt(time1 % 60, 10).toString();
        time2 = parseInt(time2 / 60, 10).toString() + ':' + parseInt(time2 % 60, 10).toString();

        time = time1 + '-' + time2;
    } else {
        if (time < 60) time = ':' + time;
        else time = parseInt(time / 60, 10).toString() + ':' + parseInt(time % 60, 10).toString();
    }

    return time;
};

export const editTemp = (tempF, tempC) => {
    if (tempC == undefined && tempF == undefined) {
        return '-';
    } else if (tempC == undefined) {
        return tempF + '°F';
    } else if (tempF == undefined) {
        return +tempC + '°C';
    }
    return tempF + '°F' + '(' + tempC + '°C)';
};

export const editWater = (waterGal, waterL) => {
    waterL = String(parseFloat(waterL).toFixed(1)).replaceAll(',', '.');
    waterGal = String(parseFloat(waterGal).toFixed(1)).replaceAll(',', '.');
    return waterGal + ' Gal.' + '(' + waterL + ' Lit.)';
};

export const editProgramName = (program) => {
    if (program.includes('Pots') && program.includes('Pans')) {
        return 'Heavy+';
    }
    if (program.includes('Mixwash')) {
        return 'Aquaflex';
    }
    if (program.includes('Quick') && program.includes('Dry')) {
        return 'Quick & Shine';
    }
    return program;
};

export const editOptionObjectStructure = (programSequence, optionObject) => {
    // debugger;
    let optionInfoArray = [
        { optionName: 'Deep Wash', timeValues: [] },
        { optionName: 'Fast+', timeValues: [] },
        { optionName: 'Steam Gloss', timeValues: [] },
        { optionName: 'Sanitize', timeValues: [] },
        { optionName: 'Half Load', timeValues: [] },
        { optionName: 'MFT', timeValues: [] },
        { optionName: 'Kapı Açma', timeValues: [] }
    ];

    optionInfoArray.map((obj) => {
        for (let index = 0; index < programSequence.length; index++) {
            obj.timeValues.push(-1);
        }
    });

    for (let item in optionObject) {
        const optionArray = optionObject[item];
        const programName = item;

        optionArray.map((option, index) => {
            let optionIndex = findOption(option.optionName);
            const programIndex = findProgram(programSequence, programName);
            if (programIndex == -1) {
                console.log(`${programName} not found!`);
            }
            if (optionIndex != 2 && optionIndex != 4) optionIndex = 1;

            optionInfoArray[optionIndex].timeValues[programIndex] = option.leftTime;
        });
    }

    return optionInfoArray;
};

const findOption = (optionName) => {
    if (optionName.includes('TABLET') && !optionName.includes('+')) {
        return 2;
    } else if (optionName.includes('1/2') && !optionName.includes('+')) {
        return 4;
    }
};

const findProgram = (programSequence, programName) => {
    let programIndex = -1;
    programSequence = programSequence.map((prog) => {
        if (prog.toLowerCase().includes('auto')) {
            return 'auto';
        } else if (prog.toLowerCase().includes('mix')) {
            return 'mix';
        } else if (prog.toLowerCase().includes('pots')) {
            return 'pots';
        } else if (prog.toLowerCase().includes('regular')) {
            return 'regular';
        } else if (prog.toLowerCase().includes('glass')) {
            return 'glass';
        } else if (prog.toLowerCase().includes('dry')) {
            return 'dry';
        } else if (prog.toLowerCase().includes('quick') && prog.toLowerCase().includes('wash')) {
            return 'quick wash';
        } else if (prog.toLowerCase().includes('rinse')) {
            return 'rinse';
        }
    });
    programSequence.map((prog, index) => {
        if (programName.toLowerCase().includes(prog.toLowerCase())) programIndex = index;
    });

    return programIndex;
};

export const combineOptionObjects = (generalObject, localObject) => {
    if (generalObject.length == 0) return localObject;
    generalObject = generalObject?.map((obj, indexObject) => {
        const { optionName, timeValues } = obj;

        timeValues.map((time, indexTime) => {
            if (time === -1) {
                const { localOptionName, localTimeValues } = localObject[indexObject];
                if (localTimeValues[indexTime] !== -1)
                    timeValues[indexTime] = localTimeValues[indexTime];
            }
        });

        return { optionName, timeValues };
    });

    console.log(generalObject);
    return generalObject;
};
