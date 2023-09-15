import React, { useEffect, useState, useRef } from 'react';
import yaml from 'js-yaml';
import AceEditor from 'react-ace'
import 'ace-builds/src-noconflict/theme-github';
import 'ace-builds/src-noconflict/ext-searchbox'; // Import the searchbox extension
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
    // in case new data needs to be updated to local storage
    if (rawDataNew) {
      localStorage.setItem('entries', rawDataNew);
    }

    const localStorageData = localStorage.getItem('entries');
    if (localStorageData) {
      try {
        setEntries(yaml.load(localStorageData));
      } catch (error) {
        alert(error);
      }

    }

    console.log(entries);
  }

  const handleSyncPDF = () => {
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

  const handleFind = () => {
    editorRef.current.editor.execCommand('find');
  };

  //
  // the form to add new vitae items
  //
  const Form = () => {
    const categories = {
      'Basic Information': [],
      'Current Position': [],
      'Education': [],
      'Awards': ['Awards Won by Me', 'Awards Won by Students'],
      'Professional Experiences': [],
      'Publications': ['Conferences & Journals', 'Dissertations & These', 'Book Chapters', 'Magazine Articles', 'Workshop, Demo, Work-in-Progress, Poster, and Consortium Papers'],
      'Patents': [],
      'Funding': [],
      'Press': ['Research Conducted or Led by Me', 'Research Collaborated with Others'],
      'Talks': [],
      'Teaching & Mentoring': ['Course Instructor and Teaching Assistant', 'Ph.D. Students Mentored', 'Master Students Mentored', 'Undergraduate Students Mentored', 'Intern & Visiting Students Mentored'],
      'Service': ['Ph.D. Thesis Committee', 'Master Thesis Committee', 'Pre-college Education & Outreach', 'Review Panel', 'Editorial Board', 'Program Committee', 'Organizing Committee', 'External Reviewer', 'Special Recognition as a Reviewer']
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

      const rawDataNew = yaml.dump(entries, { noRefs: true, quoteKeys: true });
      syncData(rawDataNew);
      handleSyncPDF();

      // update the editor
      editorRef.current.editor.setValue(rawDataNew)

    };

    const handleDownload = (e) => {
      const yamlString = yaml.dump(entries);
      const blob = new Blob([yamlString], { type: 'application/x-yaml' });
      const blobURL = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobURL;
      a.download = 'vitae.yml'; // Set the desired filename
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }

    return (
      <div>
        <form onSubmit={handleSubmit}>
          <select value={category} onChange={handleCategoryChange}>
            <option value="">-- Category --</option>
            {Object.keys(categories).map((option, index) => (
              <option key={index} value={option}>{option}</option>
            ))}
          </select>

          <select value={subCategory} onChange={handleSubCategoryChange}>
            <option value="">-- Select --</option>
            {subCategoryOptions.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>

          <br />

          <input type="number" value={startYear} onChange={handleStartYearChange} placeholder='Start Year' />
          <input type="number" value={endYear} onChange={handleEndYearChange} placeholder='End Year' />
          <input type="text" value={label} onChange={handleLabelChange} placeholder='Label' />

          <br />

          <textarea
            rows={5}
            cols={60}
            placeholder="Description" onChange={handleDescriptionChange}
          />

          <br />

          <input type="text" value={link} onChange={handleLinkChange} placeholder='Link' />

          <button type="submit">Submit</button>
        </form>

        <button onClick={handleDownload}>Download Vitae Data</button>

      </div>
    );
  }

  //
  //
  //
  useEffect(() => {
    // localStorage.clear();

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

    editor.commands.addCommand({
      name: 'search',
      bindKey: { win: 'Ctrl-F', mac: 'Cmd-F' },
      exec: handleFind,
    });

  }, []);

  return (
    <div>
      <table width="100%" border="0">
        <tr>
          <td colSpan="2">
            <h1>OpenVitae</h1>
          </td>
        </tr>
        <tr>
          <td width="50%">
            {/* form and editor column */}
            <Form />

            <div>{statusText}</div>
            <AceEditor
              ref={editorRef}
              theme="github"
              mode="yaml"
              value={yaml.dump(entries, { noRefs: true, quoteKeys: true })}
            />
          </td>
          {/* PDF column */}
          <td width="50%">
            {/* <button onClick={handleSyncPDF}>Sync PDF</button> */}

            <br />

            {isDataReady ? <Vitae entries={entries} /> : <p>Loading ...</p>}

          </td>
        </tr>
      </table>
    </div>
  );
}

export default App;
