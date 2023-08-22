import React, { useEffect, useState } from 'react';
import { PDFViewer } from '@react-pdf/renderer';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

function Vitae(data) {
    const entryBlank = { startYear: '', endYear: '', label: '', description: '', link: '' };
    const [currentPosition, setCurrentPosition] = useState(entryBlank)

    useEffect(() => {
        const entries = data.entries;

        if (entries) {
            if (entries['Current Position']) {
                const objsCurrentPosition = entries['Current Position']['']
                if (objsCurrentPosition && objsCurrentPosition.length > 0) {
                    setCurrentPosition(objsCurrentPosition[0])
                }
            }
        }

    }, []);

    const styles = StyleSheet.create({
        page: {
            flexDirection: 'row',
            backgroundColor: '#FFFFFF'
        },
        section: {
            margin: 10,
            padding: 10,
            flexGrow: 1
        }
    });

    const VitaePage = () => (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={styles.section}>
                    <Text>Current Position</Text>
                    <Text>{currentPosition.startYear}</Text>
                </View>
                <View style={styles.section}>
                    <Text>Section #2</Text>
                </View>
            </Page>
        </Document>
    );

    return (
        <PDFViewer>
            <VitaePage />
        </PDFViewer>
    );
}

export default Vitae;