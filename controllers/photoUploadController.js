const path = require("path");
const multer = require("multer");

// Store uploaded files in /uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname); // ✅ extract original extension (.jpg, .png, etc.)
    const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9) + ext; // ✅ keep extension
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

// ✅ Export both multer instance and handler correctly
exports.upload = upload;

exports.uploadFile = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: "No file uploaded" });
  }

  const fileUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
  res.status(200).json({ success: true, url: fileUrl });
};
