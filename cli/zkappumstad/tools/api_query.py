import requests


def query_index(tool, query):
    url = "https://zkappsumstad.com/api/embeddings"

    payload = {"tool": tool, "query": query}

    try:
        response = requests.post(url, json=payload)
        if response.status_code == 200:
            try:
                return response.text
            except ValueError as e:
                return {
                    "error": f"JSON decoding failed: {str(e)}",
                    "response": response.text,
                }
        else:
            return {
                "error": f"Request failed with status code {response.status_code}",
                "response": response.text,
            }
    except requests.exceptions.RequestException as e:
        return {"error": f"Request failed: {str(e)}"}


def query_project(tool, query, project_name):
    url = "https://zkappsumstad.com/api/embeddings"

    payload = {"tool": tool, "query": query, "project": project_name}

    try:
        response = requests.post(url, json=payload)
        if response.status_code == 200:
            try:
                return response.text
            except ValueError as e:
                return {
                    "error": f"JSON decoding failed: {str(e)}",
                    "response": response.text,
                }
        else:
            return {
                "error": f"Request failed with status code {response.status_code}",
                "response": response.text,
            }
    except requests.exceptions.RequestException as e:
        return {"error": f"Request failed: {str(e)}"}
