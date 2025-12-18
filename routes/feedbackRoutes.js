const express=require('express');
const router=express.Router();
const feedbackController=require('../controllers/feedbackController');
const userController=require('../controllers/userController');

router.route('/create').post(feedbackController.addfeedBack);
router.route('/getAll').post(userController.protection,feedbackController.getAllFeedbacks);


module.exports=router;