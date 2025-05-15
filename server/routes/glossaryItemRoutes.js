// server/routes/glossaryItemRoutes.js

const express = require('express');
const router  = express.Router();
const ctrl    = require('../controllers/glossaryItemController'); // Ensure this path and casing are correct
const { protect, admin } = require('../middleware/authMiddleware'); // Ensure this path is correct

// ----- Admin Routes (Protected) -----
// These routes are defined first to ensure they are matched before any generic /:param routes
router.post('/admin',                 protect, admin, ctrl.createGlossaryItem);
router.get ('/admin',                 protect, admin, ctrl.getAllGlossaryItemsForAdmin);
router.get ('/admin/:id',             protect, admin, ctrl.getGlossaryItemByIdForAdmin);
router.put ('/admin/:id',             protect, admin, ctrl.updateGlossaryItem);
router.delete('/admin/:id',           protect, admin, ctrl.deleteGlossaryItem);

// ----- Public Routes -----
router.get('/',                       ctrl.getAllGlossaryItems);
// router.get('/term/:term',          ctrl.getGlossaryItemByTerm); 

module.exports = router;
