
from abc import ABCMeta, abstractmethod


class Portfolio(object):
    """
    The Portfolio class handles the positions and market
    value of all contracts at a resolution of a "bar",
    i.e. one block or one day
    """

    __metaclass__ = ABCMeta

    @abstractmethod
    def update_signal(self, event):
        """
        Acts on a TradingEvent to generate new orders
        based on the portfolio logic.
        """
        raise NotImplementedError("Should implement update_signal()")

    @abstractmethod
    def update_fill(self, event):
        """
        Updates the portfolio current positions and holdings
        from a FillEvent.
        """
        raise NotImplementedError("Should implement update_fill()")

    @abstractmethod
    def output_csv(self):
        """
        Parses trading instructions into a CSV
        """
        raise NotImplementedError("Should implement output_csv()")