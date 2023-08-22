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

void (async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page: Page = await context.newPage();

  console.log("Start task");
  await page.goto(targetUrl);
  await page.waitForTimeout(1000);

  console.info("Expend form");
  await page.locator(LINK_EXPEND_AUTH_FORM_SELECTOR).click();

  console.info("Start filling form");
  await page.isVisible(AUTH_FORM_SELECTOR);
  await page.locator(AUTH_FORM_USERNAME_SELECTOR).first().fill(login);
  await page.fill(AUTH_FORM_PASSWORD_SELECTOR, password);
  await page.locator(AUTH_FORM_BUTTON_SUBMIT_SELECTOR).click();
  await page.waitForTimeout(2500);

  console.info("Update resume");
  await page.locator(UPDATE_RESUME_BUTTON_SELECTOR).first().click();

  await browser.close();
  console.info("Done");
})();
