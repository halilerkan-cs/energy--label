import React, { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Table } from 'react-bootstrap';

const PdfCreator = ({ getInfoArray, getCardObject, getOptionInfoArray }) => {
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

    const cardObject = getCardObject();
    const cycleInfoArray = getInfoArray();
    const optionInfoArray = getOptionInfoArray();
    console.log(optionInfoArray);

    // console.log(data);
    const specs = ['Dirtiness', 'Wash Temps', 'Rinse Temps', 'Time(Approx.)', 'Water'];

    return (
        <div
            style={{
                display: 'flex',
                gap: '1em',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
            <div
                style={{
                    backgroundColor: 'rgba(216, 216, 216, 0.2)',
                    color: 'white',
                    width: 'fit-content',
                    padding: '0.3em',
                    fontWeight: '500',
                    fontSize: '1.5em'
                }}>
                Bastırılan Kartın Kodu:{' '}
                {cardObject != null && cardObject['Range - Türev Kartlar Kodu']}
            </div>
            <div ref={componentRef} style={{ backgroundColor: 'white', margin: '0' }}>
                <Table bordered>
                    <thead style={{ backgroundColor: 'grey' }}>
                        <tr>
                            <th key={0} style={{ width: '50px' }}>
                                Cycles
                            </th>
                            {cycleInfoArray.map((item, i) => {
                                return <th key={i}>{item['Program Name']}</th>;
                            })}
                        </tr>
                    </thead>
                    <tbody>
                        {specs.map((spec, i) => {
                            return (
                                <tr key={i}>
                                    <td>{spec}</td>
                                    {cycleInfoArray.map((object, j) => {
                                        return <td>{object[spec]}</td>;
                                    })}
                                </tr>
                            );
                        })}
                    </tbody>
                </Table>
                {optionInfoArray && (
                    <Table bordered>
                        <thead style={{ backgroundColor: 'grey' }}>
                            <tr>
                                <th style={{ width: '50px' }}>Options(Time with Added Options)</th>
                                <th></th>
                                {optionInfoArray?.map(() => {
                                    return <th></th>;
                                })}
                            </tr>
                        </thead>
                        <tbody>
                            {optionInfoArray.map((obj, i) => {
                                let timeArray = obj.timeValues;
                                if (timeArray !== undefined)
                                    return (
                                        <tr key={i}>
                                            <td>{obj.optionName}</td>
                                            {timeArray.map((time) => {
                                                return <td>{time}</td>;
                                            })}
                                        </tr>
                                    );
                            })}
                        </tbody>
                    </Table>
                )}
            </div>
            <Button
                variant="btn btn-light "
                style={{ width: 'fit-content', fontWeight: '900', fontSize: '1.5em' }}
                onClick={handlePrint}>
                PRINT
            </Button>
        </div>
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
