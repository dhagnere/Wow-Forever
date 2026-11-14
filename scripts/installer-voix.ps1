# Installe la voix de Jobwow (Chatterbox Multilingual, Resemble AI, licence MIT) sur ce PC Windows : une seule fois.
#   npm run voix:installer
# Ensuite : npm run carnet:voix -- "<vidéo>.narration.json"
# Il faut Python 3.11 (python.org, case « Add Python to PATH » cochée) et environ 5 Go libres.

$ErrorActionPreference = "Stop"

function Py {
    if (Get-Command py -ErrorAction SilentlyContinue) { & py -3.11 @args } else { & python @args }
    if ($LASTEXITCODE -ne 0) { throw "Python a échoué : $args" }
}

Write-Host "1/4 Python" -ForegroundColor Yellow
try { Py --version } catch {
    Write-Host "Python 3.11 introuvable. Installez-le depuis https://www.python.org/downloads/ (cochez « Add Python to PATH »), puis relancez." -ForegroundColor Red
    exit 1
}

$libre = [math]::Round((Get-PSDrive -Name ((Get-Location).Drive.Name)).Free / 1GB, 1)
if ($libre -lt 6) { Write-Host "Attention : seulement $libre Go libres sur ce disque ; il en faut environ 5." -ForegroundColor Red }

Write-Host "2/4 Chatterbox (et PyTorch)" -ForegroundColor Yellow
Py -m pip install --upgrade pip
Py -m pip install chatterbox-tts

Write-Host "3/4 Carte graphique" -ForegroundColor Yellow
if (Get-Command nvidia-smi -ErrorAction SilentlyContinue) {
    # même version de PyTorch, construite pour CUDA : bien plus rapide qu'au processeur
    $torch = (Py -c "import torch; print(torch.__version__.split('+')[0])").Trim()
    $audio = (Py -c "import torchaudio; print(torchaudio.__version__.split('+')[0])").Trim()
    $cuda = if ([version]$torch -ge [version]"2.6.0") { "cu126" } else { "cu124" }
    Write-Host "Carte NVIDIA trouvée : PyTorch $torch pour CUDA ($cuda)."
    Py -m pip install --force-reinstall --no-deps "torch==$torch" "torchaudio==$audio" --index-url "https://download.pytorch.org/whl/$cuda"
} else {
    Write-Host "Pas de carte NVIDIA : la voix sera calculée par le processeur (plus lent, mais sans limite)."
}

Write-Host "4/4 Téléchargement du modèle et essai" -ForegroundColor Yellow
Py -c "import torch; from chatterbox.mtl_tts import ChatterboxMultilingualTTS as M; d='cuda' if torch.cuda.is_available() else 'cpu'; M.from_pretrained(device=d); print('Voix de Jobwow prête, calcul sur ' + d)"

Write-Host "Terminé. Lancez : npm run carnet:voix -- `"<vidéo>.narration.json`"" -ForegroundColor Green
