from typing import Generic, TypeVar

T = TypeVar("T")


class RingBuffer(Generic[T]):
    """class that implements a not-yet-full buffer"""

    def __init__(self, size_max: int):
        self.max: int = size_max
        self.data: list[T] = []
        self.full = False
        self.cur: int = 0  # Only used when full

    def append(self, x: T):
        """Append an element overwriting the oldest one."""

        if self.full:
            self.data[self.cur] = x
            self.cur = (self.cur + 1) % self.max
        else:
            self.data.append(x)

    def get(self) -> list[T]:
        """Return a list of elements from the oldest to the newest."""
        if self.full:
            return self.data[self.cur :] + self.data[: self.cur]
        else:
            return self.data
