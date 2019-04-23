const express = require("express");
const models = require("./models");
const app = express();
const mongoose = require('mongoose');
const dbUrl = "mongodb://branch:branch1@ds145456.mlab.com:45456/branch-chat-app";
const bodyParser = require('body-parser');
const http = require('http').Server(app);
const io = require('socket.io')(http);
const Message = mongoose.model('Message',
{
  message: String,
  answer: String,
  customerName: String,
  agentName: String,
  urgent:Boolean,
  createdOn: Date,
  answeredOn: Date,
});


app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
  });

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.get('/messages', (req, res) => {
	Message.find({}, (err, messages) => {
		res.send(messages);
	});
})

app.post('/answer', (req, res) => {
  try{
    Message.findById(req.body._id, function (err, msg) {
      if (err) sendStatus(500);
      msg.answer = req.body.answer;
      msg.agentName = req.body.agentName;
      msg.answeredOn = new Date();
      msg.save((err) => {
        if (err) sendStatus(500);
        io.emit('answer', msg);
        res.sendStatus(200);
      });

    });
  }catch(error){
    console.log(error);
  }
})

app.post('/message', (req, res) => {
	const message = new Message(req.body);
	message.save((err) => {
		if (err) sendStatus(500);

		io.emit('message', message);
		res.sendStatus(200);

	})
});

io.on('connection', () => {
	console.log('a user is connected');
})

io.on('error', (error) => {});

mongoose.connect(dbUrl, (err) => {
	console.log('mongodb connected', err);
});

const server = http.listen(3001, () => {
  console.log('Server is running on port', server.address().port);
});


app.use(express.static(__dirname));
