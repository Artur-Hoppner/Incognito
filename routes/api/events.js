const express = require('express');
const router = express.Router();
const Events = require('../../model/Events');

//*********************************************/
//*** Register Events: api/events/register ***/
//*******************************************/
router.post('/register', async (req, res) => {
  let { name, place, date, typeOfEvent, createdBy } = req.body;
  if (
    name == '' ||
    place == '' ||
    date == '' ||
    typeOfEvent == '' ||
    createdBy == ''
  ) {
    return res.status(400).json({
      msg: 'Please fill data all requred data.',
    });
  }
  console.log('else starts');
  await Events.findOne({ name: name }).then((envents) => {
    if (envents && !res.headersSent) {
      return res.status(400).json({
        msg: 'Name is already taken.',
      });
    }
  });
  if (!res.headersSent) {
    let newEvent = Events({
      name,
      place,
      date,
      typeOfEvent,
      createdBy,
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

//**********************************/
//*** Create a add review route ***/
//********************************/
router.post('/review', async (req, res) => {
  console.log(req.body);
  let { place, date, typeOfEvent, createdBy } = req.body;

  if (
    name == '' ||
    place == '' ||
    date == '' ||
    typeOfEvent == '' ||
    createdBy == ''
  ) {
    return res.status(400).json({
      msg: 'Please fill data all requred data.',
    });
  }
  console.log('else starts');
  await Events.findOne({ name: name }).then((envents) => {
    if (envents && !res.headersSent) {
      return res.status(400).json({
        msg: 'Name is already taken.',
      });
    }
  });

  if (!res.headersSent) {
    let newEvent = Events({
      name,
      place,
      date,
      typeOfEvent,
      createdBy,
    });

    newEvent.save().then((event) => {
      return res.status(201).json({
        success: true,
        msg: 'New event is now registered.',
      });
    });
  }
});
//******************************************/
//*** Create a attending to event route ***/
//****************************************/
router.post('/attending', async (req, res) => {
  console.log(req.body);
  const username = req.body.username;
  const enevtId = req.body.value;
  try {
    await Events.updateOne(
      { _id: enevtId },
      { $push: { participant: [username] } }
    );
    const event = await Events.findById({ _id: enevtId });
    console.log(event);
    return res.status(200).json({
      msg: `Participating to event ${event.name}`,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      msg: 'Something went wrong.',
    });
  }
});
module.exports = router;
