const MONGO_URL='mongodb+srv://rm2:@cluster0.2t16jzq.mongodb.net/rm2';

const csv = require('csvtojson');
const MongoClient = require('mongodb').MongoClient;

const formData = require('form-data');
const Mailgun = require('mailgun.js');

const csvFilePath = '1.csv';
const databasename = 'rm2';
const url = process.env.MONGO_URL || MONGO_URL;


const API_KEY = '2205319cc7b24a191ea11d7af4e4f2dd-69a6bd85-c8f4aa4e';
const DOMAIN = 'underdogs.fyi';

const mailgun = new Mailgun(formData);
const client = mailgun.client({username: 'api', key: API_KEY});


(async () => {
	// get data from csv and insert into database
	const jsonArray=await csv().fromFile(csvFilePath);
	console.log(jsonArray);

	const data = jsonArray.map(item => ({
		email: item['Email'],
		name: item['field1'],
		title: item['field6'],
		location: item['field7'],
		linkedin: item['field5'],
	}))

	console.log(data);

	// MongoClient.connect(url).then((client) => {
	// 	const connect = client.db(databasename);
	// 	const collection = connect.collection('emails');
	// 	collection.updateMany(data);

	// 	console.log("Insertion Successful")
	// }).catch((err) => {
	// 	console.log(err);
	// });

data.forEach(item => {

if (item.email && item.email.length > 0) {


	// Send email
	const messageData = {
		// from: 'info@underdogs.fyi',
		from: 'Underdogs.fyi <contact@underdogs.fyi>',
		to: item.email,
		subject: item.name + '. We Value Your Important Feedback on Managers - Share Anonymously!',
		html: `
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Underdogs.fyi Invitation</title>
</head>
<body>

	<p>Hi ${item.name},</p>

	<p>Interested in shaping a better workplace? Underdogs.fyi invites you to anonymously <strong>REVIEW YOUR MANAGERS.</strong> Here’s how it’s safe and simple:</p>

	<ul>
		<li>Log in with a Google account for <strong>SECURITY</strong>.</li>
		<li>Leave an <strong>ANONYMOUS</strong> review.</li>
		<li>Help others with your <strong>HONEST</strong> feedback.</li>
	</ul>

	<p><strong>START NOW:</strong> <a href="https://www.underdogs.fyi">www.underdogs.fyi</a></p>

	<p>Your voice matters. Let's make a difference together.</p>

	<p>Best,</p>

	<img src="https://www.underdogs.fyi/logo.png" width="100"></img>
	<p><a href="https://www.underdogs.fyi">underdog.fyi Team</a></p>

	<p>Contact us at <a href="mailto:contact@underdogs.fyi">contact@underdogs.fyi</a></p>
</body>
</html>
		`,
	};

	console.log(messageData);

	client.messages.create(DOMAIN, messageData)
	.then((res) => {
		console.log(res);
	})
	.catch((err) => {
		console.error(err);
	});

}


})


})();

