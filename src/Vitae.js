import React, { useEffect, useState } from 'react';
import { PDFViewer } from '@react-pdf/renderer';
import { Document, Page, Text, View, StyleSheet, Link } from '@react-pdf/renderer';

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100vh'
    },
    page: {
        flexDirection: 'column',
        backgroundColor: '#FFFFFF',
        fontSize: "12",
        // margin: 20,
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 40,
        paddingBottom: 40,
    },
    section: {
        margin: 10,
        padding: 10
    },
    heading: {
        fontFamily: 'Helvetica-Bold',
        marginBottom: 5
    },
    rowItem: {
        flexDirection: "row",
        alignItems: 'stretch',
        width: '100%',
        marginBottom: 10
    },
    textDates: {
        width: '15%',
        marginRight: 0
    },
    textLabel: {
        width: '10%',
        marginRight: 20
    },
    textDescription: {
        width: '65%',
    }
});

function Vitae(data) {
    const entryBlank = { startYear: '', endYear: '', label: '', description: '', link: '' };
    const [basicInfo, setBasicInfo] = useState(entryBlank);
    const [currentPositions, setCurrentPositions] = useState([]);
    const [educations, setEducations] = useState([]);
    const [awards, setAwards] = useState([]);
    const [professionals, setProfessionals] = useState([]);
    const [confjrnlPubs, setConfJrnlPubs] = useState([]);
    const [patents, setPatents] = useState([]);
    const [funding, setFunding] = useState([]);

    useEffect(() => {
        const entries = data.entries;

        if (entries) {
            if (entries['Basic Information']) {
                const objs = entries['Basic Information']['']
                if (objs && objs.length > 0) {
                    setBasicInfo(objs[0])
                }
            }
            if (entries['Current Position']) {
                const objs = entries['Current Position']['']
                if (objs && objs.length > 0) {
                    setCurrentPositions(objs)
                }
            }
            if (entries['Education']) {
                const objs = entries['Education']['']
                if (objs && objs.length > 0) {
                    setEducations(objs)
                }
            }
            if (entries['Awards']) {
                const objs = entries['Awards']['']
                if (objs && objs.length > 0) {
                    setAwards(objs)
                }
            }
            if (entries['Professional Experiences']) {
                const objs = entries['Professional Experiences']['']
                if (objs && objs.length > 0) {
                    setProfessionals(objs)
                }
            }
            if (entries['Publications']) {
                const objs = entries['Publications']['Conferences & Journals']
                if (objs && objs.length > 0) {
                    setConfJrnlPubs(objs)
                }
            }
            if (entries['Patents']) {
                const objs = entries['Patents']['']
                if (objs && objs.length > 0) {
                    setPatents(objs)
                }
            }
            if (entries['Funding']) {
                const objs = entries['Funding']['']
                if (objs && objs.length > 0) {
                    setFunding(objs)
                }
            }
        }

    }, []);

    const VitaeSection = (objs) => {
        const sectionEntries = objs.entries
        sectionEntries.sort((a, b) => parseInt(a.startYear) - parseInt(b.startYear))
        const sectionName = objs.name
        return sectionEntries.length === 0 ? <View></View> :
            <View style={styles.section}>
                <Text style={styles.heading}>{sectionName}</Text>
                {sectionEntries.reverse().map((entry, idx) => (
                    <View style={styles.rowItem}>
                        <Text style={styles.textDates}>
                            {entry.startYear + (entry.endYear === '' ? '' : ('-' + entry.endYear))} 
                        </Text>
                        <Text style={styles.textLabel}>{entry.label}</Text>
                        <Text style={styles.textDescription}>
                            {entry.description}
                            {" "}
                            {entry.link === '' ? "" : <Link src={entry.link}>{entry.link}</Link>}
                        </Text>
                    </View>
                ))}
            </View>
    }

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

                <VitaeSection entries={currentPositions} name="Current Position" />

                <VitaeSection entries={educations} name="Education" />

                <VitaeSection entries={awards} name="Awards" />

                <VitaeSection entries={professionals} name="Professional Experiences" />

                <VitaeSection entries={confjrnlPubs} name="Publications / Conferences & Journals" />

                <VitaeSection entries={patents} name="Patents" />

                <VitaeSection entries={funding} name="Funding" />

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