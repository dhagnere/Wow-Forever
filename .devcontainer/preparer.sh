#!/usr/bin/env bash
# Préparation du Codespace, lancée une seule fois à sa création.
set -euo pipefail

npm ci

# Réglages locaux : jamais envoyés sur GitHub (.env.* est ignoré).
if [ ! -f .env.local ]; then
  motdepasse="$(openssl rand -base64 18 | tr -d '/+=' | cut -c1-20)"
  {
    echo "ADMIN_PASSWORD=${motdepasse}"
    echo "SESSION_SECRET=$(openssl rand -hex 32)"
  } > .env.local
  echo
  echo "Mot de passe de /admin pour ce Codespace : ${motdepasse}"
  echo "(il est gardé dans .env.local, propre à ce Codespace)"
  echo
fi

# Attendre la base, puis créer les tables.
for _ in $(seq 1 30); do
  if node -e "const s=require('net').connect(5432,'db');s.on('connect',()=>process.exit(0));s.on('error',()=>process.exit(1))"; then break; fi
  sleep 1
done
npm run db:migrate

echo "Prêt : npm run dev, puis ouvrir le port 3000."
