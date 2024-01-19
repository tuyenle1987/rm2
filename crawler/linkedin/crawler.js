let name = document.getElementsByTagName('h1')[0].innerText.trim();
let linkedin = window.location.href;
let image = document.getElementsByClassName('evi-image')[0].getAttribute('src');
let exps = [];


let items = document.getElementsByClassName('pvs-list')[0].getElementsByClassName('artdeco-list__item');

for (let i = 0; i< items.length; i++) {
  let elems = items[i];
  let elems_ = elems.getElementsByClassName('display-flex');
  console.log(elems_[4]);
  let title = elems_[4].children[0].innerText.split('\n')[0];
  let company = elems_[4].children[1].innerText.split('\n')[0].replace(' · Full-time', '');
  let date = elems_[4].children[2].innerText.split('\n')[0];
  exps.push({ title, company, date });
}

console.log(exps);

let works = [];
let companies = [];
exps.forEach((exp, index) => {
  let startDate = new Date('01 ' + exp.date.split('·')[0].split('-')[0]);
  let endDate = new Date('01 ' + exp.date.split('·')[0].split('-')[1]);

  companies.push({
    name: exp.company,
    startDate,
    endDate,
  });

  works.push({
    name: exp.title,
    startDate,
    isCurrent: index === 0,
  })
})


let json =
{
  "company": exps[0].company,
  "name": name,
  "createdOn": new Date(),
  "email": null,
  "image": image,
  "linkedin": linkedin,
  "status": "approved",
  "title": exps[0].title,
  "updatedOn": new Date(),
  "theorgId": '',
  "theorgSlug": '',
  "companyHistory": companies,
  "workHistory": works
};
console.log(JSON.stringify(json));
