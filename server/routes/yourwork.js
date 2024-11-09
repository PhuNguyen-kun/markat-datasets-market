const router = require("express").Router();
const {
  getAllYourWorkVersionsByUserId,
  getYourWorkDetail,
  getAllCollectionsByUserId,
  getCollection
} = require("../controllers/yourwork.controller");
router.route("/collection_detail").get(getCollection);
router.route("/collections").get(getAllCollectionsByUserId);
router.route("/yourwork_detail").get(getYourWorkDetail);
router.route("/").get(getAllYourWorkVersionsByUserId);
module.exports = router;
