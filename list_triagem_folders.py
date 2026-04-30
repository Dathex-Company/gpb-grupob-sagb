import pathlib

root_path = pathlib.Path("z:/SagB/_ventures")
all_triagem_folders = [p.as_posix() for p in root_path.rglob("_triagem") if p.is_dir() and p.name == "_triagem"]

for folder in sorted(all_triagem_folders):
    print(folder)
