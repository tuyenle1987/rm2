const MONGO_URL='mongodb+srv://rm2:@cluster0.2t16jzq.mongodb.net/rm2';

const csv = require('csvtojson');
const MongoClient = require('mongodb').MongoClient;

const formData = require('form-data');
const Mailgun = require('mailgun.js');

const csvFilePath = '3.csv';
const databasename = 'rm2';
const url = process.env.MONGO_URL || MONGO_URL;


const API_KEY = '-4c955d28-c046672e';
const DOMAIN = '.mailgun.org';

const mailgun = new Mailgun(formData);
const client = mailgun.client({username: 'api', key: API_KEY});


(async () => {
	const jsonArray=await csv().fromFile(csvFilePath);
	console.log(jsonArray);

	const data = jsonArray.map(item => ({
		email: item['field11'],
		name: item['field2'] + ' ' + item['field3'],
		title: item['field6'],
		location: item['field7'],
		linkedin: item['field10'],
	}))

	console.log(data);

	// MongoClient.connect(url).then((client) => {
	// 	const connect = client.db(databasename);
	// 	const collection = connect.collection('emails');
	// 	collection.insertMany(data);

	// 	console.log("Insertion Successful")
	// }).catch((err) => {
	// 	console.log(err);
	// });






	// const messageData = {
	// 	from: 'info@underdogs.fyi',
	// 	to: 'dtuyen.le@gmail.com',
	// 	subject: 'Make sure your rollover funds are working for you!',
	// 	text: `
	// 	What are Alpha Waves?

	// 	In an Alpha state, we are awake and present, but physically and mentally relaxed. Between 8-13 Hz, Alpha waves provide an environment where we can be more susceptible to new ideas and open to more possibilities.

	// 	Where can I find Alpha Waves of NeoRhythm?

	// 	By using NeoRhythm's Advanced Mode, you can choose your preferred frequency, duration, intensity, and even coil positioning.

	// 	The more you know:

	// 	When athletes get “in the zone” they are in an Alpha state

	// 	When we admire someone’s charisma, it’s because they are fully present in the moment and most likely in the Alpha state
	// 	`,
	// };

	// client.messages.create(DOMAIN, messageData)
	// .then((res) => {
	// 	console.log(res);
	// })
	// .catch((err) => {
	// 	console.error(err);
	// });

})();

