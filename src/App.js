import React, { useEffect, useState, useRef } from 'react';
import yaml from 'js-yaml';
import AceEditor from 'react-ace'
import 'ace-builds/src-noconflict/theme-github';
import 'ace-builds/src-noconflict/ext-searchbox'; // Import the searchbox extension
import Vitae from './Vitae';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'ace-builds/src-noconflict/theme-dawn'; // Replace 'theme-monokai' with your desired theme

function App() {

  const [entries, setEntries] = useState({});
  const [isDataReady, setDataReady] = useState(false);
  // const [heightEditor, setHeightEditor] = useState(0);

  const formRef = useRef(null);
  const editorRef = useRef(null);

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

    // setStatusText("Data saved.");
    setTimeout(() => {
      // TODO: find a better placeholder
      // setStatusText("...");
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
      <div className="form-group">

        <div className="row mb-3">
          <div className="col">
            {/* <form onSubmit={handleSubmit}> */}
            <select className="form-control" value={category} onChange={handleCategoryChange}>
              <option value="">-- Category --</option>
              {Object.keys(categories).map((option, index) => (
                <option key={index} value={option}>{option}</option>
              ))}
            </select>
          </div>
          <div className="col">
            <select className="form-control" value={subCategory} onChange={handleSubCategoryChange}>
              <option value="">-- Subcategory --</option>
              {subCategoryOptions.map((option, index) => (
                <option key={index} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className='row mb-3'>
          <div className='col'>
            <input className="form-control" type="number" value={startYear} onChange={handleStartYearChange} placeholder='Start Year' />
          </div>
          <div className='col'>
            <input className="form-control" type="number" value={endYear} onChange={handleEndYearChange} placeholder='End Year' />
          </div>
          <div className='col'>
            <input className="form-control" type="text" value={label} onChange={handleLabelChange} placeholder='Label' />
          </div>
        </div>

        <div className='row mb-3'>
          <div className='col'>
            <textarea className="form-control"
              rows={5}
              cols={60}
              placeholder="Description" onChange={handleDescriptionChange}
            />
          </div>
        </div>


        <div className='row mb-3'>
          <div className='col'>
            <input className="form-control" type="text" value={link} onChange={handleLinkChange} placeholder='Link' />
          </div>
        </div>

        <div className='row'>
          <div className='col-sm-auto' >
            <button className="btn btn-dark" onClick={handleSubmit} type="submit">Submit</button>
          </div>

          <div className='col'>
            <button className="btn btn-dark" onClick={handleDownload}>Download Vitae Data</button>
          </div>
        </div>
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

    // register the 'Cmd-F' command
    editor.commands.addCommand({
      name: 'search',
      bindKey: { win: 'Ctrl-F', mac: 'Cmd-F' },
      exec: handleFind,
    });

    // dynamically adjust ace editor's height
    const divForm = document.getElementsByName('divForm')[0]
    const heightEditor = divForm.parentNode.offsetHeight - divForm.offsetHeight
    console.log(heightEditor)
    editor.height = heightEditor

  }, []);

  return (
    // <table style={{ maxHeight: '50vh', overflow: 'auto' }}>
    <div className=" mx-5 my-3">
      <div className='container-fluid' style={{ maxHeight: '95vh', overflow: 'hidden' }}>

        <div className='row mb-3'>
          <h3>OpenVitae</h3>
        </div>

        <div className='row'>
          <div className='col-' style={{ width: '640px' }}>
            <div name='divForm' className='row mb-3' style={{ width: '100%' }}>
              <Form ref={formRef} />
            </div>
            <div className='row p-2' style={{ width: '100%', height: '100vh'}}>
              <AceEditor
                ref={editorRef}
                theme="dawn"
                mode="yaml"
                height="100%"
                style={{ flex: '1' }}
                value={yaml.dump(entries, { noRefs: true, quoteKeys: true })}
              />
            </div>
          </div>
          <div className='col mx-5'>
            {isDataReady ? <div style={{ position: 'relative' }}><Vitae entries={entries} /> </div> : <p>Loading ...</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
