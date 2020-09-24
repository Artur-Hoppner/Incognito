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
router.post('/commentingevent', async (req, res) => {
  console.log(req.body);
  const userName = req.body.userName;
  const newComment = req.body.comment;
  const eventId = req.body.eventId;
  const event = await Events.findById({ _id: eventId });

  try {
    await Events.updateOne(
      { _id: eventId },
      { $push: { comments: [{ userName, newComment }] } }
    );
    return res.status(200).json({
      msg: `Comment added to event: ${event.name}`,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      msg: 'Something went wrong.',
    });
  }
});

//******************************************/
//*** Create a attending to event route ***/
//****************************************/
router.post('/attending', async (req, res) => {
  try {
    console.log(req.body);
    const userName = req.body.userName;
    const eventId = req.body.eventId;
    const event = await Events.findById({ _id: eventId });
    const matchUser = event.participant.filter((participant) => {
      return participant == userName;
    });
    if (matchUser[0] == userName) {
      await Events.updateOne(
        { _id: eventId },
        { $pullAll: { participant: [userName] } }
      );

      console.log('if match', event.participant);
      return res.status(200).json({
        msg: `Dont participating to event ${event.name}`,
      });
    } else {
      await Events.updateOne(
        { _id: eventId },
        { $push: { participant: [userName] } }
      );
      console.log('dont match', event.participant);
      return res.status(200).json({
        msg: `Participating to event ${event.name}`,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      msg: 'Something went wrong.',
    });
  }
});

//******************************************/
//*** Create a like event route ***/
//****************************************/
router.post('/like', async (req, res) => {
  try {
    console.log(req.body);
    const userName = req.body.userName;
    const eventId = req.body.eventId;
    const event = await Events.findById({ _id: eventId });
    const matchUser = event.likes.filter((likes) => {
      return likes == userName;
    });
    if (matchUser[0] == userName) {
      await Events.updateOne(
        { _id: eventId },
        { $pullAll: { likes: [userName] } }
      );

      console.log('if match', event.likes);
      return res.status(200).json({
        msg: `Unlike event: ${event.name}`,
      });
    } else {
      await Events.updateOne(
        { _id: eventId },
        { $push: { likes: [userName] } }
      );
      console.log('dont match', event.participant);
      return res.status(200).json({
        msg: `Like Event ${event.name}`,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      msg: 'Something went wrong.',
    });
  }
});
module.exports = router;
