from pydantic import BaseModel, Field
from typing import List

class Planners(BaseModel):
    planner_name: str = Field(..., description="Planner name.")
    expenses: List[dict]
    cash_flows: List[dict]
    which_is_higher: str
    difference: float
    total_expenses: float
    total_cash_flows: float


