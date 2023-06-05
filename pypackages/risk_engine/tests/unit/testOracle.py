import unittest
from pypackages.risk_engine.src.evm.block import FIRST_MAINNET_POS_BLOCK_TIMESTAMP, POS_SECONDS_PER_BLOCK, Block
from pypackages.risk_engine.src.oracles.oracle import Oracle


class TestAccountManager(unittest.TestCase):
    def setUp(self):
        self.block = Block(relative_block_position=0)

    def test_initialization(self):
        oracle = Oracle(
            block=self.block,
            initial_observations=[
                [FIRST_MAINNET_POS_BLOCK_TIMESTAMP - 100, 1],
                [FIRST_MAINNET_POS_BLOCK_TIMESTAMP - 1, 1.05],
                [FIRST_MAINNET_POS_BLOCK_TIMESTAMP, 1.06],
            ],
        )

        self.assertEqual(
            oracle.observations,
            [
                [FIRST_MAINNET_POS_BLOCK_TIMESTAMP - 100, 1],
                [FIRST_MAINNET_POS_BLOCK_TIMESTAMP - 1, 1.05],
                [FIRST_MAINNET_POS_BLOCK_TIMESTAMP, 1.06],
            ],
        )

    def test_initialization_unchronological_timestamps(self):
        with self.assertRaisesRegex(Exception, "rate oracle: unchronological timestamps"):
            Oracle(
                block=self.block,
                initial_observations=[
                    [FIRST_MAINNET_POS_BLOCK_TIMESTAMP, 1.05],
                    [FIRST_MAINNET_POS_BLOCK_TIMESTAMP - 1, 1],
                ],
            )

    def test_initialization_future_timestamps(self):
        with self.assertRaisesRegex(Exception, "rate oracle: appending rate from future"):
            Oracle(
                block=self.block,
                initial_observations=[
                    [FIRST_MAINNET_POS_BLOCK_TIMESTAMP, 1],
                    [FIRST_MAINNET_POS_BLOCK_TIMESTAMP + 1, 1.05],
                ],
            )

    def test_capture_rate(self):
        oracle = Oracle(
            block=self.block,
            initial_observations=[
                [FIRST_MAINNET_POS_BLOCK_TIMESTAMP, 1],
            ],
        )

        self.block.skip_forward_block(blocks_to_move_forward=1000)

        oracle.capture_rate(rate=1.05)

        self.assertEqual(
            oracle.observations,
            [
                [FIRST_MAINNET_POS_BLOCK_TIMESTAMP, 1],
                [FIRST_MAINNET_POS_BLOCK_TIMESTAMP + 1000 * POS_SECONDS_PER_BLOCK, 1.05],
            ],
        )

    def test_snapshot_on_empty_oracle(self):
        oracle = Oracle(
            block=self.block,
        )

        with self.assertRaisesRegex(Exception, "rate oracle: no observations"):
            oracle.snapshot(timestamp=FIRST_MAINNET_POS_BLOCK_TIMESTAMP)

    def test_snapshot_on_old_timestamp(self):
        oracle = Oracle(
            block=self.block,
            initial_observations=[
                [FIRST_MAINNET_POS_BLOCK_TIMESTAMP - 100, 1],
                [FIRST_MAINNET_POS_BLOCK_TIMESTAMP - 1, 1.05],
                [FIRST_MAINNET_POS_BLOCK_TIMESTAMP, 1.06],
            ],
        )

        with self.assertRaisesRegex(Exception, "rate oracle: timestamp too old"):
            oracle.snapshot(timestamp=FIRST_MAINNET_POS_BLOCK_TIMESTAMP - 101)

    def test_snapshot_on_future_timestamp(self):
        oracle = Oracle(
            block=self.block,
            initial_observations=[
                [FIRST_MAINNET_POS_BLOCK_TIMESTAMP - 100, 1],
                [FIRST_MAINNET_POS_BLOCK_TIMESTAMP - 1, 1.05],
                [FIRST_MAINNET_POS_BLOCK_TIMESTAMP, 1.06],
            ],
        )

        with self.assertRaisesRegex(Exception, "rate oracle: timestamp in future"):
            oracle.snapshot(timestamp=FIRST_MAINNET_POS_BLOCK_TIMESTAMP + 1)

    def test_snapshot_on_new_timestamp(self):
        oracle = Oracle(
            block=self.block,
            initial_observations=[
                [FIRST_MAINNET_POS_BLOCK_TIMESTAMP - 100, 1],
                [FIRST_MAINNET_POS_BLOCK_TIMESTAMP - 1, 1.05],
                [FIRST_MAINNET_POS_BLOCK_TIMESTAMP, 1.06],
            ],
        )

        self.block.skip_forward_block(blocks_to_move_forward=10)

        self.assertAlmostEqual(oracle.snapshot(timestamp=FIRST_MAINNET_POS_BLOCK_TIMESTAMP - 50), 1)

        self.assertAlmostEqual(oracle.snapshot(timestamp=FIRST_MAINNET_POS_BLOCK_TIMESTAMP - 1), 1.05)

        self.assertAlmostEqual(oracle.snapshot(timestamp=FIRST_MAINNET_POS_BLOCK_TIMESTAMP), 1.06)

        self.assertAlmostEqual(oracle.snapshot(timestamp=FIRST_MAINNET_POS_BLOCK_TIMESTAMP + 10), 1.06)

    def test_latest(self):
        oracle = Oracle(
            block=self.block,
            initial_observations=[
                [FIRST_MAINNET_POS_BLOCK_TIMESTAMP - 100, 1],
                [FIRST_MAINNET_POS_BLOCK_TIMESTAMP - 1, 1.05],
                [FIRST_MAINNET_POS_BLOCK_TIMESTAMP, 1.06],
            ],
        )

        self.block.skip_forward_block(blocks_to_move_forward=10)

        self.assertAlmostEqual(oracle.latest(), 1.06)


if __name__ == "__main__":
    unittest.main()