from zkappumstad.tools.modules_info import query_modules_info


def test_query_modules_info():
    modules_info = {
        "module1": "Module 1 information",
        "module2": "Module 2 information",
        "module3": "Module 3 information",
    }
    modules_to_query = ["module1", "module3"]
    expected_result = "Module 1 information\nModule 3 information"

    result = query_modules_info(modules_info, modules_to_query)

    assert result == expected_result


def test_query_modules_info_with_missing_modules():
    modules_info = {
        "module1": "Module 1 information",
        "module2": "Module 2 information",
        "module3": "Module 3 information",
    }
    modules_to_query = ["module1", "module4"]
    expected_result = "Module 1 information"

    result = query_modules_info(modules_info, modules_to_query)

    assert result == expected_result


def test_query_modules_info_with_empty_modules():
    modules_info = {
        "module1": "Module 1 information",
        "module2": "Module 2 information",
        "module3": "Module 3 information",
    }
    modules_to_query = []
    expected_result = ""

    result = query_modules_info(modules_info, modules_to_query)

    assert result == expected_result
