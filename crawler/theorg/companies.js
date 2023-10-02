let limit = 400;
let offset = 1200;

async function post_company_data(companies) {
  await fetch(
    'http://localhost:3000/api/v1/company/bulk',
    {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(companies)
    }
  );
}

async function post_reviewers_data(reviewers) {
  await fetch(
    'http://localhost:3000/api/v1/reviewer/bulk',
    {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(reviewers)
    }
  );
}

function process_company_data(company) {
  return {
    name: company.name,
    description: company.description,
    logo: company.logoImage ? company.logoImage.endpoint + '/' + company.logoImage.uri + '_thumb.' + company.logoImage.ext : null,
    industry: company.industries ? company.industries.map(industry => industry.title).join(',') : null,
    website: company.social?.websiteUrl,
    linkedin: company.social?.linkedInUrl,
    facebook: company.social?.facebookUrl,
    twitter: company.social?.twitterUrl,
    size: company.stats?.employeeRange,
    headquarter: company.location ? company.location.city + ',' + company.location.state + ',' + company.location.country : null,
    status: 'approved',
  };
}

function process_reviewer_data(company) {
  const reviewers = company.nodes.map(reviewer => {
    const position = reviewer?.node?.position;
    console.log(position);
    return {
      name: position?.fullName,
      email: null,
      image: position && position.profileImage ? position.profileImage.endpoint + '/' + position.profileImage.uri + '_thumb.' + position.profileImage.ext : null,
      company: company.name,
      title: position?.role,
      description: position.description,
      linkedin: position?.social?.linkedInUrl,
      status: 'approved',
    };
  });
  return reviewers;
}

(async function () {
    const getData = () => JSON.stringify({
      query: `

query exploreCompaniesV2(
  $countries: [String!],
  $categories: [String!],
  $employeeRanges: [String!],
  $hasPublishedJobs: Boolean,
  $limit: Int!,
  $offset: Int!
) {
  exploreCompaniesV2(
    countries: $countries,
    categories: $categories,
    employeeRanges: $employeeRanges,
    hasPublishedJobs: $hasPublishedJobs,
    limit: $limit,
    offset: $offset
  ) {
    paging {
      ...Paging
      __typename
    }
    results {
      ...ExploreCompanyV2
      __typename
    }
    __typename
  }
}

fragment Paging on Paging {
  current
  limit
  next
  previous
  pages
  itemsPerPage
  range {
    start
    end
    __typename
  }
  total
  __typename
}

fragment ExploreCompanyV2 on Company {
  id
  slug
  name
  logoImage {
    ...ImageFragment
    __typename
  }
  verified
  description
  positions(limit: 4, offset: 0) {
    id
    profilePicture {
      ...ImageFragment
      __typename
    }
    __typename
  }
  stats {
    jobsCount
    positionCount
    latestFundingRound {
      id
      fundingType
      fundingName
      __typename
    }
    __typename
  }
  industries {
    id
    title
  }
  social {
    facebookUrl
    linkedInUrl
    twitterUrl
    websiteUrl
  }
  nodes {
    ...PositionNode
  }
  stats {
    employeeRange
  }
  location {
    ...ExploreLocationFragment
    __typename
  }
  jobs(limit: 1, offset: 0) {
    ...ExploreCompanyJobPost
    __typename
  }
  __typename
}


fragment PositionNode on OrgChartStructureNode {
  id
  title
  containingNodeId
  node {
    ... on Vacant {
      job {
        id
        slug
        title
        location {
          city
          state
          country
          __typename
        }
        atsProvider {
          provider
          __typename
        }
        createdOn
        jobFunction
        remote
        __typename
      }
      __typename
    }
    ... on Position {
      position {
        id
        fullName
        role
        description
        slug
        social {
          linkedInUrl
        }
        claimedBy
        profileImage {
          ...ImageFragment
          __typename
        }
        __typename
      }
      __typename
    }
    __typename
  }
  order
  parentId
  section
  type
  __typename
}

fragment ImageFragment on Image {
  endpoint
  ext
  prevailingColor
  uri
  versions
  __typename
}

fragment ExploreLocationFragment on CompanyLocation {
  id
  city
  country
  state
  __typename
}

fragment ExploreCompanyJobPost on JobPost {
  id
  slug
  title
  jobType
  location {
    ...ExploreLocationFragment
    __typename
  }
  associatedPosition {
    id
    manager {
      ... on ChartNodeGroup {
        positions {
          ... on PositionOrgChartPosition {
            positionId
            profileImage {
              ...ImageFragment
              __typename
            }
            fullName
            __typename
          }
          ... on VacantOrgChartPosition {
            jobPostId
            __typename
          }
          __typename
        }
        __typename
      }
      ... on ChartNodeSingular {
        position {
          ... on PositionOrgChartPosition {
            profileImage {
              ...ImageFragment
              __typename
            }
            fullName
            __typename
          }
          ... on VacantOrgChartPosition {
            jobTitle
            __typename
          }
          __typename
        }
        __typename
      }
      __typename
    }
    __typename
  }
  __typename
}


      `,
      variables: {
        limit, offset,
      }
    });



  // 1800
  for(let i = 0; i < 10; i++) {
    const response = await fetch(
        'https://prod-graphql-api.theorg.com/graphql',
        {
          method: 'post',
          body: getData(),
          mode: 'cors',
          headers: {
            'Content-Type': 'application/json',
          },
        }
    );

    const json = await response.json();

    const companies = json.data?.exploreCompaniesV2?.results.map(company => process_company_data(company));
    await post_company_data(companies);

    let reviewers = [];
    json.data?.exploreCompaniesV2?.results.forEach(company => {
      reviewers = reviewers.concat(process_reviewer_data(company));
    });
    await post_reviewers_data(reviewers);

    offset = offset + 400;
  }

})();
