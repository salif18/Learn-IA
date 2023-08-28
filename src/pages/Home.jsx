import React, { useEffect, useRef, useState } from "react";
import * as mobilenet from '@tensorflow-models/mobilenet';
const Home = () => {
  //etats initial
  const [images , setImages] = useState(null);
  const [model, setModel]= useState(null);
  const [resultats, setResultats] = useState([]);
  const [isModeloading, setIsModeloading] = useState(false)

  //les champs
  const imageRef = useRef(null)
  const fileInputRef = useRef(null);
  const textInputRef = useRef(null);

  //change le champs file
  const handleChangeFile = (e) => {
    const { files }= e.target;
    if(files.length > 0){
    const url = URL.createObjectURL(files[0]);
    setImages(url); 
    }else{
      setImages(null)
    }   
  };

  //envoyer
  const handleSubmitFile=()=>{
     fileInputRef.current.click()
  }

  const handleChangeText = (e) => {
    setImages(e.target.value);
    setResultats([]);
  };

  //telecharger le model mobilenet
  const loadModel =async()=>{
    setIsModeloading(true);
    try{
     const model = await mobilenet.load();
     setModel(model);
     setIsModeloading(false);
    }catch(err){
      console.log(err);
      setIsModeloading(false)
    }
  }

  //appel 
  useEffect(()=>{
    loadModel()
  },[])

  if(isModeloading){
    return <h1 style={{textAlign:'center'}}>Initializing....</h1>
  }

  //classer limage entrer dans mobilenet
  const handleSubmitdetect =async()=>{
      textInputRef.current.value = '';
      const results = await model.classify(imageRef.current);
      setResultats(results)
  }

console.log(resultats)
  return (
    <div className="home">
    <header className="myheader">
    <h1>Indentification d'images par IA</h1>
  </header>
      <main className="container">
        <div className="container-img">
          <div style={{display:'flex', flexDirection:'column',alignItems:'center'}}>
          {images && <img src={images} ref={imageRef} className="photo" alt="fichier selectionner" />}
          {images && <button className="btn-url" onClick={handleSubmitdetect}>Detcter les images </button>}
          </div>
          { resultats.length > 0 && 
          <div className="details">
          {resultats.map((result, index) =>(
           <div className="noms" key={result.className}>
           <span className="res">{result.className}</span>
           <span className="acc">Reponse fiable à {(result.probability*100).toFixed(2)}%{""}</span>
           {index === 0 && (
            <span className="bestguess">Supposition la  plus probable</span>
           )}
           </div>
           ))
          }
          </div>
         }
        </div>
        <div className="formulaire">
        <div className="field">
          <input type="file" accept="image/*" capture="camera" ref={fileInputRef} onChange={handleChangeFile} />
          <button className="btn-file" onClick={handleSubmitFile}>Charger</button>
        </div>
        <div className="field" >
          <input type="text" ref={textInputRef} onChange={handleChangeText} placeholder="Entrer URL de l'image" />
          
        </div>
        </div>
        
      </main>
    </div>
  );
};

export default Home;
