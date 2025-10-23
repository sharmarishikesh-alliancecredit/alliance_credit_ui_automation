import { test, expect } from "@playwright/test";
const fs = require("fs");
const path = require("path");

const url: string = "http://localhost:5173/";

test.beforeEach(async ({ page }) => {
  await page.goto(url);
  await page.getByText("Login As Admin").click();
});

test.describe("Legal Upload", () => {
  test("Verify if main table in legal-search section is visible", async ({
    page,
  }) => {
    await expect(
      page.locator("div").filter({ hasText: "File Ref. IdFileFile" }).nth(4)
    ).toBeVisible();
  });

  test("Verify if the legal search button is clickable and redirects to search page", async ({
    page,
  }) => {
    await page.goto(url);
    await page.getByText("Login As Admin").click();
    await expect(page.getByText("Legal Search")).toBeEnabled();
    await page.getByText("Legal Search").click();
    await expect(page.getByRole("main")).toContainText(
      "Legal Information Search"
    );
  });

  test("Verify if the search functionality is working as expected", async ({
    page,
  }) => {
    await page.getByPlaceholder("Search Legal File").click();
    await page.getByPlaceholder("Search Legal File").fill("jlr");
    await page.getByText("jlr", { exact: true }).first().click();
    await page.getByPlaceholder("Search Legal File").click();
    await page.getByRole("img").nth(2).click();
    await page.getByPlaceholder("Search Legal File").fill("LG-002568");
    await expect(page.getByRole("main")).toContainText("LG-002568");
  });

  test("Verify if the upload functionality is working as expected", async ({
    page,
  }) => {
    await page.getByRole("button", { name: "Upload Legal" }).click();
    await page.getByRole("textbox", { name: "Legal Type" }).click();
    await page.getByText("bkr_select").click();
    await page.getByRole("textbox", { name: "Region" }).click();
    await page.getByText("eastern").click();
    await page
      .locator("//div[@class='custom_upload']//child::input")
      .setInputFiles("LegalFiles/BKR.xls");
    await page.getByRole("button", { name: "Upload", exact: true }).click();
    await expect
      .soft(page.getByText("File uploaded successfully"))
      .toBeVisible();
    await expect(page.getByRole("main")).toContainText("BKR.xls");
  });

  test("Verify if the download functionality is working as expected", async ({
    page,
  }) => {
    const downloadPromise = page.waitForEvent("download");
    await page.getByText("BKR.xls").first().click();
    const download = await downloadPromise;
    const downloadPath = path.join(
      __dirname,
      "temp_downloads",
      download.suggestedFilename()
    );
    await download.saveAs(downloadPath);

    await expect(download.suggestedFilename()).toBe("BKR.xls");
    await expect(fs.existsSync(downloadPath)).toBe(true);

    // Clean up the downloaded file
    fs.unlinkSync(downloadPath);
  });
});

test.describe("Legal Search", () => {
  test.beforeEach(async ({ page }) => {
    await page.locator("//span[contains(text(), 'Legal Search')]").click();
  });

  test("Verify if all the 3 files are searchable in the legal search section", async ({
    page,
  }) => {
    await page
      .getByRole("textbox", { name: "Search Legal Information" })
      .fill("9272-5241 QUEBEC INC. ");
    await page.getByRole("button", { name: "search" }).click();
    await expect
      .soft(page.getByRole("main"))
      .toContainText("9272-5241 QUEBEC INC.");
    await page.getByRole("img").nth(2).click();
    await page
      .getByRole("textbox", { name: "Search Legal Information" })
      .click();
    await page
      .getByRole("textbox", { name: "Search Legal Information" })
      .fill("GROUPE CANAM INC.");
    await page.getByRole("button", { name: "search" }).click();
    await expect.soft(page.getByRole("main")).toContainText("GROUPE CANAM INC");
    await page.getByRole("img").nth(2).click();
    await page
      .getByRole("textbox", { name: "Search Legal Information" })
      .fill("CANTAM GROUP LTD");
    await page.getByRole("button", { name: "search" }).click();
    await expect.soft(page.getByRole("main")).toContainText("CANTAM GROUP LTD.");
  });
});
