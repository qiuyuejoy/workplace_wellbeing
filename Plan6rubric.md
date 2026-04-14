# CommCue — Dimension Scoring Rubric

## 1. Clarity

- **Clarity**
  - Definition: The degree to which the message is easily understood and unambiguous on first read.
  - Evaluate:
    - Is the main point or intent immediately clear?
    - Are references (who/what/when) explicit?
    - Is the structure logically organized?
    - Are there vague terms (e.g., "this", "that") without clear referents?
  - Do not confuse with:
    - Conciseness (length)
    - Professionalism (tone)
  - Scoring guide:
    - 1–2: Hard to follow, vague, or unclear references
    - 3: Mostly understandable but with some ambiguity
    - 4–5: Clear, explicit, and easy to interpret immediately


## 2. Accuracy

- **Accuracy**
  - Definition: The extent to which the message is factually correct, reliable, and appropriately precise.
  - Evaluate:
    - Are statements factually correct based on available information?
    - Is the message internally consistent?
    - Does it avoid misleading phrasing or overstatements?
    - Are uncertainties or assumptions appropriately signaled?
  - Do not confuse with:
    - Clarity (understandability)
    - Confidence or assertiveness
  - Scoring guide:
    - 1–2: Misleading, inconsistent, or overconfident claims
    - 3: Generally accurate but slightly imprecise or under-qualified
    - 4–5: Precise, reliable, and appropriately bounded

## 3. Responsibility

- **Responsibility**
  - Definition: The extent to which the message conveys ownership, accountability, and clear next steps.
  - Evaluate:
    - Is ownership clearly stated (who is doing what)?
    - Are next steps concrete and actionable?
    - Are expectations or timelines explicit?
    - Does the message avoid passive or vague commitments?
  - Do not confuse with:
    - Clarity (understandability)
    - Supportiveness (helpfulness tone)
  - Scoring guide:
    - 1–2: Vague, avoids ownership, or lacks direction
    - 3: Some direction but lacks specificity or ownership
    - 4–5: Clear ownership, concrete next steps, and explicit expectations

## 4. Professionalism

- **Professionalism**
  - Definition: The extent to which the message aligns with workplace communication norms in tone, politeness, and formality.
  - Evaluate:
    - Is the tone respectful and appropriate for the context?
    - Does the message avoid slang, sarcasm, or overly casual phrasing?
    - Is the level of formality appropriate for the audience?
  - Do not confuse with:
    - Compassion (emotional acknowledgment)
    - Supportiveness (helpfulness)
  - Scoring guide:
    - 1–2: Inappropriate, overly casual, or potentially disrespectful
    - 3: Acceptable but slightly mismatched in tone or formality
    - 4–5: Consistently appropriate, respectful, and workplace-suitable


## 5. Sincerity

- **Sincerity**
  - Definition: The degree to which the message reflects genuine intent and authentic expression.
  - Evaluate:
    - Does the message feel authentic rather than scripted?
    - Is the tone aligned with the actual intent?
    - Does it avoid manipulation, performative politeness, or empty phrases?
  - Do not confuse with:
    - Professionalism (appropriateness)
    - Compassion (empathy)
  - Scoring guide:
    - 1–2: Feels artificial, insincere, or manipulative
    - 3: Neutral, somewhat generic or formulaic
    - 4–5: Genuine, transparent, and aligned with intent


## 6. Compassion

- **Compassion**
  - Definition: The extent to which the message acknowledges and responds to the recipient's emotional state or perspective.
  - Evaluate:
    - Does the message recognize the other person's feelings or situation?
    - Does it demonstrate perspective-taking?
    - Is the tone emotionally sensitive rather than purely transactional?
  - Do not confuse with:
    - Professionalism (politeness)
    - Responsibility (action-taking)
  - Scoring guide:
    - 1–2: Emotionally dismissive or purely transactional
    - 3: Neutral, minimal emotional acknowledgment
    - 4–5: Clearly empathetic and responsive to the recipient's perspective

---

## Evaluation Guidelines

When evaluating, treat each dimension independently.

Do not let one strong or weak impression affect all scores.

Keep these distinctions clear:
- Clarity = understandability, not brevity
- Accuracy = truthfulness, not confidence
- Professionalism = appropriateness, not warmth
- Sincerity = authenticity, not politeness
- Responsibility = ownership and action, not tone
- Compassion = emotional acknowledgment, not problem-solving

Base all judgments on observable language evidence in the message.

---

## JSON Schema

```json
"dimension_scores": {
  "clarity":        { "score": 4, "reason": "The response clearly states escalation and timeline." },
  "accuracy":       { "score": 4, "reason": "..." },
  "professionalism":{ "score": 4, "reason": "..." },
  "sincerity":      { "score": 4, "reason": "..." },
  "responsibility": { "score": 5, "reason": "Ownership and next steps are explicit." },
  "compassion":     { "score": 4, "reason": "..." }
}
```
