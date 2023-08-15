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

  const shareToWhatsApp = async () => {

    const qrCodeElement = document.getElementById('html-to-png');

    if ( !qrCodeElement ) return;

    const canvas = await html2canvas(qrCodeElement);

    const pngDataUrl = canvas.toDataURL('image/png');

    // Create a WhatsApp Web Share link
    const whatsappLink = `https://api.whatsapp.com/send?text=Check%20out%20this%20QR%20code&data=${encodeURIComponent(pngDataUrl)}`;

    window.open(whatsappLink);
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
    <button onClick={ shareToWhatsApp }>Compartilhar QR-Code</button> 
    </div>
  );
}

interface GeneratePNGModalProps {
  onGeneratePNG: (title: string, description: string) => void;
}

const GeneratePNGModal: React.FC<GeneratePNGModalProps> = ({ onGeneratePNG }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleGenerateClick = () => {
    onGeneratePNG(title, description);
  };

  return (
      <>
      <h2>Generate PNG</h2>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        type="text"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <button onClick={handleGenerateClick}>Generate and Download</button>
      </>
  );
}

export default App;