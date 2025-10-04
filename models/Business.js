import mongoose from "mongoose";
import slugify from "slugify";

const businessSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  businessName: { type: String, required: true },
  slug: { type: String, unique: true },
  description: String,
  phone: String,
  address: String,
  service: String, // single service field
  logo: String,
  timings: { type: String, default: "10:00am - 8:00pm" },
}, { timestamps: true });

// Slug
businessSchema.pre("save", function(next) {
  this.slug = slugify(this.businessName, { lower: true });
  next();
});

export default mongoose.model("Business", businessSchema);
