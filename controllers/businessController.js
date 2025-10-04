import Business from "../models/Business.js";
import fs from "fs";
import path from "path";

// CREATE
export const createBusiness = async (req, res) => {
  try {
    const { businessName, description, phone, address, service } = req.body;
    if(!businessName) return res.status(400).json({ msg: "Business name required" });
    const logo = req.file ? req.file.filename : null;
    const b = await Business.create({ user: req.user._id, businessName, description, phone, address, service, logo });
    res.status(201).json(b);
  } catch (err) {
    console.error("CreateBusiness Error:", err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

// UPDATE
export const updateBusiness = async (req, res) => {
  try {
    const slug = req.params.slug;
    const b = await Business.findOne({ slug });
    if(!b) return res.status(404).json({ msg: "Business not found" });
    if(b.user.toString() !== req.user._id.toString()) return res.status(403).json({ msg: "Not allowed" });

    const { description, phone, address, service } = req.body;
    if(description) b.description = description;
    if(phone) b.phone = phone;
    if(address) b.address = address;
    if(service) b.service = service;

    if(req.file){
      if(b.logo){
        const oldPath = path.join("uploads", b.logo);
        if(fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
      b.logo = req.file.path; // Cloudinary gives a public URL
    }

    await b.save();
    res.json(b);
  } catch (err) {
    console.error("UpdateBusiness Error:", err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

// DELETE
// DELETE BUSINESS
export const deleteBusiness = async (req, res) => {
  try {
    const slug = req.params.slug;
    const b = await Business.findOne({ slug });
    if (!b) return res.status(404).json({ msg: "Business not found" });

    // ✅ Only owner can delete
    if (b.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ msg: "Not allowed to delete this business" });
    }

    // ✅ Delete image if exists
    if (b.logo) {
      const oldPath = path.join("uploads", b.logo);
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }

    // ✅ Proper delete method for Mongoose 7+
    await Business.deleteOne({ _id: b._id });

    res.json({ msg: "Business deleted successfully" });
  } catch (err) {
    console.error("DeleteBusiness Error:", err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};


// GET BY SLUG
export const getBusinessBySlug = async (req, res) => {
  try {
    const slug = req.params.slug;
    const business = await Business.findOne({ slug }).populate("user", "name email");
    if(!business) return res.status(404).json({ msg: "Business not found" });
    res.json(business);
  } catch (err) {
    console.error("GetBusinessBySlug Error:", err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};
