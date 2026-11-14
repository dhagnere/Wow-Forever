﻿# Installe la voix de Jobwow (Chatterbox Multilingual, Resemble AI, licence MIT) sur ce PC Windows : une seule fois.
#   npm run voix:installer
# Ensuite : npm run carnet:voix -- "<vidéo>.narration.json"
#
# Tout s'installe dans un environnement à part, le dossier .voix du site : le Python du PC n'est pas modifié.
# Chatterbox demande Python 3.10 à 3.14 (PyTorch audio n'existe pas encore pour 3.15). Le script choisit une version
# compatible parmi celles installées ; s'il n'en trouve pas, il installe Python 3.12 à côté de la dernière version
# (gestionnaire « py install »), sans la remplacer. Il faut environ 5 Go libres.

$ErrorActionPreference = "Stop"
$racine = Split-Path -Parent $PSScriptRoot
$env_voix = Join-Path $racine ".voix"
$pyVoix = Join-Path $env_voix "Scripts\python.exe"

function Essai([string[]]$cmd) {
    try {
        $exe = $cmd[0]; $reste = @($cmd | Select-Object -Skip 1)
        $v = & $exe @reste -c "import sys; print('%d.%d' % sys.version_info[:2])" 2>$null
        if ($LASTEXITCODE -eq 0 -and $v -match '^3\.(1[0-4])$') { return $true }
    } catch {}
    return $false
}

function TrouverPython {
    if (Get-Command py -ErrorAction SilentlyContinue) {
        foreach ($v in "3.12", "3.11", "3.13", "3.14", "3.10") {
            if (Essai @("py", "-$v")) { return @("py", "-$v") }
        }
    }
    if ((Get-Command python -ErrorAction SilentlyContinue) -and (Essai @("python"))) { return @("python") }
    return $null
}

function PyVoix {
    & $pyVoix @args
    if ($LASTEXITCODE -ne 0) { throw "Python a échoué : $args" }
}

Write-Host "1/5 Python compatible" -ForegroundColor Yellow
$python = TrouverPython
if (-not $python -and (Get-Command py -ErrorAction SilentlyContinue)) {
    Write-Host "Votre Python est trop récent pour PyTorch audio : installation de Python 3.12 à côté (il ne remplace rien)."
    & py install 3.12
    $python = TrouverPython
}
if (-not $python) {
    Write-Host "Aucun Python entre 3.10 et 3.14. Installez Python 3.12 depuis https://www.python.org/downloads/ (il cohabite avec la dernière version), puis relancez." -ForegroundColor Red
    exit 1
}
$exe = $python[0]; $opt = @($python | Select-Object -Skip 1)
Write-Host ("Python retenu : " + (& $exe @opt --version))

$libre = [math]::Round((Get-PSDrive -Name ((Get-Item $racine).PSDrive.Name)).Free / 1GB, 1)
if ($libre -lt 6) { Write-Host "Attention : seulement $libre Go libres sur ce disque ; il en faut environ 5." -ForegroundColor Red }

Write-Host "2/5 Environnement .voix" -ForegroundColor Yellow
if (-not (Test-Path $pyVoix)) {
    & $exe @opt -m venv $env_voix
    if ($LASTEXITCODE -ne 0) { throw "Création de l'environnement .voix impossible." }
}
PyVoix -m pip install --upgrade pip

Write-Host "3/5 Chatterbox (et PyTorch)" -ForegroundColor Yellow
PyVoix -m pip install chatterbox-tts

Write-Host "4/5 Carte graphique" -ForegroundColor Yellow
if (Get-Command nvidia-smi -ErrorAction SilentlyContinue) {
    # même version de PyTorch, construite pour CUDA : bien plus rapide qu'au processeur
    $torch = (PyVoix -c "import torch; print(torch.__version__.split('+')[0])").Trim()
    $audio = (PyVoix -c "import torchaudio; print(torchaudio.__version__.split('+')[0])").Trim()
    $fait = $false
    foreach ($cuda in "cu128", "cu126", "cu130", "cu124") {
        Write-Host "Carte NVIDIA trouvée : essai de PyTorch $torch pour CUDA ($cuda)."
        & $pyVoix -m pip install --force-reinstall --no-deps "torch==$torch" "torchaudio==$audio" --index-url "https://download.pytorch.org/whl/$cuda"
        if ($LASTEXITCODE -eq 0) { $fait = $true; break }
    }
    if (-not $fait) { Write-Host "Pas de PyTorch CUDA pour cette version : calcul au processeur." -ForegroundColor Red }
} else {
    Write-Host "Pas de carte NVIDIA : la voix sera calculée par le processeur (plus lent, mais sans limite)."
}

Write-Host "5/5 Téléchargement du modèle" -ForegroundColor Yellow
PyVoix -c "import torch; from chatterbox.mtl_tts import ChatterboxMultilingualTTS as M; d='cuda' if torch.cuda.is_available() else 'cpu'; M.from_pretrained(device=d); print('Voix de Jobwow prête, calcul sur ' + d)"

Write-Host "Terminé. Lancez : npm run carnet:voix -- `"<vidéo>.narration.json`"" -ForegroundColor Green
