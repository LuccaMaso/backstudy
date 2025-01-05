const mongoose = require("mongoose");

const url = process.env.MONGODB_URI;

mongoose.set("strictQuery", false);

mongoose
  .connect(url)
  .then((result) => console.log("Connected to DB"))
  .catch((error) => console.log("Couldn't connect to DB:", error.message));

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true,
  },
  number: {
    type: String,
    required: true,
    validate: {
      validator: function (number) {
        return (
          /^[0-9]{2}-[0-9]{6}[0-9]*$/.test(number) ||
          /^[0-9]{3}-[0-9]{5}[0-9]*$/.test(number)
        );
      },
    },
  },
});

personSchema.set("toJSON", {
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
  },
});

module.exports = mongoose.model("Person", personSchema);
