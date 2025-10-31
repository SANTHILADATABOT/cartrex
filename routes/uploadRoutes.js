const express = require("express");
const router = express.Router();
const photoUploadController = require("../controllers/photoUploadController");

const multer = require("multer");
const upload = multer({ dest: "uploads/" });

router.post("/uplaodPhoto", upload.single("file"), photoUploadController.uploadFile);

module.exports = router;
