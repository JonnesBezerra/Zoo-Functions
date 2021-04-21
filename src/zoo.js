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
  return ids.map((id) => animals.find((animal) => animal.id === id));
}

// Requirement 2
function animalsOlderThan(animal, age) {
  return animals.find((specie) => specie.name === animal).residents
    .map((resident) => resident.age > age)
    .reduce((_, curr) => curr);
}

// Requirement 3
function employeeByName(employeeName) {
  const searchEmployee = employees.find((employee) =>
    (employee.firstName === employeeName)
    || (employee.lastName === employeeName));

  return searchEmployee || {};
}

// Requirement 4
function createEmployee(personalInfo, associatedWith) {
  return Object.assign(personalInfo, associatedWith);
}

// Requirement 5
function isManager(id) {
  return employees.some((employee) => employee.managers
    .some((manager) => manager === id)); // I took this simplified syntax from @gmcerqueira's repository
}

// Requirement 6
function addEmployee(id, firstName, lastName, managers = [], responsibleFor = []) {
  return data.employees.push({
    id,
    firstName,
    lastName,
    managers,
    responsibleFor,
  });
}

// Requirement 7
function animalCount(species) {
  const amount = {};
  if (species) {
    const obj = animals.find((specie) => specie.name === species);
    amount[species] = obj.residents.length;
  } else {
    animals.forEach((ani) => {
      amount[ani.name] = ani.residents.length;
    });
  }

  return species ? amount[species] : amount;
}

// Requirement 8
function entryCalculator(entrants) {
  if (!entrants || entrants === {}) return 0;
  const totalValue = Object.keys(entrants).reduce((acc, curr) => (
    acc + (entrants[curr] * prices[curr])
    // access the object value by using obj[varWithPropertyName] sintax and multiplies entrants{} value by prices{} value
  ), 0);
  return totalValue;
}

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

// I got helped by @gmcerqueira's repository to undertand and build this function
function animalWithNames({ sorted = false, sex = false }) {
  const locations = getLocation();

  animals.map((animal) => locations[animal.location].push({
    [animal.name]: getAnimalNames(animal.name, sorted, sex),
  }));

  return locations;
}

function animalMap(options = false) {
  if (options.includeNames) return animalWithNames(options);

  return getAnimalSpecies();
}

// Requirement 10
// I took this convertion function from https://stackoverflow.com/questions/13898423/javascript-convert-24-hour-time-of-day-string-to-12-hour-time-with-am-pm-and-no
const convertHour = (time24) => {
  const period = +time24 < 12 ? 'am' : 'pm';
  const hour = +time24 % 12 || 12;

  return `${hour}${period}`;
};

function setDisplay(day) {
  const times = Object.values(hours[day]);
  return `Open from ${convertHour(times[0])} until ${convertHour(times[1])}`;
}

function schedule(dayName) {
  const scheduleTable = {};

  if (!dayName) {
    const days = Object.keys(hours);
    days.forEach((day) => {
      scheduleTable[day] = (day !== 'Monday') ? setDisplay(day) : 'CLOSED';
    });
    return scheduleTable;
  }

  scheduleTable[dayName] = (dayName !== 'Monday') ? setDisplay(dayName) : 'CLOSED';

  return scheduleTable;
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
  const employee = getEmployee(id);
  const { responsibleFor } = employee;
  const residents = getFirstAnimal(responsibleFor[0]);

  return Object.values(oldestResident(residents[0].residents));
}

// Requirement 12
function increasePrices(percentage) {
  Object.keys(prices).forEach((key) => {
    prices[key] = Math.ceil(prices[key] * (100 + percentage)) / 100;
  });
}

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
  if (!idOrName) return allCoverage();

  return exactlyCoverage(idOrName);
}

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
