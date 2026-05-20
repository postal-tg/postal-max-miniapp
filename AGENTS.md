<!-- codex-review-guidelines:start -->
## Codex Review Guidelines

- Review the entire pull request diff, including every changed file, before submitting the review.
- Do not stop after the first one or two findings; continue searching until the whole PR has been checked.
- Report all P0/P1/P2 findings that are relevant and actionable.
- Compare each pull request implementation against the task described in the PR description.
- Treat missing or incorrectly implemented task requirements as P1 review findings.
- Treat important but non-blocking correctness, regression, or maintainability risks as P2 review findings when applicable.
- Prefix every review finding with its priority label, such as [P1] or [P2], so automation can decide whether to approve or request changes.
- Prefer inline comments on exact changed lines. If a finding cannot be attached inline, include it in the review summary.
- Always finish the review with a clear verdict line: `Verdict: APPROVE` when there are no P0/P1/P2 findings, or `Verdict: REQUEST_CHANGES` when there are P0/P1/P2 findings.
- Check for regressions, edge cases, security issues, data loss risks, and unrelated changes.
- If the PR description links to an external task, inspect it when available and mention when it cannot be accessed.
- If the PR description does not contain a clear task, state that the review is blocked by missing requirements.
<!-- codex-review-guidelines:end -->