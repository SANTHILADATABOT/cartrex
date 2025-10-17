const express = require('express');
const router = express.Router();
const controller = require("../../controllers/admin/masterController");

// Use ?type=category or ?type=subcategory
router.post('/create', controller.create);

router.put('/update/:id', controller.update);
router.delete('/delete/:id', controller.delete);
router.get("/getallcategories", controller.getallcategories);
router.get("/getallsubcategories", controller.getallsubcategories);
router.get("/getcategorysubcategories", controller.getcategorysubcategories);

module.exports = router;
