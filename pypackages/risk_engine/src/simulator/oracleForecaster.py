import numpy as np

"""
Kalman filter implemenatation for performing forecasting on oracle time
series.
"""


class OracleForecaster:
    def __init__(self, X: np.array, covariance_matrix: np.array):

        self.delta = 1e-7
        self.wt = self.delta / (1 - self.delta) * np.eye(X.shape[1] + 1)  # Starting system error
        self.vt = 0.006  # Starting measurement error -- based on volatility of the oracle time series
        self.theta = np.zeros(X.shape[1] + 1).reshape(-1, 1)  # Starting hidden state
        self.C = covariance_matrix
        self.R = None
        self.yhat = None

    def kalman_step(self, X_data: np.array, y_data: np.array):
        # X and y are steps in the data and target

        # Observation matrix and forecast, formed by treating the
        # the oracle indexed as the observation
        F = np.c_[np.ones(X_data.shape[0]), X_data]

        y = y_data  # --> this comes from the oracle entry we wish to forecast, which we treat as the observation

        # Assume the prior value of the hidden states, theta_t, is distributed
        # as a multivariate Gaussian with mean a_t and covariance R_t
        if self.R is not None:
            self.R = self.C + self.wt
        else:
            self.R = np.zeros((X_data.shape[1] + 1, X_data.shape[1] + 1))

        # Kalman filter update
        # 1) Prediction of new observation as well as forecast error of that prediction
        yhat = F.dot(self.theta)
        et = y - yhat

        # 2) Qt calculation: the variance of the prediction on the observations (residual variance)
        # Let's add some measurement error at the scale of the returns
        err_matrix = np.diag(np.ones(len(y)) * self.vt)  # This could start as a proper covariance matrix
        Qt = F.dot(self.R).dot(F.T) + err_matrix

        # 3) Posterior value of the hidden states, assuming that the hidden state prior is
        # distributed as a multivariate Gaussian with mean m_t and and covariance C_t
        Kt = self.R @ (F.T) @ np.linalg.inv(Qt)  # Kalman gain

        self.theta += Kt @ et  # State update
        self.R = self.R - Kt @ F.dot(self.R)  # State covariance update

        self.yhat = yhat  # Update the forecast