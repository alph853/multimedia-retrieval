import os


def GET_PROJECT_ROOT():
    current_abspath = os.path.abspath(__file__)
    while True:
        if os.path.split(current_abspath)[1] == 'app':
            project_root = current_abspath
            break
        elif current_abspath == os.path.dirname(current_abspath):  # Root directory reached
            raise FileNotFoundError("The specified project root 'app' was not found.")
        else:
            current_abspath = os.path.dirname(current_abspath)
    return project_root


PROJECT_ROOT = GET_PROJECT_ROOT()
