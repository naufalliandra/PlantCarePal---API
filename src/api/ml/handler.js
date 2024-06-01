const detectClassification = require("../../ml/detect");
const crypto = require("crypto");
const db = require('../../config/db');

async function postDetectHandler(request, h) {
    const { image } = request.payload;
    const { model } = request.server.app;
  
    const { diseasesName, suggestion, percentage, description } = await detectClassification(model, image);
    const id = crypto.randomUUID();
    const createdAt = new Date().toISOString();
  
    await db.collection("detections").doc(id).set({
      diseasesName,
      percentage,
      description,
      suggestion,
      createdAt,
    });
  
    const response = h.response({
      status: "success",
      message: "Model is predicted successfully.",
      data,
    });
    response.code(201);
    return response;
  }
  
async function historiesDetectHandler(request, h) {
    const historyCollection = db.collection("detections");
    const snapshot = await historyCollection.get();
  
    if (snapshot.empty) {
      return h
        .response({
          status: "success",
          data: [],
        })
        .code(200);
    }
  
    const histories = snapshot.docs.map((doc) => ({
      id: doc.id,
      history: {
        ...doc.data(),
        id: doc.id,
      },
    }));
  
    return h
      .response({
        status: "success",
        data: histories,
      })
      .code(200);
  }
  
  module.exports = { postDetectHandler, historiesDetectHandler };
  