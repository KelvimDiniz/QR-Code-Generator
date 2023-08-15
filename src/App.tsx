import React, { useState } from 'react';
import './App.css';
import QRCode from 'qrcode.react';
import html2canvas from 'html2canvas';
import Modal from 'react-modal';

function App() {

  const [inputValues, setInputValues] = useState({
    readerUsername: "Usuário",
    readerPassword: "Senha",
    primaryServer: "https://app1.ticketwork.com.br",
    secondaryServer: ""
  });
  const [ eventName, setEventName ] = useState('Nome do evento');
  const [ setorName, setSetorName ] = useState('Nome do setor');

  const handleInputChange = ( event: React.ChangeEvent<HTMLInputElement> ) => {
    if (!event) return;
    const { name, value } = event.target;
    setInputValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleGeneratePNG = async () => {

    const qrCodeElement = document.getElementById('html-to-png');

    if ( !qrCodeElement ) return;

    const canvas = await html2canvas(qrCodeElement);

    const pngDataUrl = canvas.toDataURL('image/png');

    const downloadLink = document.createElement('a');
    downloadLink.href = pngDataUrl;
    downloadLink.download = 'generated_qrcode.png';
    downloadLink.click();
  };
  
  return (
    <div id="app-container">
      <div id='html-to-png' >
        <h2 children={ eventName }/>
        <h4 children={ setorName }/>
        <QRCode size={ 300 } value={JSON.stringify(inputValues)} />
        <p children={ `${ inputValues.readerUsername } | ${ inputValues.readerPassword }` }/>
      </div>
      <div className="input-fields">
      <input
        type="text"
        name="eventName"
        placeholder='Nome do evento'
        onChange={ (event) => setEventName( event.target.value ) }
      />
      <input
        type="text"
        name="setorName"
        placeholder='Nome do setor'
        onChange={ (event) => setSetorName( event.target.value ) }
      />      
      <input
        type="text"
        name="readerUsername"
        placeholder='Usuário checkin'
        onChange={ (event) => handleInputChange(event) }
      />
      <input
        type="text"
        name="readerPassword"
        placeholder='Senha checkin'
        onChange={ (event) => handleInputChange(event) }
      />
      <input
        type="text"
        name="primaryServer"
        value={inputValues.primaryServer}
        placeholder='Servidor primário'
        onChange={ (event) => handleInputChange(event) }
      />
      <input
        type="text"
        name="secondaryServer"
        placeholder='Servidor secundário'
        onChange={ (event) => handleInputChange(event) }
      />
    </div>
    <button onClick={ handleGeneratePNG }>Baixar QR-Code</button> 
    </div>
  );
}

export default App;