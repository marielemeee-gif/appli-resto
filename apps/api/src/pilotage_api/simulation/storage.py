import hashlib
import json
from collections.abc import Iterable
from datetime import date, datetime
from pathlib import Path
from typing import Any

from pydantic import BaseModel


def _json_default(value: object) -> str:
    if isinstance(value, (date, datetime)):
        return value.isoformat()
    raise TypeError(f"Unsupported JSON value: {type(value)!r}")


def write_ndjson(path: Path, records: Iterable[BaseModel | dict[str, Any]]) -> int:
    path.parent.mkdir(parents=True, exist_ok=True)
    count = 0
    with path.open("w", encoding="utf-8", newline="\n") as output:
        for record in records:
            payload = record.model_dump(mode="json") if isinstance(record, BaseModel) else record
            output.write(
                json.dumps(payload, ensure_ascii=False, sort_keys=True, default=_json_default)
            )
            output.write("\n")
            count += 1
    return count


def read_ndjson(path: Path) -> list[dict[str, Any]]:
    if not path.exists():
        return []
    return [json.loads(line) for line in path.read_text().splitlines() if line]


def file_sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as source:
        for chunk in iter(lambda: source.read(65536), b""):
            digest.update(chunk)
    return digest.hexdigest()


def build_manifest(root: Path, metadata: dict[str, Any]) -> dict[str, Any]:
    files = {
        str(path.relative_to(root)): {
            "sha256": file_sha256(path),
            "bytes": path.stat().st_size,
        }
        for path in sorted(root.rglob("*.ndjson"))
    }
    manifest = {**metadata, "files": files}
    (root / "manifest.json").write_text(
        json.dumps(manifest, ensure_ascii=False, indent=2, sort_keys=True, default=_json_default)
        + "\n"
    )
    return manifest
