import numpy as np
import random

def cumprod(lst: np.array) -> np.array:
    results = []
    cur = 1
    for n in lst:
        cur *= n
        results.append(cur)
    return results


def get_random() -> float:
    exp = random.randint(-5, -2)
    significand = 0.9 * random.random() + 0.1
    return significand * 10**exp