from pydantic import BaseModel
from typing import Dict, List, Any

class DashboardResponse(BaseModel):
    total_expenses: str
    total_cash_flows: str
    which_is_higher: str
    difference: str
    daily_chart: List[Dict[str, Any]]


