from abc import ABCMeta, abstractmethod


class WalkForwardTrades(object):

    __metaclass__ = ABCMeta

    @abstractmethod
    def run_backtest(self):

        raise NotImplementedError("Should implement run_backtest()")