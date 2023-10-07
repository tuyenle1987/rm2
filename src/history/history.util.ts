import fetch from 'node-fetch';

export const getQuery = (id) => JSON.stringify({
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
  variables: { id },
  operationName: 'workHistory',
});
