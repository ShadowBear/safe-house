import CryptoEs from "crypto-es";

export const generateKey = (password, salt) =>
  CryptoEs.PBKDF2(password, salt, {
    keySize: 512 / 32,
    iterations: 1000,
  }).toString();

export const encryptData = (data, key) => {
  async function encrypt(data, key) {
    try {
      const encryptedData = await CryptoEs.AES.encrypt(data, key);
      return encryptedData.toString();
    } catch (error) {
      console.error("Error encrypting data: ", error);
      return null;
    }
  }
  return encrypt(data, key);
};

export const decrypt = (encryptData, key) => {
  async function decrypt(encryptData, key) {
    try {
      const bytes = await CryptoEs.AES.decrypt(encryptData, key);
      return bytes.toString(CryptoEs.enc.Utf8);
    } catch (error) {
      console.error("Error decrypting data: ", error);
      return null;
    }
  }
  return decrypt(encryptData, key);
};
