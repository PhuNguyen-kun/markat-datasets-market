const {
  sendSendingRequest,
  getRequestsHistory,
  getAllSendingRequests,
  getAllBuyingRequests,
  // getSendingRequests,
  // getBuyingRequests,
} = require("../controllers/requests.controller");
const router = require("express").Router();

router.route("/create/sending").post(sendSendingRequest);
router.route("/history").get(getRequestsHistory);
router.route("/sending").get(getAllSendingRequests);
router.route("/buying").get(getAllBuyingRequests);
// router.route("/sending/:id").get(getSendingRequest);
// router.route("/buying/:id").get(getBuyingRequest);
module.exports = router;
