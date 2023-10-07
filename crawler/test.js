const fetch = require('node-fetch');



const bearer = 'Bearer 6e9f7220-a034-40ff-9f0a-11fea3e2d624';

const getData = () => JSON.stringify({
  query: `
query workHistory($id: Int!) {
  position(id: $id) {
    id
    previousCompanies {
      id
      company {
        companyId
        slug
        logoImage {
          ...Image
          __typename
        }
        __typename
      }
      companyName
      startDate
      endDate
      __typename
    }
    roleTimeline {
      ...PositionRole
      __typename
    }
    __typename
  }
}

fragment Image on Image {
  uri
  extensions
  versions
  endpoint
  ext
  __typename
}

fragment PositionRole on PositionRole {
  role
  startDate
  current
  __typename
}
  `,
variables: { id: 1241554 },
operationName: 'workHistory',
});


(async() => {
    const response = await fetch(
    'https://api.vision.theorg.com/graphql',
      {
        method: 'post',
        body: getData(),
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          'X-Auth-Token': bearer,
          'Accept': '*/*',
          'Accept-Encoding': 'gzip, deflate, br',
          'Accept-Language': 'en-US,en;q=0.9,nl;q=0.8,vi;q=0.7',
          'Cache-Control': 'no-cache',
          'Content-Length': '682',
          'Content-Type': 'application/json',
          'Origin': 'https://vision.theorg.com',
          'Pragma': 'no-cache',
          'Referer': 'https://vision.theorg.com/',
          'Sec-Ch-Ua': '"Chromium";v="116", "Not)A;Brand";v="24", "Google Chrome";v="116"',
          'Sec-Ch-Ua-Mobile': '?0',
          'Sec-Ch-Ua-Platform': '"macOS"',
          'Sec-Fetch-Dest': 'empty',
          'Sec-Fetch-Mode': 'cors',
          'Sec-Fetch-Site': 'same-site',
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36',
        },
      }
    );

    const json = await response.json();

    console.log(JSON.stringify(json, null, 3));
})()


