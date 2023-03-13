from pathlib import Path

print(str(Path(__file__).parent.absolute().parent) + "\\index.html")
with open(str(Path(__file__).parent.absolute().parent) + "\\index.html", 'r') as f:
    print(f.read())