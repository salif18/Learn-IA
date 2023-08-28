import React from 'react';
import { useEffect} from "react";
import * as tf from '@tensorflow/tfjs';
import * as tfvis from '@tensorflow/tfjs-vis';
const Annalyse2D = () => {
    //recuperer les donnees 
    // "https://storage.googleapis.com/tfjs-tutorials/carsData.json"
    const getData = async()=>{
        const data = await fetch("https://storage.googleapis.com/tfjs-tutorials/carsData.json");
        const dataJSON = await data.json();
        const filterData = dataJSON
          .map((x) => ({ mgp:x.Miles_per_Gallon, how:x.Horsepower}))
          .filter((x) => x.mgp !== null && x.how !== null);
          return filterData;
  };
      
      //CREATE MODEL
      const createModel =()=> {
        const model = tf.sequential();
        model.add(tf.layers.dense({units:1, inputShape:[1], useBias:true}));
        model.add(tf.layers.dense({units:1, useBias:true}));
        tfvis.show.modelSummary({name:'Model Summary'},model)
        return model
      };
  
      //BRASSER CONVERTIR  NORMALISER LES DONNEE
      const converTensor = (data) => {
        return tf.tidy(()=>{
          //brasser 
          tf.util.shuffle(data);
  
          //recuperer les donnees entrer
          const inputs = data.map( x => x.mgp );
          const labels = data.map( x => x.how);
  
          //convertir en dimention tensor2
          const inputTensor = tf.tensor2d(inputs, [inputs.length, 1]);
          const labelTensor = tf.tensor2d(labels, [labels.length, 1]);
  
          //creer un min et max des entrer
          const inputMin = inputTensor.min();
          const inputMax = inputTensor.max();
          const labelMin = labelTensor.min();
          const labelMax = labelTensor.max();
  
          //normaliser
          const normalizedInput = inputTensor.sub(inputMin).div(inputMax.sub(inputMin));
          const normalisedLabel = labelTensor.sub(labelMin).div(labelMax.sub(labelMin));
          return { inputs:normalizedInput, labels:normalisedLabel, inputMin, inputMax, labelMin, labelMax }
        })
      };
  
      //ENTRAINEMENT DES DONNEES
      const trainModel = async(model , inputs, labels ) =>{
        model.compile({ loss:tf.losses.meanSquaredError , optimizer:tf.train.adam(), matrics:['mse']});
        return await model.fit(inputs, labels, {
          batchSize:32,
          epochs:50,
          shuffle:true,
          callbacks:tfvis.show.fitCallbacks(
            {name:'Entrainement de la performance'},
             ["loss","mse"], 
             {height:400, callbacks:['onEpochEnd']})
        })
      };
  
      const testModel = (model, inputData, normalizeData) => {
        const { inputMin , inputMax, labelMax, labelMin } = normalizeData;
  
        //creer les constante de prediction
        const [xs, preds ] = tf.tidy(()=>{
          const xs = tf.linspace(0, 1, 100);
          const preds = model.predict(xs.reshape([100, 1]));
  
          const unNormXs = xs.mul(inputMax.sub(inputMin)).add(inputMin);
          const unNormPerds = preds.mul(labelMax.sub(labelMin)).add(labelMin);
  
          return [unNormXs.dataSync(), unNormPerds.dataSync()]
        });
  
        const predictPoints = Array.from(xs).map((val , i) => ({x:val , y:preds[i]}));
        const pointOriginal = inputData.map((d) => ({x:d.mgp, y:d.how}));
  
        tfvis.render.scatterplot(
          {name:''},
          {values:[predictPoints, pointOriginal], series:['predict', 'original']},
          {xLabel:'MGP', yLabel:'how', height:400}
        )
      }
     
      // VISSUALISER
      useEffect(()=>{
        const startApp = async()=>{
        const model = createModel();
        const data = await getData();
        const values = data.map((d) => ({x: d.mgp, y:d.how}));
        tfvis.render.scatterplot({name:'HORSEPOWER VS MGP'}, {values}, {xLabel:"Mgp", yLabel:"Horsepower", height:400});
        
        const tensorData = converTensor(data);
        const { inputs , labels} = tensorData;
         trainModel(model,inputs,labels );
         testModel(model,data, tensorData)
      };
      startApp();
      },[])
    return (
        <div>
          <div className="scatterplot" id="scatterplot"></div>
        </div>
    );
}

export default Annalyse2D;
