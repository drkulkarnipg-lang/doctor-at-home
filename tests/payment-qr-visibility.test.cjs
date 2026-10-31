'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
const payment = fs.readFileSync(path.join(__dirname, '..', 'payment-options.js'), 'utf8');

test('patient payment panel and UPI QR are visible by default', () => {
  assert.match(html, /<details class="payment-methods" id="paymentMethods" open>/);
  assert.match(html, /<details id="upiQrDetails" open>/);
  assert.match(html, /id="upiQrImg"[^>]*hidden/);
  assert.match(payment, /if\(!image\|\|!details\?\.open\)return/);
  assert.match(payment, /qr\.toDataURL\(uri/);
});

test('UPI QR payload uses the approved UPI payee and INR amount', () => {
  assert.match(payment, /const UPI='drkulkarnipg@upi'/);
  assert.match(payment, /pa:UPI/);
  assert.match(payment, /pn:'Dr Pramod G Kulkarni'/);
  assert.match(payment, /am:String\(fee\)/);
  assert.match(payment, /cu:'INR'/);
});

test('public payment UI does not publish bank account or IFSC details', () => {
  assert.doesNotMatch(html, /649601050101|ICIC0001802/);
  assert.match(html, /Bank account numbers are deliberately not published on this public page/);
  assert.match(html, /Request transfer instructions/);
});
