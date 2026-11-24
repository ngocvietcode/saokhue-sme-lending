"""Where the app keeps its data, read once by the MCP server and the backend.

One app holds both stages: the assessment store at <data>/ and the Sale's dossier
store at <data>/sales/. The handover copies a submitted dossier from the second into
the first, so both processes must agree on the two roots.
"""

from __future__ import annotations

import os
from dataclasses import dataclass
from pathlib import Path


@dataclass(frozen=True)
class AppPaths:
    home: Path
    lending: Path
    sales: Path
    knowledge: Path


def app_paths(app_root: Path) -> AppPaths:
    app_root = Path(app_root)
    lending = Path(os.environ.get("SME_LENDING_DATA") or app_root / "data")
    return AppPaths(
        home=Path(os.environ.get("KIROCREW_HOME") or app_root.parent.parent),
        lending=lending,
        sales=Path(os.environ.get("SME_SALES_DATA") or lending / "sales"),
        knowledge=Path(os.environ.get("SME_LENDING_KNOWLEDGE") or app_root / "knowledge"),
    )
