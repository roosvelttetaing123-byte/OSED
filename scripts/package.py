"""Create a source snapshot with resolved build locks, excluding private/generated data."""
from pathlib import Path
from zipfile import ZipFile, ZIP_DEFLATED
root=Path(__file__).resolve().parents[1]
(root/'release').mkdir(exist_ok=True)
with ZipFile(root/'release/OSED-Forge-Source.zip','w',ZIP_DEFLATED) as z:
    for base in ['web','src-tauri','scripts','tests','labs','.github']:
        for p in (root/base).rglob('*'):
            if p.is_file() and not set(p.relative_to(root).parts)&{'target','bin','gen','icons','__pycache__'}:
                z.write(p,p.relative_to(root))
    for name in ['package.json','package-lock.json','README.md','RELEASE_NOTES.md','.gitignore']:
        p=root/name
        if p.exists():z.write(p,name)
