import Dexie from 'dexie';

// Create a new Dexie database
const db = new Dexie('TafreehDB');

// Define the database schema
const databaseSchema = {
  users: `
    its, 
    name, 
    surname, 
    fatherOrHusbandName, 
    gender, 
    age, 
    dateOfBirth, 
    mohallah, 
    whatsAppNumber, 
    alternateWhatsAppNumber,
    timestamp,
    status, 
    createdAt,
    updatedAt
  `,
  waitingUsersList: `
  its, 
  name, 
  surname, 
  fatherOrHusbandName, 
  gender, 
  age, 
  dateOfBirth, 
  mohallah, 
  whatsAppNumber, 
  alternateWhatsAppNumber,
  timestamp,
  status, 
  createdAt,
  updatedAt
`,
confirmedUsersList: `
its, 
name, 
surname, 
fatherOrHusbandName, 
gender, 
age, 
dateOfBirth, 
mohallah, 
whatsAppNumber, 
alternateWhatsAppNumber,
timestamp,
status, 
createdAt,
updatedAt
`,
  // Add more tables as needed
};

// Configure the database with the schema
db.version(1).stores(databaseSchema);

// Export the database instance
export default db;
