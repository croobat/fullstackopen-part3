const mongoose = require('mongoose');

mongoose.set('strictQuery', false);

const url = process.env.MONGODB_URI;

mongoose
  .connect(url)
  .then(() => {
    console.log('connected to MongoDB');
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message);
  });

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 3,
    required: true,
  },
  number: {
    type: String,
    minlength: 8,
    required: true,
    validate: {
      validator: (v) => {
        // check if has one and only one dash
        if (v.split('-').length !== 2) {
          return false;
        }

        // check if the rest of the string is only numbers
        const numbersWithoutDash = v.split('-').join('');
        if (isNaN(numbersWithoutDash)) {
          return false;
        }

        // check if there are only 2-3 numbers before dash
        const numbersBeforeDash = v.split('-')[0];
        if (numbersBeforeDash.length < 2 || numbersBeforeDash.length > 3) {
          return false;
        }
      },
      message: (props) => `${props.value} is not a valid phone number!`,
    },
  },
});

personSchema.set('toJSON', {
  transform: (_, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model('Person', personSchema);
