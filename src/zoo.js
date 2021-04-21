/*
eslint no-unused-vars: [
  "error",
  {
    "args": "none",
    "vars": "local",
    "varsIgnorePattern": "data"
  }
]
*/

const data = require('./data');

const { animals } = data;
const { employees } = data;
const { prices } = data;
const { hours } = data;

// Requirement 1
function animalsByIds(...ids) {
  // seu código aqui
  return ids.map((id) => animals.find((animal) => animal.id === id));
}

// Requirement 2
function animalsOlderThan(animal, age) {
  // seu código aqui
  return animals.find((specie) => specie.name === animal).residents
    .map((resident) => resident.age > age)
    .reduce((_, curr) => curr);
}
// const specie = 'otters';
// animalsOlderThan(specie, 7);

// Requirement 3
function employeeByName(employeeName) {
  // seu código aqui
  // let obj = {};
  const searchEmployee = employees.find((employee) =>
    (employee.firstName === employeeName)
    || (employee.lastName === employeeName));
  // console.log(searchEmployee);

  return searchEmployee || {};
}
// const emp = 'Wishart';
// console.log(employeeByName(emp));

// Requirement 4
function createEmployee(personalInfo, associatedWith) {
  // seu código aqui
  return Object.assign(personalInfo, associatedWith);
}
// const info = {
//   id: '7ed1c9bb-8570-44f6-b718-0666b869573a',
//   firstName: 'John',
//   lastName: 'Doe',
// };

// const ass = {
//   managers: [
//     'c5b83cb3-a451-49e2-ac45-ff3f54fbe7e1',
//     '9e7d4524-363c-416a-8759-8aa7e50c0992',
//   ],
//   responsibleFor: [
//     '0938aa23-f153-4937-9f88-4858b24d6bce',
//     '89be95b3-47e4-4c5b-b687-1fabf2afa274',
//     'bb2a76d8-5fe3-4d03-84b7-dba9cfc048b5',
//   ],
// };
// console.log(createEmployee(info, ass));

// Requirement 5
function isManager(id) {
  // seu código aqui
  return employees.some((employee) => employee.managers
    .some((manager) => manager === id)); // I took this simplified syntax from @gmcerqueira's repository
}

// Requirement 6
function addEmployee(id, firstName, lastName, managers = [], responsibleFor = []) {
  // seu código aqui
  return data.employees.push({
    id,
    firstName,
    lastName,
    managers,
    responsibleFor,
  });
}

// addEmployee('4141da1c-a6ed-4cf7-90c4-99c657ba4ef3', 'Jane', 'Doe',
//   [
//     '546fe3d4-2d81-4bb4-83a7-92d5b7048d17',
//     'a67a36ee-3765-4c74-8e0f-13f881f6588a',
//   ],
//   [
//     'ee6139bf-b526-4653-9e1e-1ca128d0ad2e',
//     '210fcd23-aa7b-4975-91b7-0230ebb27b99',
//   ]);

// Requirement 7
function animalCount(species) {
  // seu código aqui
  const amount = {};
  if (species) {
    const obj = animals.find((specie) => specie.name === species);
    amount[species] = obj.residents.length;
  } else {
    animals.forEach((ani) => {
      amount[ani.name] = ani.residents.length;
    });
  }
  // console.log(amount);

  return species ? amount[species] : amount;
}
// console.log(animalCount('lions'));
// console.log(animalCount());

// Requirement 8
function entryCalculator(entrants) {
  // seu código aqui
  if (!entrants || entrants === {}) return 0;
  const totalValue = Object.keys(entrants).reduce((acc, curr) => (
    acc + (entrants[curr] * prices[curr])
    // access the object value by using obj[varWithPropertyName] sintax
    // and multiplies entrants{} value by prices{} value
  ), 0);
  // console.log(totalValue);
  return totalValue;
}
// const people = { 'Adult': 1 };
// entryCalculator(people);

// Requirement 9
// I took this ideia from https://stackoverflow.com/questions/33381583/how-to-add-many-values-to-one-key-in-javascript-object/33382321
function getLocation() {
  const locations = {};
  animals.forEach((animal) => {
    locations[animal.location] = [];
  });

  return locations;
}

function getAnimalSpecies() {
  const locations = getLocation();
  animals.map((animal) => locations[animal.location].push(animal.name));

  return locations;
}

function getAnimalNames(animalName, sorted, sex) {
  let nameArray = animals.find((animal) => (
    animal.name === animalName
  )).residents.map((resident) => resident.name);

  if (sex) {
    nameArray = animals.find((animal) => (
      animal.name === animalName
    )).residents.filter((resident) => (
      resident.sex === sex
    )).map((resident) => resident.name);
  }

  if (sorted) {
    nameArray.sort();
  }

  return nameArray;
}

function animalWithNames({ sorted = false, sex = false }) {
  const locations = getLocation();

  animals.map((animal) => locations[animal.location].push({
    [animal.name]: getAnimalNames(animal.name, sorted, sex),
  }));

  return locations;
}
// const f = animalWithNames();
// console.log(f);

function animalMap(options = false) {
  // seu código aqui

  if (options.includeNames) return animalWithNames(options);

  return getAnimalSpecies();
}
// const options = { includeNames: true };
// console.log(animalMap(options));

// Requirement 10
// I took this convertion function from https://stackoverflow.com/questions/13898423/javascript-convert-24-hour-time-of-day-string-to-12-hour-time-with-am-pm-and-no
const convertHour = (time24) => {
  const period = +time24 < 12 ? 'am' : 'pm';
  const hour = +time24 % 12 || 12;

  return `${hour}${period}`;
};
// console.log(convertFrom24To12Format(18));

function setDisplay(day) {
  const times = Object.values(hours[day]);
  return `Open from ${convertHour(times[0])} until ${convertHour(times[1])}`;
}

function schedule(dayName) {
  // seu código aqui
  const obj = {};

  if (!dayName) {
    const days = Object.keys(hours);
    days.forEach((day) => {
      obj[day] = (day !== 'Monday') ? setDisplay(day) : 'CLOSED';
    });
    return obj;
  }

  obj[dayName] = (dayName !== 'Monday') ? setDisplay(dayName) : 'CLOSED';

  return obj;
}

// Requirement 11
const getEmployee = (id) => employees.find((worker) => worker.id === id);

const getFirstAnimal = (firstAnimal) => animals.filter((animal) => (
  (firstAnimal.includes(animal.id)) // Wolf helped me with this includes thing
));

const getOlder = (older, curr) => (older.age < curr.age ? curr : older);

function oldestResident(residents) {
  return residents.reduce(getOlder, residents[0]);
}

function oldestFromFirstSpecies(id) {
  // seu código aqui
  const employee = getEmployee(id);
  const { responsibleFor } = employee;
  const residents = getFirstAnimal(responsibleFor[0]);

  return Object.values(oldestResident(residents[0].residents));
}
// const id1 = '9e7d4524-363c-416a-8759-8aa7e50c0992';
// const id2 = '4b40a139-d4dc-4f09-822d-ec25e819a5ad';
// console.log(oldestFromFirstSpecies(id1));

// Requirement 12
// const { Adult, Senior, Child } = prices;
function increasePrices(percentage) {
  // seu código aqui
  Object.keys(prices).forEach((key) => {
    prices[key] = Math.ceil(prices[key] * (100 + percentage)) / 100;
  });
}
// increasePrices(50);
// console.log(prices);

// Requirement 13
function findAnimals(employee) {
  const animalNames = [];
  employee.responsibleFor.forEach((id) => {
    animalNames.push(animals.find((animal) => (animal.id === id)).name);
  });

  return animalNames;
}

function allCoverage() {
  const coverTable = {};
  employees.forEach((employee) => {
    const fullName = `${employee.firstName} ${employee.lastName}`;
    coverTable[fullName] = findAnimals(employee);
  });

  return coverTable;
}

function exactlyCoverage(idNameLast) {
  const employeeFound = employees.find((employee) => (employee.id === idNameLast)
    || (employee.firstName === idNameLast) || (employee.lastName === idNameLast));
  const fullName = `${employeeFound.firstName} ${employeeFound.lastName}`;

  return { [fullName]: findAnimals(employeeFound) };
}

function employeeCoverage(idOrName) {
  // seu código aqui
  if (!idOrName) return allCoverage();

  return exactlyCoverage(idOrName);
}
// const id1 = '4b40a139-d4dc-4f09-822d-ec25e819a5ad';
// const v = employeeCoverage();
// console.log(v);
// employeeCoverage();

module.exports = {
  entryCalculator,
  schedule,
  animalCount,
  animalMap,
  animalsByIds,
  employeeByName,
  employeeCoverage,
  addEmployee,
  isManager,
  animalsOlderThan,
  oldestFromFirstSpecies,
  increasePrices,
  createEmployee,
};
