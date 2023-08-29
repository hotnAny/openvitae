import React, { useEffect, useState } from 'react';
import { PDFViewer } from '@react-pdf/renderer';
import { Document, Page, Text, View, StyleSheet, Link, Font, Svg } from '@react-pdf/renderer';
import LinkSvg from "./link.svg";

Font.register({
    family: 'FontAwesome',
    fonts: [{ src: './Font Awesome 6 Free-Regular-400.otf' }],
});

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
    subHeading: {
        fontFamily: 'Helvetica-Oblique',
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
        width: '15%',
        marginRight: 5
    },
    textDescription: {
        width: '70%',
    },
    textNone : {
        width: '0%'
    }
});

const IconLink = () => {
    return (
        <View>
            <Svg viewBox="0 0 64 64" width={24} height={24}>
                <LinkSvg /> {/* Render your imported SVG component */}
            </Svg>
        </View>
    )
}

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

    const initEntry = (entries, name, setMethod) => {
        if (entries[name]) {
            const objs = data.entries[name]
            Object.keys(objs).map((key, index) => (
                objs[key].sort((a, b) => (parseInt(b.startYear) - parseInt(a.startYear)) + parseInt(b.endYear) - parseInt(a.endYear))
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
        }

    }, []);

    const VitaeSection = (objs) => {
        const secEntries = objs.entries
        const secName = objs.name
        return secEntries == undefined ? <View></View> :
            <View style={styles.section}>
                {secName === '' ? "" : <Text style={styles.heading}>{secName}</Text>}
                {Object.keys(secEntries).map((subsecName, idx) => (
                    <View>
                        <Text style={styles.subHeading}>{subsecName}</Text>
                        {secEntries[subsecName].map((entry, idx) => (
                            <View style={styles.rowItem}>
                                <Text style={styles.textDates}>
                                    {entry.startYear + (entry.endYear === '' ? '' : ('-' + entry.endYear))}
                                </Text>
                                <Text style={entry.label === '' ? styles.textNon : styles.textLabel}>{entry.label}</Text>
                                <Text style={styles.textDescription}>
                                    {entry.description}
                                    {" "}
                                    {entry.link === '' ? "" : <Link src={entry.link}>[link]</Link>}
                                </Text>
                            </View>
                        ))}
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

                <VitaeSection entries={publications} name="Publications" />

                <VitaeSection entries={patents} name="Patents" />

                <VitaeSection entries={funding} name="Funding" />

                <VitaeSection entries={press} name="Press"/>

                <VitaeSection entries={talks} name="Talks"/>

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