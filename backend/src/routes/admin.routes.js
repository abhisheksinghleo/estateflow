const express = require("express");

const adminController = require("../controllers/admin.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const validate = require("../middlewares/validate.middleware");
const adminValidator = require("../validators/admin.validator");

const router = express.Router();

router.use(authMiddleware.authenticate);
router.use(authMiddleware.authorize("ADMIN_HEAD", "ADMIN_CO_HEAD"));

router.get("/properties/pending", adminController.listPendingProperties);

router.patch(
  "/properties/:id/status",
  adminValidator.updatePropertyStatusValidator,
  validate,
  adminController.updatePropertyStatus,
);

module.exports = router;
