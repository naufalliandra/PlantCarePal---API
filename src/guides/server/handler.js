const db = require("../config/db");

async function getAllGuidesHandler(request, h) {
  try {
    const guidesCollection = db.collection("guides");
    const snapshot = await guidesCollection.get();

    const guides = snapshot.docs.map((doc) => {
      const guideData = doc.data();
      return {
        id: doc.id,
        title: guideData.title,
        published_at: guideData.published_at,
        summary: guideData.summary,
        image: guideData.image,
      };
    });

    return h.response({
      status: "success",
      data: guides,
    }).code(200);
  } catch (error) {
    console.error("Error getting guides:", error);
    return h.response({
      status: "fail",
      message: "Internal Server Error",
    }).code(500);
  }
}

async function getGuideHandler(request, h) {
  try {
    const guidesCollection = db.collection("guides");
    const doc = await guidesCollection.doc(request.params.id).get();

    if (!doc.exists) {
      return h.response({
        status: "fail",
        message: "Guide not found",
      }).code(404);
    }

    const guideData = doc.data();

    const guide = {
      id: doc.id,
      title: guideData.title,
      published_at: guideData.published_at,
      image: guideData.image,
      content: guideData.content,
    };

    return h.response({
      status: "success",
      data: guide,
    }).code(200);
  } catch (error) {
    console.error("Error getting guide:", error);
    return h.response({
      status: "fail",
      message: "Internal Server Error",
    }).code(500);
  }
}

module.exports = { getAllGuidesHandler, getGuideHandler };
