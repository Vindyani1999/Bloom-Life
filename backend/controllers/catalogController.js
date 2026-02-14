const Catalog = require("../models/catalog");

const sanitizeArray = (value) => (Array.isArray(value) ? value : []);

exports.getCatalog = async (_req, res) => {
  try {
    const catalog = await Catalog.findOne({ slug: "default" })
      .select("-__v -_id")
      .lean();

    if (!catalog) {
      res.status(404).json({ message: "Catalog not found." });
      return;
    }

    res.status(200).json(catalog);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong." });
  }
};

exports.upsertCatalog = async (req, res) => {
  try {
    const body = req.body || {};
    const catalog = {
      slug: "default",
      stats: sanitizeArray(body.stats),
      writingPads: sanitizeArray(body.writingPads),
      planners: sanitizeArray(body.planners),
      bundles: sanitizeArray(body.bundles),
      services: sanitizeArray(body.services),
      updatedAt: new Date(),
    };

    await Catalog.updateOne(
      { slug: "default" },
      { $set: catalog },
      { upsert: true },
    );

    res.status(200).json(catalog);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong." });
  }
};
