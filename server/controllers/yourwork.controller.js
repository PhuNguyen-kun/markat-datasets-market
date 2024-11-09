const YourWorkService = require("../services/yourwork.service");
const getAllYourWorkVersionsByUserId = async (req, res) => {
  try {
    const { id_user } = req.query;

    if (!id_user) {
      return res.status(400).json({ message: "User ID is required" });
    }
    const yourwork = await YourWorkService.getAllYourWorkVersionsByUserId(
      id_user
    );
    if (!yourwork) {
      return res.status(404).json({ message: "Your work not found" });
    }
    return res.status(200).json(yourwork);
  } catch (error) {
    console.error("Error fetching your work:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getYourWorkDetail = async (req, res) => {
  try {
    const { id_user, id_dataset } = req.query;

    if (!id_user || !id_dataset) {
      return res.status(400).json({ message: "User ID or Dataset ID is required" });
    }
    const yourworkdetail = await YourWorkService.getYourWorkDetail(
      id_user,
      id_dataset,
    );
    if (!yourworkdetail) {
      return res.status(404).json({ message: "Your work detail not found" });
    }
    return res.status(200).json(yourworkdetail);
  } catch (error) {
    console.error("Error fetching your work detail:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getAllCollectionsByUserId = async (req, res) => {
  try {
    const { id_user } = req.query;

    if (!id_user) {
      return res.status(400).json({ message: "User ID is required" });
    }
    const yourcollections = await YourWorkService.getAllCollectionsByUserId(
      id_user
    );
    if (!yourcollections) {
      return res.status(404).json({ message: "Your collections not found" });
    }
    return res.status(200).json(yourcollections);
  } catch (error) {
    console.error("Error fetching your collections:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getCollection = async (req, res) => {
  try {
    const { id_user, id_dataset } = req.query;

    if (!id_user || !id_dataset) {
      return res.status(400).json({ message: "User ID or Dataset ID is required" });
    }
    const collectiondetail = await YourWorkService.getCollectionDetail(
      id_user,
      id_dataset,
    );
    if (!collectiondetail) {
      return res.status(404).json({ message: "Your collection detail not found" });
    }
    return res.status(200).json(collectiondetail);
  } catch (error) {
    console.error("Error fetching your collection detail:", error);
    res.status(500).json({ message: "Server error" });
  }
};
module.exports = {
  getAllYourWorkVersionsByUserId,
  getYourWorkDetail,
  getAllCollectionsByUserId,
  getCollection,
};
