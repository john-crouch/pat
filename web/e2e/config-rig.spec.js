// ABOUTME: E2E tests for config page rig selection (Issue #505)
// ABOUTME: Verifies rig values load correctly in the web UI

const { test, expect } = require('@playwright/test');

// Helper to expand collapsed sections
async function expandSection(page, href) {
  const link = page.locator(`a[href="${href}"]`);
  const panel = page.locator(href);
  const isExpanded = await panel.evaluate(el => el.classList.contains('in'));
  if (!isExpanded) {
    await link.click();
    await page.waitForTimeout(350); // Bootstrap collapse animation
  }
}

test.describe('Config Page - Rig Selection (Issue #505)', () => {
  test('should load config page and display rig sections', async ({ page }) => {
    await page.goto('/ui/config');
    await page.waitForSelector('a[href="#rigControlCollapse"]');

    // Expand the Hamlib rigs section
    await expandSection(page, '#rigControlCollapse');
    await page.waitForSelector('#rigsContainer', { state: 'visible' });

    // Verify rigsContainer is visible
    const rigsContainer = page.locator('#rigsContainer');
    await expect(rigsContainer).toBeVisible();
  });

  test('should display configured rigs in dropdown options', async ({ page }) => {
    await page.goto('/ui/config');
    await page.waitForSelector('a[href="#rigControlCollapse"]');

    // Expand sections
    await expandSection(page, '#rigControlCollapse');
    await page.waitForSelector('#rigsContainer', { state: 'visible' });
    await expandSection(page, '#varaHfCollapse');

    // Get all configured rig names
    const rigNames = await page.locator('.rig-row .rig-name').evaluateAll(
      inputs => inputs.map(i => i.value).filter(v => v)
    );

    // Get all dropdown options (excluding "None")
    const dropdownOptions = await page.locator('#vara_hf_rig option').evaluateAll(
      opts => opts.map(o => o.value).filter(v => v)
    );

    // Dropdown options should match configured rigs
    expect(dropdownOptions.sort()).toEqual(rigNames.sort());
  });

  test('should have rig dropdown with None option', async ({ page }) => {
    await page.goto('/ui/config');
    await page.waitForSelector('a[href="#rigControlCollapse"]');

    // Expand VARA HF section
    await expandSection(page, '#varaHfCollapse');

    // Verify dropdown has "None" option
    const noneOption = page.locator('#vara_hf_rig option[value=""]');
    await expect(noneOption).toHaveText('None');
  });
});
