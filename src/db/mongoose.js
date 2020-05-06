const mongoose = require("mongoose");

mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: false,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});
