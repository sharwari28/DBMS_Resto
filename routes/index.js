const express = require('express');
const router = express.Router();
const passport = require('passport');
const homeController = require('../controllers/home_controller');

console.log('router loaded');

router.get('/', homeController.signin);
router.get('/add', homeController.add);
router.post('/create', homeController.create);
router.post('/edit/:id',passport.checkAuthentication, homeController.edit);
router.post('/create-session', passport.authenticate(
    'local',
    {failureRedirect: '/'},
), homeController.createSession);
router.get('/sign-out', homeController.destroySession);
router.get('/dashboard', passport.checkAuthentication, homeController.dashboard);
router.get('/manage', passport.checkAuthentication, homeController.manage);
router.get('/add-order', passport.checkAuthentication, homeController.addorder);
router.get('/view-order', passport.checkAuthentication, homeController.vieworder);
router.post('/add-item', homeController.additem);
router.get('/delete-item/:id', homeController.deleteitem);
router.post('/add-employee', homeController.addemployee);
router.post('/add-customer', homeController.addcustomer);
router.post('/place-order', homeController.placeorder);
router.get('/delete-employee/:id', homeController.deleteemployee);
router.get('*',(req,res)=>{
    res.status(404).send('Page not found');
});

module.exports = router;