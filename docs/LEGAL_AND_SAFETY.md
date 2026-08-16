# Legal and Safety

**This software is not a law firm, not a notified body, and not a customs ruling.**

Outputs are:

| Label | Meaning |
|---|---|
| Verified regulatory source | Official URL + article + retrieval date + hash |
| Automated interpretation | Predicate match of product attributes to encoded scope |
| Compliance recommendation | Suggested tests, documents, representatives |
| Expert review required | Insufficient evidence or ambiguous scope |

## Status semantics

- `PASS` — encoded requirements that applied were evidenced. Not a license to ship.
- `WARNING` — applicable gap or platform overlay; ship at your own risk.
- `BLOCKED` — a hard encoded obligation is unmet (e.g. RED, BPOM notification, FCC authorization).
- `UNCERTAIN` — no encoded rule, or attributes missing. **Refuses silent PASS.**
- `EXPERT_REVIEW_REQUIRED` — pyramid forbids assertion.

## False safe

Telling a factory they **can** sell when they cannot is worse than over-warning. Tests cover wireless without FCC/RED and unknown categories.

## Data

MVP stores merchant catalogs locally. No requirement to upload secrets. Regulation texts are short excerpts + links, not a pirate gazette.

## Future experts (commercial)

Lawyer, regulatory consultant, testing lab, certification body, EU RP, Indonesian license holder. The product may refer; it does not impersonate them.
