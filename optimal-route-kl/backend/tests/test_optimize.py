import pytest
from httpx import AsyncClient
from main import app


@pytest.mark.asyncio
async def test_optimize_success():
    async with AsyncClient(app=app, base_url="http://test") as client:
        payload = {"locations": ["1.3000,103.8000", "1.3010,103.8010", "Some Address"]}
        r = await client.post("/optimize", json=payload)
        assert r.status_code == 200
        data = r.json()
        assert "route" in data
        assert len(data["route"]) == 3
        assert "coord" in data["route"][0]


@pytest.mark.asyncio
async def test_optimize_bad_request():
    async with AsyncClient(app=app, base_url="http://test") as client:
        r = await client.post("/optimize", json={"locations": ["only-one"]})
        assert r.status_code == 400