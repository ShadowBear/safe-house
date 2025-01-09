export class UserProfileData {
  constructor(
    username,
    password,
    firstname,
    lastname,
    dateofbirth,
    street,
    city,
    phone,
    country,
    securityPin = null
  ) {
    this.username = username;
    this.password = password;
    this.firstname = firstname;
    this.lastname = lastname;
    this.dateofbirth = dateofbirth;
    this.street = street;
    this.city = city;
    this.phone = phone;
    this.country = country;
    this.securityPin = securityPin;
  }

  displayInfo() {
    console.log(`Username: ${this.username}`);
    console.log(`Password: ${this.password}`);
    console.log(`Firstname: ${this.firstname}`);
    console.log(`Lastname: ${this.lastname}`);
    console.log(`Date of Birth: ${this.dateofbirth}`);
    console.log(`Street: ${this.street}`);
    console.log(`City: ${this.city}`);
    console.log(`Phone: ${this.phone}`);
    console.log(`Country: ${this.country}`);
    if (this.securityPin) {
      console.log(`Security Pin: ${this.securityPin}`);
    }
  }

  resetSecurityPin() {
    this.securityPin = null;
    console.log("Security Pin Reset");
  }
}
