<!-- codex-review-guidelines:start -->
## Codex Review Guidelines

- Review the entire pull request diff, including every changed file, before submitting the review.
- Do not stop after the first one or two findings; continue searching until the whole PR has been checked.
- Report all P0/P1/P2 findings that are relevant and actionable.
- Compare each pull request implementation against the task snapshot published in the PR description.
- Treat the `Notion task snapshot for Codex` section, including the copied task content and `Notion comments` section, as the source of truth for the linked task.
- Do not try to read requirements from external Notion links during review. Those links are references only; use the task content and comments already copied into the PR description by GitHub Actions.
- If a Notion or external task link is present but the task snapshot is missing, unavailable, or says comments are unavailable, treat that as a P1 review finding and use `Verdict: REQUEST_CHANGES`.
- Treat missing or incorrectly implemented task requirements as P1 review findings.
- Treat important but non-blocking correctness, regression, or maintainability risks as P2 review findings when applicable.
- Prefix every review finding with its priority label, such as [P1] or [P2], so automation can decide whether to approve or request changes.
- Prefer inline comments on exact changed lines. If a finding cannot be attached inline, include it in the review summary.
- Always finish the review with a clear verdict line: `Verdict: APPROVE` when there are no P0/P1/P2 findings, or `Verdict: REQUEST_CHANGES` when there are P0/P1/P2 findings.
- Check for regressions, edge cases, security issues, data loss risks, and unrelated changes.
- If the PR description does not contain a clear task or copied task snapshot, state that the review is blocked by missing requirements and treat it as a P1 finding.
<!-- codex-review-guidelines:end -->