import React, { useEffect, useState, useRef } from 'react';
import yaml from 'js-yaml';
import AceEditor from 'react-ace'
import 'ace-builds/src-noconflict/theme-github';
import Vitae from './Vitae';


function App() {


  const [entries, setEntries] = useState({});
  const [isDataReady, setDataReady] = useState(false);

  const editorRef = useRef(null);
  const [statusText, setStatusText] = useState('...');

  //
  // synchronize data across local storage, the editor view, and the PDF view
  //
  const syncData = (rawDataNew) => {
    // // signal to the PDF viewer that data is not ready 
    // setDataReady(false);

    // in case new data needs to be updated to local storage
    if (rawDataNew) {
      localStorage.setItem('entries', rawDataNew);
    }

    const localStorageData = localStorage.getItem('entries');
    if (localStorageData) {
      setEntries(yaml.load(localStorageData));
    }

    console.log(entries);

    // // signal to the PDF viewer that data is now ready 
    // setDataReady(true);
  }

  const handleSyncPDF = () => {
    // console.log("sync pdf")

    // signal to the PDF viewer that data is not ready 
    setDataReady(false);

    // signal to the PDF viewer that data is now ready 
    setTimeout(() => {
      setDataReady(true);
    }, 1000);

  }

  const handleSave = () => {
    const rawDataNew = editorRef.current.editor.getValue();

    syncData(rawDataNew);
    handleSyncPDF();

    setStatusText("Data saved.");
    setTimeout(() => {
      // TODO: find a better placeholder
      setStatusText("...");
    }, 1000);
  };

  const Form = () => {
    const categories = {
      'Basic Information': [],
      'Current Position': [],
      'Education': [],
      'Awards': [],
      'Professional Experiences': [],
      'Publications': ['Conferences & Journals', 'Dissertations & These', 'Book Chapters', 'Magazine Articles']
    }

    const [category, setCategory] = useState('');
    const [subCategory, setSubCategory] = useState('');
    const [subCategoryOptions, setSubCategoryOptions] = useState([]);

    const [startYear, setStartYear] = useState('');
    const [endYear, setEndYear] = useState('');
    const [label, setLabel] = useState('');
    const [description, setDescription] = useState('');
    const [link, setLink] = useState('');

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
      const entry = { startYear, endYear, label, description, link };

      syncData();

      if (!entries[category]) {
        entries[category] = {}
      }

      if (!entries[category][subCategory]) {
        entries[category][subCategory] = []
      }
      entries[category][subCategory].push(entry)

      const rawDataNew = yaml.dump(entries);
      syncData(rawDataNew);
      handleSyncPDF();

      // update the editor
      editorRef.current.editor.setValue(rawDataNew)

    };

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

      </div>
    );
  }

  //
  //
  //
  useEffect(() => {
    syncData()
    handleSyncPDF()

    // initialize the editor
    const editor = editorRef.current.editor;

    // register the 'Cmd-S' command
    editor.commands.addCommand({
      name: 'save',
      bindKey: { win: 'Ctrl-S', mac: 'Cmd-S' },
      exec: handleSave,
    });

  }, []);

  return (
    <div>
      <table>
        <tr>
          <td colSpan="2">
            <h1>OpenVitae</h1>
          </td>
        </tr>
        <tr>
          <td>
            {/* form and editor column */}
            <Form />

            <div>{statusText}</div>
            <AceEditor
              ref={editorRef}
              theme="github"
              mode="yaml"
              value={yaml.dump(entries)}
            />
          </td>
          {/* PDF column */}
          <td >
            <button onClick={handleSyncPDF}>Sync PDF</button>

            <br />

            {isDataReady ? <Vitae entries={entries} /> : <p>Loading ...</p>}

          </td>
        </tr>
      </table>
    </div>
  );
}

export default App;
