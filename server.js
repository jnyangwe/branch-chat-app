const express = require("express");
import models, { sequelize } from './models';
const app = express();
const mongoose = require('mongoose');
const dbUrl = "mongodb://branch:branch1@ds145456.mlab.com:45456/branch-chat-app";
const bodyParser = require('body-parser');
const http = require('http').Server(app);
const io = require('socket.io')(http);
// d3OnM0N4KyIPrzK6
const Message = mongoose.model('Message', {name: String, message: String});

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
  });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.get('/messages', (req, res) => {
	Message.find({}, (err, messages) => {
		res.send(messages);
	});
})

app.post('/messages', (req, res) => {
	const message = new Message(req.body);
	message.save((err) => {
		if (err) sendStatus(500);

		io.emit('message', req.body);
		res.sendStatus(200);


	})
});

io.on('connection', () => {
	console.log('a user is connected');
})

mongoose.connect(dbUrl, (err) => {
	console.log('mongodb connected', err);
});

const eraseDatabaseOnSync = true;

sequelize.sync({force: eraseDatabaseOnSync }).then( async  => {
	const server = http.listen(3001, () => {
		console.log('Server is running on port', server.address().port);
	});
});




app.use(express.static(__dirname));
