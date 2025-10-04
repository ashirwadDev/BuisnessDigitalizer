import express from "express";
import { protect } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";
import { createBusiness, updateBusiness, deleteBusiness, getBusinessBySlug } from "../controllers/businessController.js";

const router = express.Router();

// Multer safe wrapper
const uploadSafe = (req, res, next) => {
  upload.single("logo")(req, res, (err) => {
    if(err) return res.status(400).json({ msg: err.message });
    next();
  });
};

router.post("/", protect, uploadSafe, createBusiness);
router.put("/:slug", protect, uploadSafe, updateBusiness);
router.delete("/:slug", protect, deleteBusiness);
router.get("/:slug", getBusinessBySlug);

export default router;
