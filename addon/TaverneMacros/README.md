# TaverneMacros

Les macros de votre classe, créées en un clic, pour les neuf classes : des macros de base, cochées d'office, et des
macros au choix ; une macro raciale par race et des macros communes à toutes les classes. Addon de La Taverne Éternelle.

## Commandes

| Commande | Effet |
|---|---|
| `/tm` | ouvre la fenêtre de choix : une case par macro, places libres, « Installer la sélection » |
| `/tm installer` | crée (ou met à jour) les macros cochées et retire les macros de l'addon décochées |
| `/tm installer tout` | coche et installe toutes les macros de la classe, dans la limite des places |
| `/tm liste` | affiche les macros de la classe, cochées ou non, et leurs touches |
| `/tm ajouter <nom>` · `/tm enlever <nom>` | coche ou décoche une macro (puis `/tm installer`) |
| `/tm defaut` | revient aux macros de base |
| `/tm nourriture <nom>` | chasseur : nourriture ajoutée à la macro « Nourrir » |
| `/tm retirer` | supprime toutes les macros créées par l'addon |

Un personnage n'a que 18 places de macros : la fenêtre compte celles qui restent et signale en rouge une sélection trop grande.
Les macros arrivent dans l'onglet du personnage (Échap > Macros) : glissez-les sur vos barres. Le nom de chaque sort vient du
jeu, d'après son identifiant : elles marchent avec un client français comme anglais. Un sort pas encore appris n'empêche pas
l'installation : la macro servira dès qu'il sera connu. Identifiants et noms de secours lus dans les fichiers du jeu de Forever
(`scripts/addon-macros.py` du site). Une macro ne lance qu'un sort par appui : l'addon ne joue pas à votre place.

Touches : **Maj**, **Ctrl** et **Alt** choisissent une variante en appuyant sur la macro. « Survol » : la cible sous la souris
passe avant votre cible, puis vous-même pour un soin ou un renfort.

## Guerrier (9 de base, 18 au choix)

| Macro | Effet | |
|---|---|---|
| Charge | Charge en posture de combat, Interception en berserker, sinon passe en posture de combat | base |
| Frappe | Frappe héroïque · Maj : Enchaînement | base |
| Postures | posture de combat · Maj : défensive · Ctrl : berserker | base |
| Pourfendre | Pourfendre · Maj : Brise-genou | base |
| Fulgurance | Fulgurance (passe en posture de combat si besoin) | base |
| Exécution | Exécution, attaque en continu | base |
| Cris | Cri de guerre · Maj : Cri démoralisant | base |
| Interruption | Coup de bouclier en défensive, Volée de coups en berserker | base |
| Provocation | Provocation (passe en posture défensive si besoin) | base |
| Tonnerre | Coup de tonnerre (passe en posture de combat si besoin) | au choix |
| Fracasser | Fracasser armure, attaque en continu | au choix |
| Vengeance | Vengeance (passe en posture défensive si besoin) | au choix |
| Blocage | Maîtrise du blocage · Maj : Mur protecteur | au choix |
| Tourbillon | Tourbillon (passe en posture berserker si besoin) | au choix |
| Rage | Rage sanguinaire · Maj : Rage berserker | au choix |
| Intimidation | Cri d'intimidation · Maj : Cri de défi | au choix |
| Recharges | le grand temps de recharge de la posture : Représailles, Mur protecteur ou Témérité | au choix |
| Victoire | Ivresse de la victoire après une victime | au choix |
| Coup de talent | Frappe mortelle, Sanguinaire ou Heurt de bouclier : celui de vos talents | au choix |
| Moquerie | Coup railleur (passe en posture de combat si besoin) | au choix |
| Désarmer | Désarmement (passe en posture défensive si besoin) | au choix |
| Hurlement | Hurlement perçant, ralentit les ennemis proches | au choix |
| Dernier rempart | Dernier rempart | au choix |
| Circulaires | Attaques circulaires (passe en posture de combat si besoin) | au choix |
| Souhait mortel | Souhait mortel | au choix |
| Heurtoir | Heurtoir, attaque en continu | au choix |
| Bourrasque | Bourrasque, étourdit la cible | au choix |

## Paladin (8 de base, 18 au choix)

| Macro | Effet | |
|---|---|---|
| Jugement | Jugement, attaque en continu | base |
| Sceaux | Sceau de piété · Maj : du Croisé · Ctrl : de justice | base |
| Soins | Lumière sacrée sur la cible survolée, sinon votre cible, sinon vous · Maj : Éclair lumineux | base |
| Bénédiction | Bénédiction de puissance · Maj : de sagesse (cible amie, sinon vous) | base |
| Auras | Aura de dévotion · Maj : de vindicte · Ctrl : de concentration | base |
| Protection | Protection divine · Maj : Imposition des mains | base |
| Marteau | Marteau de la justice, interrompt votre incantation | base |
| Purification | Purification sur la cible survolée, sinon votre cible, sinon vous | base |
| Exorcisme | Exorcisme (morts-vivants et démons) | au choix |
| Courroux | Marteau de courroux sur une cible affaiblie | au choix |
| Consécration | Consécration | au choix |
| Bouclier divin | Bouclier divin · Maj : Intervention divine sur un allié | au choix |
| Protéger ami | Bénédiction de protection (survol, cible, vous) · Maj : de liberté | au choix |
| Rédemption | Rédemption sur l'allié mort survolé, sinon votre cible | au choix |
| Fureur | Fureur vertueuse, pour tenir les monstres | au choix |
| Nettoyage | Épuration sur la cible survolée, sinon votre cible, sinon vous | au choix |
| Frappe sacrée | Frappe sacrée, attaque en continu | au choix |
| Renvoi | Renvoi des morts-vivants sur la cible survolée, sinon votre cible | au choix |
| Grandes bénéd. | Bénédiction supérieure de puissance · Maj : de sagesse · Ctrl : des rois | au choix |
| Sacrifice | Bénédiction de sacrifice sur l'allié survolé, sinon votre cible | au choix |
| Sceaux 2 | Sceau de sagesse · Maj : de lumière · Ctrl : d'autorité | au choix |
| Horion sacré | Horion sacré : soigne l'allié survolé ou ciblé, frappe l'ennemi ciblé | au choix |
| Repentir | Repentir (survol, sinon cible) | au choix |
| Bouclier sacré | Bouclier sacré | au choix |
| Rois | Bénédiction des rois (cible amie, sinon vous) | au choix |
| Auras résist. | Aura de résistance à l'Ombre · Maj : au Givre · Ctrl : au Feu | au choix |

## Chasseur (12 de base, 17 au choix)

| Macro | Effet | |
|---|---|---|
| Tir+familier | lance le tir automatique (sans l'arrêter) et envoie le familier | base |
| Marque | Marque du chasseur sur la cible, le familier attaque | base |
| Morsure | Morsure de serpent, le familier attaque | base |
| Mêlée | Attaque du raptor · Maj : Coupure d'ailes · Ctrl : Morsure de la mangouste | base |
| Feindre | arrête les attaques, rappelle le familier et feint la mort | base |
| Familier | Guérison du familier · sans familier : Appel · Maj : Ressusciter | base |
| Att. familier | le familier attaque la cible survolée, sinon votre cible | base |
| Rappel fam. | rappelle le familier · Maj : le met aussi en passif | base |
| Aspects | Aspect du faucon · Maj : guépard · Ctrl : singe · Alt : vipère | base |
| Pièges | Piège givrant · Maj : Piège d'immolation | base |
| Nourrir | nourrit le familier (nourriture réglée par /tm nourriture <nom>) | base |
| Tirs | Tir des arcanes · Maj : Trait de choc | base |
| Multi | Flèches multiples · Maj : Salve | au choix |
| Visée | Visée · Maj : Tir rapide | au choix |
| Désengager | Désengagement · Maj : Dissuasion | au choix |
| Dispersion | Flèche de dispersion sur la cible survolée, sinon votre cible | au choix |
| Effrayer | Effrayer une bête (survol, sinon cible) | au choix |
| Piqûres | Piqûre de scorpide · Maj : Morsure de vipère | au choix |
| Fusée | Fusée éclairante | au choix |
| Pistage | Pister les bêtes · Maj : humanoïdes · Ctrl : camouflés | au choix |
| Dompter | Apprivoiser une bête | au choix |
| Pièges 2 | Piège de givre · Maj : Piège explosif | au choix |
| Contre-attaque | Contre-attaque après une parade | au choix |
| Intimidation | Intimidation : le familier étourdit sa cible | au choix |
| Courroux | Courroux bestial du familier | au choix |
| Aspects 2 | Aspect de la meute · Maj : de la nature | au choix |
| Tranquilliser | Tir tranquillisant, calme une cible enragée | au choix |
| Bête | Connaissance des bêtes · Maj : Renvoyer le familier | au choix |
| Précision | Aura de précision | au choix |

## Voleur (9 de base, 14 au choix)

| Macro | Effet | |
|---|---|---|
| Ouverture | Coup bas en camouflage · Maj : Garrot · hors camouflage : Attaque pernicieuse | base |
| Attaque | Attaque pernicieuse · Maj : Attaque sournoise | base |
| Finisseur | Éviscération · Maj : Débiter | base |
| Camouflage | Camouflage (sans l'annuler par un second appui) | base |
| Coup de pied | Coup de pied (interruption) | base |
| Assommer | Assommer la cible survolée, sinon votre cible | base |
| Évasion | Évasion · Maj : Sprint | base |
| Suriner | Suriner | base |
| Disparition | Disparition, arrête l'attaque | base |
| Embuscade | Embuscade en camouflage, sinon Attaque sournoise | au choix |
| Coup de rein | Aiguillon perfide · Maj : Rupture | au choix |
| Exposer | Exposer l'armure | au choix |
| Feinte | Feinte, baisse la menace | au choix |
| Cécité | Cécité sur la cible survolée, sinon votre cible | au choix |
| Vol à la tire | Vol à la tire en camouflage, sinon passe en camouflage | au choix |
| Distraction | Distraction à l'endroit du curseur | au choix |
| Déluge | Déluge de lames | au choix |
| Mutilation | Mutilation, attaque en continu | au choix |
| Hémorragie | Hémorragie, attaque en continu | au choix |
| Préméditation | Préméditation (en camouflage) | au choix |
| Désarmer piège | Désarmement de piège | au choix |
| Débiter | Débiter | au choix |
| Sprint | Sprint | au choix |

## Prêtre (8 de base, 19 au choix)

| Macro | Effet | |
|---|---|---|
| Soins | Soins inférieurs sur la cible survolée, sinon votre cible, sinon vous · Maj : Rénovation | base |
| Bouclier | Mot de pouvoir : Bouclier (survol, cible, vous) | base |
| Attaque | Châtiment · Maj : Mot de l'ombre : Douleur | base |
| Baguette | tir à la baguette (sans l'arrêter par un second appui) | base |
| Endurance | Mot de pouvoir : Robustesse (cible amie, sinon vous) | base |
| Feu intérieur | Feu intérieur | base |
| Cri | Cri psychique · Maj : Oubli | base |
| Dissipation | Dissipation de la magie (survol, cible, vous) · Maj : Guérison des maladies | base |
| Gros soins | Soins (survol, cible, vous) · Maj : Soins supérieurs | au choix |
| Soin rapide | Soins rapides (survol, cible, vous) | au choix |
| Mental | Attaque mentale · Maj : Fouet mental | au choix |
| Feu sacré | Flammes sacrées · Maj : Nova sacrée | au choix |
| Résurrection | Résurrection sur l'allié mort survolé, sinon votre cible | au choix |
| Brûlure mana | Brûlure de mana | au choix |
| Entraves | Entraves des morts-vivants (survol, sinon cible) | au choix |
| Pénitence | Pénitence : soigne l'allié survolé ou ciblé, frappe l'ennemi ciblé | au choix |
| Prière soins | Prière de soins pour le groupe | au choix |
| Ombre | Peste dévorante · Maj : Étreinte vampirique | au choix |
| Lévitation | Lévitation (cible amie, sinon vous) | au choix |
| Infusion | Infusion de puissance (survol, cible, vous) | au choix |
| Contrôle | Contrôle mental (survol, sinon cible) | au choix |
| Apaisement | Apaisement (survol, sinon cible) | au choix |
| Maladies | Abolir maladie (survol, cible, vous) | au choix |
| Prières | Prière de robustesse · Maj : Prière d'Esprit | au choix |
| Protections | Protection contre l'Ombre · Maj : Gardien de peur · Ctrl : Esprit divin (cible amie, sinon vous) | au choix |
| Désespoir | Prière du désespoir | au choix |
| Puits | Puits de lumière | au choix |

## Chaman (9 de base, 16 au choix)

| Macro | Effet | |
|---|---|---|
| Éclair | Éclair · Maj : Chaîne d'éclairs | base |
| Horions | Horion de terre · Maj : de givre · Ctrl : de flammes | base |
| Soins | Vague de soins (survol, cible, vous) · Maj : Vague de soins inférieurs | base |
| Arme | Arme Croque-roc · Maj : Langue de feu · Ctrl : Arme de givre | base |
| Totem terre | Totem de force de la terre · Maj : de peau de pierre | base |
| Totem feu | Totem incendiaire · Maj : Nova de feu | base |
| Bouclier | Bouclier de foudre | base |
| Loup fantôme | Loup fantôme | base |
| Purge | Expiation · Maj : Guérison du poison | base |
| Totem eau | Totem guérisseur · Maj : Fontaine de mana · Ctrl : Purification du poison | au choix |
| Totem air | Totem Furie-des-vents · Maj : Grâce aérienne · Ctrl : Glèbe | au choix |
| Totem contrôle | Totem de lien terrestre · Maj : Séisme · Ctrl : Griffes de pierre | au choix |
| Rappel totems | Rappel totémique | au choix |
| Magma | Totem de magma | au choix |
| Résurrection | Esprit ancestral sur l'allié mort survolé, sinon votre cible | au choix |
| Salve | Salve de guérison (survol, cible, vous) · Maj : Remous | au choix |
| Rappel astral | Rappel astral | au choix |
| Frappe tempête | Frappe-tempête, attaque en continu | au choix |
| Arme Furie | Arme Furie-des-vents | au choix |
| Eau | Marche sur l'eau · Maj : Respiration aquatique (cible amie, sinon vous) | au choix |
| Vague de mana | Totem de Vague de mana | au choix |
| Rapidité | Rapidité de la nature | au choix |
| Totems résist. | Totem de résistance au Givre · Maj : au Feu · Ctrl : à la Nature | au choix |
| Totems utiles | Totem de Purification des maladies · Maj : Sentinelle · Ctrl : Mur des vents | au choix |
| Langue de feu | Totem Langue de feu | au choix |

## Mage (10 de base, 21 au choix)

| Macro | Effet | |
|---|---|---|
| Boule de feu | Boule de feu · Maj : Trait de feu | base |
| Givre | Éclair de givre · Maj : Nova de givre | base |
| Mouton | Métamorphose sur la cible survolée, sinon votre cible | base |
| Contresort | Contresort, interrompt votre incantation | base |
| Transfert | Transfert | base |
| Intelligence | Intelligence des Arcanes (cible amie, sinon vous) | base |
| Armure | Armure de givre · Maj : Armure de glace | base |
| Invocations | Invocation d'eau · Maj : de nourriture | base |
| Explosion | Explosion des Arcanes | base |
| Baguette | tir à la baguette (sans l'arrêter par un second appui) | base |
| Projectiles | Projectiles des arcanes · Maj : Déflagration des arcanes | au choix |
| Zone | Blizzard · Maj : Choc de flammes | au choix |
| Cône | Cône de froid | au choix |
| Brûlure | Brûlure | au choix |
| Boucliers | Bouclier de mana · Maj : Barrière de glace | au choix |
| Gardes | Gardien de feu · Maj : Gardien de givre | au choix |
| Bloc de glace | Bloc de glace | au choix |
| Évocation | Évocation | au choix |
| Décurse | Délivrance de la malédiction mineure (survol, cible, vous) | au choix |
| Téléport | Téléportation : Orgrimmar · Maj : Fossoyeuse · Ctrl : Thunder Bluff | au choix · Horde |
| Portail | Portail : Orgrimmar · Maj : Fossoyeuse · Ctrl : Thunder Bluff | au choix · Horde |
| Téléport | Téléportation : Hurlevent · Maj : Forgefer · Ctrl : Darnassus | au choix · Alliance |
| Portail | Portail : Hurlevent · Maj : Forgefer · Ctrl : Darnassus | au choix · Alliance |
| Chute lente | Chute lente (cible amie, sinon vous) | au choix |
| Magie | Amplification de la magie · Maj : Atténuation (cible amie, sinon vous) | au choix |
| Vague | Vague explosive | au choix |
| Pyro | Explosion pyrotechnique · Maj : précédée de Présence spirituelle | au choix |
| Recharges | Pouvoir des arcanes · Maj : Combustion · Ctrl : Morsure du froid | au choix |
| Gemme | Invocation d'une agate de mana · Maj : d'une jade | au choix |
| Illumination | Illumination des arcanes, pour le groupe | au choix |
| Armure mage | Armure du mage | au choix |

## Démoniste (9 de base, 19 au choix)

| Macro | Effet | |
|---|---|---|
| Trait | Trait de l'ombre, le démon attaque | base |
| Afflictions | Corruption · Maj : Plaie d'agonie · Ctrl : Immolation | base |
| Drain | Drain de vie · Maj : Siphon d'âme | base |
| Peur | Peur sur la cible survolée, sinon votre cible | base |
| Connexion | Connexion | base |
| Démon | Invoquer un diablotin · Maj : un marcheur du Vide | base |
| Att. démon | le démon attaque la cible survolée, sinon votre cible | base |
| Armure | Peau de démon · Maj : Armure démoniaque | base |
| Baguette | tir à la baguette (sans l'arrêter par un second appui) | base |
| Malédictions | Malédiction de faiblesse · Maj : de témérité · Ctrl : des langages · Alt : des éléments | au choix |
| Pierres | Pierre de soins · Maj : Pierre d'âme · Ctrl : Pierre de feu | au choix |
| Démon 2 | Invoquer une succube · Maj : un chasseur corrompu | au choix |
| Canal | Captation de vie vers le démon | au choix |
| Bannir | Bannir la cible survolée, sinon votre cible | au choix |
| Hurlement | Hurlement de terreur · Maj : Voile mortel | au choix |
| Douleur | Douleur brûlante · Maj : Feu de l'âme | au choix |
| Pluie de feu | Pluie de feu · Maj : Flammes infernales | au choix |
| Drain mana | Drain de mana | au choix |
| Rituel | Rituel d'invocation | au choix |
| Asservir | Asservir démon (survol, sinon cible) | au choix |
| Brûlure | Brûlure de l'ombre | au choix |
| Conflagration | Conflagration | au choix |
| Siphon | Siphon de vie | au choix |
| Gardien ombre | Gardien de l'ombre | au choix |
| Respiration | Respiration interminable · Maj : Détection de l'invisibilité (cible amie, sinon vous) | au choix |
| Inferno | Inferno à l'endroit du curseur | au choix |
| Lien | Lien spirituel | au choix |
| Pierre de sort | Création de Pierre de sort | au choix |

## Druide (9 de base, 26 au choix)

| Macro | Effet | |
|---|---|---|
| Colère | Colère · Maj : Éclat lunaire | base |
| Soins | Toucher guérisseur (survol, cible, vous) · Maj : Récupération | base |
| Formes | forme d'ours · Maj : de félin · Ctrl : de voyage | base |
| Ours | Mutiler en forme d'ours · Maj : Rugissement démoralisant | base |
| Félin | Griffe en forme de félin · Maj : Déchirure | base |
| Humanoïde | quitte la forme de combat ou de voyage | base |
| Marque | Marque du fauve (cible amie, sinon vous) | base |
| Épines | Épines (cible amie, sinon vous) | base |
| Racines | Sarments sur la cible survolée, sinon votre cible | base |
| Feu stellaire | Feu stellaire · Maj : Essaim d'insectes | au choix |
| Lucioles | Lucioles (survol, sinon cible) | au choix |
| Rétablissement | Rétablissement (survol, cible, vous) | au choix |
| Innervation | Innervation (cible amie, sinon vous) | au choix |
| Renaissance | Renaissance sur l'allié mort survolé, sinon votre cible | au choix |
| Lambeau | Lambeau en forme de félin · camouflé : Ravager | au choix |
| Griffure | Griffure en forme de félin | au choix |
| Rôder | Rôder (passe en forme de félin si besoin) | au choix |
| Grognement | Grondement en forme d'ours · Maj : Sonner | au choix |
| Hibernation | Hibernation (survol, sinon cible) | au choix |
| Écorce | Écorce | au choix |
| Purif. druide | Délivrance de la malédiction (survol, cible, vous) · Maj : Abolir le poison | au choix |
| Emprise | Emprise de la nature | au choix |
| Ouragan | Ouragan · Maj : Tranquillité | au choix |
| Prompte | Prompte guérison (survol, cible, vous) · Maj : Croissance sauvage | au choix |
| Rapidité | Rapidité de la nature | au choix |
| Célérité | Célérité (passe en forme de félin si besoin) | au choix |
| Morsure | Morsure féroce en forme de félin | au choix |
| Traquenard | Traquenard en félin camouflé, sinon Rôder | au choix |
| Charge ours | Charge farouche en forme d'ours | au choix |
| Ours défense | Régénération frénétique · Maj : Rugissement provocateur · Ctrl : Enrager (forme d'ours) | au choix |
| Balayage | Balayage en forme d'ours | au choix |
| Sélénien | Forme de sélénien | au choix |
| Don du fauve | Don du fauve, pour le groupe | au choix |
| Reflet-de-Lune | Téléportation : Reflet-de-Lune | au choix |
| Aquatique | Forme aquatique | au choix |

## Macro raciale (toutes les classes, cochée d'office)

Une macro « Raciale » par race, avec les capacités raciales de Forever (lues dans les fichiers du jeu). Pour une race que le jeu nomme autrement, l'addon reconnaît la race à la capacité que le personnage connaît.

| Race | Macro « Raciale » |
|---|---|
| Humain | Volonté de survie (étourdissements) · Maj : Perception |
| Nain | Forme de pierre · Maj : Découverte de trésors |
| Elfe de la nuit | Camouflage dans l'ombre · Maj : Lumière d'Élune |
| Gnome | Maître de l'évasion · Maj : Eurêka ! |
| Orc | Fureur sanguinaire · Maj : Bris de malédictions |
| Mort-vivant | Volonté des Réprouvés (peur, charme, sommeil) · Maj : Cannibalisme |
| Tauren | Choc martial · Maj : Culture |
| Troll | Berserker · Maj : Régénération rapide |
| Skyborne | Lecture des lignes telluriques · Maj : Marche sur l'air · Ctrl : Vue céleste |

## Macros communes (toutes les classes, au choix)

Les objets sont pris du meilleur au moins bon : le premier présent dans vos sacs sert.

| Macro | Effet | |
|---|---|---|
| Foyer | Pierre de foyer | au choix |
| Potion | la meilleure potion de soins de vos sacs | au choix |
| Bandage | le meilleur bandage de vos sacs, sur vous | au choix |
| Cible | cible l'ennemi le plus proche quand vous n'avez pas d'ennemi vivant ciblé | au choix |
| Assistance | prend la cible de l'allié survolé, sinon de votre cible | au choix |
| Crâne | pose le crâne sur votre cible | au choix |
