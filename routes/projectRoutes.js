const express=require('express');
const router=express.Router();
const projectController=require('../controllers/projectController');
const userController=require('../controllers/userController');

router.route('/create').post(userController.protection,projectController.createProject);
router.route('/getAll').post(userController.protection,projectController.getAllProjects);
router.route('/get').post(userController.protection,projectController.getSingleProject);


module.exports=router;