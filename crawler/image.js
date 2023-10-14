const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const axios = require('axios');

const toDataURL = async (url) => {
  let image = await axios.get(url, {
    responseType: 'arraybuffer',
  });
  let returnedB64 = Buffer.from(image.data).toString('base64');
  return 'data:image/jpeg;base64,' + returnedB64;
}

(async () => {
  await mongoose.connect(process.env.MONGO_URL);
  const connection = mongoose.connection;
  const collection = connection.db.collection('companies');

  // let data = null;

  // while
  const data = await collection.find({ logo: { $regex : /^https:/ } }).limit(10).toArray();

  let upsertData = [];
  for (let i = 0; i < data.length; i++) {
    const company = data[i];

    const logo = company.logo;

    if (logo) {
      const logoData = await toDataURL(logo);
      company.logoUrl = company.logo;
      company.logo = logoData;
    }

    upsertData.push({
      updateOne: {
        filter: {
          _id: company._id
        },
        update: {
          $set: {
            logoUrl: company.logoUrl,
            logo: company.logo,
          },
        },
        upsert: false,
      },
    });
  }

  const result = await collection.bulkWrite(upsertData);
})();
