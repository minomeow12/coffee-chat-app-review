import pytest
from sum_list import sum_list

def test_sum_list_empty():
    assert sum_list([]) == 0

def test_sum_list_single():
    assert sum_list([7]) == 7

def test_sum_list_multiple():
    assert sum_list([1, 2, 3, 4]) == 10

def test_sum_list_with_negatives():
    assert sum_list([-1, 2, -3, 10]) == 8

def test_sum_list_none_raises():
    with pytest.raises(TypeError):
        sum_list(None)

def test_sum_list_non_int_element_raises():
    with pytest.raises(TypeError):
        sum_list([1, "2", 3])

def test_sum_list_float_element_raises():
    with pytest.raises(TypeError):
        sum_list([1, 2.5, 3])

def test_sum_list_non_iterable_raises():
    with pytest.raises(TypeError):
        sum_list(123)  