"""Memory stability regression tests for inventory response construction."""
from __future__ import annotations

import gc
import tracemalloc
from typing import Any

from ploc_cellar import _build_inventory_response
from ploc_cellar.models import Cellar, Rack, RackItem, Wine


def _large_cellar(size: int = 120) -> Cellar:
    """Build a deterministic synthetic cellar with bounded collections."""
    rack = Rack(id="rack-1", name="Test rack")
    wines = {
        f"wine-{index}": Wine(
            id=f"wine-{index}",
            name=f"Wine {index:03d}",
            bottles=1,
            bottles_in_cellar=1,
            vintage=2000 + index % 25,
            appellation="Test appellation",
            color="Red",
            color_rgb=(150, 20, 30),
            classification=None,
            region="Test region",
            country="France",
            grapes="Grape variety",
            cuvee=None,
            comment=None,
            alcohol_percent=None,
            service_temperature_min=None,
            service_temperature_max=None,
            bottle_format="Bottle",
            bottle_volume_l=0.75,
            ploud_pid=None,
            domain="Test domain",
            owner_id=None,
        )
        for index in range(size)
    }
    positions = {
        f"position-{index}": RackItem(
            id=f"position-{index}",
            rack_id=rack.id,
            wine_id=f"wine-{index}",
            row=index // 12,
            column=index % 12,
        )
        for index in range(size)
    }
    return Cellar(
        initialized=True,
        stock_reconstruction_complete=True,
        wines=wines,
        racks={rack.id: rack},
        rack_items=positions,
    )


def test_repeated_inventory_response_builds_do_not_retain_temporary_payloads() -> None:
    """Repeated response generation leaves only bounded traced memory behind."""
    cellar = _large_cellar()
    def build_response() -> dict[str, Any]:
        return _build_inventory_response(
            cellar,
            search="",
            color="",
            image_url_builder=lambda document_id: f"/image/{document_id}",
        )

    warmup = build_response()
    assert len(warmup["wines"]) == len(cellar.wines)
    del warmup
    gc.collect()

    tracemalloc.start()
    try:
        baseline, _ = tracemalloc.get_traced_memory()
        for _ in range(40):
            response = build_response()
            assert len(response["wines"]) == len(cellar.wines)
            assert len(response["rack_items"]) == len(cellar.rack_items)
            del response
        gc.collect()
        current, peak = tracemalloc.get_traced_memory()

        # The threshold is intentionally generous to avoid allocator/test-runner
        # noise while detecting accidental retention of many full responses.
        assert current - baseline < 1_000_000
        assert peak - baseline < 8_000_000
    finally:
        tracemalloc.stop()
