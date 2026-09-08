// Run in a separate, main-only job with issues:write permission.
module.exports = async ({github, context, core}) => {
  if (context.eventName !== 'push' || context.ref !== 'refs/heads/main') return;
  const marker = '<!-- robotics-ci:s76-execution-failure -->';
  const issues = await github.paginate(github.rest.issues.listForRepo, {
    ...context.repo, state: 'open', per_page: 100
  });
  const existing = issues.find(issue => !issue.pull_request && issue.body?.includes(marker));
  if (existing) {
    core.info(`S76 failure already tracked: ${existing.html_url}`);
    return;
  }
  const run = `${context.serverUrl}/${context.repo.owner}/${context.repo.repo}/actions/runs/${context.runId}`;
  await github.rest.issues.create({
    ...context.repo,
    title: 'CI: S76 notebook execution failed',
    body: `${marker}\nS76 failed or timed out during its separate CI execution. The book build was configured to use its saved committed outputs and continue; deployment still depends on the remaining build succeeding.\n\n[Workflow run and logs](${run}) · [Diagnostic artifacts](${run}#artifacts) (artifact: s76-execution-${context.runId}).\n\nInspect the diagnostics for the cause; this may be a Zenodo outage or another notebook error. Artifacts may be incomplete after a hard timeout. Close this issue manually after recovery.`
  });
};
