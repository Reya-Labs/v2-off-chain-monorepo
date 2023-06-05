def get_rate_given_apy(rate_start, time, apy_in_between, compounding=True):
    if compounding:
        return rate_start * ((1 + apy_in_between) ** time)

    return rate_start + (apy_in_between * time)
