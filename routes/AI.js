const tf = require("@tensorflow/tfjs-node")
const express = require("express");
const router = express.Router();
const { createCanvas, Image } = require('canvas');
const fs = require('fs');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });


router.post('/disease', upload.single('image') ,async (req, res) => {
    let model = await tf.loadLayersModel('../model/AI-model/plant_model_v2.h5');
    const img = new Image();
    img.src = fs.readFileSync(req.file.path);

    targetSize = [256, 256];
    const canvas = createCanvas(targetSize[0], targetSize[1]);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, targetSize[0], targetSize[1]);
    const resizedImg = tf.browser.fromPixels(canvas);

    const normalizedImg = resizedImg.toFloat().div(tf.scalar(255));
    const processedImg = normalizedImg.expandDims();

    const predictions = model.predict(processedImg);
    predictions.print();

    res.send(predictions);
});

module.exports = router;