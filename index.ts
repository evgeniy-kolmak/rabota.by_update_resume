import { Page } from "playwright";
import { chromium } from "playwright";

require("dotenv").config();

const targetUrl = "https://rabota.by/applicant/resumes";
const login = process.env.LOGIN;
const password = process.env.PASSWORD;

const LINK_EXPEND_AUTH_FORM_SELECTOR = '[data-qa="expand-login-by-password"]';
const AUTH_FORM_SELECTOR = '[data-qa="account-login-form"]';
const AUTH_FORM_USERNAME_SELECTOR = '[data-qa="login-input-username"]';
const AUTH_FORM_PASSWORD_SELECTOR = '[data-qa="login-input-password"]';
const AUTH_FORM_BUTTON_SUBMIT_SELECTOR = '[data-qa="account-login-submit"]';
const UPDATE_RESUME_BUTTON_SELECTOR =
  '[data-qa="resume-update-button_actions"]';

const buttonText = "Поднять в поиске";

let tryUpdate = 0;

const run = async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page: Page = await context.newPage();

  console.log(`Start task | Try: ${tryUpdate}`);
  await page.goto(targetUrl);
  await page.waitForTimeout(1000);

  console.info("Expend form");
  await page.locator(LINK_EXPEND_AUTH_FORM_SELECTOR).click();

  console.info("Start filling form");
  await page.locator(AUTH_FORM_USERNAME_SELECTOR).first().fill(login);
  await page.fill(AUTH_FORM_PASSWORD_SELECTOR, password);
  await page.locator(AUTH_FORM_BUTTON_SUBMIT_SELECTOR).click();
  await page.waitForTimeout(2500);

  const isVisibleUpdateButton = await page.isVisible(
    UPDATE_RESUME_BUTTON_SELECTOR
  );
  const updateButton = page.locator(UPDATE_RESUME_BUTTON_SELECTOR).first();

  if (isVisibleUpdateButton) {
    console.log("Trying to update resume");
    if ((await updateButton.textContent()) === buttonText) {
      await updateButton.click();
      console.log("Successfully");
    } else {
      console.log("Not ready");
      await browser.close();
    }
  } else if (tryUpdate <= 30) {
    console.log("Failed, needed captcha");
    await browser.close();
    tryUpdate++;
    run();
  } else {
    console.log("Update failed");
  }
};

run();
