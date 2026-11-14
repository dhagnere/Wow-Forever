# Ajoute les macros complémentaires de TaverneMacros (Macros.lua) et refait la table des sorts d'après
# content/sorts-jeu.json et content/sorts-jeu.en.json (identifiants et noms des fichiers du jeu de Forever).
#   python3 scripts/addon-macros.py
# Les macros déjà présentes restent les macros de base (installées par défaut) ; celles-ci sont au choix.
import json, re, pathlib

RACINE = pathlib.Path(__file__).resolve().parent.parent
FICHIER = RACINE / "addon/TaverneMacros/Macros.lua"

fr = json.load(open(RACINE / "content/sorts-jeu.json", encoding="utf8"))
en = json.load(open(RACINE / "content/sorts-jeu.en.json", encoding="utf8"))
SORTS_JEU = {}
for cl, spes in fr["classes"].items():
    for i, spe in enumerate(spes):
        noms_en = {s["rangs"][0]["id"]: s["nom"] for s in en["classes"][cl][i]["sorts"] if s["rangs"]}
        for s in spe["sorts"]:
            if not s["rangs"]:
                continue
            r = s["rangs"][0]
            nom_en = noms_en.get(r["id"])
            if nom_en and nom_en not in SORTS_JEU:
                SORTS_JEU[nom_en] = (r["id"], s["nom"])

# Survol d'une cible amie, sinon sa cible, sinon soi ; avec Maj pour la variante.
AMI = "[@mouseover,help,nodead][help,nodead][@player]"
AMI_MAJ = "[mod:shift,@mouseover,help,nodead][mod:shift,help,nodead][mod:shift,@player]"
MORT = "[@mouseover,help,dead][help,dead][]"
ENNEMI = "[@mouseover,harm,nodead][]"

AJOUTS = {
    "WARRIOR": [
        ("Tonnerre", "#showtooltip\n/cast [stance:1] {Thunder Clap}; {Battle Stance}", "Coup de tonnerre (passe en posture de combat si besoin)"),
        ("Fracasser", "#showtooltip\n/startattack\n/cast {Sunder Armor}", "Fracasser armure, attaque en continu"),
        ("Vengeance", "#showtooltip\n/startattack\n/cast [stance:2] {Revenge}; {Defensive Stance}", "Vengeance (passe en posture défensive si besoin)"),
        ("Blocage", "#showtooltip\n/cast [mod:shift] {Shield Wall}; {Shield Block}", "Maîtrise du blocage · Maj : Mur protecteur"),
        ("Tourbillon", "#showtooltip\n/startattack\n/cast [stance:3] {Whirlwind}; {Berserker Stance}", "Tourbillon (passe en posture berserker si besoin)"),
        ("Rage", "#showtooltip\n/cast [mod:shift] {Berserker Rage}; {Bloodrage}", "Rage sanguinaire · Maj : Rage berserker"),
        ("Intimidation", "#showtooltip\n/cast [mod:shift] {Challenging Shout}; {Intimidating Shout}", "Cri d'intimidation · Maj : Cri de défi"),
        ("Recharges", "#showtooltip\n/cast [stance:1] {Retaliation}; [stance:2] {Shield Wall}; [stance:3] {Recklessness}", "le grand temps de recharge de la posture : Représailles, Mur protecteur ou Témérité"),
        ("Victoire", "#showtooltip\n/startattack\n/cast {Victory Rush}", "Ivresse de la victoire après une victime"),
        ("Coup de talent", "#showtooltip\n/startattack\n/cast {Mortal Strike}\n/cast {Bloodthirst}\n/cast {Shield Slam}", "Frappe mortelle, Sanguinaire ou Heurt de bouclier : celui de vos talents"),
        ("Moquerie", "#showtooltip\n/cast [stance:1] {Mocking Blow}; {Battle Stance}", "Coup railleur (passe en posture de combat si besoin)"),
    ],
    "PALADIN": [
        ("Exorcisme", "#showtooltip\n/cast {Exorcism}", "Exorcisme (morts-vivants et démons)"),
        ("Courroux", "#showtooltip\n/cast {Hammer of Wrath}", "Marteau de courroux sur une cible affaiblie"),
        ("Consécration", "#showtooltip\n/cast {Consecration}", "Consécration"),
        ("Bouclier divin", "#showtooltip\n/cast [mod:shift,help] {Divine Intervention}; {Divine Shield}", "Bouclier divin · Maj : Intervention divine sur un allié"),
        ("Protéger ami", "#showtooltip\n/cast " + AMI_MAJ + " {Blessing of Freedom}; " + AMI + " {Blessing of Protection}", "Bénédiction de protection (survol, cible, vous) · Maj : de liberté"),
        ("Rédemption", "#showtooltip\n/cast " + MORT + " {Redemption}", "Rédemption sur l'allié mort survolé, sinon votre cible"),
        ("Fureur", "#showtooltip\n/cast {Righteous Fury}", "Fureur vertueuse, pour tenir les monstres"),
        ("Nettoyage", "#showtooltip\n/cast " + AMI + " {Cleanse}", "Épuration sur la cible survolée, sinon votre cible, sinon vous"),
        ("Frappe sacrée", "#showtooltip\n/startattack\n/cast {Holy Strike}", "Frappe sacrée, attaque en continu"),
        ("Renvoi", "#showtooltip\n/cast " + ENNEMI + " {Turn Undead}", "Renvoi des morts-vivants sur la cible survolée, sinon votre cible"),
        ("Grandes bénéd.", "#showtooltip\n/cast [mod:shift] {Greater Blessing of Wisdom}; [mod:ctrl] {Greater Blessing of Kings}; {Greater Blessing of Might}", "Bénédiction supérieure de puissance · Maj : de sagesse · Ctrl : des rois"),
    ],
    "HUNTER": [
        ("Multi", "#showtooltip\n/cast [mod:shift] {Volley}; {Multi-Shot}", "Flèches multiples · Maj : Salve"),
        ("Visée", "#showtooltip\n/cast [mod:shift] {Rapid Fire}; {Aimed Shot}", "Visée · Maj : Tir rapide"),
        ("Désengager", "#showtooltip\n/cast [mod:shift] {Deterrence}; {Disengage}", "Désengagement · Maj : Dissuasion"),
        ("Dispersion", "#showtooltip\n/cast " + ENNEMI + " {Scatter Shot}", "Flèche de dispersion sur la cible survolée, sinon votre cible"),
        ("Effrayer", "#showtooltip\n/cast " + ENNEMI + " {Scare Beast}", "Effrayer une bête (survol, sinon cible)"),
        ("Piqûres", "#showtooltip\n/cast [mod:shift] {Viper Sting}; {Scorpid Sting}", "Piqûre de scorpide · Maj : Morsure de vipère"),
        ("Fusée", "#showtooltip\n/cast {Flare}", "Fusée éclairante"),
        ("Pistage", "#showtooltip\n/cast [mod:shift] {Track Humanoids}; [mod:ctrl] {Track Hidden}; {Track Beasts}", "Pister les bêtes · Maj : humanoïdes · Ctrl : camouflés"),
        ("Dompter", "#showtooltip\n/cast {Tame Beast}", "Apprivoiser une bête"),
        ("Pièges 2", "#showtooltip\n/cast [mod:shift] {Explosive Trap}; {Frost Trap}", "Piège de givre · Maj : Piège explosif"),
    ],
    "ROGUE": [
        ("Embuscade", "#showtooltip\n/cast [stealth] {Ambush}; {Backstab}", "Embuscade en camouflage, sinon Attaque sournoise"),
        ("Coup de rein", "#showtooltip\n/startattack\n/cast [mod:shift] {Rupture}; {Kidney Shot}", "Aiguillon perfide · Maj : Rupture"),
        ("Exposer", "#showtooltip\n/startattack\n/cast {Expose Armor}", "Exposer l'armure"),
        ("Feinte", "#showtooltip\n/cast {Feint}", "Feinte, baisse la menace"),
        ("Cécité", "#showtooltip\n/cast " + ENNEMI + " {Blind}", "Cécité sur la cible survolée, sinon votre cible"),
        ("Vol à la tire", "#showtooltip\n/cast [stealth] {Pick Pocket}; !{Stealth}", "Vol à la tire en camouflage, sinon passe en camouflage"),
        ("Distraction", "#showtooltip\n/cast [@cursor] {Distract}", "Distraction à l'endroit du curseur"),
        ("Déluge", "#showtooltip\n/cast {Blade Flurry}", "Déluge de lames"),
        ("Mutilation", "#showtooltip\n/startattack\n/cast {Mutilate}", "Mutilation, attaque en continu"),
        ("Hémorragie", "#showtooltip\n/startattack\n/cast {Hemorrhage}", "Hémorragie, attaque en continu"),
    ],
    "PRIEST": [
        ("Gros soins", "#showtooltip\n/cast " + AMI_MAJ + " {Greater Heal}; " + AMI + " {Heal}", "Soins (survol, cible, vous) · Maj : Soins supérieurs"),
        ("Soin rapide", "#showtooltip\n/cast " + AMI + " {Flash Heal}", "Soins rapides (survol, cible, vous)"),
        ("Mental", "#showtooltip\n/cast [mod:shift] {Mind Flay}; {Mind Blast}", "Attaque mentale · Maj : Fouet mental"),
        ("Feu sacré", "#showtooltip\n/cast [mod:shift] {Holy Nova}; {Holy Fire}", "Flammes sacrées · Maj : Nova sacrée"),
        ("Résurrection", "#showtooltip\n/cast " + MORT + " {Resurrection}", "Résurrection sur l'allié mort survolé, sinon votre cible"),
        ("Brûlure mana", "#showtooltip\n/cast {Mana Burn}", "Brûlure de mana"),
        ("Entraves", "#showtooltip\n/cast " + ENNEMI + " {Shackle Undead}", "Entraves des morts-vivants (survol, sinon cible)"),
        ("Pénitence", "#showtooltip\n/cast [@mouseover,help,nodead][help,nodead][harm][@player] {Penance}", "Pénitence : soigne l'allié survolé ou ciblé, frappe l'ennemi ciblé"),
        ("Prière soins", "#showtooltip\n/cast {Prayer of Healing}", "Prière de soins pour le groupe"),
        ("Ombre", "#showtooltip\n/cast [mod:shift] {Vampiric Embrace}; {Devouring Plague}", "Peste dévorante · Maj : Étreinte vampirique"),
        ("Lévitation", "#showtooltip\n/cast [help][@player] {Levitate}", "Lévitation (cible amie, sinon vous)"),
    ],
    "SHAMAN": [
        ("Totem eau", "#showtooltip\n/cast [mod:shift] {Mana Spring Totem}; [mod:ctrl] {Poison Cleansing Totem}; {Healing Stream Totem}", "Totem guérisseur · Maj : Fontaine de mana · Ctrl : Purification du poison"),
        ("Totem air", "#showtooltip\n/cast [mod:shift] {Grace of Air Totem}; [mod:ctrl] {Grounding Totem}; {Windfury Totem}", "Totem Furie-des-vents · Maj : Grâce aérienne · Ctrl : Glèbe"),
        ("Totem contrôle", "#showtooltip\n/cast [mod:shift] {Tremor Totem}; [mod:ctrl] {Stoneclaw Totem}; {Earthbind Totem}", "Totem de lien terrestre · Maj : Séisme · Ctrl : Griffes de pierre"),
        ("Rappel totems", "#showtooltip\n/cast {Totemic Recall}", "Rappel totémique"),
        ("Magma", "#showtooltip\n/cast {Magma Totem}", "Totem de magma"),
        ("Résurrection", "#showtooltip\n/cast " + MORT + " {Ancestral Spirit}", "Esprit ancestral sur l'allié mort survolé, sinon votre cible"),
        ("Salve", "#showtooltip\n/cast " + AMI_MAJ + " {Riptide}; " + AMI + " {Chain Heal}", "Salve de guérison (survol, cible, vous) · Maj : Remous"),
        ("Rappel astral", "#showtooltip\n/cast {Astral Recall}", "Rappel astral"),
        ("Frappe tempête", "#showtooltip\n/startattack\n/cast {Stormstrike}", "Frappe-tempête, attaque en continu"),
        ("Arme Furie", "#showtooltip\n/cast {Windfury Weapon}", "Arme Furie-des-vents"),
    ],
    "MAGE": [
        ("Projectiles", "#showtooltip\n/cast [mod:shift] {Arcane Blast}; {Arcane Missiles}", "Projectiles des arcanes · Maj : Déflagration des arcanes"),
        ("Zone", "#showtooltip\n/cast [mod:shift] {Flamestrike}; {Blizzard}", "Blizzard · Maj : Choc de flammes"),
        ("Cône", "#showtooltip\n/cast {Cone of Cold}", "Cône de froid"),
        ("Brûlure", "#showtooltip\n/cast {Scorch}", "Brûlure"),
        ("Boucliers", "#showtooltip\n/cast [mod:shift] {Ice Barrier}; {Mana Shield}", "Bouclier de mana · Maj : Barrière de glace"),
        ("Gardes", "#showtooltip\n/cast [mod:shift] {Frost Ward}; {Fire Ward}", "Gardien de feu · Maj : Gardien de givre"),
        ("Bloc de glace", "#showtooltip\n/cast {Ice Block}", "Bloc de glace"),
        ("Évocation", "#showtooltip\n/cast {Evocation}", "Évocation"),
        ("Décurse", "#showtooltip\n/cast " + AMI + " {Remove Lesser Curse}", "Délivrance de la malédiction mineure (survol, cible, vous)"),
        ("Téléport", "#showtooltip\n/cast [mod:shift] {Teleport: Undercity}; [mod:ctrl] {Teleport: Thunder Bluff}; {Teleport: Orgrimmar}", "Téléportation : Orgrimmar · Maj : Fossoyeuse · Ctrl : Thunder Bluff", "Horde"),
        ("Portail", "#showtooltip\n/cast [mod:shift] {Portal: Undercity}; [mod:ctrl] {Portal: Thunder Bluff}; {Portal: Orgrimmar}", "Portail : Orgrimmar · Maj : Fossoyeuse · Ctrl : Thunder Bluff", "Horde"),
        ("Téléport", "#showtooltip\n/cast [mod:shift] {Teleport: Ironforge}; [mod:ctrl] {Teleport: Darnassus}; {Teleport: Stormwind}", "Téléportation : Hurlevent · Maj : Forgefer · Ctrl : Darnassus", "Alliance"),
        ("Portail", "#showtooltip\n/cast [mod:shift] {Portal: Ironforge}; [mod:ctrl] {Portal: Darnassus}; {Portal: Stormwind}", "Portail : Hurlevent · Maj : Forgefer · Ctrl : Darnassus", "Alliance"),
    ],
    "WARLOCK": [
        ("Malédictions", "#showtooltip\n/cast [mod:shift] {Curse of Recklessness}; [mod:ctrl] {Curse of Tongues}; [mod:alt] {Curse of the Elements}; {Curse of Weakness}", "Malédiction de faiblesse · Maj : de témérité · Ctrl : des langages · Alt : des éléments"),
        ("Pierres", "#showtooltip\n/cast [mod:shift] {Create Soulstone}; [mod:ctrl] {Create Firestone}; {Create Healthstone}", "Pierre de soins · Maj : Pierre d'âme · Ctrl : Pierre de feu"),
        ("Démon 2", "#showtooltip\n/cast [mod:shift] {Summon Felhunter}; {Summon Succubus}", "Invoquer une succube · Maj : un chasseur corrompu"),
        ("Canal", "#showtooltip\n/cast {Health Funnel}", "Captation de vie vers le démon"),
        ("Bannir", "#showtooltip\n/cast " + ENNEMI + " {Banish}", "Bannir la cible survolée, sinon votre cible"),
        ("Hurlement", "#showtooltip\n/cast [mod:shift] {Death Coil}; {Howl of Terror}", "Hurlement de terreur · Maj : Voile mortel"),
        ("Douleur", "#showtooltip\n/cast [mod:shift] {Soul Fire}; {Searing Pain}", "Douleur brûlante · Maj : Feu de l'âme"),
        ("Pluie de feu", "#showtooltip\n/cast [mod:shift] {Hellfire}; {Rain of Fire}", "Pluie de feu · Maj : Flammes infernales"),
        ("Drain mana", "#showtooltip\n/cast {Drain Mana}", "Drain de mana"),
        ("Rituel", "#showtooltip\n/cast {Ritual of Summoning}", "Rituel d'invocation"),
        ("Asservir", "#showtooltip\n/cast " + ENNEMI + " {Subjugate Demon}", "Asservir démon (survol, sinon cible)"),
    ],
    "DRUID": [
        ("Feu stellaire", "#showtooltip\n/cast [mod:shift] {Insect Swarm}; {Starfire}", "Feu stellaire · Maj : Essaim d'insectes"),
        ("Lucioles", "#showtooltip\n/cast " + ENNEMI + " {Faerie Fire}", "Lucioles (survol, sinon cible)"),
        ("Rétablissement", "#showtooltip\n/cast " + AMI + " {Regrowth}", "Rétablissement (survol, cible, vous)"),
        ("Innervation", "#showtooltip\n/cast [help][@player] {Innervate}", "Innervation (cible amie, sinon vous)"),
        ("Renaissance", "#showtooltip\n/cast " + MORT + " {Rebirth}", "Renaissance sur l'allié mort survolé, sinon votre cible"),
        ("Lambeau", "#showtooltip\n/startattack\n/cast [form:3,stealth] {Ravage}; [form:3] {Shred}; {Cat Form}", "Lambeau en forme de félin · camouflé : Ravager"),
        ("Griffure", "#showtooltip\n/startattack\n/cast [form:3] {Rake}; {Cat Form}", "Griffure en forme de félin"),
        ("Rôder", "#showtooltip\n/cast [form:3] !{Prowl}; {Cat Form}", "Rôder (passe en forme de félin si besoin)"),
        ("Grognement", "#showtooltip\n/startattack\n/cast [form:1,mod:shift] {Bash}; [form:1] {Growl}; {Bear Form}", "Grondement en forme d'ours · Maj : Sonner"),
        ("Hibernation", "#showtooltip\n/cast " + ENNEMI + " {Hibernate}", "Hibernation (survol, sinon cible)"),
        ("Écorce", "#showtooltip\n/cast {Barkskin}", "Écorce"),
        ("Purif. druide", "#showtooltip\n/cast " + AMI_MAJ + " {Abolish Poison}; " + AMI + " {Remove Curse}", "Délivrance de la malédiction (survol, cible, vous) · Maj : Abolir le poison"),
    ],
}

texte = FICHIER.read_text(encoding="utf8")
debut_macros = texte.index("ns.MACROS = {")
existants = {}
classe = None
for ligne in texte[debut_macros:].splitlines():
    m = re.match(r"\s{4}([A-Z]+) = \{$", ligne)
    if m:
        classe = m.group(1); existants[classe] = []
    elif classe and ligne.strip().startswith("{ nom ="):
        existants[classe].append(ligne.strip().rstrip(","))

def lua(s):
    return '"' + s.replace("\\", "\\\\").replace('"', '\\"').replace("\n", "\\n") + '"'

utilises = set()
for lignes in existants.values():
    for l in lignes:
        utilises.update(re.findall(r"\{([^}]+)\}", l.split("modele =")[1].split("aide =")[0]))
for macros in AJOUTS.values():
    for m in macros:
        utilises.update(re.findall(r"\{([^}]+)\}", m[1]))

anciens = dict(re.findall(r'\["([^"]+)"\] = \{ (\d+), "', texte))
manquants = [n for n in sorted(utilises) if n not in SORTS_JEU and n not in anciens]
if manquants:
    raise SystemExit("Sorts absents des fichiers de Forever : " + ", ".join(manquants))

def entree(n):
    if n in anciens:
        fr_nom = re.search(r'\["' + re.escape(n) + r'"\] = \{ \d+, "([^"]*)" \}', texte).group(1)
        return int(anciens[n]), fr_nom
    return SORTS_JEU[n]

sortie = [
    "-- TaverneMacros : sorts et macros de chaque classe. Identifiants et noms français de secours lus dans les fichiers",
    "-- du jeu de Forever (content/sorts-jeu.json du site) ; macros complémentaires ajoutées par scripts/addon-macros.py.",
    "-- Le nom affiché vient du jeu (GetSpellInfo).",
    "local _, ns = ...",
    "",
    "-- nom anglais → { identifiant du premier rang, nom français de secours }",
    "ns.SORTS = {",
]
for n in sorted(utilises):
    i, f = entree(n)
    sortie.append(f'    ["{n}"] = {{ {i}, {lua(f)} }},')
sortie += [
    "}",
    "",
    "-- macros par classe (nom de 16 octets au plus, modèle {Nom anglais du sort}, aide).",
    "-- base = true : installée par défaut ; les autres se choisissent (/tm choix). faction : réservée à une faction.",
    "ns.MACROS = {",
]
for cl in ["WARRIOR", "PALADIN", "HUNTER", "ROGUE", "PRIEST", "SHAMAN", "MAGE", "WARLOCK", "DRUID"]:
    sortie.append(f"    {cl} = {{")
    for l in existants[cl]:
        l = l if "base = true" in l else l[:-1].rstrip() + ", base = true }"
        sortie.append("        " + l + ",")
    for m in AJOUTS[cl]:
        nom, modele, aide = m[0], m[1], m[2]
        if len(nom.encode("utf8")) > 16:
            raise SystemExit(f"Nom trop long : {nom}")
        if len(modele.encode("utf8")) > 255:
            raise SystemExit(f"Macro trop longue : {nom}")
        fac = f", faction = {lua(m[3])}" if len(m) > 3 else ""
        sortie.append(f"        {{ nom = {lua(nom)}, modele = {lua(modele)}, aide = {lua(aide)}{fac} }},")
    sortie.append("    },")
sortie.append("}")
FICHIER.write_text("\n".join(sortie) + "\n", encoding="utf8")
print(f"{len(utilises)} sorts, " + ", ".join(f"{cl} {len(existants[cl])}+{len(AJOUTS[cl])}" for cl in AJOUTS))
