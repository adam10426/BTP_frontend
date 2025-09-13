import * as XLSX from 'xlsx';

// Map Excel column names to our database fields
const mapExcelToUser = (excelRow) => {
  // Convert Excel date to JavaScript Date if needed
  const parseDate = (excelDate) => {
    if (!excelDate) return new Date();
    // If it's already a Date object
    if (excelDate instanceof Date) return excelDate;
    // If it's an Excel date number
    if (typeof excelDate === 'number') return new Date((excelDate - 25569) * 86400 * 1000);
    // If it's a date string
    return new Date(excelDate) || new Date();
  };

  // Clean and format phone numbers
  const cleanPhoneNumber = (number) => {
    if (!number) return '';
    // Remove all non-digit characters
    return number.toString().replace(/\D/g, '');
  };

  // Extract first name from full name
//   const firstName = (excelRow['Name'] || '').split(' ')[0] || '';
  
  return {
    its: excelRow['ITS #']?.toString().trim() || '',
    name: excelRow['Name'],
    surname: excelRow['Surname'] || '',
    fatherOrHusbandName: excelRow['Husband/Father Name'] || '',
    gender: (excelRow['Gender'] || '').toLowerCase()|| '',
    age: parseInt(excelRow['Age Verification']) || 0,
    dateOfBirth: parseDate(excelRow['Date of Birth']),
    mohallah: excelRow['Mohallah Verification'] || '',
    whatsAppNumber: cleanPhoneNumber(excelRow['Active Whatsapp Number'] || ''),
    alternateWhatsAppNumber: cleanPhoneNumber(excelRow['Accomplice active Whatsapp Number'] || ''),
    createdAt: parseDate(excelRow['Timestamp']),
    status: 'pending',
  };
};

/**
 * Processes an uploaded XLSX file and returns its data
 * @param {File} file - The XLSX file to process
 * @returns {Promise<Array<Object>>} - Array of objects representing the sheet data
 */
export const processXLSXFile = async (file) => {
  try {
    // Read the file as array buffer
    const arrayBuffer = await file.arrayBuffer();
    
    // Parse the XLSX file
    const workbook = XLSX.read(arrayBuffer, { type: 'array', cellDates: true });
    
    // Get the first sheet
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    const verifiedUsersWorkSheet = workbook.Sheets['Verified Users'];
    
    // Convert to JSON with raw values to handle dates properly
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { raw: true, dateNF: 'yyyy-mm-dd' });
    const verifiedUsersData = XLSX.utils.sheet_to_json(verifiedUsersWorkSheet, { raw: true, dateNF: 'yyyy-mm-dd' });
    
    // Map Excel data to our user model
    const users = jsonData.map(row => mapExcelToUser(row));
    const verifiedUsers = verifiedUsersData.map(row => mapExcelToUser(row));
    
    console.log("Mapped users from XLSX:", users);
    return {users, verifiedUsers};
  } catch (error) {
    console.error('Error processing XLSX file:', error);
    throw new Error('Failed to process XLSX file');
  }
};

/**
 * Reads an XLSX file from a URL and returns its data
 * @param {string} url - URL of the XLSX file
 * @returns {Promise<Array<Object>>} - Array of objects representing the sheet data
 */
export const readXLSXFromUrl = async (url) => {
  try {
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    
    // Parse the XLSX file
    const workbook = XLSX.read(arrayBuffer, { type: 'array' });
    
    // Get the first sheet
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    
    // Convert to JSON
    const data = XLSX.utils.sheet_to_json(worksheet, { raw: true });
    
    return data;
  } catch (error) {
    console.error('Error reading XLSX from URL:', error);
    throw new Error('Failed to read XLSX from URL');
  }
};