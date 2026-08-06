# FutureFlow User Stories

**Version:** 1.0  
**Project:** FutureFlow – Predictive Cash Flow & Scenario Planner

## Purpose

This document captures the primary user stories for FutureFlow. These stories help developers understand user needs and guide implementation priorities.

| ID | Title | User Story | Acceptance Criteria |
| --- | --- | --- | --- |
| US-001 | User Registration | As a new user, I want to create an account so that I can securely save my financial data. | Account created and user can log in. |
| US-002 | Secure Login | As a user, I want to securely log in so that only I can access my information. | JWT issued after successful authentication. |
| US-003 | Import Transactions | As a user, I want to import a CSV from my bank so that I don't have to manually enter transactions. | CSV validated and transactions imported. |
| US-004 | View Dashboard | As a user, I want to see my current financial position and forecast so that I understand my future cash flow. | Dashboard displays balances, forecast, and insights. |
| US-005 | Manage Transactions | As a user, I want to add, edit, and delete transactions so that my financial data remains accurate. | Changes immediately affect forecasts. |
| US-006 | Forecast Cash Flow | As a user, I want to forecast my finances for the next 6–12 months so I can prepare for future expenses. | Forecast generated in real time. |
| US-007 | Run What-If Scenarios | As a user, I want to simulate life changes such as salary changes or a new mortgage so that I can compare financial outcomes. | Scenario saved without modifying baseline data. |
| US-008 | Track Goals | As a user, I want to create savings goals so that I can monitor my progress. | Goal recommendations adjust dynamically. |
| US-009 | Manage Subscriptions | As a user, I want recurring subscriptions detected automatically so I can reduce unnecessary spending. | Recurring charges identified. |
| US-010 | Receive AI Insights | As a user, I want personalized financial observations so I can make better decisions. | Insights generated or rule-based fallback used. |

## Implementation Priority

| Phase | Focus |
| --- | --- |
| Phase 1 | Authentication, Accounts, Transactions, Dashboard |
| Phase 2 | Forecast Engine and Scenario Planning |
| Phase 3 | Goals and Subscription Manager |
| Phase 4 | AI Insights and Reporting |
