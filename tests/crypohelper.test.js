import { expect, test } from "vitest";
import { Security } from "../utils/securityStore";
import { generateKey, encryptData, decrypt } from "../utils/crypoHelper";

const sampleData = {
  data: "Test Data",
  id: "123",
  userName: "TestUser",
  password: "TestPassword",
};

test("Test if Key Generation is working and if different Salt change key", async () => {
  //Arrange and Act
  const key = await generateKey(Security.Testing_PW, Security.TestingSalt);
  const key2 = await generateKey(
    Security.Testing_PW,
    "Rnd+" + Security.TestingSalt
  );

  //Assert
  expect(key).toMatch(Security.AES_TestResult);
  expect(key2).not.toBe(Security.AES_TestResult);
});

test("Test if encrypt and decryption are working", async () => {
  //Arrange
  const key = await generateKey(Security.Testing_PW, Security.TestingSalt);
  const jsonData = JSON.stringify(sampleData);

  //Act
  const encrypted = await encryptData(jsonData, key);
  const decryptedString = await decrypt(encrypted, key);
  const decrypted = JSON.parse(decryptedString);

  //Assert
  expect(decrypted.data).toBe(sampleData.data);
  expect(decrypted.id).toBe(sampleData.id);
  expect(decrypted.userName).toBe(sampleData.userName);
  expect(decrypted.password).toBe(sampleData.password);
});
