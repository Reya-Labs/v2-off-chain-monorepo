class Event(object):
    """
    Event is base class providing an interface for all subsequent
    (inherited) events, that will trigger further events in the
    trading infrastructure.
    """

    pass


class MarketEvent(Event):
    """
    Handles the event of receiving a new market update with
    corresponding rates data.
    """

    def __init__(self):
        """
        Initialises the MarketEvent.
        """
        self.type = "MARKET"


class TradingEvent(Event):

    """
    Handles the event of sending a specific tarding instruction
    from a TradingStrategy object.
    This is received by a Portfolio object and acted upon.
    """

    def __init__(self, token, direction, timestamp, block):
        """
        Initialises the TradingEvent.
        Parameters:
        token - Underlying yield bearing pool, e.g. "Aave USDC"
        timestamp - The timestamp at which the signal was generated
        block - correspond block to timestamp
        direction - 'LONG' or 'SHORT'.
        """

        self.type = "TRADING"
        self.token = token
        self.timestamp = timestamp
        self.block = block
        self.direction = direction


class OrderEvent(Event):
    """
    Handles the event of sending an Order to an execution system.
    The order contains a token (e.g. "Aave USDC"),
    notional and a direction.
    """

    def __init__(self, token, direction, timestamp, block, notional, margin):
        """
        Initialises the order event which has
        a notional traded and its direction, LONG or SHORT
        Parameters:
        token - Underlying yield bearing pool, e.g. "Aave USDC"
        timestamp - The timestamp at which the signal was generated
        block - Correspond block to timestamp
        direction - 'LONG' or 'SHORT'.
        notional - Non-negative integer for notional amount (margin*leverage) traded
        margin   - Non-negative integer for margin amount (i.e. collateral to support the IRS position)
        """

        self.type = "ORDER"
        self.token = token
        self.timestamp = timestamp
        self.block = block
        self.direction = direction
        self.notional = notional
        self.margin = margin

    def print_order(self):
        """
        Outputs the values within the Order.
        """
        print(
            "Order: Token=%s, Timestamp=%s, Block=%s, Notional=%s, Notional=%s, Direction=%s"
            % (self.token, self.timestamp, self.block, self.notional, self.margin, self.direction)
        )


class FillEvent(Event):
    """
    Encapsulates the notion of a filled order, as returned
    from the protocol after executing the trade.
    Stores the notional actually traded and at what fixed rate.
    In addition, stores the fees of the trade collected by liquidity providers.
    """

    def __init__(self, token, fee, timestamp, block, notional, margin, direction, slippage):
        """
        Initialises the FillEvent object. Sets the token, slippage,
        fees, timestamp, notional & direction
        Parameters:
        token - Underlying yield bearing pool, e.g. "Aave USDC"
        timestamp - The timestamp at which the signal was generated
        block - correspond block to timestamp
        direction - 'LONG' or 'SHORT'.
        notional - Non-negative integer for notional amount (margin*leverage) traded
        margin   - Non-negative integer for margin amount (i.e. collateral to support the position)
        fee      - fee paid by the trader to the liquidity providers in the pool
        slippage - Provide a slippage estimate
        """

        self.type = "FILL"
        self.token = token
        self.timestamp = timestamp
        self.block = block
        self.direction = direction
        self.notional = notional
        self.margin = margin
        self.fee = fee
        self.slippage = slippage