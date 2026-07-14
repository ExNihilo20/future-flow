# FutureFlow Forecasting Engine Design

**Version:** 1.0  
**Project:** FutureFlow – Predictive Cash Flow & Scenario Planner

## 1. Purpose

This document defines the initial design for the FutureFlow Forecasting Engine. The engine is responsible for projecting future cash flow, monthly surplus or deficit, goal contributions, and scenario impacts based on user financial data and assumptions.

## 2. Engine Objectives

- Generate a rolling 6-12 month cash-flow forecast.
- Support long-term scenario projections for 5-10 years.
- Project recurring income, recurring expenses, debt payments, and goal contributions.
- Identify future cash crunch months before they occur.
- Allow what-if scenarios without changing baseline financial data.
- Return chart-ready output for the Angular dashboard and Apache ECharts visualizations.

## 3. Inputs

| Input | Description |
| --- | --- |
| Accounts | Current account balances and account types. |
| Transactions | Historical income and spending records. |
| Recurring Transactions | Bills, subscriptions, income, transfers, and scheduled payments. |
| Goals | Savings envelopes such as Emergency Fund, Travel, or Down Payment. |
| Scenario Adjustments | Temporary or permanent assumptions such as salary changes or new expenses. |
| Forecast Settings | Forecast length, start month, inflation assumptions, and optional growth assumptions. |

## 4. Outputs

| Output | Used By |
| --- | --- |
| Monthly starting balance | Dashboard cash-flow chart |
| Projected income | Monthly forecast table |
| Projected expenses | Monthly forecast table |
| Goal contributions | Goal envelope recommendations |
| Monthly surplus/deficit | Dashboard alerts and charts |
| Ending balance | Cash-flow projection |
| Cash crunch warning | Dashboard notifications |
| Scenario comparison data | What-if simulator charts |

## 5. Core Forecasting Rules

- Forecast calculations shall be deterministic. The same input data shall produce the same result.
- Baseline forecasts shall not be changed by scenario simulations.
- Recurring income shall be applied before recurring expenses within each forecast month.
- Scheduled one-time transactions shall be included only in their scheduled month.
- Inactive subscriptions and deleted recurring transactions shall not be included.
- Goal recommendations may be reduced when a projected month would otherwise become negative.
- Historical transactions shall remain unchanged by forecasting operations.

## 6. Monthly Forecast Process

| Step | Description |
| --- | --- |
| 1 | Load the user account balances, recurring transactions, goals, and forecast settings. |
| 2 | Create an empty forecast month for each month in the selected forecast window. |
| 3 | Apply projected income for each month based on recurrence rules. |
| 4 | Apply projected expenses, subscriptions, debt payments, and transfers. |
| 5 | Apply recommended goal contributions if sufficient projected cash is available. |
| 6 | Calculate surplus or deficit for each month. |
| 7 | Calculate ending balance and carry it into the next month as starting balance. |
| 8 | Flag months where projected ending balance drops below the configured threshold. |
| 9 | Return chart-ready forecast data to the API response. |

## 7. Basic Calculation Model

For each forecast month, the engine applies the following simplified model:

```text
Ending Balance = Starting Balance + Projected Income - Projected Expenses - Goal Contributions +/- Scenario Adjustments
Monthly Surplus/Deficit = Projected Income - Projected Expenses - Goal Contributions
```

## 8. Scenario Handling

Scenarios are applied as overlays against the baseline forecast. A scenario may add, remove, or modify projected income, expenses, contributions, or one-time events. Scenario calculations produce separate output and shall not alter the user's saved baseline data.

| Scenario Type | Example |
| --- | --- |
| Income Change | What if I take a 10% pay cut? |
| New Expense | What if I buy a house with a $2,000 mortgage? |
| Contribution Change | What if I contribute 15% to my 401(k)? |
| Subscription Cancellation | What if I cancel unused subscriptions? |
| One-Time Event | What if I pay a $3,000 emergency expense? |

## 9. Cash Crunch Detection

A cash crunch occurs when the projected ending balance for a month falls below a configured threshold. The default threshold should be zero dollars, but users may later configure a higher safety threshold.

- Flag any month with projected ending balance below the threshold.
- Show the first projected cash crunch month on the dashboard.
- Recommend reducing optional goal contributions before flagging essential expenses.
- Include cash crunch data in scenario comparison output.

## 10. Goal Envelope Interaction

The Forecasting Engine supports goal-based envelopes by recommending monthly contributions that help users reach target dates while respecting expected cash flow. If the forecast shows a future negative balance, recommended contributions may be reduced or deferred.

## 11. API Integration

| Endpoint | Purpose |
| --- | --- |
| `GET /api/v1/forecast` | Return baseline forecast data. |
| `POST /api/v1/forecast/recalculate` | Force forecast recalculation after data changes. |
| `GET /api/v1/scenarios/{id}/forecast` | Return forecast data for a saved scenario. |
| `POST /api/v1/scenarios/compare` | Compare baseline forecast against one or more scenarios. |

## 12. Implementation Notes

- Implement the engine as a backend TypeScript service inside the NestJS API.
- Keep calculation logic separate from controllers and database access.
- Use unit tests for recurrence expansion, monthly calculations, cash crunch detection, and scenario overlays.
- Return normalized JSON that can be consumed directly by Angular and Apache ECharts.
- Avoid storing every generated forecast unless caching becomes necessary.

## 13. Initial Test Cases

| Test Case | Expected Result |
| --- | --- |
| Recurring paycheck twice per month | Income appears in each affected forecast month. |
| Monthly rent payment | Expense appears once per month. |
| Inactive subscription | Expense is excluded from forecast. |
| 10% pay cut scenario | Scenario forecast shows reduced monthly income. |
| New mortgage scenario | Scenario forecast includes new recurring housing expense. |
| Negative projected balance | Cash crunch warning is returned. |

## 14. Conclusion

The Forecasting Engine is the core business capability of FutureFlow. Its design emphasizes deterministic calculations, clear separation from baseline data, scenario flexibility, and chart-ready output for the user interface. This initial design is intentionally concise and will be refined during implementation.
