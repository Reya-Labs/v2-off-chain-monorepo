from abc import ABCMeta, abstractmethod


class OracleHandler(object):
    """
    OracleHandler is an abstract base class providing an interface for
    all subsequent (inherited) data handlers (both live and historic).
    The goal of a (derived) OracleHandler object is to output a generated
    set of rates for each token requested.
    This will replicate how a live strategy would function as current
    market data would be sent "down the pipe". Thus a historic and live
    system will be treated identically by the rest of the backtesting suite.
    """

    __metaclass__ = ABCMeta

    @abstractmethod
    def get_oracle_index(self, token, N=1):
        """
        Returns the last N rates/prices from the latest_token list,
        or fewer if less rates are available.
        """
        raise NotImplementedError("Should implement get_oracle_index()")

    @abstractmethod
    def update_oracle_index(self):
        """
        Pushes the latest rate/pric to the latest token structure
        for all tokens in the token list.
        """
        raise NotImplementedError("Should implement update_oracle()")