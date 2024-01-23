const express = require('express');

const router = express.Router();

const eventController = require('../controllers/eventsController');

//const { auth } = require('../middleware/auth');


router.get('/getEvent', eventController.getEvents);
router.delete('/deleteEvent', eventController.deleteEvent);
router.post('/getAllEvents', eventController.getAllEvents);
router.post('/getAllEventsById', eventController.getAllEventsById);
router.post('/getEventsById', eventController.getEventById);
router.post('/getCategoryByName', eventController.getCategoryByName);
router.post('/newEvent', eventController.newEvent);
router.put('/updateEvent', eventController.editEvent);


module.exports = router;