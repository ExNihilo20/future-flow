# FutureFlow AI Integration Design

**Version:** 1.0  
**Project:** FutureFlow – Predictive Cash Flow & Scenario Planner

## 1. Purpose

This document defines how FutureFlow will use local AI capabilities for transaction categorization and user-facing financial insights. The design avoids paid AI services and keeps the application usable even when the local AI service is unavailable.

## 2. Design Goals

- Use a free, local-first AI approach suitable for a portfolio project.
- Keep financial calculations deterministic and separate from AI-generated suggestions.
- Allow AI output to assist the user without becoming the sole source of truth.
- Provide graceful fallback behavior when the AI service is offline.
- Avoid sending sensitive financial data to paid external services.

## 3. AI Scope

| Capability | Description | Initial Priority |
| --- | --- | --- |
| Transaction Categorization | Suggest categories for imported or manually entered transactions based on merchant, amount, description, and past user corrections. | High |
| Spending Insights | Generate short natural-language observations about spending trends, recurring expenses, and cash-flow risks. | High |
| Subscription Detection Support | Help identify likely subscriptions and summarize price changes detected by rule-based logic. | Medium |
| Goal Recommendations | Explain how goal contributions affect the forecast and identify months where contributions may need adjustment. | Medium |
| Conversational Finance Assistant | Allow users to ask questions about their data in natural language. | Future |

## 4. Recommended Technology

| Component | Technology | Role |
| --- | --- | --- |
| Local AI Runtime | Ollama | Runs open-source models locally during development and demo use. |
| Backend Integration | NestJS Service | Sends structured prompts to the local AI runtime and validates responses. |
| Primary Data Source | PostgreSQL | Stores transactions, categories, insights, confidence values, and user overrides. |
| Fallback Categorizer | Rule-Based Service | Provides deterministic categorization when AI is unavailable or uncertain. |

## 5. Integration Flow

The AI service operates as an optional supporting service. The backend first applies deterministic rules, then asks the local AI service to assist with unresolved or low-confidence records.

*Figure 1. FutureFlow AI integration flow.*

## 6. Transaction Categorization Process

1. Normalize imported transaction descriptions and merchant names.
2. Apply existing user rules, known merchant mappings, and recurring transaction patterns.
3. Send unresolved transactions to the local AI service with only the data required for categorization.
4. Validate the AI response against supported categories and required JSON format.
5. Store the suggested category, confidence score, explanation, and whether the user accepted or overrode the suggestion.
6. Use future user overrides to improve rule-based categorization.

## 7. Prompting and Response Format

Prompts should be structured, concise, and designed to return machine-readable JSON. The backend must never assume that AI output is valid until it has been parsed and validated.

| Field | Purpose |
| --- | --- |
| transactionDescription | Normalized transaction description or merchant text. |
| amount | Transaction amount. |
| transactionType | Income or expense. |
| candidateCategories | Allowed categories that the model may choose from. |
| priorUserOverrides | Optional examples of how the user has categorized similar merchants. |
| response.category | Selected category. |
| response.confidence | Estimated confidence from 0.00 to 1.00. |
| response.reason | Short explanation for the suggestion. |

## 8. AI Insight Generation

AI-generated insights should summarize patterns already identified by deterministic services. The AI should explain findings in plain language, but it should not perform final financial calculations.

- Dining, grocery, utility, and subscription trend summaries.
- Cash crunch explanations based on forecast output.
- Subscription price-change summaries.
- Goal contribution impact explanations.
- Scenario comparison summaries.

## 9. Safeguards and Constraints

| Area | Requirement |
| --- | --- |
| Data Privacy | Do not send financial data to external paid AI services in the initial portfolio version. |
| Validation | All AI JSON responses must be schema-validated before use. |
| User Control | Users must be able to override AI categorization. |
| Determinism | Forecasts and scenario calculations must not depend on AI output. |
| Fallback | Rule-based categorization remains available if Ollama is offline. |
| Transparency | AI insights should be labeled as suggestions or observations, not financial advice. |

## 10. API Touchpoints

| Endpoint | Purpose |
| --- | --- |
| `POST /api/v1/transactions/categorize` | Categorize one or more transactions. |
| `PUT /api/v1/transactions/{id}/category` | Apply a user category override. |
| `GET /api/v1/insights` | Retrieve current AI-assisted insights. |
| `POST /api/v1/insights/generate` | Generate a new insight set from current forecast and transaction data. |
| `GET /api/v1/ai/status` | Check whether the local AI runtime is available. |

## 11. Success Criteria

- Transactions can be categorized using rules alone when the AI service is unavailable.
- AI categorization returns structured data that can be validated and stored.
- Users can manually override all suggested categories.
- AI-generated insights summarize data without changing financial records or forecasts.
- The AI service can run locally through Docker Compose for demo and development use.
