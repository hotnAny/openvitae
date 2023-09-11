import React, { useEffect, useState } from 'react';
import { PDFViewer } from '@react-pdf/renderer';
import { Document, Page, Text, View, StyleSheet, Link, Font } from '@react-pdf/renderer';

import { faArrowUpRightFromSquare, faTrophy, faCertificate } from '@fortawesome/free-solid-svg-icons'
import FontAwesomeIcon from './FontAwesomeIcon'

import EBGaramondRegular from './EBGaramond-Regular.ttf'
import EBGaramondItalic from './EBGaramond-Italic.ttf'
import EBGaramondBold from './EBGaramond-Bold.ttf'

Font.register({
    family: 'EBGaramond',
    fonts: [
        { src: EBGaramondRegular, fontWeight: "normal" },
        { src: EBGaramondBold, fontWeight: "bold" },
    ],
});

Font.register({
    family: 'EBGaramondItalic',
    fonts: [
        { src: EBGaramondItalic },
    ]
});

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100vh'
    },
    page: {
        flexDirection: 'column',
        backgroundColor: '#FFFFFF',
        fontFamily: 'EBGaramond',
        fontSize: "11",
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 40,
        paddingBottom: 50,
    },
    section: {
        margin: 10,
        padding: 10
    },
    heading: {
        fontWeight: "bold",
        marginBottom: 5
    },
    subHeading: {
        fontFamily: 'EBGaramondItalic',
        marginTop: 10,
        marginBottom: 5
    },
    rowItem: {
        flexDirection: "row",
        alignItems: 'stretch',
        width: '100%',
        marginBottom: 10
    },
    textDates: {
        width: '10%',
        marginRight: 10
    },
    textLabel: {
        width: '10%',
        marginRight: 10,
    },
    textDescription: {
        maxWidth: '70%',
        marginRight: 5,
    },
    textDescriptionWide: {
        maxWidth: '80%',
        marginRight: 5,
    },
    textLink: {
        width: '5%',
        marginLeft: 10,
    },
    textNone: {
        width: '0%'
    },
    textAward: {
        color: '#DC143C',
        fontWeight: 'bold',
    },
    pageNumbers: {
        position: 'absolute',
        bottom: 40,
        left: 0,
        right: 0,
        textAlign: 'center'
    },
});

function Vitae(data) {
    const entryBlank = { startYear: '', endYear: '', label: '', description: '', link: '' };
    const [basicInfo, setBasicInfo] = useState(entryBlank);
    const [currentPositions, setCurrentPositions] = useState();
    const [educations, setEducations] = useState();
    const [awards, setAwards] = useState();
    const [professionals, setProfessionals] = useState();
    const [publications, setPublications] = useState();
    const [patents, setPatents] = useState();
    const [funding, setFunding] = useState();
    const [press, setPress] = useState();
    const [talks, setTalks] = useState();
    const [teachingMentoring, setTeachingMentoring] = useState();
    const [service, setService] = useState();

    const initEntry = (entries, name, setMethod) => {
        const fixEndYear = (endYear) => {
            return endYear === '' ? new Date().getFullYear() : parseInt(endYear)
        }
        if (entries[name]) {
            const objs = data.entries[name]
            Object.keys(objs).map((key, index) => (
                objs[key].sort((a, b) => parseInt(b.startYear) != parseInt(a.startYear) ? (parseInt(b.startYear) - parseInt(a.startYear)) : (fixEndYear(b.endYear) - fixEndYear(a.endYear)))
            ))
            setMethod(objs)
        }
    }

    useEffect(() => {
        if (data.entries) {
            if (data.entries['Basic Information']) {
                const objs = data.entries['Basic Information']['']
                if (objs && objs.length > 0) {
                    setBasicInfo(objs[0])
                }
            }

            initEntry(data.entries, 'Current Position', setCurrentPositions)
            initEntry(data.entries, 'Education', setEducations)
            initEntry(data.entries, 'Awards', setAwards)
            initEntry(data.entries, 'Professional Experiences', setProfessionals)
            initEntry(data.entries, 'Publications', setPublications)
            initEntry(data.entries, 'Patents', setPatents)
            initEntry(data.entries, 'Funding', setFunding)
            initEntry(data.entries, 'Press', setPress)
            initEntry(data.entries, 'Talks', setTalks)
            initEntry(data.entries, 'Teaching & Mentoring', setTeachingMentoring)
            initEntry(data.entries, 'Service', setService)
        }

    }, []);

    const VitaeSection = (objs) => {
        const secEntries = objs.entries
        const secName = objs.name
        return secEntries === undefined ? <View></View> :
            <View style={styles.section}>
                {secName === '' ? "" : <Text style={styles.heading}>{secName}</Text>}
                {Object.keys(secEntries).map((subsecName, idx) => (
                    <View>
                        <Text style={styles.subHeading}>{subsecName}</Text>
                        {secEntries[subsecName].map((entry, idx) => (
                            <View style={styles.rowItem}>
                                <Text style={styles.textDates}>
                                    {entry.startYear + (entry.endYear === '' ? "" : ('-' + entry.endYear))}
                                </Text>
                                <Text style={entry.label === '' ? styles.textNon : styles.textLabel}>{entry.label}</Text>
                                <View style={{ flexDirection: "column" }}>
                                    <Text style={entry.label === '' ? styles.textDescriptionWide : styles.textDescription}>
                                        {entry.description}
                                    </Text>
                                    {entry.award != undefined && entry.award.includes("Best") ? <View style={{ flexDirection: "row" }}>
                                        <FontAwesomeIcon faIcon={entry.award.includes("Honorable") ? faCertificate : faTrophy} style={{ color: '#DC143C', width: '10px' }} />
                                        <Text>{" "}</Text>
                                        <Text style={styles.textAward}>{entry.award}</Text>
                                    </View> : ""}
                                </View>
                                <View style={styles.textLink}>
                                    {entry.link === '' ? <Text>{""}</Text> : <Link src={entry.link}><FontAwesomeIcon faIcon={faArrowUpRightFromSquare} style={{ color: '#2D68C4', width: '8px', marginTop: 3 }} /></Link>}
                                </View>
                            </View>
                        ))}
                    </View>
                ))}
            </View>
    }

    const VitaePage = () => (
        <Document>
            <Page wrap size="A4" style={styles.page}>
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

                <VitaeSection entries={publications} name="Publications" />

                <VitaeSection entries={patents} name="Patents" />

                <VitaeSection entries={funding} name="Funding" />

                <VitaeSection entries={press} name="Press" />

                <VitaeSection entries={talks} name="Talks" />

                <VitaeSection entries={teachingMentoring} name="Teaching & Mentoring" />

                <VitaeSection entries={service} name="Service" />

                <Text style={styles.pageNumbers} render={({ pageNumber, totalPages }) => (
                    `${pageNumber} / ${totalPages}`
                )} fixed />

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