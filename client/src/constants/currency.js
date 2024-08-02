// Constants for currency conversion
export const CRC_TO_USD_CONVERSION_RATE = 500; // 1 USD = 500 CRC

// Function to convert CRC to USD
export const convertCRCtoUSD = (amountInCRC) => {
  return amountInCRC / CRC_TO_USD_CONVERSION_RATE;
};