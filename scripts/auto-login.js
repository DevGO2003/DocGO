const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false, channel: 'chrome' }).catch(async () => {
    return chromium.launch({ headless: false });
  });

  const context = await browser.newContext();
  const page = await context.newPage();

  const url = process.env.LOGIN_URL || 'http://localhost:3000/login';
  const username = process.env.LOGIN_USERNAME || 'admin';
  const password = process.env.LOGIN_PASSWORD || '123456';

  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });

  const usernameSelectors = [
    'input[name="username"]',
    '#username',
    'input#username',
    'input[name="email"]',
    '#email',
    'input#email',
    'input[type="email"]',
    'input[placeholder*="email" i]',
    'input[placeholder*="username" i]',
    'input[placeholder*="tài khoản" i]'
  ];

  const passwordSelectors = [
    'input[name="password"]',
    '#password',
    'input#password',
    'input[type="password"]',
    'input[placeholder*="password" i]',
    'input[placeholder*="mật khẩu" i]'
  ];

  const loginButtonSelectors = [
    'button[type="submit"]',
    'input[type="submit"]',
    'button:has-text("Login")',
    'button:has-text("Đăng nhập")',
    '[role="button"]:has-text("Login")',
    '[role="button"]:has-text("Đăng nhập")'
  ];

  async function fillFirst(selectors, value) {
    for (const selector of selectors) {
      const el = await page.$(selector);
      if (el) {
        await el.fill(value);
        return true;
      }
    }
    return false;
  }

  async function clickFirst(selectors) {
    for (const selector of selectors) {
      const el = await page.$(selector);
      if (el) {
        await el.click();
        return true;
      }
    }
    return false;
  }

  const userFilled = await fillFirst(usernameSelectors, username);
  const passFilled = await fillFirst(passwordSelectors, password);

  if (!userFilled || !passFilled) {
    console.warn('Không tìm thấy selector để điền tài khoản hoặc mật khẩu.');
  }

  await clickFirst(loginButtonSelectors);

  // Chờ điều hướng sau đăng nhập (nếu có)
  try {
    await page.waitForLoadState('networkidle', { timeout: 10000 });
  } catch (_) {}

  // Giữ trình duyệt mở để bạn xác nhận trạng thái đăng nhập
  console.log('Đã cố gắng đăng nhập. Đóng cửa sổ trình duyệt khi xong.');
})();


