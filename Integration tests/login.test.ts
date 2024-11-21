import { Builder, By, until } from "selenium-webdriver";
import assert from "assert";

describe("Login Integration Test", () => {
  let driver: any;

  beforeAll(async () => {
    driver = await new Builder().forBrowser("chrome").build();
  });

  afterAll(async () => {
    await driver.quit();
  });

  it("should log in successfully with valid credentials", async () => {
    await driver.get("http://localhost:5173/login");

    await driver.findElement(By.name("email")).sendKeys("abc@gmail.com");
    await driver.findElement(By.name("password")).sendKeys("asdf;lkj");

    await driver.findElement(By.css("button[type='submit']")).click();

    await driver.wait(until.urlContains("http://localhost:5173"), 10000);

    const pageTitle = await driver.getTitle();
    assert.strictEqual(pageTitle, "Vite + React + TS");
  });

  it("should show an error for invalid credentials", async () => {
    await driver.get("http://localhost:5173/login");

    await driver.findElement(By.name("email")).sendKeys("wronguser@example.com");
    await driver.findElement(By.name("password")).sendKeys("wrongpassword");

    await driver.findElement(By.css("button[type='submit']")).click();

    const toastElement = await driver.wait(until.elementLocated(By.css(".chakra-toast")), 10000);

    const toastMessage = await toastElement.getText();

    assert.strictEqual(toastMessage.includes("Login Failed"), true);
    assert.strictEqual(toastMessage.includes("Please enter your correct email or password"), true);
  });
});
