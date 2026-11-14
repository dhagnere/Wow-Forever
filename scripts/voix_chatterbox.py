"""
Voix de Jobwow sur les bulles du Journal (sur le PC de Jobwow, jamais sur le serveur du site) :

    npm run carnet:voix -- "<vidéo>.narration.json" [--reference <audio>] [--exaggeration 0.7] [--cfg 0.3] [--refaire]
    (ou : python scripts/voix_chatterbox.py "<vidéo>.narration.json" …)

Chaque bulle est dite par Chatterbox Multilingual (Resemble AI, licence MIT, français), qui imite le timbre de
l'enregistrement de référence : par défaut visuels/voix/jobwow-reference.mp3, la voix « Gilles » de Piper (jeu
d'enregistrements CC0) passée au traitement « mort-vivant léger ». Réglages choisis le 14/11 : exaggeration 0,7 (jeu de
tavernier), cfg 0,3 (débit lent et posé).

Les fichiers vont dans « voix-<vidéo>/ » à côté de la narration, qui reçoit pour chaque bulle `voix`, `voixTexte` et
`dureeVoix` ; la bulle reste affichée le temps de la phrase. Une bulle déjà dite n'est refaite que si son texte a changé
(ou avec --refaire). Le rendu (npm run carnet:incrustation) mêle ensuite les voix au son du jeu, qu'il baisse pendant
que Jobwow parle.

Installation, une fois : npm run voix:installer (environnement .voix, Python 3.10 à 3.14, PyTorch pour CUDA si une
carte NVIDIA est présente ; sans carte, la génération tourne sur le processeur, plus lentement).
Le modèle se télécharge depuis Hugging Face au premier lancement.
Mentionner dans la description YouTube : « Voix de Jobwow : synthèse vocale (Chatterbox, Resemble AI) ».
"""
import argparse
import json
import os
import sys

RACINE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
REFERENCE = os.path.join(RACINE, "visuels", "voix", "jobwow-reference.mp3")
MARGE = 0.6  # secondes de bulle après la fin de la phrase


def texte_parle(bulle: str) -> str:
    """Texte donné au modèle : apostrophes droites, espaces simples."""
    t = bulle.replace("’", "'").replace(" ", " ").replace(" ", " ")
    return " ".join(t.split())


def main() -> None:
    ap = argparse.ArgumentParser(description="Voix de Jobwow sur les bulles d'une narration")
    ap.add_argument("narration")
    ap.add_argument("--reference", default=REFERENCE)
    ap.add_argument("--exaggeration", type=float, default=0.7)
    ap.add_argument("--cfg", type=float, default=0.3)
    ap.add_argument("--graine", type=int, default=7)
    ap.add_argument("--refaire", action="store_true")
    a = ap.parse_args()

    if not os.path.exists(a.narration):
        sys.exit(f"Narration introuvable : {a.narration}")
    if not os.path.exists(a.reference):
        sys.exit(f"Enregistrement de référence introuvable : {a.reference}")
    with open(a.narration, encoding="utf-8") as f:
        n = json.load(f)

    dossier = os.path.dirname(os.path.abspath(a.narration))
    base = os.path.splitext(os.path.basename(n["video"]))[0]
    sous_dossier = f"voix-{base}"
    os.makedirs(os.path.join(dossier, sous_dossier), exist_ok=True)

    a_faire = []
    for i, m in enumerate(n["moments"]):
        bulle = (m.get("bulle") or "").strip()
        if not bulle:
            continue
        deja = m.get("voix") and m.get("voixTexte") == m["bulle"] and os.path.exists(os.path.join(dossier, m["voix"]))
        if deja and not a.refaire:
            continue
        a_faire.append(i)
    if not a_faire:
        print("Toutes les bulles ont déjà leur voix (--refaire pour tout refaire).")
        return

    import torch
    import torchaudio as ta
    from chatterbox.mtl_tts import ChatterboxMultilingualTTS

    appareil = "cuda" if torch.cuda.is_available() else ("mps" if torch.backends.mps.is_available() else "cpu")
    print(f"Chatterbox sur {appareil} : {len(a_faire)} bulle(s) à dire…")
    modele = ChatterboxMultilingualTTS.from_pretrained(device=appareil)

    for i in a_faire:
        m = n["moments"][i]
        torch.manual_seed(a.graine)
        wav = modele.generate(texte_parle(m["bulle"]), language_id="fr", audio_prompt_path=a.reference,
                              exaggeration=a.exaggeration, cfg_weight=a.cfg)
        nom = f"{sous_dossier}/{i + 1:02d}.wav"
        ta.save(os.path.join(dossier, nom), wav, modele.sr)
        duree = round(wav.shape[-1] / modele.sr, 2)
        m["voix"], m["voixTexte"], m["dureeVoix"] = nom, m["bulle"], duree
        m["duree"] = max(float(m.get("duree", 5)), round(duree + MARGE, 1))
        print(f"  {i + 1:02d} · {duree:4.1f} s · {m['bulle'][:60]}")

    # une bulle allongée peut empiéter sur la suivante : à décaler dans l'atelier
    ms = n["moments"]
    for x, y in zip(ms, ms[1:]):
        if x["seconde"] + x["duree"] > y["seconde"]:
            print(f"Attention : la bulle de {x['seconde']} s déborde sur celle de {y['seconde']} s (à décaler dans l'atelier).")

    with open(a.narration, "w", encoding="utf-8") as f:
        json.dump(n, f, ensure_ascii=False, indent=2)
    print(f"Narration mise à jour : {a.narration}. Relancez le rendu : npm run carnet:incrustation -- \"{a.narration}\"")


if __name__ == "__main__":
    main()
