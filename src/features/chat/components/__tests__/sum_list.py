from typing import Iterable

def sum_list(nums: Iterable[int]) -> int:
    """
    Return the sum of a list of integers.

    Raises:
        TypeError: if nums is not iterable or has non-integers.
    """
    if nums is None:
        raise TypeError("nums must be an iterable of integers, not None")

    total = 0
    for i, n in enumerate(nums):
        if not isinstance(n, int):
            raise TypeError(f"Element at index {i} is not an int: {n!r}")
        total += n
    return total