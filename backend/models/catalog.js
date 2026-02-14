const mongoose = require("mongoose");

const StatsSchema = new mongoose.Schema(
  {
    value: String,
    label: String,
  },
  { _id: false },
);

const ProductSchema = new mongoose.Schema(
  {
    name: String,
    description: String,
    price: String,
    size: String,
    imageLabel: String,
    tag: String,
  },
  { _id: false },
);

const BundleSchema = new mongoose.Schema(
  {
    name: String,
    description: String,
    previousPrice: String,
    price: String,
    includes: [String],
    imageLabel: String,
  },
  { _id: false },
);

const ServiceSchema = new mongoose.Schema(
  {
    name: String,
    description: String,
    turnaround: String,
    minimum: String,
  },
  { _id: false },
);

const CatalogSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true },
    stats: [StatsSchema],
    writingPads: [ProductSchema],
    planners: [ProductSchema],
    bundles: [BundleSchema],
    services: [ServiceSchema],
    updatedAt: Date,
  },
  { timestamps: true },
);

module.exports = mongoose.model("Catalog", CatalogSchema);
