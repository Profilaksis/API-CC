const tf = require('@tensorflow/tfjs');
const db = require('../database/db');
const { verifyToken } = require('../utils/jwt');

// Load the TensorFlow.js model
const loadModelHeart = async () => {
  const model = await tf.loadLayersModel(`https://profilaksis-llgpy7csea-as.a.run.app/heart/model.json`);
  return model;
};


// Function to save prediction results to the history table
async function savePredictionToHistory(username, prediction) {
  try {
    let healthStatus = '';
    let description = '';

    const roundedPrediction = Math.round(prediction);

    if (roundedPrediction <= 30) {
      healthStatus = 'Healthy';
      description = 'Keep it up! Your heart is healthy. Maintain a healthy diet and regular physical activity.';
    } else if (roundedPrediction <= 70) {
      healthStatus = 'Average';
      description = 'Your heart health is average. Consider adopting healthier lifestyle choices, such as improving your diet and increasing physical activity.';
    } else {
      healthStatus = 'Unhealthy';
      description = 'Consultation is recommended. You may be at a higher risk of heart disease. It is advised to avoid smoking, reduce alcohol consumption, and consult with a doctor for further examination.';
    }

    const diseaseCategory = 'Heart Disease';

    const insertQuery = 'INSERT INTO health_history (username, prediction_result, health_status, disease_category, description) VALUES (?, ?, ?, ?, ?)';
    const insertValues = [username, prediction, healthStatus, diseaseCategory, description];

    db.query(insertQuery, insertValues, (error, result) => {
      if (error) {
        console.error('Error saving prediction to history:', error);
      } else {
        console.log('Prediction saved to history:', result);
      }
    });
  } catch (error) {
    console.error('Error saving prediction to history:', error);
  }
}


const predictHeartDisease = async (req, res) => {
  try {
    const {
      kelamin,
      umur,
      bmi,
      tekananDarah,
      kolesterol,
      stroke,
      diabetes,
      rokok,
      alkohol,
      olahraga,
      buah,
      sayur,
      susahJalan
    } = req.body;

    // Ensure all required input variables are provided
    if (
      kelamin === undefined || umur === undefined || bmi === undefined || tekananDarah === undefined || rokok === undefined ||
      diabetes === undefined || stroke === undefined || alkohol === undefined ||  kolesterol === undefined ||
      susahJalan === undefined || olahraga === undefined || buah === undefined || sayur === undefined
    ) {
      return res.status(400).json({ error: 'All input variables are required' });
    }

    // Load TensorFlow.js model
    const model = await loadModelHeart();

    // Make predictions
    const input = tf.tensor2d([[kelamin, umur, bmi, tekananDarah, kolesterol, stroke, diabetes, rokok, alkohol, olahraga, buah, sayur, susahJalan]]);
    const prediction = model.predict(input).dataSync()[0];
    const roundedPrediction = Math.round(prediction * 100);

    let healthStatus, keterangan;
    
    if (roundedPrediction <= 30) {
      healthStatus = 'Healthy';
      keterangan = 'Keep it up! Your heart is healthy. Maintain a healthy diet and regular physical activity.';
    } else if (roundedPrediction <= 70) {
      healthStatus = 'Average';
      keterangan = 'Your heart health is average. Consider adopting healthier lifestyle choices, such as improving your diet and increasing physical activity.';
    } else {
      healthStatus = 'Unhealthy';
      keterangan = 'Consultation is recommended. You may be at a higher risk of heart disease. It is advised to avoid smoking, reduce alcohol consumption, and consult with a doctor for further examination.';
    }

    // Save prediction results to the history table
    const token = req.header('Authorization');
    const decodedToken = verifyToken(token);
    const { username } = decodedToken;

    await savePredictionToHistory(username, roundedPrediction);
    res.json({
      message: 'Heart disease prediction saved successfully',
      data: { 
      prediction: roundedPrediction, 
      healthStatus: healthStatus,
      keterangan: keterangan,
      }
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


const loadModelDiabetes = async () => {
  const model = await tf.loadLayersModel(`https://profilaksis-llgpy7csea-as.a.run.app/diabetes/model.json`);
  return model;
};

async function savePredictionDiabetesToHistory(username, prediction) {
  try {
    let healthStatus = '';
    let keterangan = '';

    const roundedPrediction = Math.round(prediction);

    if (roundedPrediction <= 30) {
      healthStatus = 'Healthy';
      keterangan = 'Keep it up! You do not have diabetes. Maintain a healthy diet and regular physical activity.';
    } else if (roundedPrediction <= 70) {
      healthStatus = 'Average';
      keterangan = 'Your risk of diabetes is average. Consider controlling sugar intake, maintaining body weight, and adopting a healthier lifestyle.';
    } else {
      healthStatus = 'Unhealthy';
      keterangan = 'Consultation is recommended. You may be at a higher risk of diabetes. It is advised to control sugar intake, maintain body weight, and consult with a doctor for further examination.';
    }

    const kategoriPenyakit = 'Diabetes';

    const insertQuery = 'INSERT INTO health_history (username, prediction_result, health_status, kategori_penyakit, keterangan) VALUES (?, ?, ?, ?, ?)';
    const insertValues = [username, prediction, healthStatus, kategoriPenyakit, keterangan];

    db.query(insertQuery, insertValues, (error, result) => {
      if (error) {
        console.error('Error saving diabetes prediction to history:', error);
      } else {
        console.log('Diabetes prediction saved to history:', result);
      }
    });
  } catch (error) {
    console.error('Error saving diabetes prediction to history:', error);
  }
}


const predictDiabetesDisease = async (req, res) => {
  try {
    const {
      kelamin,
      umur,
      bmi,
      tekananDarah,
      kolesterol,
      stroke,
      sakitJantung,
      rokok,
      alkohol,
      olahraga,
      buah,
      sayur,
      susahJalan
    } = req.body;

    // Ensure all required input variables are provided
    if (
      kelamin === undefined || umur === undefined || bmi === undefined || tekananDarah === undefined || rokok === undefined ||
      sakitJantung === undefined || stroke === undefined || alkohol === undefined ||  kolesterol === undefined ||
      susahJalan === undefined || olahraga === undefined || buah === undefined || sayur === undefined
    ) {
      return res.status(400).json({ error: 'All input variables are required' });
    }

    // Load TensorFlow.js model
    const model = await loadModelDiabetes();

    // Make predictions
    const input = tf.tensor2d([[kelamin, umur, bmi, tekananDarah, kolesterol, stroke, sakitJantung, rokok, alkohol, olahraga, buah, sayur, susahJalan]]);
    const prediction = model.predict(input).dataSync()[0];
    const roundedPrediction = Math.round(prediction * 100);

    let healthStatus, keterangan;
    
    if (roundedPrediction <= 30) {
      healthStatus = 'Healthy';
      keterangan = 'Keep it up! You do not have diabetes. Maintain a healthy diet and regular physical activity.';
    } else if (roundedPrediction <= 70) {
      healthStatus = 'Average';
      keterangan = 'Your risk of diabetes is average. Consider controlling sugar intake, maintaining body weight, and adopting a healthier lifestyle.';
    } else {
      healthStatus = 'Unhealthy';
      keterangan = 'Consultation is recommended. You may be at a higher risk of diabetes. It is advised to control sugar intake, maintain body weight, and consult with a doctor for further examination.';
    }
    // Save diabetes prediction results to the history table
    const token = req.header('Authorization');
    const decodedToken = verifyToken(token);
    const { username } = decodedToken;

    await savePredictionDiabetesToHistory(username, roundedPrediction);
    res.json({
      message: 'Diabetes prediction saved successfully',data:{ 
      prediction: roundedPrediction, 
      healthStatus: healthStatus,
      keterangan: keterangan,
       
    }});
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  predictHeartDisease,
  predictDiabetesDisease,
};
