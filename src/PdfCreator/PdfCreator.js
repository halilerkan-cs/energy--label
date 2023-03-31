import React, { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Table } from 'react-bootstrap';
import { border, rgbToHex } from '@mui/system';

const PdfCreator = ({ getInfoArray }) => {
    const componentRef = useRef();
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: 'emp-data'
    });

    //sample array element;
    //
    // ['Program Name']: programName,
    // ['Dirtiness']: 'High-Medium',
    // ['Wash Temps']: washTemp,
    // ['Rinse Temps']: rinseTemp,
    // ['Time(Approx.)']: time,
    // ['Water']: water
    const data = getInfoArray();
    const specs = ['Dirtiness', 'Wash Temps', 'Rinse Temps', 'Time(Approx.)', 'Water'];

    return (
        <>
            <div ref={componentRef} style={{ backgroundColor: 'white', margin: '0' }}>
                <Table bordered style={{ margin: 'auto' }}>
                    <thead style={{ backgroundColor: 'grey' }}>
                        <tr>
                            <th>Cycles</th>
                            {data?.map((item, i) => {
                                return <th key={i}>{item['Program Name']}</th>;
                            })}
                        </tr>
                    </thead>
                    <tbody>
                        {specs.map((spec, i) => {
                            return (
                                <tr key={i}>
                                    <td>{spec}</td>
                                    {data?.map((object, j) => {
                                        return <td>{object[spec]}</td>;
                                    })}
                                </tr>
                            );
                        })}
                    </tbody>
                </Table>
            </div>
            <Button variant="btn btn-light " style={{ margin: '1em 0 0 0' }} onClick={handlePrint}>
                PRINT
            </Button>
        </>
    );
};

export default PdfCreator;

// import React, { Component, Fragment } from 'react';
// import {
//     PDFViewer,
//     PDFDownloadLink,
//     Document,
//     Page,
//     Text,
//     View,
//     StyleSheet
// } from '@react-pdf/renderer';
// import Table from './Table';

// const PdfCreator = ({ infoArray, getCardObject }) => {
//     const styles = StyleSheet.create({
//         page: {
//             flexDirection: 'row'
//         },
//         section: {
//             flexGrow: 1
//         }
//     });

//     const data = {
//         id: '5df3180a09ea16dc4b95f910',
//         items: [
//             {
//                 sr: 1,
//                 desc: 'desc1',
//                 xyz: 5
//             },
//             {
//                 sr: 2,
//                 desc: 'desc2',
//                 xyz: 6
//             }
//         ]
//     };

//     const LoadingButton = (
//         <button className="btn btn-danger btn-md" style={{ marginTop: '1em' }}>
//             Yükleniyor
//         </button>
//     );

//     const DownloadButton = (
//         <button className="btn btn-warning btn-md" style={{ marginTop: '1em' }}>
//             İndir
//         </button>
//     );

//     return (
//         <div style={{ display: 'inline-block' }}>
//             <div>
//                 {/* <PDFDownloadLink document={MyDocument} fileName="somename.pdf">
//                     {({ blob, url, loading, error }) => (loading ? LoadingButton : DownloadButton)}
//                 </PDFDownloadLink> */}
//                 <Fragment>
//                     <PDFDownloadLink document={MyDocument} fileName="somename.pdf">
//                         {({ blob, url, loading, error }) =>
//                             loading ? LoadingButton : DownloadButton
//                         }
//                         <Table data={data} />
//                     </PDFDownloadLink>
//                 </Fragment>
//             </div>
//         </div>
//     );
// };

// export default PdfCreator;
