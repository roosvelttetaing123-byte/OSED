"""Build a self-contained browser edition from the real application modules.

No mock data or bridge is included. Progress uses the existing IndexedDB store.
Only this project's static named ESM imports/exports are supported; unexpected
syntax fails instead of producing an incomplete bundle.
"""
from pathlib import Path
import argparse
import json
import re

ROOT = Path(__file__).resolve().parents[1]
WEB = ROOT / "web"


def bundle():
    done = set()
    chunks = ["window.__forgePortable=true;window.__forgeModules={};"]

    def module(path):
        path = path.resolve()
        key = path.relative_to(WEB).as_posix()
        if key in done:
            return
        code = path.read_text(encoding="utf-8")
        pattern = r"import\s*\{([^}]+)\}\s*from\s*['\"]([^'\"]+)['\"];?"

        def replace(match):
            dep = (path.parent / match[2]).resolve()
            module(dep)
            names = re.sub(r"\s+as\s+", ":", match[1])
            dep_key = json.dumps(dep.relative_to(WEB).as_posix())
            return f"const {{{names}}}=window.__forgeModules[{dep_key}];"

        code = re.sub(pattern, replace, code)
        exports = re.findall(r"export\s+(?:async\s+)?(?:function|const|let)\s+(\w+)", code)
        code = re.sub(r"\bexport\s+", "", code)
        if re.search(r"^\s*(?:import|export)\s", code, re.M):
            raise ValueError(f"Unsupported module syntax in {key}")
        chunks.append(f"window.__forgeModules[{json.dumps(key)}]=(()=>{{\n{code}\nreturn {{{','.join(exports)}}};\n}})();")
        done.add(key)

    module(WEB / "tutor/app.js")
    return "\n".join(chunks)


def build(output):
    html = (WEB / "index.html").read_text(encoding="utf-8")
    html = re.sub(r'<link[^>]+(?:rel="manifest"|rel="icon")[^>]*>', '', html)
    theme = (WEB / "tutor/theme.js").read_text(encoding="utf-8")
    style = (WEB / "tutor/style.css").read_text(encoding="utf-8")
    html = html.replace('<script src="tutor/theme.js"></script>', '<script>'+theme+'</script>')
    html = html.replace('<link rel="stylesheet" href="tutor/style.css">', '<style>'+style+'</style>')
    html = html.replace('<script type="module" src="tutor/app.js"></script>', '<script>'+bundle().replace('</script', '<\\/script')+'</script>')
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text(html, encoding="utf-8")
    print(f"Built {output.name} ({output.stat().st_size:,} bytes)")


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--output", type=Path, default=ROOT / "release/OSED-Forge-Study.html")
    build(parser.parse_args().output)
