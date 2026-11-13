#!/usr/bin/env bash
# Publica el frontend de NutriVida en la instancia EC2 con Caddy y HTTPS.
# Uso (en la instancia):  bash desplegar-web.sh 50.17.200.0.sslip.io
# Se puede ejecutar más de una vez: recompila el frontend y reaplica la configuración.
set -euo pipefail

DOMINIO="${1:?Indica el dominio, por ejemplo 50.17.200.0.sslip.io}"
REPO="https://github.com/AMunozPSo/Clinica-Nutricional-NutriVida.git"
cd /opt/nutrivida

echo "1/5 Descargando el frontend desde GitHub…"
sudo rm -rf front-src
sudo git clone -q --depth 1 "$REPO" front-src

echo "2/5 Compilando el frontend (contenedor Node, tarda unos minutos)…"
sudo docker run --rm -v "/opt/nutrivida/front-src/Prueba 3/frontend":/app -w /app \
  node:22-alpine sh -c 'npm ci --silent && npm run build'
# Se vacía la carpeta sin borrarla: Caddy la tiene montada y perdería el montaje.
sudo mkdir -p web && sudo find web -mindepth 1 -delete
sudo cp -r "front-src/Prueba 3/frontend/dist/." web/

echo "3/5 Escribiendo el Caddyfile…"
sudo tee Caddyfile >/dev/null <<'EOF'
{$SITE_ADDRESS::80} {
    encode gzip

    @usuarios path_regexp ^/api/v1/(auth|usuarios|profesionales)(/.*)?$
    handle @usuarios {
        reverse_proxy usuarios:8081
    }

    @catalogo path_regexp ^/api/v1/(servicios|categorias)(/.*)?$
    handle @catalogo {
        reverse_proxy catalogo:8082
    }

    @atencion path_regexp ^/api/v1/(citas|pacientes|planes|progreso|contacto)(/.*)?$
    handle @atencion {
        reverse_proxy atencion:8083
    }

    @ventas path_regexp ^/api/v1/pedidos(/.*)?$
    handle @ventas {
        reverse_proxy ventas:8084
    }

    handle {
        root * /srv
        try_files {path} /index.html
        file_server
    }
}
EOF

echo "4/5 Agregando el servicio web al compose y ajustando el .env…"
if ! grep -q '^  web:' compose.yaml; then
  sudo cp compose.yaml compose.yaml.bak
  sudo sed -i 's/^volumes:$/  web:\n    image: caddy:2\n    environment:\n      SITE_ADDRESS: ${SITE_ADDRESS:-:80}\n    volumes:\n      - .\/Caddyfile:\/etc\/caddy\/Caddyfile:ro\n      - .\/web:\/srv:ro\n      - caddy_data:\/data\n      - caddy_config:\/config\n    ports:\n      - "80:80"\n      - "443:443"\n    depends_on:\n      - usuarios\n      - catalogo\n      - atencion\n      - ventas\n    restart: unless-stopped\n\nvolumes:\n  caddy_data:\n  caddy_config:/' compose.yaml
fi
sudo cp .env .env.bak
sudo sed -i -e '/^FRONTEND_ORIGINS=/d' -e '/^COOKIE_SECURE=/d' -e '/^SITE_ADDRESS=/d' .env
printf 'FRONTEND_ORIGINS=https://%s\nCOOKIE_SECURE=true\nSITE_ADDRESS=%s\n' "$DOMINIO" "$DOMINIO" | sudo tee -a .env >/dev/null

echo "5/5 Levantando los servicios…"
sudo docker compose --env-file .env up -d --no-build
sudo docker ps --format '{{.Names}} | {{.Status}}'
echo "Listo. En uno o dos minutos abre https://$DOMINIO"
