import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";

export class User {
  constructor(userName, password, categories = []) {
    this.userName = userName;
    this.password = password;
    this.categories = categories;
    this.id = uuidv4();
  }

  addCategory(category) {
    this.categories.push(category);
  }

  getAllCategories() {
    return this.categories;
  }

  displayInfo() {
    console.log(`Username: ${this.userName}`);
    console.log(`Password: ${this.password}`);
    console.log("Categories:");
    this.categories.forEach((category, index) => {
      console.log(`${index + 1}. ${category.title}`);
    });
  }
}

export class PwData {
  constructor(avatar, title, pwData = []) {
    this.avatar = avatar;
    this.title = title;
    this.pwData = pwData;
    this.id = uuidv4();
  }

  addCredentials(userName, password) {
    const credentials = new Credential(userName, password);
    this.pwData.push(credentials);
  }

  getAllCredentials() {
    return this.pwData;
  }

  displayInfo() {
    console.log(`Title: ${this.title}`);
    console.log(`Avatar: ${this.avatar}`);
    console.log("Credentials:");
    this.pwData.forEach((credential, index) => {
      console.log(
        `${index + 1}. Username: ${credential.username}, Password: ${
          credential.password
        }`
      );
    });
  }
}

export class Credential {
  constructor(username, password) {
    this.userName = username;
    this.password = password;
    this.id = uuidv4();
  }

  displayInfo() {
    console.log(`Username: ${this.userName}`);
    console.log(`Password: ${this.password}`);
  }
}
