const { expect, test } = require("@playwright/test");

const SEEDED_URL = "/?seed=548426&scenario=default";

async function wait(page, ms = 100) {
  await page.waitForTimeout(ms);
}

async function gotoActions(page) {
  await page.getByRole("button", { name: "Actions" }).click();
  await wait(page, 80);
}

async function gotoData(page) {
  await page.getByRole("button", { name: "Data" }).click();
  await wait(page, 80);
}

async function currentTurn(page) {
  const text = await page.locator("#turn-chip").innerText();
  return Number(text.match(/Turn\s+(\d+)/i)?.[1] ?? 0);
}

async function currentStage(page) {
  const text = await page.locator("#stage-chip").innerText();
  return Number(text.match(/Stage\s+(\d+)/i)?.[1] ?? 0);
}

async function closeTransientModals(page, closeEndgame = false) {
  for (let i = 0; i < 8; i += 1) {
    let acted = false;

    if (closeEndgame) {
      const endgameClose = page.locator("#endgame-modal:not(.hidden) #endgame-close");
      if (await endgameClose.count()) {
        await endgameClose.click({ force: true });
        acted = true;
        await wait(page, 70);
      }
    }

    const onboardingClose = page.locator("#onboarding-modal:not(.hidden) #onboarding-close");
    if (await onboardingClose.count()) {
      await onboardingClose.click({ force: true });
      acted = true;
      await wait(page, 70);
    }

    const quizChoice = page.locator("#quiz-modal:not(.hidden) #quiz-choices button[data-choice]");
    if (await quizChoice.count()) {
      await quizChoice.first().click({ force: true });
      acted = true;
      await wait(page, 90);
    }

    const dilemmaChoice = page.locator("#dilemma-modal:not(.hidden) #dilemma-choices button[data-choice]");
    if (await dilemmaChoice.count()) {
      await dilemmaChoice.first().click({ force: true });
      acted = true;
      await wait(page, 120);
    }

    const summaryClose = page.locator("#summary-modal:not(.hidden) #summary-close");
    if (await summaryClose.count()) {
      await summaryClose.click({ force: true });
      acted = true;
      await wait(page, 80);
    }

    if (!acted) break;
  }
}

async function clearPolicies(page) {
  for (let i = 0; i < 6; i += 1) {
    const checked = page.locator('#policies input[type="checkbox"]:checked');
    if (!(await checked.count())) break;
    await checked.first().click({ force: true });
    await wait(page, 50);
  }
}

async function selectPoliciesUpToCap(page) {
  await gotoActions(page);
  await clearPolicies(page);
  for (let i = 0; i < 3; i += 1) {
    const available = page.locator('#policies input[type="checkbox"]:not(:disabled):not(:checked)');
    if (!(await available.count())) break;
    await available.first().click({ force: true });
    await wait(page, 80);
    await closeTransientModals(page);
  }
  return page.locator('#policies input[type="checkbox"]:checked').count();
}

async function advanceTurn(page) {
  await gotoActions(page);
  const nextTurnButton = page.locator("#next-turn");
  const disabled = await nextTurnButton.isDisabled();
  if (!disabled) {
    await nextTurnButton.click({ force: true });
    await wait(page, 150);
  }
  const endgameVisible = (await page.locator("#endgame-modal:not(.hidden)").count()) > 0;
  if (!endgameVisible) {
    await closeTransientModals(page);
  }
  return {
    turn: await currentTurn(page),
    stage: await currentStage(page),
    endgameVisible,
  };
}

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    window.localStorage.removeItem("fairview-onboarding-optout");
  });
  await page.goto(SEEDED_URL);
});

test("onboarding and stage 1 constraints are enforced", async ({ page }) => {
  await expect(page.locator("#onboarding-modal:not(.hidden)")).toHaveCount(1);
  await closeTransientModals(page);

  await page.locator("#help-open").click();
  await expect(page.locator("#onboarding-modal:not(.hidden)")).toHaveCount(1);
  await closeTransientModals(page);

  await gotoActions(page);
  await expect(page.locator("#policy-limit-note")).toContainText("up to 1");
  await expect(page.locator("#placements .placement-btn:not(.locked)")).toHaveCount(2);
  await expect(page.locator("#placements .placement-btn.locked")).toHaveCount(3);

  const selectedCount = await selectPoliciesUpToCap(page);
  expect(selectedCount).toBe(1);
  await expect(page.locator("#turn-checklist")).toContainText("Policy choice: 1/1 selected");

  const remainingSelectable = await page.locator('#policies input[type="checkbox"]:not(:disabled):not(:checked)').count();
  expect(remainingSelectable).toBe(0);

  const lockedToken = page.locator("#placements .placement-btn.locked").first();
  await lockedToken.click({ force: true });
  await expect(page.locator("#coach-text")).toContainText("unlocks at Stage");

  const unlockedToken = page.locator("#placements .placement-btn:not(.locked)").first();
  await unlockedToken.click({ force: true });
  const undevelopedTile = page.locator("#grid .tile.undeveloped").first();
  await undevelopedTile.click({ force: true });
  await expect(page.locator("#placement-info")).toContainText("undeveloped");
});

test("progression, endgame state, exports, and console health", async ({ page }) => {
  const consoleErrors = [];
  page.on("console", (message) => {
    if (message.type() !== "error") return;
    const text = message.text();
    if (text.includes("favicon.ico")) return;
    consoleErrors.push(text);
  });
  page.on("pageerror", (error) => {
    consoleErrors.push(`pageerror: ${error.message}`);
  });

  await closeTransientModals(page);

  let stage = await currentStage(page);
  let stageSafety = 0;
  while (stage < 2 && stageSafety < 24) {
    await selectPoliciesUpToCap(page);
    const snap = await advanceTurn(page);
    stage = snap.stage;
    stageSafety += 1;
  }

  expect(stage).toBeGreaterThanOrEqual(2);
  await gotoActions(page);
  await expect(page.locator("#policy-limit-note")).toContainText("up to 2");
  expect(await page.locator("#placements .placement-btn:not(.locked)").count()).toBeGreaterThanOrEqual(4);

  const unlockNewsExists = await page.evaluate(() =>
    Array.from(document.querySelectorAll("#newsfeed .news-item")).some((el) =>
      /New resources unlocked/i.test(el.textContent || "")
    )
  );
  expect(unlockNewsExists).toBeTruthy();

  let endgameVisible = false;
  let turn = await currentTurn(page);
  let endSafety = 0;
  while (!endgameVisible && endSafety < 40) {
    await selectPoliciesUpToCap(page);
    const snap = await advanceTurn(page);
    turn = snap.turn;
    endgameVisible = snap.endgameVisible;
    endSafety += 1;
  }

  await gotoActions(page);
  await expect(page.locator("#next-turn")).toBeDisabled();
  expect(turn).toBeGreaterThanOrEqual(21);

  const achievementNewsExists = await page.evaluate(() =>
    Array.from(document.querySelectorAll("#newsfeed .news-item")).some((el) =>
      /Achievements:/i.test(el.textContent || "")
    )
  );
  expect(achievementNewsExists).toBeTruthy();

  await closeTransientModals(page, true);
  await gotoData(page);

  const [jsonDownload] = await Promise.all([
    page.waitForEvent("download"),
    page.locator("#export-json").click({ force: true }),
  ]);
  const [csvDownload] = await Promise.all([
    page.waitForEvent("download"),
    page.locator("#export-csv").click({ force: true }),
  ]);

  expect(jsonDownload.suggestedFilename()).toMatch(/\.json$/i);
  expect(csvDownload.suggestedFilename()).toMatch(/\.csv$/i);
  expect(consoleErrors).toEqual([]);
});
