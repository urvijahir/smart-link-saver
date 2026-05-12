const Link = require("../models/Link");

// Create Link
const createLink = async (req, res) => {
  try {
    console.log("BODY:", req.body);
    console.log("USER:", req.user);

    const { title, url, note } = req.body;

    if (!title || !url) {
      return res.status(400).json({
        message: "Title and URL required",
      });
    }

    const link = await Link.create({
      title,
      url,
      note,
      userId: req.user._id,
    });

    res.status(201).json(link);
  } catch (error) {
    console.log("ERROR:", error);
    res.status(500).json({
      message: "Server error",
    });
  }
};
// Get My Links
const getLinks = async (req, res) => {
  const links = await Link.find({
    userId: req.user._id,
  }).sort({ createdAt: -1 });

  res.json(links);
};

// Delete My Links
const deleteLink = async (req, res) => {
  const link = await Link.findById(req.params.id);

  if (!link) {
    return res.status(404).json({
      message: "Link not found",
    });
  }

  if (link.userId.toString() !== req.user._id.toString()) {
    return res.status(401).json({
      message: "Not authorized",
    });
  }

  await Link.findByIdAndDelete(req.params.id);

  res.json({
    message: "Link deleted successfully",
  });
};

//Update Link
const updateLink = async (req, res) => {
  const link = await Link.findById(req.params.id);

  if (!link) {
    return res.status(404).json({
      message: "Link not found",
    });
  }

  if (link.userId.toString() !== req.user._id.toString()) {
    return res.status(401).json({
      message: "Not authorized",
    });
  }

  const updatedLink = await Link.findByIdAndUpdate(req.params.id, req.body, {
    returnDocument: "after",
  });

  res.json(updatedLink);
};

module.exports = { createLink, getLinks, deleteLink, updateLink };
