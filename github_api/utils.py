import requests

from config.utils import display_source_code


def get_github_source_code(owner, repo, commit_hash, token, source_path):
    """
    Fetch source code from github
    """
    url = f"https://raw.githubusercontent.com/{owner}/{repo}/{commit_hash}/{source_path}"
    response = requests.get(url, headers={'Authorization': f"token {token}"})
    if response.status_code == 200:
        return display_source_code(source_code=response.content, file_path=source_path)
    return None
