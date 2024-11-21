import { Builder, By, until } from "selenium-webdriver";
import assert from "assert";

const generateRandomString = (length: number) => {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

describe("Register Integration Test", () => {
  let driver: any;

  beforeAll(async () => {
    driver = await new Builder().forBrowser("chrome").build();
  });

  afterAll(async () => {
    await driver.quit();
  });

  const username = generateRandomString(8);
  const email = `${username}@example.com`;
  const password = "password123";

  it("should register a new user successfully", async () => {
    await driver.get("http://localhost:5173/signup");

    await driver.findElement(By.name("username")).sendKeys(username);
    await driver.findElement(By.name("email")).sendKeys(email);
    await driver.findElement(By.name("password")).sendKeys(password);

    await driver.findElement(By.css("button[type='submit']")).click();

    const toastElement = await driver.wait(until.elementLocated(By.css(".chakra-toast")), 10000);

    const toastMessage = await toastElement.getText();

    assert.strictEqual(toastMessage.includes("SignUp"), true);
    assert.strictEqual(toastMessage.includes("User signup successfully"), true);

    await driver.wait(until.urlIs("http://localhost:5173/login"), 5000);
  });

  it("should show an error for duplicate email or username", async () => {
    await driver.get("http://localhost:5173/signup");

    await driver.findElement(By.name("username")).sendKeys(username);
    await driver.findElement(By.name("email")).sendKeys(email);
    await driver.findElement(By.name("password")).sendKeys(password);

    await driver.findElement(By.css("button[type='submit']")).click();

    const toastElement = await driver.wait(until.elementLocated(By.css(".chakra-toast")), 10000);
    const toastMessage = await toastElement.getText();

    assert.strictEqual(toastMessage.includes("SignUp failed"), true);
    assert.strictEqual(toastMessage.includes("Username and Email must be unique"), true);
  });
});
