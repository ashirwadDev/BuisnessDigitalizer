import express from "express";
import { createBusiness, getAllBusinesses, getBusinessBySlug, deleteBusiness } from "../controllers/businessController.js";
import { protect } from "../middleware/auth.js";
import upload from "../middleware/upload.js";

const router = express.Router();

router.post("/", protect, upload.single("logo"), createBusiness);
router.get("/", getAllBusinesses);
router.get("/:slug", getBusinessBySlug);
router.delete("/:slug", protect, deleteBusiness);

export default router;
