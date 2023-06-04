from unittest import mock

from packages.risk_engine.src.oracles.oracle import Oracle


class MockOracle(Oracle):
    def __init__(self):
        self.latest = mock.Mock()
        self.snapshot = mock.Mock()

    def mock_latest(self, return_value):
        self.latest = mock.Mock(return_value=return_value)

    def mock_snapshot(self, return_value):
        self.snapshot = mock.Mock(return_value=return_value)