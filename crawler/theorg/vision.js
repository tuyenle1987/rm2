// https://vision.theorg.com/org/applied-intuition
const data = {
  "AL": "Alabama",
  "AK": "Alaska",
  "AS": "American Samoa",
  "AZ": "Arizona",
  "AR": "Arkansas",
  "CA": "California",
  "CO": "Colorado",
  "CT": "Connecticut",
  "DE": "Delaware",
  "DC": "District Of Columbia",
  "FM": "Federated States Of Micronesia",
  "FL": "Florida",
  "GA": "Georgia",
  "GU": "Guam",
  "HI": "Hawaii",
  "ID": "Idaho",
  "IL": "Illinois",
  "IN": "Indiana",
  "IA": "Iowa",
  "KS": "Kansas",
  "KY": "Kentucky",
  "LA": "Louisiana",
  "ME": "Maine",
  "MH": "Marshall Islands",
  "MD": "Maryland",
  "MA": "Massachusetts",
  "MI": "Michigan",
  "MN": "Minnesota",
  "MS": "Mississippi",
  "MO": "Missouri",
  "MT": "Montana",
  "NE": "Nebraska",
  "NV": "Nevada",
  "NH": "New Hampshire",
  "NJ": "New Jersey",
  "NM": "New Mexico",
  "NY": "New York",
  "NC": "North Carolina",
  "ND": "North Dakota",
  "MP": "Northern Mariana Islands",
  "OH": "Ohio",
  "OK": "Oklahoma",
  "OR": "Oregon",
  "PW": "Palau",
  "PA": "Pennsylvania",
  "PR": "Puerto Rico",
  "RI": "Rhode Island",
  "SC": "South Carolina",
  "SD": "South Dakota",
  "TN": "Tennessee",
  "TX": "Texas",
  "UT": "Utah",
  "VT": "Vermont",
  "VI": "Virgin Islands",
  "VA": "Virginia",
  "WA": "Washington",
  "WV": "West Virginia",
  "WI": "Wisconsin",
  "WY": "Wyoming"
};

// ca fl ny tx
const countries = [
  'al', 'ak', 'as', 'az', 'ar', 'ca', 'co', 'ct', 'de', 'dc',
  'fm', 'fl', 'ga', 'gu', 'hi', 'id', 'il', 'in', 'ia', 'ks', 'ky',
  'la', 'me', 'mh', 'md', 'ma', 'mi', 'mn', 'ms', 'mo', 'mt', 'ne',
  'nv', 'nh', 'nj', 'nm', 'ny', 'nc', 'nd', 'mp', 'oh', 'ok', 'or',
  'pw', 'pa', 'pr', 'ri', 'sc', 'sd', 'tn', 'tx', 'ut', 'vt', 'vi',
  'va', 'wa', 'wv', 'wi', 'wy',
];

let currState = 'ut';
const bearer = 'Bearer 6e9f7220-a034-40ff-9f0a-11fea3e2d624';
let limit = 50;
let offset = 0;

const getGQL = async(url, body) => {
  return await fetch(
    url,
    {
      method: 'post',
      body,
      mode: 'cors',
      credentials: "include",
      headers: {
        'Content-Type': 'application/json',
        'X-Auth-Token': bearer,
      },
    }
  );
};

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
};

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
};

function process_company_data(company) {
  const logoUrl = company.logoImage ? company.logoImage.endpoint + '/' + company.logoImage.uri + '_thumb.' + company.logoImage.ext : null;
  let logo = logoUrl;

  return {
    name: company.name,
    description: company.description,
    logo,
    theorgId: company?.companyId,
    theorgSlug: company.slug,
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
};

function process_reviewer_data(company) {
  const reviewers = [];

  for (i = 0; i < company.nodes.length; i++) {
    const reviewer = company.nodes[i];
    const position = reviewer?.node?.position;

    const imageUrl = position && position.profileImage ? position.profileImage.endpoint + '/' + position.profileImage.uri + '_thumb.' + position.profileImage.ext : null;
    let image = imageUrl;

    reviewers.push({
      name: position?.fullName,
      email: null,
      slug: position?.slug,
      image,
      theorgId: position?.id,
      theorgSlug: position?.slug,
      company: company.name,
      title: position?.role,
      description: position?.description,
      linkedin: position?.social?.linkedInUrl,
      status: 'approved',
    });
  };

  return reviewers;
};

const getCompaniesSlug = () => JSON.stringify({
  query: `
    query prospectingCompanies($filter: ProspectingFilter!, $offset: Int!, $limit: Int!) {
      prospecting(filter: $filter, offset: $offset, limit: $limit) {
        companies {
          results {
            ...ProspectingCompany
            __typename
          }
          __typename
        }
        __typename
      }
    }

    fragment ProspectingCompany on Company {
      companyId
      slug
      __typename
    }
  `,
  operationName: 'prospectingCompanies',
  variables: {
    filter: {
      employeeRanges: [],
      companyIds: [],
      industryTagIds: [],
      locations: [
        {country: "US", state: currState}
      ],
      departments: [],
      latestFundingStages: [],
      orgChartLevels: [],
      hiredWithinDays: null,
      keywords: [],
      previousCompanyIds: [],
      personFullNames: []
    },
    limit, offset,
  }
});



const getCompaniesNodes = (company) => {
return JSON.stringify({
  query: `
    query companyWithNodes($slug: String!) {
      company(slug: $slug) {
        ...CompanyWithNodes
        __typename
      }
    }


    fragment CompanyWithNodes on Company {
      ...FullCompany
      nodes {
        ...PositionNode
        __typename
      }
      __typename
    }

    fragment FullCompany on Company {
      id
      name
      slug
      extensions
      logoImage {
        ...ImageFragment
        __typename
      }
      social {
        ...CompanySocialFragment
        __typename
      }
      location {
        ...CompanyLocation
        __typename
      }
      description
      type
      industry
      status
      private
      teams {
        id
        __typename
      }
      meta {
        ...MetaFragment
        __typename
      }
      stats {
        ...CompanyStats
        __typename
      }
      verification {
        verificationType
        __typename
      }
      adminLocked
      stage
      companyValues {
        ...CompanyValue
        __typename
      }
      imageGallery {
        ...ImageFragment
        __typename
      }
      testimonials {
        ...CompanyTestimonialConnection
        __typename
      }
      industries {
        ...CompanyIndustryFragment
        __typename
      }
      lastUpdate
      permissionSettings {
        companyId
        restrictMembersFromEditing
        __typename
      }
      lastVerificationRequest {
        request {
          requestState
          requester
          __typename
        }
        __typename
      }
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

    fragment CompanySocialFragment on CompanySocial {
      twitterUrl
      linkedInUrl
      facebookUrl
      websiteUrl
      __typename
    }

    fragment CompanyLocation on CompanyLocation {
      id
      street
      postalCode
      city
      subLocality
      country
      countryIso
      state
      locationString
      isPrimary
      __typename
    }

    fragment MetaFragment on CompanyMeta {
      noIndex
      importanceScore
      tags
      __typename
    }

    fragment CompanyStats on CompanyStats {
      tags
      employeeRange
      followerCount
      positionCount
      jobsCount
      teamsCount
      announcementsCount
      promptDismissals
      latestFundingRound {
        id
        fundingType
        __typename
      }
      __typename
    }

    fragment CompanyValue on CompanyValue {
      id
      value
      description
      __typename
    }

    fragment CompanyTestimonialConnection on CompanyTestimonialConnection {
      testimonial {
        id
        question
        answer
        __typename
      }
      position {
        id
        slug
        fullName
        profileImage {
          ...ImageFragment
          __typename
        }
        role
        parentPositionId
        isAdviser
        lastUpdate
        __typename
      }
      __typename
    }

    fragment CompanyIndustryFragment on CompanyTag {
      id
      title
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
            manager {
              ... on ChartNodeGroup {
                positions {
                  ... on PositionOrgChartPosition {
                    positionId
                    fullName
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
              ... on ChartNodeSingular {
                positionId
                position {
                  ... on PositionOrgChartPosition {
                    profileImage {
                      ...ImageFragment
                      __typename
                    }
                    fullName
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
        ... on Position {
          position {
            id
            fullName
            role
            slug
            social {
              linkedInUrl
              websiteUrl
              twitterUrl
              linkedInUrl
              facebookUrl
              __typename
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
    }`,
    operationName : "companyWithNodes",
    variables: {
      slug: company,
    },
  });
}


(async() => {
try {
  for (let j = 0; j < 100000; j++) {

    const companiesResp = await getGQL('https://api.vision.theorg.com/graphql', getCompaniesSlug());
    const jsonCompaniesResp = await companiesResp.json();
    const companies = jsonCompaniesResp.data.prospecting.companies.results.map(company => company.slug);

    if (companies.length === 0) {
      throw "no data";
    }

    let data = [];
    for (let i = 0; i < companies.length; i++) {
      const company = companies[i];
      const reviewersResp = await getGQL('https://prod-graphql-api.theorg.com/graphql', getCompaniesNodes(company));
      const jsonReviewersResp = await reviewersResp.json();
      data.push(jsonReviewersResp.data.company);
    }

    let reviewersData = [];
    let companiesData = [];
    data.forEach(item => {
      companiesData.push(process_company_data(item));
      const reviewerDataBatch = process_reviewer_data(item);
      reviewersData = reviewersData.concat(reviewerDataBatch);
    });
    await post_company_data(companiesData);
    await post_reviewers_data(reviewersData);

    offset = offset + 50;
    console.log(offset, '===============');
  }
} catch(err) {
  alert(offset);
  console.error(err);
}
})()
