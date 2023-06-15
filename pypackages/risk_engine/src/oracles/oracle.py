class Oracle:
    def __init__(self, block, initial_observations=None):
        if initial_observations is None:
            initial_observations = []
        self.block = block
        self.observations = []

        for [timestamp, rate] in initial_observations:
            self._append_rate(timestamp=timestamp, rate=rate)

    def _append_rate(self, timestamp, rate):
        if len(self.observations) > 0 and self.observations[-1][0] > timestamp:
            raise Exception("rate oracle: unchronological timestamps")

        if timestamp > self.block.timestamp:
            raise Exception("rate oracle: appending rate from future")

        self.observations.append([timestamp, rate])

    def capture_rate(self, rate):
        self._append_rate(timestamp=self.block.timestamp, rate=rate)

    def snapshot(self, timestamp):
        if len(self.observations) == 0:
            raise Exception("rate oracle: no observations")

        if timestamp < self.observations[0][0]:
            raise Exception("rate oracle: timestamp too old")

        if timestamp > self.block.timestamp:
            raise Exception("rate oracle: timestamp in future")

        index = 0
        while (
            index + 1 < len(self.observations)
            and self.observations[index + 1][0] <= timestamp
        ):
            index += 1

        return self.observations[index][1]

    def latest(self):
        return self.snapshot(timestamp=self.block.timestamp)
