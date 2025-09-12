import { Page } from "playwright";
import { chromium } from "playwright";

require("dotenv").config();

const targetUrl = "https://rabota.by/applicant/resumes";
const login = process.env.LOGIN;
const password = process.env.PASSWORD;

const LINK_EXPAND_AUTH_FORM_SELECTOR = '[data-qa="expand-login-by-password"]';
const AUTH_FORM_USERNAME_SELECTOR = '[data-qa="login-input-username"]';
const AUTH_FORM_PASSWORD_SELECTOR = '[data-qa="login-input-password"]';
const AUTH_FORM_BUTTON_SUBMIT_SELECTOR = '[data-qa="account-login-submit"]';

void (async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page: Page = await context.newPage();

  await page.goto(targetUrl);
  await page.waitForTimeout(1000);

  await page.locator(LINK_EXPAND_AUTH_FORM_SELECTOR).click();

  await page.locator(AUTH_FORM_USERNAME_SELECTOR).first().fill(login);
  await page.fill(AUTH_FORM_PASSWORD_SELECTOR, password);
  await page.locator(AUTH_FORM_BUTTON_SUBMIT_SELECTOR).click();
  await page.waitForTimeout(2500);

  const button = page.getByRole("button", { name: "Поднять в поиске" });

  if ((await button.isVisible()) && (await button.isEnabled()))
    await button.click();

  await browser.close();
})();
