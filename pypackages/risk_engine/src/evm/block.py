from __future__ import (  # https://stackoverflow.com/questions/33533148/how-do-i-type-hint-a-method-with-the-type-of-the-enclosing-class
    annotations,
)

FIRST_MAINNET_POS_BLOCK = 15537394
FIRST_MAINNET_POS_BLOCK_TIMESTAMP = 1663220562
POS_SECONDS_PER_BLOCK = 12


class Block:
    def __init__(self, relative_block_position: int):
        self.number: int = 0
        self.timestamp: int = 0

        self.relative_block_position = relative_block_position
        self._update()

    def _update(self):
        self.number = FIRST_MAINNET_POS_BLOCK + self.relative_block_position
        self.timestamp = FIRST_MAINNET_POS_BLOCK_TIMESTAMP + (
            self.relative_block_position * POS_SECONDS_PER_BLOCK
        )

    def next(
        self,
    ) -> Block:
        """Increments the block and timestamp of this block as if one new block has been added to the blockchain. Also returns the new block for convenience."""
        return self.skip_forward_block(1)

    def skip_forward_block(self, blocks_to_move_forward: int) -> Block:
        """Increments the block and timestamp of this block as if one new block has been added to the blockchain. Also returns the new block for convenience."""
        self.relative_block_position += blocks_to_move_forward
        self._update()
        return self

    def skip_forward_time(self, time_to_move_forward: int) -> Block:
        """Increments the block and timestamp of this block as if one new block has been added to the blockchain. Also returns the new block for convenience."""
        self.relative_block_position += time_to_move_forward // POS_SECONDS_PER_BLOCK
        self._update()
        return self