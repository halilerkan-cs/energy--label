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

    console.log(code + ', ' + columnIndex + ', ' + columnName);

    return 'Error004: Not found wanted board! Wanted board is null or is not in the sheet.';
};

export const getInfoFromSheet = (sheet, columnName, code, wantedColumns) => {
    // console.log(sheet);
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

export const editTime = (time) => {
    time.replaceAll(' ', '');
    if (time.includes('-') && time.includes('/')) {
    } else if (time.includes('/')) {
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
