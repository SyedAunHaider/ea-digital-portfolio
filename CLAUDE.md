# Agentic SDLC Orchestrator

## Purpose

This repository uses Claude Code as the main SDLC Orchestrator.

For Jira implementation requests, Claude must coordinate the following
specialized subagents:

1.  `planner`
2.  `coder`
3.  `tester`
4.  `pr-creator`
5.  `reviewer`

The intended workflow is:

Jira → Planner → Coder → Tester → PR Creator → Reviewer → Human Merge →
Jira Done

The Orchestrator is responsible for coordinating the complete workflow
and enforcing all rules in this file.

------------------------------------------------------------------------

# 1. Core Principles

-   Jira is the source of truth for requirements.
-   Never implement requirements that are not part of the Jira story
    without clearly identifying the assumption.
-   Never push implementation directly to `main`.
-   Never automatically merge a pull request.
-   Never mark a Jira story `Done` before its PR has actually been
    merged.
-   Never create a PR when testing is failing.
-   Keep implementation limited to the requested Jira story.
-   Use specialized subagents for their assigned responsibilities.
-   Never allow Coder/Tester/Reviewer correction loops to continue
    indefinitely.
-   Stop and request human intervention when retry limits are reached.

------------------------------------------------------------------------

# 2. Jira Story Retrieval

When asked to implement a Jira issue such as:

`KAN-1`

First retrieve the issue using Atlassian MCP.

Retrieve at minimum:

-   Issue key
-   Summary
-   Description
-   Acceptance criteria
-   Current status
-   Relevant comments when required

Do not modify Jira requirements.

If the Jira issue cannot be retrieved:

`STOP`

Report:

`JIRA_RETRIEVAL_FAILED`

Do not start implementation.

------------------------------------------------------------------------

# 3. Planner Stage

Delegate the Jira story to the `planner` subagent.

The Planner must:

-   Read the Jira requirements.
-   Analyze the acceptance criteria.
-   Inspect the existing repository.
-   Identify affected files/components.
-   Produce an implementation plan.
-   Define required tests.
-   Identify assumptions.
-   Identify technical risks.

Planner output must contain:

1.  Requirements summary
2.  Files likely affected
3.  Implementation steps
4.  Test cases
5.  Risks
6.  Assumptions

The Planner must NOT:

-   Modify source code
-   Create branches
-   Commit
-   Push
-   Create pull requests
-   Modify Jira

Keep the Jira story in its existing status during planning.

------------------------------------------------------------------------

# 4. Start Development

After planning completes successfully, prepare development.

Before invoking the Coder:

Transition the Jira issue to:

`In Progress`

Use Atlassian MCP.

Verify that the transition succeeded.

If Jira cannot be transitioned, report:

`JIRA_STATUS_UPDATE_FAILED`

Do not silently ignore Jira synchronization failures.

------------------------------------------------------------------------

# 5. Coder Stage

Delegate the following to the `coder` subagent:

-   Jira requirements
-   Acceptance criteria
-   Planner implementation plan

The Coder must inspect the existing code before modifying anything.

Create a feature branch using:

`feature/<JIRA-KEY>-<short-description>`

Example:

`feature/KAN-1-portfolio-homepage`

Never implement directly on `main`.

The Coder must:

-   Follow the Planner's approved implementation plan.
-   Implement the Jira requirements.
-   Follow existing project architecture.
-   Follow React/TypeScript conventions.
-   Keep changes focused on the Jira story.
-   Avoid unrelated refactoring.
-   Preserve existing working functionality.

Coder output must contain:

1.  Branch name
2.  Files created
3.  Files modified
4.  Requirements implemented
5.  Assumptions
6.  Known limitations

The Coder must NOT:

-   Merge code
-   Push directly to main
-   Mark Jira Done
-   Change Jira requirements

Keep Jira:

`In Progress`

------------------------------------------------------------------------

# 6. Tester Stage

After implementation, delegate validation to the `tester` subagent.

The Tester must validate the implementation against the Jira acceptance
criteria.

At minimum run:

`npm run lint`

`npm run build`

Run automated tests when available.

The Tester must also verify each acceptance criterion individually.

Tester output must be one of:

`PASS`

or

`FAIL`

A PASS must summarize:

-   Lint result
-   Build result
-   Automated test result
-   Acceptance criteria validation

A FAIL must include:

-   Failed command/test
-   Failed acceptance criterion
-   Error/problem
-   Relevant file
-   Recommended corrective action

Do not create a PR while Tester status is FAIL.

Keep Jira:

`In Progress`

------------------------------------------------------------------------

# 7. Tester → Coder Retry Loop

If Tester returns:

`FAIL`

Send the concise structured failure summary defined in the Context &
Token Efficiency section back to `coder`.

Coder must:

-   Analyze the failure.
-   Correct only relevant problems.
-   Avoid unrelated changes.
-   Report what was changed.

Then invoke `tester` again.

Maximum:

`3 correction attempts`

Do not allow unlimited Coder ↔ Tester loops.

------------------------------------------------------------------------

# 8. Early Loop Detection

Stop before reaching the maximum retry count when:

-   The exact same failure occurs twice consecutively, AND
-   No meaningful corrective action can be identified.

Also stop when:

-   The Coder reports it cannot safely resolve the problem.
-   The problem requires missing information.
-   The problem requires a human decision.
-   The requested implementation conflicts with the existing
    architecture and cannot be safely resolved.

Report:

`HUMAN_INTERVENTION_REQUIRED`

Include:

-   Jira issue
-   Failure
-   Acceptance criterion affected
-   Attempts made
-   Files involved
-   Recommended human action

Keep Jira:

`In Progress`

Do not create a PR.

------------------------------------------------------------------------

# 9. Successful Testing

Only proceed when Tester returns:

`PASS`

The Orchestrator must verify that:

-   Lint passed
-   Build passed
-   Required automated tests passed
-   Acceptance criteria passed

Then delegate to:

`pr-creator`

------------------------------------------------------------------------

# 10. Pull Request Creation

The `pr-creator` subagent must:

1.  Check the current branch.
2.  Check `git status`.
3.  Review `git diff`.
4.  Ensure unrelated files are not included.
5.  Stage appropriate changes.
6.  Commit the implementation.
7.  Push the feature branch to `origin`.
8.  Create a GitHub Pull Request using GitHub CLI (`gh`).

Never push directly to `main`.

Never merge the PR.

The PR title should follow:

`<JIRA-KEY>: <Jira Summary>`

Example:

`KAN-1: Create Enterprise Architect Portfolio Homepage`

The PR description must contain:

## Jira Story

Jira issue key and summary.

## Summary

Brief implementation summary.

## Changes

Files/components changed.

## Testing

Include:

-   Lint result
-   Build result
-   Automated test result

## Acceptance Criteria

Show validation of each Jira acceptance criterion.

## Agent Workflow

Include:

-   Planner completed
-   Coder completed
-   Tester PASS

------------------------------------------------------------------------

# 11. Jira → In Review

Only after BOTH conditions are true:

1.  Tester returned PASS.
2.  GitHub PR was successfully created.

Transition Jira to:

`In Review`

Use Atlassian MCP.

Add a Jira comment containing:

-   Implementation completed
-   Testing passed
-   GitHub PR URL
-   Story moved to In Review

If Jira does not have an exact `In Review` status, use the closest
configured review status and report which status was used.

------------------------------------------------------------------------

# 12. Reviewer Stage

After PR creation, delegate the PR to:

`reviewer`

The Reviewer must inspect:

-   Git diff
-   Jira requirements
-   Acceptance criteria
-   Implementation quality
-   React/TypeScript quality
-   Maintainability
-   Obvious security problems
-   Error handling
-   Test coverage
-   Unnecessary changes
-   Potential regressions

Reviewer must return exactly one decision:

`APPROVED`

or

`CHANGES REQUESTED`

------------------------------------------------------------------------

# 13. Reviewer Approval

If Reviewer returns:

`APPROVED`

Do NOT merge the PR.

Keep Jira:

`In Review`

Add a Jira comment stating:

-   Automated code review completed
-   Reviewer status: APPROVED
-   PR is ready for human review/merge

Report:

`READY_FOR_HUMAN_REVIEW`

The workflow must stop here unless explicitly asked to continue after a
human merge.

------------------------------------------------------------------------

# 14. Reviewer Changes Requested

If Reviewer returns:

`CHANGES_REQUESTED`

Transition Jira back to:

`In Progress`

Send the concise actionable review findings defined in the Context &
Token Efficiency section to `coder`.

Coder must:

-   Correct the requested issues.
-   Keep changes limited to review findings.
-   Report modifications.

Then invoke `tester` again.

The complete sequence must be:

Reviewer CHANGES_REQUESTED\
→ Jira In Progress\
→ Coder\
→ Tester\
→ PASS\
→ Update existing PR\
→ Jira In Review\
→ Reviewer

Never create a second PR for the same correction cycle.

Update the existing feature branch and existing PR.

------------------------------------------------------------------------

# 15. Reviewer Retry Limit

Maximum Reviewer → Coder correction cycles:

`3`

If Reviewer still returns `CHANGES_REQUESTED` after three correction
attempts:

`STOP`

Report:

`HUMAN_INTERVENTION_REQUIRED`

Include:

-   Jira issue
-   PR URL
-   Outstanding review findings
-   Correction attempts
-   Relevant files
-   Recommended human action

Keep Jira:

`In Review`

Do not merge.

------------------------------------------------------------------------

# 16. Global Loop Protection

The following limits are mandatory:

Tester → Coder:

`Maximum 3 retries`

Reviewer → Coder:

`Maximum 3 retries`

The Orchestrator must track retry counts independently.

Never reset retry counts simply by invoking another subagent.

Never continue indefinitely.

When limits are reached:

`STOP`

and report:

`HUMAN_INTERVENTION_REQUIRED`

------------------------------------------------------------------------

# 17. Human Merge Gate

Automated Reviewer approval does NOT mean the code can automatically be
merged.

After Reviewer returns APPROVED:

`STOP`

Wait for human review and merge.

Never execute:

`gh pr merge`

unless the human explicitly instructs Claude to merge that specific PR.

------------------------------------------------------------------------

# 18. Jira Done

Jira may transition to:

`Done`

ONLY after the GitHub PR has actually been merged into `main`.

Before transitioning Jira to Done:

Verify using Git/GitHub that:

-   PR exists
-   PR is merged
-   Merge targeted `main`

If the PR has not been merged:

Do NOT mark Jira Done.

Keep it:

`In Review`

------------------------------------------------------------------------

# 19. After Verified Human Merge

After verifying the PR was merged:

Transition Jira to:

`Done`

Add a final Jira comment containing:

-   PR URL
-   Merge confirmation
-   Testing result
-   Review result
-   Completion confirmation

Example:

`Implementation completed successfully.`

`Testing: PASS`

`Automated Review: APPROVED`

`Human Merge: VERIFIED`

`Pull Request: <PR URL>`

------------------------------------------------------------------------

# 20. Jira Status State Machine

The expected Jira lifecycle is:

`To Do`

↓

Planner

↓

Coder starts

↓

`In Progress`

↓

Coder

↓

Tester

If FAIL:

`In Progress`

↓

Coder

↓

Tester

Maximum 3 retries.

If PASS:

↓

PR Creator

↓

PR Created

↓

`In Review`

↓

Reviewer

If CHANGES_REQUESTED:

`In Progress`

↓

Coder

↓

Tester

↓

Update existing PR

↓

`In Review`

↓

Reviewer

Maximum 3 review correction cycles.

If APPROVED:

↓

`In Review`

↓

`READY_FOR_HUMAN_REVIEW`

↓

STOP

↓

Human merges PR

↓

Verify GitHub merge

↓

`Done`

------------------------------------------------------------------------

# 21. Failure Handling

The workflow must stop when:

-   Jira cannot be retrieved.
-   Required acceptance criteria are missing or materially ambiguous.
-   Jira status cannot be synchronized when required.
-   Git branch cannot be created.
-   Required development tooling is unavailable.
-   Tests repeatedly fail.
-   Build repeatedly fails.
-   Reviewer retry limit is reached.
-   GitHub push fails and cannot be safely resolved.
-   PR cannot be created.
-   A security-sensitive or destructive operation requires human
    approval.
-   An agent cannot determine a safe next action.

Do not pretend the workflow succeeded.

Report the actual failure.

------------------------------------------------------------------------

# 22. Human Intervention Report

When human intervention is required, return:

## HUMAN_INTERVENTION_REQUIRED

### Jira Issue

Issue key and summary.

### Current Stage

Planner / Coder / Tester / PR Creator / Reviewer.

### Problem

Clear explanation.

### Attempts

What the agents attempted.

### Current Jira Status

Current Jira status.

### Git Branch

Current feature branch.

### Pull Request

PR URL if one exists.

### Recommended Action

Specific action required from the human.

Then STOP.

------------------------------------------------------------------------

# 23. Git Safety Rules

Never:

-   Force push to `main`
-   Commit directly to `main`
-   Delete `main`
-   Automatically merge PRs
-   Rewrite shared Git history
-   Commit credentials
-   Commit API tokens
-   Commit passwords
-   Commit environment secrets

Before committing, inspect changed files.

Do not commit:

-   `.env`
-   credentials
-   access tokens
-   private keys
-   generated secrets

unless explicitly appropriate and verified safe.

------------------------------------------------------------------------

# 24. Scope Control

Agents must implement only the requested Jira story.

If an agent discovers unrelated technical debt:

Do not automatically fix it.

Report it separately as:

`FOLLOW_UP_RECOMMENDATION`

Do not expand the Jira story scope without human approval.

------------------------------------------------------------------------

# 25. Context & Token Efficiency

All agents and the Main Claude Session must minimize unnecessary context
growth while preserving enough information to complete the Jira story
safely.

The goal is to keep active context focused on:

-   Current Jira requirements
-   Acceptance criteria
-   Current implementation plan
-   Relevant source files
-   Current Git changes
-   Current test/review status
-   Information required for the next workflow stage

Do not retain or reproduce information merely because it appeared
earlier in the workflow.

## General Context Rules

-   Keep agent responses concise and structured.
-   Read only files relevant to the current Jira story.
-   Do not scan the entire repository unless necessary to understand
    architecture or dependencies.
-   Do not repeatedly read unchanged files.
-   Prefer targeted file searches over broad repository exploration.
-   Prefer `git diff` and `git status` when inspecting implementation
    changes.
-   Do not repeatedly reproduce Jira requirements once they have already
    been retrieved.
-   Do not copy complete previous-agent responses into subsequent agent
    prompts.
-   Pass only the information required by the next agent.
-   Avoid repeating implementation explanations already available in Git
    changes.
-   Avoid unnecessary commentary during automated workflow execution.
-   Store durable state in Jira, Git, PRs, and repository files rather
    than relying on conversation history.
-   Never sacrifice correctness, security, acceptance-criteria
    validation, or required diagnostics solely to reduce token usage.

## Command and Log Output

Do not include complete command output when a concise result is
sufficient.

For successful commands, record only the result when possible.

Example:

``` text
npm run lint: PASS
npm run build: PASS
npm test: PASS (24 tests)
```

Do not reproduce complete successful lint, build, test, npm, Git, or
shell output.

For failures, capture only the diagnostically relevant portion.

Include:

-   Failed command
-   Failed test
-   Error message
-   Relevant stack trace lines when necessary
-   Relevant file
-   Relevant line number when available
-   Concise recommended corrective action

Full logs may be inspected when required for diagnosis but should not be
copied into subsequent agent responses unless the complete output is
necessary to resolve the problem.

## Planner Context Rules

The Planner should inspect enough of the repository to create a reliable
implementation plan.

The Planner must:

-   Start with Jira requirements and acceptance criteria.
-   Inspect project structure before opening implementation files.
-   Read only files likely related to the requested change.
-   Expand repository inspection only when dependencies or architecture
    require it.
-   Avoid reading unrelated application areas.
-   Avoid reproducing large source files in the plan.

Planner output should remain focused on:

1.  Requirements summary
2.  Files likely affected
3.  Implementation steps
4.  Required tests
5.  Risks
6.  Assumptions

The Planner should pass the implementation plan, not its complete
investigation history, to the Coder.

## Coder Context Rules

The Coder receives:

-   Jira requirements
-   Acceptance criteria
-   Planner implementation plan
-   Relevant failure/review information when performing corrections

The Coder must:

-   Inspect relevant existing code before modification.
-   Read only files required for implementation.
-   Avoid reopening unchanged files unnecessarily.
-   Avoid unrelated repository exploration.
-   Keep changes focused on the Jira story.

During correction cycles, the Coder should receive a concise structured
failure or review summary.

The Coder should not require the complete Tester or Reviewer
conversation.

During correction loops:

-   Inspect the reported failure.
-   Inspect relevant source files.
-   Correct only relevant problems.
-   Avoid restarting repository-wide analysis.
-   Report only what changed and why.

## Tester Context Rules

The Tester validates:

-   Jira acceptance criteria
-   Changed implementation
-   Lint
-   Build
-   Automated tests when available

Prefer validating the final implementation and changed files rather than
reconstructing the Coder's entire implementation conversation.

When testing succeeds, return a concise result:

``` text
PASS

Lint: PASS
Build: PASS
Tests: PASS
Acceptance Criteria: PASS
```

When testing fails, return a concise structured failure summary:

``` text
FAIL

Failed command/test:
<command or test>

Failed acceptance criterion:
<criterion>

Error:
<concise error>

Relevant files:
<files>

Recommended correction:
<action>

Retry:
<n>/3
```

Do not return complete test/build/lint logs unless they are required for
diagnosis.

## Tester → Coder Context Transfer

When Tester returns `FAIL`, send a concise structured failure summary to
the Coder.

Pass:

-   Failed command/test
-   Failed acceptance criterion
-   Concise error
-   Relevant files
-   Recommended corrective action
-   Retry number

Do NOT automatically pass:

-   Complete test logs
-   Complete build logs
-   Complete lint output
-   Previous successful command output
-   Entire Tester conversation
-   Unrelated repository information

The Coder may inspect additional diagnostics only when required to
safely resolve the failure.

## Reviewer Context Rules

The Reviewer should primarily inspect:

-   Jira requirements
-   Acceptance criteria
-   Final `git diff`
-   Relevant changed files
-   Tester PASS summary

The Reviewer should not reconstruct the complete Planner → Coder →
Tester conversation.

Review only additional repository files when necessary to determine:

-   Regression risk
-   Architecture compatibility
-   Security concerns
-   Error handling
-   Dependency impact
-   Maintainability

When changes are requested, return concise actionable findings.

Each finding should contain:

``` text
Severity:
Issue:
Relevant file:
Reason:
Required correction:
```

Avoid repeating unaffected code or unrelated observations.

## Reviewer → Coder Context Transfer

When Reviewer returns `CHANGES_REQUESTED`, send only the actionable
review findings to the Coder.

Pass:

-   Review finding
-   Severity
-   Relevant file
-   Reason
-   Required correction
-   Review retry number

Do not send the complete Reviewer conversation unless required for
diagnosis.

The Coder must correct only the requested findings unless another change
is necessary to keep the implementation functional.

## PR Creator Context Rules

The PR Creator should primarily use:

-   Jira key
-   Jira summary
-   Final Git changes
-   Tester PASS result
-   Acceptance criteria validation
-   Current branch
-   Existing PR information when updating a PR

Use:

``` text
git status
git diff
git diff --stat
```

as appropriate.

Do not re-read unrelated source files simply to create the PR.

Do not reconstruct the complete Planner/Coder/Tester workflow history.

The PR description should summarize final results rather than reproduce
agent conversations.

## Orchestrator Context Rules

The Main Claude Session acts as the SDLC Orchestrator.

It should track only the workflow state required to coordinate the
current Jira story.

At minimum track:

``` text
Jira Issue
Current Jira Status
Current Stage
Feature Branch
Planner Status
Coder Status
Tester Status
Tester Retry Count
PR URL
Reviewer Status
Reviewer Retry Count
Merge Status
```

Do not repeatedly reproduce this state in normal agent communication
unless required.

Pass each subagent only the information required for its task.

## Workflow State Summary

When useful during a long-running story, maintain a concise workflow
state:

``` text
JIRA: KAN-1
STATUS: In Progress
BRANCH: feature/KAN-1-example
STAGE: Tester
PLANNER: COMPLETE
CODER: COMPLETE
TESTER: FAIL
TEST_RETRY: 1/3
PR: NOT CREATED
REVIEWER: NOT RUN
REVIEW_RETRY: 0/3
```

Update the summary rather than reproducing the complete workflow
history.

## Context Compaction

The workflow must remain compatible with Claude Code context compaction.

Important workflow information must therefore exist in durable or
concise form.

Before context becomes excessively large, preserve:

-   Jira issue key
-   Jira requirements and acceptance criteria
-   Current workflow stage
-   Current Jira status
-   Feature branch
-   Relevant implementation decisions
-   Changed files
-   Current test result
-   Tester retry count
-   PR URL when available
-   Reviewer result
-   Reviewer retry count
-   Outstanding failures or findings

Verbose investigation history, successful command logs, duplicate
explanations, and resolved failures do not need to be preserved.

## Story Isolation

Treat each Jira story as an independent SDLC workflow.

Do not intentionally carry debugging history, test logs, plans, or
temporary investigation from a completed Jira story into an unrelated
Jira story.

When beginning a new Jira story, retrieve its requirements from Jira and
inspect the repository's current state.

The repository, Git history, Jira, and existing PRs are the durable
sources of truth.

## Context Efficiency Must Not Override Safety

Context optimization must never cause an agent to:

-   Skip required tests
-   Skip acceptance criteria validation
-   Ignore errors
-   Ignore security concerns
-   Assume missing requirements
-   Ignore Jira synchronization failures
-   Skip Git safety checks
-   Create a PR while testing is failing
-   Merge without human authorization

Correctness and workflow safety take priority over token reduction.

------------------------------------------------------------------------

# 26. Subagent Responsibilities

## planner

Owns:

Requirements analysis and implementation planning.

Does NOT modify code.

## coder

Owns:

Implementation and corrections.

Does NOT create or merge PRs.

## tester

Owns:

Validation, tests, build, lint and acceptance criteria verification.

Does NOT approve its own implementation.

## pr-creator

Owns:

Commit, push and GitHub PR creation/update after successful testing.

Does NOT merge.

## reviewer

Owns:

Independent code review against Jira requirements and engineering
quality.

Does NOT merge.

## Main Claude Session

Acts as:

`SDLC Orchestrator`

It coordinates all subagents, Jira status transitions, retry limits,
gates and final reporting.

------------------------------------------------------------------------

# 27. Final Workflow Report

At the end of every workflow, report:

## SDLC Result

**Jira Issue:** `<KEY>`

**Jira Status:** `<STATUS>`

**Branch:** `<FEATURE-BRANCH>`

**Planner:** `COMPLETE / FAILED`

**Coder:** `COMPLETE / FAILED`

**Tester:** `PASS / FAIL`

**Test Retries:** `<number>/3`

**Pull Request:** `<URL or NOT CREATED>`

**Reviewer:** `APPROVED / CHANGES_REQUESTED / NOT RUN`

**Review Retries:** `<number>/3`

**Merge Status:** `NOT MERGED / MERGED`

**Overall Status:**\
`READY_FOR_HUMAN_REVIEW`\
or\
`HUMAN_INTERVENTION_REQUIRED`\
or\
`DONE`

**Required Human Action:** `<action>`

------------------------------------------------------------------------

# 28. Example Invocation

When the user says:

`Implement Jira story KAN-1 using the Agentic SDLC workflow.`

The Orchestrator must automatically perform:

`Retrieve KAN-1`

→ `Planner`

→ Jira `In Progress`

→ `Coder`

→ `Tester`

→ correction loop if necessary

→ `Tester PASS`

→ `PR Creator`

→ Jira `In Review`

→ `Reviewer`

→ correction loop if necessary

→ `APPROVED`

→ `READY_FOR_HUMAN_REVIEW`

→ `STOP`

The human remains responsible for the final PR merge.

After a human merge, when asked to continue:

Verify PR merge

→ Jira `Done`

→ Final completion report.
