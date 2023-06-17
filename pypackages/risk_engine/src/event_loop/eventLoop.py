import queue


class EventLoop(object):
    def __init__(self, events, index, strategy, executionHandler, portfolio):

        self.events = events
        self.oracle_index = index
        self.trading_strategy = strategy
        self.executionHandler = executionHandler
        self.portfolio = portfolio

    def run_outer_loop(self):

        while True:
            # Update the oracle feed
            if self.oracle_index.continue_backtest:
                self.oracle_index.update_oracle_index()
            else:
                break

            self.run_inner_loop()

    def run_inner_loop(self):

        # Handle the events
        while True:
            try:
                event = self.events.get(False)
            except queue.Empty:
                break

            if event is not None:
                if event.type == "MARKET":
                    self.strategy.calculate_signals(event=event)
                    self.portfolio.update_timeindex(event=event)

                elif event.type == "TRADING":
                    self.portfolio.update_signal(event=event)

                elif event.type == "ORDER":
                    self.executionHandler.execute_order(event=event)

                elif event.type == "FILL":
                    self.portfolio.update_fill(event=event)