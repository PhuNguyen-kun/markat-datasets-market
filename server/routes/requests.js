const router = require("express").Router()
const {
  sendSellingRequest,
  sendBuyingRequest,
  //getRequestsHistory,
  // getAllSendingRequests,
  // getAllBuyingRequests,
  // getSendingRequests,
  // getBuyingRequests,
} = require("../controllers/requests.controller");
;
router.route("/create/selling").put(sendSellingRequest);
router.route("/create/buying").put(sendBuyingRequest);
// router.route("/history").get(getRequestsHistory);
// router.route("/sending").get(getAllSendingRequests);
// router.route("/buying").get(getAllBuyingRequests);
// router.route("/sending/:id").get(getSendingRequest);
// router.route("/buying/:id").get(getBuyingRequest);

module.exports = router;
