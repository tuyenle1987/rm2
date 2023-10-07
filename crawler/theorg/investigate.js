

// {"operationName":"PositionsContactInfoResolve","variables":{"input":{"positionIds":[31190]}},"query":"mutation PositionsContactInfoResolve($input: PositionsContactInfoResolveInput!) {
//   positionsContactInfoResolve(input: $input) {
//     result {
//       positionId
//       emails {
//         ...ContactEmail
//         __typename
//       }
//       phoneNumbers {
//         string
//         __typename
//       }
//       __typename
//     }
//     __typename
//   }
// }

// fragment ContactEmail on ContactEmail {
//   email
//   emailType
//   validated
//   verification
//   __typename
// }
// "}



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


const response = await fetch(
  'https://api.vision.theorg.com/graphql',
  {
    method: 'post',
    body: getData(),
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
      'X-Auth-Token': bearer,
    },
  }
);

