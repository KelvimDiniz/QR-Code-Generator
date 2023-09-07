import React, { memo, useState } from 'react';
import './App.css';
import QRCode from 'qrcode.react';
import html2canvas from 'html2canvas';

interface InputValues {
  eventName: string;
  setorName: string;
  readerUsername: string;
  readerPassword: string;
  primaryServer: string;
  secondaryServer: string;
}

const App = () => {



  const [inputValues, setInputValues] = useState<InputValues>({
    eventName: "",
    setorName: "",
    readerUsername: "",
    readerPassword: "",
    primaryServer: "https://app1.ticketwork.com.br",
    secondaryServer: ""
  });

  const [ showQRCode, setShowQRCode ] = useState<boolean>(false);

  const handleShowQRCode = () => {
    setShowQRCode( !showQRCode );
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

  const maskedPrimaryServer = inputValues.primaryServer.substring(10);
  
  return (
  <div id="app-container">
    { showQRCode ?
    <>
          <div id='html-to-png' >
            <h2 children={ inputValues.eventName }/>
            <h4 children={ inputValues.setorName }/>
              <QRCode size={ 300 } value={JSON.stringify(inputValues)} />
            <p children={ `${ inputValues.readerUsername } | ${ inputValues.readerPassword }` }/>
            <p children={ maskedPrimaryServer }/>
        </div>
        <button className='btn-edit' onClick={ handleShowQRCode }>Editar QR-Code</button>
        <button className='btn-download' onClick={ handleGeneratePNG }>Baixar QR-Code</button>
        </> :
    <InputField 
    data={ inputValues } 
    onSubmit={ (values) => {
        setInputValues(values); 
        handleShowQRCode();
      }
    }   
  />
    }
  </div>
  );
};





const InputField: React.FC<{data: InputValues, onSubmit: (InputValues: InputValues) => void  }> = ( { data, onSubmit } ) => {

  const [fields, setFields] = useState<InputValues>(data);

  const [ disabled, setDisabled ] = useState<boolean>(true);

  // always change the color of the submit button then the required fields are filled using the useEffect hook
  React.useEffect(() => {
    const submitButton = document.getElementsByClassName('btn-submit')[0];

    if ( !submitButton ) return

    if (submitButton) {
      if ( fields.readerUsername !== "" && fields.readerPassword !== "" && fields.primaryServer == "https://app1.ticketwork.com.br" ) {
        submitButton.classList.remove('disabled');
        setDisabled(false)
      } else {
        submitButton.classList.add('disabled');
        setDisabled(true)
      }
    }
  }, [fields]);

  const submit = () => {
    onSubmit(fields);
  };

  const reset = () => {
    setFields({
      eventName: "",
      setorName: "",
      readerUsername: "",
      readerPassword: "",
      primaryServer: "https://app1.ticketwork.com.br",
      secondaryServer: ""
    });
  };

  return(
    <form className="input-fields" onSubmit={ submit } onReset={ reset }>
      <h3>Preencha os campos obrigatorios</h3>
      <input
        type="text"
        name="readerUsername"
        placeholder='Usuário checkin (obrigatorio)'
        value={ fields.readerUsername }
        required={ true }
        onChange={ (event) => setFields(
          { ...fields, readerUsername: event.target.value }
        ) }
      />
      <input
        type="text"
        name="readerPassword"
        placeholder='Senha checkin (obrigatorio)'
        value={ fields.readerPassword }
        required={ true }
        onChange={ (event) => setFields(
          { ...fields, readerPassword: event.target.value }
        ) }
      />
      <input
        type="text"
        name="primaryServer"
        value={ fields.primaryServer }
        placeholder='Servidor primário (obrigatorio)'
        required={ true }
        onChange={ (event) => setFields(
          { ...fields, primaryServer: event.target.value } 
        ) }
      />
      <br></br>      
      <input
        type="text"
        name="eventName"
        placeholder='Nome do evento (opcional)'
        value={ fields.eventName }
        onChange={ (event) => setFields( 
          { ...fields, eventName: event.target.value }
         ) }
      />
      <input
        type="text"
        name="setorName"
        placeholder='Nome do setor (opcional)'
        value={ fields.setorName }
        onChange={ (event) => setFields(
          { ...fields, setorName: event.target.value }
        ) }
      />      
      <input
        type="text"
        name="secondaryServer"
        placeholder='Servidor secundário (opcional)'
        value={ fields.secondaryServer }
        onChange={ (event) => setFields(
          { ...fields, secondaryServer: event.target.value }
        ) }
      />
      
      <button disabled={ disabled } className='btn-submit disabled' type='submit'>Gerar QR-Code</button> 
      <button className='btn-reset' type='reset'>Limpar</button>
    </form>

  );
};

export default App;