const mongoose = require("mongoose");
const express = require("express");
var cors = require('cors');
const bodyParser = require("body-parser");
const logger = require("morgan");
const Data = require("./data");

const API_PORT = 3001
const app = express()
app.use(cors());
const router = express.Router();

// Mongo DB
const dbRoute = "mongodb+srv://synsyn13:testpassword4321@cluster0-lbuul.mongodb.net/test?retryWrites=true";

//connects our backend with the db
mongoose.connect(
	dbRoute,
	{ useNewUrlParser:true }
);

let db = mongoose.connection;

db.once("open", () => console.log("connected to the database"));

// checks if connection with the database is successful
db.on("error", console.error.bind(console, "MongoDB connection error:"));


// parses the request body to be a readable json format
app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());
app.use(logger("dev"));

// GET method
router.get("/getData", (req, res) => {
	Data.find((err, data) => {
		if (err) return res.json({ success: false, error: err });
		return res.json({success: true, data:data });
	});
});

// Update method 
router.post("/updateData", (req, res) => {
	const { id, update } = req.body;
	Data.findOneAndUpdate(id, update, err => {
		if (err) return res.json({ success: false, error: err });
		return res.json({success:true});
	});
});

// Delete method 
router.delete("/deleteData", (req, res) => {
	const {id} = req.body;
	Data.findOneAndDelete(id, err => {
		if (err) return res.send(err);
		return res.json({success: true});
	});
});

// Create method
router.post("/putData", (req, res) => {
  let data = new Data();

  const { id, message } = req.body;

  if ((!id && id !== 0) || !message) {
    return res.json({
      success: false,
      error: "INVALID INPUTS"
    });
  }
  data.message = message;
  data.id = id;
  data.save(err => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true });
  });
});

// append /api for our http requests
app.use("/api", router);

// launch our backend into a port
app.listen(API_PORT, () => console.log(`LISTENING ON PORT ${API_PORT}`));
