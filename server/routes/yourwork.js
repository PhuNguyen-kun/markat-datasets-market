const router = require("express").Router();
const {
  getAllYourWorkVersionsByUserId,
  getAllCollectionsByUserId,
  getCollection
} = require("../controllers/yourwork.controller");
router.route("/collection_detail").get(getCollection);
router.route("/collections").get(getAllCollectionsByUserId);
router.route("/").get(getAllYourWorkVersionsByUserId);
module.exports = router;
