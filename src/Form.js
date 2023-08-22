import React, { useEffect, useState, useRef } from 'react';
import Vitae from './Vitae.js';
import yaml from 'js-yaml';

import AceEditor from 'react-ace'
import 'ace-builds/src-noconflict/theme-github';


const categories = {
    'Basic Information': [],
    'Current Position': [],
    'Education': [],
    'Awards': [],
    'Professional Experiences': [],
    'Publications': ['Conferences & Journals', 'Dissertations & These', 'Book Chapters', 'Magazine Articles']
}

function Form() {
    const [category, setCategory] = useState('');
    const [subCategory, setSubCategory] = useState('');
    const [subCategoryOptions, setSubCategoryOptions] = useState([]);

    const [startYear, setStartYear] = useState('');
    const [endYear, setEndYear] = useState('');
    const [label, setLabel] = useState('');
    const [description, setDescription] = useState('');
    const [link, setLink] = useState('');

    // const [tableData, setTableData] = useState([]);

    const [rawData, setRawData] = useState('');

    const editorRef = useRef(null);
    const [statusText, setStatusText] = useState('...');


    const handleStartYearChange = (e) => {
        setStartYear(e.target.value);
    };

    const handleEndYearChange = (e) => {
        setEndYear(e.target.value);
    };

    const handleCategoryChange = (e) => {
        const selectedValue = e.target.value;
        setCategory(selectedValue);
        setSubCategory('');
        setSubCategoryOptions(categories[selectedValue]);
    };

    const handleSubCategoryChange = (e) => {
        setSubCategory(e.target.value);
    };

    const handleLabelChange = (e) => {
        setLabel(e.target.value);
    };

    const handleDescriptionChange = (e) => {
        setDescription(e.target.value);
    };

    const handleLinkChange = (e) => {
        setLink(e.target.value);
    };

    const handleSubmit = (e) => {
        // localStorage.clear();

        e.preventDefault();
        // Convert form data to YAML
        const entry = { startYear, endYear, label, description, link };
        
        let entries = {};
        const localStorageData = localStorage.getItem('entries');
        if (localStorageData) {
            entries = yaml.load(localStorageData);
        }
        console.log(entries)
        // entries.push(entry);
        if (!entries[category]) {
            entries[category] = {}
        }

        if (!entries[category][subCategory]) {
            entries[category][subCategory] = []
        }
        entries[category][subCategory].push(entry)
        console.log(entries)
        const yamlData = yaml.dump(entries);
        // Store YAML data in localStorage
        localStorage.setItem('entries', yamlData);
        // console.log('YAML data stored in localStorage:', yamlData);

        // update the editor
        editorRef.current.editor.setValue(yamlData)

        // update the PDF view
        // TODO
    };

    const handleSave = () => {
        // Implement your save logic here
        const yamlData = editorRef.current.editor.getValue();
        
        setRawData(yamlData);

        localStorage.setItem('entries', yamlData);
        setStatusText("Data saved.");
        setTimeout(() => {
            setStatusText("...");
        }, 1000);

        // update the PDF view
        // TODO
    };

    useEffect(() => {
        // localStorage.clear();

        let entries = [];
        const localStorageData = localStorage.getItem('entries');
        if (localStorageData) {
            entries = yaml.load(localStorageData);
        }
        console.log(yaml.dump(entries))
        setRawData(yaml.dump(entries));

        const editor = editorRef.current.editor;

        // Register the 'Cmd-S' command
        editor.commands.addCommand({
            name: 'save',
            bindKey: { win: 'Ctrl-S', mac: 'Cmd-S' },
            exec: handleSave,
        });
    }, []);

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <select value={category} onChange={handleCategoryChange}>
                    <option value="">-- Category --</option>
                    <option value="Basic Information">Basic Information</option>
                    <option value="Current Position">Current Position</option>
                    <option value="Education">Education</option>
                    <option value="Professional Experiences">Professional Experiences</option>
                    <option value="Awards">Awards</option>
                    <option value="Publications">Publications</option>
                </select>

                <select value={subCategory} onChange={handleSubCategoryChange}>
                    <option value="">-- Select --</option>
                    {subCategoryOptions.map((option, index) => (
                        <option key={index} value={option}>
                            {option}
                        </option>
                    ))}
                </select>

                <input type="number" value={startYear} onChange={handleStartYearChange} placeholder='Start Year' />
                <input type="number" value={endYear} onChange={handleEndYearChange} placeholder='End Year' />

                <br />

                <input type="text" value={label} onChange={handleLabelChange} placeholder='Label' />
                <input type="text" value={description} onChange={handleDescriptionChange} placeholder='Description' />

                <br />

                <input type="text" value={link} onChange={handleLinkChange} placeholder='Link' />

                <button type="submit">Submit</button>
            </form>

            <div>{statusText}</div>
            <AceEditor
                ref={editorRef}
                theme="github"
                mode="yaml"
                value={rawData}
            />

        </div>
    );
}

export default Form;
