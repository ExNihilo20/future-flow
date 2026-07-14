# FutureFlow Database Design Document

**Version:** 1.0  
**Project:** FutureFlow – Predictive Cash Flow & Scenario Planner

## 1. Purpose

This document defines the initial database design for FutureFlow. It identifies the major data entities, relationships, and table structures needed to support cash-flow forecasting, scenario planning, transaction categorization, recurring expenses, goals, and AI-assisted insights.

## 2. Database Technology

| Technology | Purpose |
| --- | --- |
| PostgreSQL | Primary relational database for application data. |
| Prisma ORM | Type-safe database access from the NestJS backend. |
| Docker volume | Local persistent database storage for development. |

## 3. Design Principles

- Use normalized relational tables for core financial data.
- Keep forecast output separate from source transactions.
- Allow scenario data to modify projections without changing baseline data.
- Store imported transaction data in a traceable format.
- Avoid storing secrets or sensitive credentials in the database.
- Use timestamps for auditability and future troubleshooting.

## 4. Major Entities

| Entity | Description |
| --- | --- |
| User | Application account owner. |
| Account | Financial account such as checking, savings, credit card, loan, or investment account. |
| Transaction | Individual income or expense record. |
| Category | User or system-defined transaction category. |
| Recurring Rule | Schedule used to project recurring income and expenses. |
| Goal Envelope | Savings goal with target amount and recommended monthly contribution. |
| Scenario | User-defined what-if model. |
| Scenario Adjustment | Change applied inside a scenario, such as pay cut, mortgage, or subscription cancellation. |
| Forecast Run | Generated forecast result for a baseline or scenario. |
| Forecast Month | Monthly forecast values produced by the forecast engine. |
| AI Insight | Generated insight, explanation, or categorization suggestion. |
| Import Batch | Metadata about an uploaded CSV import. |

## 5. Initial Table Design

| Table | Key Columns | Notes |
| --- | --- | --- |
| users | id, email, password_hash, created_at, updated_at | Stores application users. Passwords are hashed only. |
| accounts | id, user_id, name, account_type, starting_balance, current_balance | Represents financial accounts. |
| categories | id, user_id, name, type, parent_category_id | Supports income and expense categorization. |
| transactions | id, user_id, account_id, category_id, amount, transaction_date, description, source | Core financial transaction table. |
| recurring_rules | id, user_id, transaction_template_id, frequency, start_date, end_date | Defines recurring income and expense schedules. |
| goals | id, user_id, name, target_amount, current_amount, target_date, priority | Supports goal-based envelopes. |
| scenarios | id, user_id, name, description, projection_years, created_at | Stores what-if scenario definitions. |
| scenario_adjustments | id, scenario_id, adjustment_type, amount, percent_value, start_date, end_date | Stores changes applied to a scenario. |
| forecast_runs | id, user_id, scenario_id, forecast_type, created_at | Represents one forecast calculation result. |
| forecast_months | id, forecast_run_id, month, projected_income, projected_expenses, projected_balance | Monthly forecast output. |
| ai_insights | id, user_id, related_entity_type, related_entity_id, insight_text, created_at | Stores generated financial insights. |
| import_batches | id, user_id, filename, row_count, imported_at, status | Tracks CSV import activity. |

## 6. Key Relationships

- One user may have many accounts, categories, transactions, goals, scenarios, and forecast runs.
- One account may have many transactions.
- One category may classify many transactions.
- One scenario may have many scenario adjustments.
- One forecast run may have many forecast month records.
- One import batch may create many transaction records.
- AI insights may reference transactions, categories, forecasts, goals, or scenarios.

## 7. Entity Relationship Overview

The final implementation should include a polished ER diagram exported from Draw.io or another diagramming tool. The initial logical relationship is shown below in text form:

```text
User 1..* Account
User 1..* Transaction
Account 1..* Transaction
Category 1..* Transaction
User 1..* Scenario
Scenario 1..* ScenarioAdjustment
User 1..* ForecastRun
ForecastRun 1..* ForecastMonth
User 1..* GoalEnvelope
ImportBatch 1..* Transaction
```

## 8. Indexing Recommendations

| Table | Recommended Index | Reason |
| --- | --- | --- |
| transactions | user_id, transaction_date | Common dashboard and forecasting query. |
| transactions | account_id, transaction_date | Account history lookup. |
| transactions | category_id | Category spending reports. |
| recurring_rules | user_id, start_date, end_date | Recurring projection lookup. |
| forecast_months | forecast_run_id, month | Forecast chart rendering. |
| scenarios | user_id, created_at | Scenario listing. |
| ai_insights | user_id, created_at | Recent insight display. |

## 9. Data Retention and Privacy

- Users should be able to delete imported transactions.
- Generated forecasts may be recalculated and do not need permanent retention unless saved by the user.
- AI prompt/response data should be limited to what is necessary for insight history.
- No bank credentials will be stored for the initial portfolio version.
- Database backups should be supported through PostgreSQL dump procedures.

## 10. Open Design Questions

- Should credit card balances be modeled as accounts, liabilities, or both?
- Should investment growth be stored monthly or calculated on demand?
- Should imported CSV rows be stored raw before normalization?
- Should goals be tied to specific accounts or remain logical envelopes?
- Should forecast results be cached or generated on demand for each dashboard request?

## 11. Conclusion

This initial database design provides a practical relational foundation for FutureFlow. It supports the core portfolio features while leaving room for future expansion such as bank API integrations, household sharing, investment modeling, tax forecasting, and advanced reporting.
