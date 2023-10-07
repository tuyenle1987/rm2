let limit = 10;
// let limit = 1;
let offset = 9999;

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

async function process_company_data(company) {
  const logoUrl = company.logoImage ? company.logoImage.endpoint + '/' + company.logoImage.uri + '_thumb.' + company.logoImage.ext : null;
  let logo = logoUrl;

  return {
    name: company.name,
    slug: company.slug,
    description: company.description,
    logo,
    stage: company.stage,
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

async function process_reviewer_data(company) {
  const reviewers = [];

  for (i = 0; i < company.nodes.length; i++) {
    const reviewer = company.nodes[i];
    const position = reviewer?.node?.position;

    const imageUrl = position && position.profileImage ? position.profileImage.endpoint + '/' + position.profileImage.uri + '_thumb.' + position.profileImage.ext : null;
    let image = imageUrl;

    reviewers.push({
      name: position?.fullName,
      theorgSlug: position?.slug,
      email: null,
      image,
      company: company.name,
      title: position?.role,
      description: position?.description,
      linkedin: position?.social?.linkedInUrl,
      status: 'approved',
    });
  };

  return reviewers;
}

(async function () {

try {

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
  for(let i = 0; i < 100; i++) {
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
    const data = json.data?.exploreCompaniesV2?.results;
    if (data.length === 0) {
      throw 'no data';
    }

    const companies = [];

    for (let i = 0; i < data.length; i++) {
      const company = data[i];
      const companyData = await process_company_data(company);
      companies.push(companyData);
    }
    // console.log('companies', companies);
    await post_company_data(companies);

    let reviewers = [];
    for (let j = 0; j < data.length; j++) {
      const company = data[j];
      const reviewersData = await process_reviewer_data(company);
      reviewers = reviewers.concat(reviewersData);
    }
    // console.log('reviewers', reviewers);
    await post_reviewers_data(reviewers);

    offset = offset + 10;
  }

} catch(err) {
  throw err;
  alert(err);
}

})();
