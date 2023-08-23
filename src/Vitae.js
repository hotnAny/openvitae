import React, { useEffect, useState } from 'react';
import { PDFViewer } from '@react-pdf/renderer';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

function Vitae(data) {
    const entryBlank = { startYear: '', endYear: '', label: '', description: '', link: '' };
    const [basicInfo, setBasicInfo] = useState(entryBlank);
    const [currentPositions, setCurrentPositions] = useState([]);

    useEffect(() => {
        const entries = data.entries;

        if (entries) {
            if (entries['Basic Information']) {
                const objsBasicInfo = entries['Basic Information']['']
                if (objsBasicInfo && objsBasicInfo.length > 0) {
                    setBasicInfo(objsBasicInfo[0])
                }
            }
            if (entries['Current Position']) {
                const objsCurrentPosition = entries['Current Position']['']
                if (objsCurrentPosition && objsCurrentPosition.length > 0) {
                    setCurrentPositions(objsCurrentPosition)
                }
            }
        }

    }, []);

    const styles = StyleSheet.create({
        container: {
            width: '100%',
            height: '100vh'
        },
        page: {
            flexDirection: 'column',
            backgroundColor: '#FFFFFF',
            fontSize: "12",
        },
        section: {
            margin: 10,
            padding: 10
        },
        heading: {
            fontFamily: 'Helvetica-Bold',
            marginBottom: 5
        },
        rowItem:{
            flexDirection: "row",
            alignItems: 'stretch',
            width: '100%'
        },
        textDates: {
            width: '10%',
            marginRight: 20
        },
        textLabel: {
            width: '20%',
            marginRight: 20
        },
        textDescription: {
            width: '70%'
        }
    });

    const VitaePage = () => (
        <Document>
            <Page size="A4" style={styles.page}>
                {/* basic info */}
                {basicInfo === undefined ? <View></View> :
                    <View style={styles.section}>
                        <Text style={styles.heading}>{basicInfo.label}</Text>
                        <Text>{basicInfo.description}</Text>
                        <Text>{basicInfo.link}</Text>
                    </View>}

                {/* current position */}
                {currentPositions.length === 0 ? <View></View> :
                    <View style={styles.section}>
                        <Text style={styles.heading}>Current Position</Text>
                        {currentPositions.map((pos, idx) => (
                            <View style={styles.rowItem}>
                                <Text style={styles.textDates}>{pos.startYear}--{pos.endYear}</Text>
                                <Text style={styles.textLabel}>{pos.label}</Text>
                                <Text style={styles.textDescription}>{pos.description}</Text>
                            </View>
                        ))}  
                    </View>}
            </Page>
        </Document>
    );

    return (
        <PDFViewer style={styles.container}>
            <VitaePage />
        </PDFViewer>
    );
}

export default Vitae;