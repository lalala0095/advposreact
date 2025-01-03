from fastapi import APIRouter, HTTPException, status, Depends
from app.core.database import db
import pandas as pd
from app.core.auth import verify_token
import logging
from datetime import datetime
from app.core.custom_logging import create_custom_log
from typing import List, Dict
from app.core.database import redis_client
import locale
from app.models.reports import DashboardResponse

locale.setlocale(locale.LC_ALL, 'en_US.UTF-8')
router = APIRouter()

@router.get("/dashboard", response_model=DashboardResponse)
async def get_options(token_data: dict = Depends(verify_token)):
    user_id = token_data['account_id']
    cash_flows_data = await db.cash_flows.find({"user_id": user_id}, {"date_of_transaction": 1, "amount": 1}).to_list(length=None)

    df_cash_flows = pd.DataFrame(cash_flows_data)
    df_cash_flows['date_of_transaction'] = pd.to_datetime(df_cash_flows['date_of_transaction'])
    df_cash_flows['Day'] = df_cash_flows['date_of_transaction'].dt.strftime("%b %d")
    df_pivot_cf = pd.pivot_table(df_cash_flows, values=['amount'], index='Day', aggfunc='sum').reset_index()
    df_pivot_cf.columns = ['Day', 'Amount']
    df_pivot_cf['Amount Text'] = df_pivot_cf['Amount'].apply(lambda x: f"₱{locale.format_string('%.2f', x, grouping=True)}")

    expenses_data = await db.expenses.find({"user_id": user_id}, {"date_of_transaction": 1, "amount": 1}).to_list(length=None)
    df_expenses = pd.DataFrame(expenses_data)
    df_expenses['date_of_transaction'] = pd.to_datetime(df_expenses['date_of_transaction'])
    df_expenses['Day'] = df_expenses['date_of_transaction'].dt.strftime("%b %d")
    df_pivot_exp = pd.pivot_table(df_expenses, values=['amount'], index='Day', aggfunc='sum').reset_index()
    df_pivot_exp.columns = ['Day', 'Amount']
    df_pivot_exp['Amount Text'] = df_pivot_exp['Amount'].apply(lambda x: f"₱{locale.format_string('%.2f', x, grouping=True)}")
    
    df_report = pd.merge(left=df_pivot_cf, right=df_pivot_exp, how='outer', on='Day')
    df_report.columns = ['Day', 'Cash Flows', 'Cash Flows Label', 'Expenses', 'Expenses Label']

    total_expenses = df_report['Expenses'].sum()
    total_expenses = f"₱{locale.format_string('%.2f', total_expenses, grouping=True)}"

    total_cash_flows = df_report['Cash Flows'].sum()
    total_cash_flows = f"₱{locale.format_string('%.2f', total_cash_flows, grouping=True)}"

    if df_report['Expenses'].sum() > df_report['Cash Flows'].sum():
        which_is_higher = "Expenses"
        difference = df_report['Expenses'].sum() - df_report['Cash Flows'].sum()
    elif df_report['Expenses'].sum() < df_report['Cash Flows'].sum():
        which_is_higher = "Cash Flows"
        difference = df_report['Cash Flows'].sum() - df_report['Expenses'].sum()
    else:
        which_is_higher = "Equal"
        difference = 0

    daily_chart = df_report.to_dict(orient="records")

    return {
        "total_expenses": total_expenses,
        "total_cash_flows": total_cash_flows,
        "which_is_higher": which_is_higher,
        "difference": f"₱{locale.format_string('%.2f', difference, grouping=True)}",
        "daily_chart": daily_chart
    }