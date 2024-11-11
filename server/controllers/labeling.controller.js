const LabelingService = require("../services/labeling.service");
const getVersionPartsDetail = async (req, res) => {
    try {
    const { id_user, id_version } = req.query;

    if (!id_user || !id_version) {
      return res.status(400).json({ message: "User ID or Dataset ID is required" });
    }
    const parts = await LabelingService.getVersionPartsDetail(
      id_user,
      id_version,
    );
    if (!parts) {
      return res.status(404).json({ message: "Parts not found" });
    }
    return res.status(200).json(parts);
  } catch (error) {
    console.error("Error fetching parts:", error);
    res.status(500).json({ message: "Server error" });
  }
}

const getDatas = async (req, res) => {
  try {
    const { id_user, id_part } = req.query;

    if (!id_user || !id_part) {
      return res.status(400).json({ message: "User ID or Part ID is required" });
    }
    const datas = await LabelingService.getDatas(
      id_user,
      id_part,
    );
    if (!datas) {
      return res.status(404).json({ message: "Datas not found" });
    }
    return res.status(200).json(datas);
  } catch (error) {
    console.error("Error fetching datas:", error);
    res.status(500).json({ message: "Server error" });
  }
}

const labelData = async (req, res) => {
  try {
    const { id_data, id_labeler, label } = req.body;
    if (!id_data || !id_labeler || !label) {
      return res.status(400).json({ message: "Dataset ID, Labeler ID, and Label are required" });
    }
    const result = await LabelingService.labelData(id_data, id_labeler, label);
    if (result) {
      return res.status(200).json({ message: result });
    } else {
      return res.status(404).json({ message: "Data not found" });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  getVersionPartsDetail,
  getDatas,
  labelData,
}