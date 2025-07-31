const mongoose = require('mongoose');
const Inquiry = require('./models/Inquiry');
const Appointment = require('./models/Appointment');
const Property = require('./models/Properties');

mongoose.connect('your_mongodb_connection_string')
  .then(async () => {
    await Inquiry.deleteMany({});
    await Appointment.deleteMany({});
    await Property.deleteMany({});
    console.log('All data deleted');
    process.exit();
  });