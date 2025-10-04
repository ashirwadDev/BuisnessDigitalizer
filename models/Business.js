import mongoose from "mongoose";
import slugify from "slugify";

const businessSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  businessName: { type: String, required: true },
  slug: { type: String, unique: true },
  description: String,
  phone: String,
  address: String,
  service: String,
  logo: String,
  timings: { type: String, default: "10:00am - 8:00pm" },
}, { timestamps: true });

// Slug with duplicate check
businessSchema.pre("save", async function(next) {
  let baseSlug = slugify(this.businessName, { lower: true });
  let slug = baseSlug;
  let count = 1;
  while(await this.constructor.findOne({ slug })) {
    slug = `${baseSlug}-${count}`;
    count++;
  }
  this.slug = slug;
  next();
});

export default mongoose.model("Business", businessSchema);
