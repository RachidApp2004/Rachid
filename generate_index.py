"""Scanne docs/ et régénère data/documents.json.
Nom de fichier attendu : Filiere_Matiere_Source_Annee_Type.pdf  (ex. MP_Maths_CentraleSupelec_2023_Sujet.pdf)"""
import json, pathlib
root = pathlib.Path(__file__).parent
docs = []
for p in sorted((root / "docs").rglob("*")):
    if p.is_file() and p.name != ".gitkeep":
        f = (p.stem.split("_") + ["Autre"] * 5)[:5]
        docs.append({"titre": p.stem.replace("_", " "), "filiere": f[0], "matiere": f[1], "source": f[2],
                     "annee": f[3], "type": f[4], "fichier": p.relative_to(root).as_posix(), "taille": p.stat().st_size})
(root / "data").mkdir(exist_ok=True)
(root / "data" / "documents.json").write_text(json.dumps(docs, ensure_ascii=False, indent=1), encoding="utf-8")
print(len(docs), "documents indexés")
