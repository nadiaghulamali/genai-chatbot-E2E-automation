GenAI Chatbot E2E Automation Framework
Playwright · TypeScript · AI Validation · Arabic + English · Security Tests

This repository contains a complete end-to-end automation test suite for the UAsk GenAI Chatbot, built using Playwright + TypeScript.

It tests UI, chat functionality, AI response quality, fallback logic, security behavior, and captcha detection.

📘 Features
1. UI Automation (English & Arabic)

Validates chat container visibility

Verifies ARIA roles (listbox, option)

Checks input textbox, send button, message rendering

Supports RTL Arabic interface

2. AI Response Validation

Each chatbot answer is validated for:

Minimum required length

Required keywords

Forbidden keywords to avoid hallucination

Clean HTML (no <script>, no broken tags)

Must include UAE official links (u.ae)

3. Fallback Behaviour

Ensures bot responds correctly to:

Random gibberish

Empty input

Noise characters

4. Prompt Injection & Security Tests

Detects and prevents issues such as:

XSS attacks

HTML injection

Jailbreak prompts

System-prompt override attempts

5. Captcha Detection

If CAPTCHA appears:

Tests stop safely

Prevents false UI failures

Makes assignment automation stable

6. Modular Page Object Model

UAskChatPage — all chatbot actions

DisclaimerModal — supports EN + AR disclaimer popups

CaptchaGuard — safe CAPTCHA detection

responseValidator.ts — AI content checks

📁 Project Structure
genai-chatbot-E2E-automation/
│
├── src/
│   ├── components/
│   │   ├── disclaimerModal.ts
│   │   ├── captchaGuard.ts
│   ├── pages/
│   │   └── uaskChatPage.ts
│   ├── utils/
│   │   └── responseValidator.ts
│   ├── data/
│   │   └── testData.ts
│
├── tests/
│   ├── ui/
│   │   ├── chat-ui.spec.ts
│   │   ├── chat-ui-arabic.spec.ts
│   ├── ai/
│   │   └── response-validation.spec.ts
│   ├── security/
│       └── injection.spec.ts
│
├── playwright.config.ts
├── package.json
└── README.md

🚀 Installation
1️⃣ Clone the project
git clone <your-repo-url>
cd genai-chatbot-E2E-automation

2️⃣ Install dependencies
npm install

3️⃣ Install Playwright browsers
npx playwright install

▶️ Running Tests
Run ALL tests
npx playwright test

Run only UI tests
npx playwright test tests/ui

Run English AI validation tests
npx playwright test tests/ai/response-validation.spec.ts

Run security tests
npx playwright test tests/security/injection.spec.ts

Run tests in headed mode
npx playwright test --headed

Run single file
npx playwright test chat-ui-arabic.spec.ts

📊 Viewing HTML Report
npx playwright show-report


If default port is busy:

npx playwright show-report --port=9999

🌐 Base URLs Used (No .env required)
EN → https://beta-ask.u.ae/en/uask
AR → https://beta-ask.u.ae/ar/uask


Hard-coded inside page object for simplicity in assignments.

🧪 Dataset Model

Dataset (testData.ts) supports both English and Arabic:

export type TestData = {
  en: LanguageTestGroup;
  ar: LanguageTestGroup;
};


Each group contains:

happy_path

fallback

security

🛡️ Captcha Handling

If CAPTCHA appears during execution:

Framework detects it through iframe inspection

Tests automatically fail with:
"CAPTCHA detected — automation cannot proceed"

This prevents false negative UI test failures.

🧩 Tech Stack
Category	Technology
Automation	Playwright
Language	TypeScript
Design Pattern	Page Object Model (POM)
Validation	Rule-based AI response checks
Security	XSS + prompt-injection detection
🏁 Summary

This framework demonstrates:
✔ Well-structured Playwright test design
✔ Clean and scalable Page Objects
✔ Real AI validation (content checks)
✔ English + Arabic interface testing
✔ Production-style assignment solution

It is suitable for:

Interview assignments

Project demos

GenAI chatbot validations

Secure UI automation