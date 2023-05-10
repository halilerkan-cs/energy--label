import React from 'react';
import { ExcelImportTool } from './ExcelImportTool';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';

export default function App() {
    // const [file, setFile] = useState('');
    // const [show, setShow] = useState(false);
    // const [columns, setColumns] = useState([]);

    // const readFile = async (event) => {
    // const file = event.target.files[0];
    // const data = await file.arrayBuffer();
    // const workbook = xlsx.read(data, { sheetRows: 4 });
    //
    // const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    // const jsonData = xlsx.utils.sheet_to_json(worksheet, {
    // header: 1,
    // defval: ''
    // });
    //
    // setColumns(jsonData);
    // setShow(true);
    // console.log(jsonData);
    // console.log(workbook);
    // };

    return <ExcelImportTool />;
}
