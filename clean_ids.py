import nbformat
from pathlib import Path
import base64
import os


def generate_short_id():
    """
    Generate a short, URL-safe ID similar to those seen in Jupyter notebooks.
    Encodes 9 random bytes using Base64 (URL-safe variant).
    """
    random_bytes = os.urandom(9)  # 9 random bytes
    return base64.urlsafe_b64encode(random_bytes).decode("utf-8").rstrip("=")


def regenerate_ids(notebook):
    """
    Ensure all cells have unique short IDs and remove `id` from metadata.
    """
    seen_ids = set()
    for cell in notebook.get("cells", []):
        # Regenerate cell IDs if missing or duplicate
        if "id" not in cell or cell["id"] in seen_ids:
            cell["id"] = generate_short_id()
        seen_ids.add(cell["id"])

        # Remove `id` from metadata if it exists
        if "id" in cell.get("metadata", {}):
            cell["metadata"].pop("id", None)


def process_notebook(notebook_path):
    """
    Process a single notebook: validate, regenerate IDs, and clean metadata.
    """
    print(f"Processing: {notebook_path}")

    # Load the notebook
    with open(notebook_path, "r") as f:
        notebook = nbformat.read(f, as_version=nbformat.NO_CONVERT)

    # Check current notebook format
    major = notebook["nbformat"]
    minor = notebook["nbformat_minor"]

    # Upgrade to the latest version if needed
    if major < 4 or (major == 4 and minor < 5):
        # Print the current notebook format version
        print(f"Notebook format version: {major}.{minor}")
        notebook["nbformat"] = 4
        notebook["nbformat_minor"] = 5
        print("Upgraded to notebook format version 4.5")

    # Regenerate IDs and clean metadata
    regenerate_ids(notebook)

    # Validate the notebook to ensure compliance
    nbformat.validate(notebook)

    # Save the updated notebook
    with open(notebook_path, "w") as f:
        nbformat.write(notebook, f)


def process_notebooks_in_directory(directory_path="."):
    """
    Process all Jupyter Notebooks in the specified directory.
    """
    directory = Path(directory_path)
    for notebook_path in directory.glob("*.ipynb"):
        process_notebook(notebook_path)


if __name__ == "__main__":
    # Run the script in the current directory
    process_notebooks_in_directory()
