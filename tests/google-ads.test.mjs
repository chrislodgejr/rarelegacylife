import { test } from "node:test";
import assert from "node:assert/strict";
import { e164UsPhone, googleAdsUserData, reportFormSubmit, FORM_SUBMIT_SEND_TO } from "@/lib/google-ads";

test("US phones become +1 and ten digits; anything else is left out", () => {
  assert.equal(e164UsPhone("(215) 866-6956"), "+12158666956");
  assert.equal(e164UsPhone("1-215-866-6956"), "+12158666956");
  assert.equal(e164UsPhone("555-1234"), undefined);
  assert.equal(e164UsPhone("(015) 866-6956"), undefined);
  assert.equal(e164UsPhone(""), undefined);
});

test("user data is a trimmed lower-case email and the E.164 phone", () => {
  assert.deepEqual(googleAdsUserData({ email: "  Pat@Example.COM ", phone: "215.866.6956" }), {
    email: "pat@example.com",
    phone_number: "+12158666956",
  });
  assert.deepEqual(googleAdsUserData({ email: "not an email", phone: "12" }), {});
});

test("a submit sets the user data, then sends the RL Form Submit conversion", () => {
  const calls = [];
  const sent = reportFormSubmit({ email: "pat@example.com", phone: "2158666956" }, { gtag: (...args) => calls.push(args) });
  assert.equal(sent, true);
  assert.deepEqual(calls, [
    ["set", "user_data", { email: "pat@example.com", phone_number: "+12158666956" }],
    ["event", "conversion", { send_to: FORM_SUBMIT_SEND_TO }],
  ]);
});

test("without the tag (blocked) nothing breaks and nothing is sent", () => {
  assert.equal(reportFormSubmit({ email: "pat@example.com" }, {}), false);
});
