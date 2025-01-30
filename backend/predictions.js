const express = require('express');
const { spawn } = require('child_process');
const router = express.Router();

router.get('/predictions/:userId', async (req, res) => {
  const pythonProcess = spawn('conda', ['run', '-n', 'ml_env', 'python', 'ml_predictions.py', req.params.userId]);
  
  let predictions = '';
  
  pythonProcess.stdout.on('data', (data) => {
    predictions += data.toString();
  });
  
  pythonProcess.stderr.on('data', (data) => {
    console.error(`Error: ${data}`);
  });
  
  pythonProcess.on('close', (code) => {
    if (code !== 0) {
      return res.status(500).json({ error: 'Error en predicciones ML' });
    }
    try {
      const parsedPredictions = JSON.parse(predictions);
      res.json({ predictions: parsedPredictions });
    } catch (error) {
      res.status(500).json({ error: 'Error parsing predictions' });
    }
  });
});

module.exports = router;