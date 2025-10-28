const express = require('express');
const router = express.Router();
const masterRoleController = require('../../controllers/admin/masterRoleController');

// Get all roles
router.get('/getRoles', masterRoleController.getRoles);
// Get all roles for dropdownlist
router.get('/getRolesfordropdowns', masterRoleController.getRolesfordropdowns);
// Get role by ID
router.get('/getRoleById/:roleid', masterRoleController.getRoleById);
// Add new role
router.post('/addRole', masterRoleController.addRole);
// Update role
router.put('/updateRole/:roleid', masterRoleController.updateRole);

// Delete role
router.delete('/deleteRole/:roleid',  masterRoleController.deleteRole);

router.put('/updateStatusRole/:roleid',masterRoleController.updateStatusRole);

module.exports = router;
