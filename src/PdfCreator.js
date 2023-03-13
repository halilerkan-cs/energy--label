import React from 'react';
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const PdfCreator = ({ cardInfo, fetchUpdatedData }) => {
    const styles = StyleSheet.create({
        page: {
            flexDirection: 'row'
        },
        section: {
            flexGrow: 1
        }
    });

    const MyDocument = (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={styles.section}>
                    <Text>
                        {cardInfo == null
                            ? ''
                            : `${cardInfo.rangeCode}: ${cardInfo.Genişlik}, ${cardInfo.PAZAR}, ${cardInfo.P1}`}
                    </Text>
                </View>
                <View style={styles.section}>
                    <Text>We're inside a PDF!</Text>
                </View>
            </Page>
        </Document>
    );

    const LoadingButton = (
        <button className="btn btn-danger btn-md" style={{ marginTop: '1em' }}>
            Yükleniyor
        </button>
    );

    const DownloadButton = (
        <button className="btn btn-warning btn-md" style={{ marginTop: '1em' }}>
            İndir
        </button>
    );

    return (
        <div style={{ display: 'inline-block' }}>
            <div>
                <PDFDownloadLink document={MyDocument} fileName="somename.pdf">
                    {({ blob, url, loading, error }) => (loading ? LoadingButton : DownloadButton)}
                </PDFDownloadLink>
            </div>
        </div>
    );
};

export default PdfCreator;
