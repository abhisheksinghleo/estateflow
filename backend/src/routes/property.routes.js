const express = require("express");

const propertyController = require("../controllers/property.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const validate = require("../middlewares/validate.middleware");
const propertyValidator = require("../validators/property.validator");

const router = express.Router();

// Public routes
router.get("/", propertyController.listProperties);

// Protected routes
router.get(
  "/my/listings",
  authMiddleware.authenticate,
  propertyController.listMyProperties,
);

// Public dynamic route (keep after specific routes)
router.get("/:id", propertyController.getPropertyById);

router.post(
  "/",
  authMiddleware.authenticate,
  authMiddleware.authorize("SELLER", "AGENT", "ADMIN_HEAD", "ADMIN_CO_HEAD"),
  propertyValidator.createPropertyValidator,
  validate,
  propertyController.createProperty,
);

router.patch(
  "/:id",
  authMiddleware.authenticate,
  authMiddleware.authorize("SELLER", "AGENT", "ADMIN_HEAD", "ADMIN_CO_HEAD"),
  propertyValidator.updatePropertyValidator,
  validate,
  propertyController.updateProperty,
);

module.exports = router;
