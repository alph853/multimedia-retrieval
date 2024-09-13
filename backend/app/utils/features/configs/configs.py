import os


def GET_PROJECT_ROOT(root: str) -> str:
    current_abspath = os.path.abspath(__file__)
    while True:
        if os.path.split(current_abspath)[1] == root:
            project_root = current_abspath
            break
        elif current_abspath == os.path.dirname(current_abspath):  # Root directory reached
            raise FileNotFoundError(f"The specified project root '{root}' was not found.")
        else:
            current_abspath = os.path.dirname(current_abspath)
    return project_root


ROOT = GET_PROJECT_ROOT('multimedia-retrieval')
PROJECT_ROOT = os.path.join(ROOT, 'backend', 'app')
FRONTEND_ROOT = os.path.join(ROOT, 'frontend')
