import Business from "../models/Business.js";
import cloudinary from "cloudinary";

export const createBusiness = async (req, res) => {
  try {
    const { businessName, description, phone, address, service } = req.body;
    if(!req.file) return res.status(400).json({ msg: "Logo required" });

    const uploadResult = await cloudinary.v2.uploader.upload(req.file.path, {
      folder: "business-logos"
    });

    const business = await Business.create({
      user: req.user._id,
      businessName,
      description,
      phone,
      address,
      service,
      logo: uploadResult.secure_url
    });

    res.status(201).json(business);
  } catch(err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

export const getAllBusinesses = async (req, res) => {
  try {
    const businesses = await Business.find();
    res.json(businesses);
  } catch(err) {
    res.status(500).json({ msg: "Server error" });
  }
};

export const getBusinessBySlug = async (req, res) => {
  try {
    const business = await Business.findOne({ slug: req.params.slug });
    if(!business) return res.status(404).json({ msg: "Business not found" });
    res.json(business);
  } catch(err) {
    res.status(500).json({ msg: "Server error" });
  }
};

export const deleteBusiness = async (req, res) => {
  try {
    const business = await Business.findOne({ slug: req.params.slug });
    if(!business) return res.status(404).json({ msg: "Business not found" });

    if(business.user.toString() !== req.user._id.toString())
      return res.status(403).json({ msg: "Unauthorized" });

    await Business.deleteOne({ _id: business._id });
    res.json({ msg: "Business deleted successfully" });
  } catch(err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};
