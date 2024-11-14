import { PwData, PwDetails, Credential } from "./pwData";

export const NewData = [
  new PwData("account-tie", "PayPal", [
    new Credential("test@mail.com", "Test123!"),
    new Credential("test2@mail.com", "Tester123!"),
    new Credential("test3@mail.com", "Testing123!"),
  ]),
  new PwData("account-tie", "Mail", [
    new Credential("test@mail.com", "Test123!"),
    new Credential("test3@mail.com", "Testing123!"),
  ]),
  new PwData("account-tie", "Bank", [
    new Credential("test@mail.com", "Test123!"),
  ]),
  new PwData("account-tie", "Amazon", [
    new Credential("test@mail.com", "Test123!"),
    new Credential("test2@mail.com", "Tester123!"),
  ]),
  new PwData("account-tie", "Udemy", [
    new Credential("test@mail.com", "Test123!"),
    new Credential("test2@mail.com", "Tester123!"),
    new Credential("test3@mail.com", "Testing123!"),
  ]),
  new PwData("account-tie", "Twitter", [
    new Credential("test2@mail.com", "Tester123!"),
    new Credential("test3@mail.com", "Testing123!"),
  ]),
  new PwData("account-tie", "Facebook", [
    new Credential("test3@mail.com", "Testing123!"),
  ]),
  new PwData("account-tie", "Youtube", [
    new Credential("test2@mail.com", "Tester123!"),
  ]),
  new PwData("account-tie", "Teams", [
    new Credential("test@mail.com", "Test123!"),
    new Credential("test3@mail.com", "Testing123!"),
  ]),
  new PwData("account-tie", "ChatBot", [
    new Credential("test3@mail.com", "Testing123!"),
  ]),
];

export const DATA = [
  {
    id: 0,
    category: "John",
    account: [
      { id: 0, userName: "Boon", password: "password" },
      { id: 1, userName: "Binn", password: "pasrd" },
      { id: 2, userName: "Bänn", password: "passwesford" },
      { id: 3, userName: "Bunn", password: "prd" },
    ],
    avatar: "flash",
  },
  {
    id: 1,
    category: "John",
    avatar: "compass",
    account: [{ id: 0, userName: "account", password: "aeffd" }],
  },
  {
    id: 2,
    category: "Jim",
    account: [{ id: 0, userName: "awdwad", password: "3dfeghzu" }],
    avatar: "cone",
  },
  {
    id: 3,
    category: "Loll",
    avatar: "cookie",
    account: [{ id: 0, userName: "account1", password: "1234sfesg" }],
  },
  {
    id: 4,
    category: "Willibaöd",
    avatar: "flask",
    account: [{ id: 0, userName: "account2", password: "vesvev" }],
  },
  {
    id: 5,
    category: "Mornihson",
    account: [{ id: 0, userName: "account3", password: "awgj643" }],
    avatar: "cordova",
  },
  {
    id: 6,
    category: "Qertwiz",
    account: [{ id: 0, userName: "account4", password: "ar3rg5" }],
    avatar: "corn",
  },
  {
    id: 7,
    category: "Qertt6j54wiz",
    account: [{ id: 0, userName: "account5", password: "ar3rg5" }],
    avatar: "corn",
  },
  {
    id: 8,
    category: "dvui",
    account: [{ id: 0, userName: "account6", password: "ar3rg5" }],
    avatar: "corn",
  },
  {
    id: 9,
    category: "1235a33",
    account: [{ id: 0, userName: "account6", password: "aeffd" }],
    avatar: "corn",
  },
  {
    id: 10,
    category: "erzzju",
    account: [{ id: 0, userName: "account7", password: "aeffd" }],
    avatar: "corn",
  },
  {
    id: 11,
    category: "awdaw",
    account: [{ id: 0, userName: "account8", password: "aeffd" }],
    avatar: "corn",
  },
];
