from risk_engine.src.evm.block import Block

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
        self.type: str = "MARKET"


class TradingEvent(Event):

    """
    Handles the event of sending a specific trading instruction
    from a TradingStrategy object.
    This is received by a Portfolio object and acted upon.
    """

    def __init__(self, marketId: str, direction: str, timestamp, block):
        """
        Initialises the TradingEvent.
        Parameters:
        marketId - Underlying yield bearing pool, e.g. "Aave USDC"
        timestamp - The timestamp at which the signal was generated
        block - correspond block to timestamp
        direction - 'LONG' or 'SHORT'.
        """

        '''
        todo: consider aligning with on-chain taker orders signature
        for context: dated irs taker event has the following arguments
        uint128 accountId,
        uint128 marketId,
        uint32 maturityTimestamp,
        int256 baseAmount,
        uint160 priceLimit
        '''

        self.type: str = "TRADING"
        self.marketId: str = marketId
        self.timestamp = timestamp # todo: confirm type
        self.block = block # todo: need to confirm if type is Block
        self.direction: str = direction


class OrderEvent(Event):
    """
    Handles the event of sending an Order to an execution system.
    The order contains a token (e.g. "Aave USDC"),
    notional and a direction.
    """

    def __init__(self, token: str, direction: str, timestamp, block, notional: float, margin: float):
        """
        Initialises the order event which has
        a notional traded and its direction, LONG or SHORT
        Parameters:
        token - Underlying yield bearing pool, e.g. "Aave USDC"
        timestamp - The timestamp at which the signal was generated
        block - Correspond block to timestamp
        direction - 'LONG' or 'SHORT'.
        notional - Non-negative float for notional amount (margin*leverage) traded
        margin   - Non-negative float for margin amount (i.e. collateral to support the IRS position)
        """

        self.type = "ORDER"
        self.token = token
        self.timestamp = timestamp
        self.block = block
        self.direction: str = direction
        self.notional: float = notional
        self.margin: float = margin

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

    def __init__(self, token: str, fee: float, timestamp, block, notional: float, margin: float, direction: str, slippage: float):
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
        self.direction: str = direction
        self.notional: float = notional
        self.margin: float = margin
        self.fee: float = fee
        self.slippage: float = slippage