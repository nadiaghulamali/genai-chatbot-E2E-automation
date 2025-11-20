# GenAI Chatbot E2E Automation Framework  
### Playwright · TypeScript · AI Validation · Arabic + English · Security Tests

This repository contains a complete end-to-end automation test suite for the UAsk GenAI Chatbot, built using Playwright + TypeScript.  
It validates UI behaviour, chat functionality, AI responses, fallback logic, security, and captcha detection.

---

## ⭐ Features

### 1. UI Automation (English & Arabic)
- Validates chat container visibility  
- Verifies ARIA roles (listbox, option)  
- Validates user input, send button, agent messages  

### 2. AI Response Validation  
Ensures each AI answer meets rules such as:  
- Minimum length  
- Required keywords  
- Must include official UAE link (u.ae)  
- Forbidden hallucination phrases  
- No invalid HTML  

### 3. Fallback Tests  
Checks chatbot handling of gibberish, noise, empty inputs.

### 4. Security Tests  
Validates protection against:  
- XSS  
- HTML injection  
- Jailbreak phrases  
- System prompt override  

### 5. CAPTCHA Detection  
Automatically stops the test if CAPTCHA appears.

### 6. Page Object Model  
- UAskChatPage  
- DisclaimerModal  
- CaptchaGuard  
- responseValidator  
- testData  


## 🚀 Setup Instructions

### 1. Clone the repository
git clone <your-repo-url>  
cd genai-chatbot-E2E-automation

### 2. Install packages
npm install

### 3. Install Playwright browsers
npx playwright install

---

## ▶️ Running Tests

### Run all tests
npx playwright test

### Run UI tests
npx playwright test tests/ui

### Run English AI validation
npx playwright test tests/ai/response-validation.spec.ts

### Run security tests
npx playwright test tests/security/injection.spec.ts

### Run headed mode
npx playwright test --headed

### Run a specific test
npx playwright test chat-ui-arabic.spec.ts

---

## 📊 HTML Report

npx playwright show-report  
If port is busy:  
npx playwright show-report --port=9999

---

## 🌐 Base URLs 

English: https://beta-ask.u.ae/en/uask  
Arabic: https://beta-ask.u.ae/ar/uask

---

## 🧪 Test Data Structure

Dataset includes:  
- happy_path  
- fallback  
- security  

Supports English and Arabic.

---

## 🛡️ CAPTCHA Handling

CaptchaGuard detects:  
- iframe presence  
- Google checkbox visibility  
If present → test stops intentionally.

---

## 🧩 Tech Stack

Automation: Playwright  
Language: TypeScript  
Architecture: POM  
Validation: Custom AI rules  
Security: XSS / Injection

---

## 🏁 Summary

This framework demonstrates:  
- UI + AI validation  
- Arabic + English support  
- Security and fallback tests  
- Clean Page Object Model 
