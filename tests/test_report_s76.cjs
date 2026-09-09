const test = require('node:test');
const assert = require('node:assert/strict');
const report = require('../scripts/report_s76.cjs');
function fixture(eventName = 'push', ref = 'refs/heads/main') {
  const issues = [];
  let listed = 0;
  const context = {eventName, ref, serverUrl: 'https://github.com', runId: 123, repo: {owner:'gtbook', repo:'robotics'}};
  const github = {paginate: async () => { listed++; return issues; }, rest: {issues: {
    listForRepo: () => {}, create: async issue => {issues.push({...issue, html_url: 'https://github.com/gtbook/robotics/issues/1'});}
  }}};
  return {context, github, core:{info:()=>{}}, issues, listed:()=>listed};
}
test('main failure creates one issue and subsequent failures reuse it', async () => {
  const f = fixture();
  await report(f); await report(f);
  assert.equal(f.issues.length, 1);
  assert.equal(f.issues[0].title, 'CI: S76 notebook execution failed');
  assert.match(f.issues[0].body, /actions\/runs\/123#artifacts/);
});
test('PRs and non-main pushes do not access the issues API', async () => {
  for (const f of [fixture('pull_request'), fixture('push', 'refs/heads/feature')]) {
    await report(f); assert.equal(f.listed(), 0); assert.equal(f.issues.length, 0);
  }
});
