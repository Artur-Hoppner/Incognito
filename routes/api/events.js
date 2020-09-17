const express = require('express');
const router = express.Router();
const Events = require('../../model/Events');

//******************************************/
//*** Register Events: api/events/login ***/
//****************************************/
router.post('/register', async (req, res) => {
  let { name, place } = req.body;

  await Events.findOne({ name: name }).then((envents) => {
    if (envents && !res.headersSent) {
      return res.status(400).json({
        msg: 'enventname is already taken.',
      });
    }
  });
  if (!res.headersSent) {
    let newEvent = Events({
      name,
      place,
    });

    newEvent.save().then((event) => {
      return res.status(201).json({
        success: true,
        msg: 'New event is now registered.',
      });
    });
  }
});

//***************************************/
//*** Get all Events: api/events/all ***/
//*************************************/
router.get('/all', async (req, res) => {
  let allEvents = [];
  await Events.find().then((events) => {
    allEvents.push(events);
  });
  return res
    .status(200)
    .json({
      success: true,
      events: allEvents,
    })
    .end();
});

module.exports = router;
