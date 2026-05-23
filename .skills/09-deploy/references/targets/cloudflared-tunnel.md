# Target · Cloudflared Tunnel
**Cuándo se usa:** Exponer temporalmente una app que corre en local para demos, webhooks de terceros que requieren URL pública, o desarrollo colaborativo.

**NO usar para producción.** Es una herramienta de desarrollo y demo.

## Cuándo SÍ usar
- Demo en vivo desde tu portátil sin exponer la red corporativa.
- Recibir webhooks de un proveedor (Stripe, GitHub) durante desarrollo.
- Compartir un prototipo con un stakeholder sin desplegar.
- Sesión de pair programming remota mostrando tu app local.

## Cuándo NO usar
- Productivo de cualquier tipo.
- Manejo de datos personales Naturgy.
- Cualquier cosa que dure más de 1 día.

## Prerrequisitos
- Cuenta Cloudflare (gratis para tunnels efímeros).
- `cloudflared` instalado:
  ```bash
  # macOS
  brew install cloudflared
  # Linux (Ubuntu)
  curl -L https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb -o cloudflared.deb
  sudo dpkg -i cloudflared.deb
  # Windows
  winget install --id Cloudflare.cloudflared
  ```

## Modo efímero (más simple)

```bash
# Tu app corriendo en localhost:3000
npm run dev &

# Exponer al mundo (URL temporal aleatoria)
cloudflared tunnel --url http://localhost:3000
# ⇒ https://random-words-1234.trycloudflare.com
```

La URL dura mientras el proceso `cloudflared` esté vivo. Al cerrar terminal, la URL muere.

## Modo persistente (named tunnel)

Si necesitas una URL estable para una demo de varios días:

```bash
# Login en Cloudflare
cloudflared tunnel login

# Crear tunnel con nombre
cloudflared tunnel create demo-naturgy

# Configurar (config.yml)
cat > ~/.cloudflared/config.yml <<EOF
tunnel: demo-naturgy
credentials-file: ~/.cloudflared/{tunnel-uuid}.json
ingress:
  - hostname: demo.tudominio.com
    service: http://localhost:3000
  - service: http_status:404
EOF

# Apuntar DNS
cloudflared tunnel route dns demo-naturgy demo.tudominio.com

# Correr
cloudflared tunnel run demo-naturgy
```

## Seguridad

⚠️ **Importante:** estás exponiendo tu portátil a internet.

- Asegura tu app local con auth básica si la URL será compartida.
- Configura Cloudflare Access (Zero Trust) si los datos son sensibles:
  ```yaml
  ingress:
    - hostname: demo.tudominio.com
      service: http://localhost:3000
      originRequest:
        access:
          required: true
          teamName: naturgy
  ```
- Nunca expongas BD corporativa o servicios internos a través del tunnel.

## Health check

```bash
# Ya con el tunnel arriba
TUNNEL_URL="https://random-words-1234.trycloudflare.com"
curl -fsS "${TUNNEL_URL}/health"
```

## Webhooks de terceros

Caso típico — registrar la URL del tunnel como webhook target:

```bash
# Ejemplo: webhook de Stripe para test
stripe listen --forward-to ${TUNNEL_URL}/webhooks/stripe
```

## Detener / limpieza

```bash
# Modo efímero: Ctrl+C en la terminal del cloudflared.
# Modo persistente:
cloudflared tunnel delete demo-naturgy
rm ~/.cloudflared/config.yml
```

## Reglas operativas para Naturgy

1. **Comunícalo si el tunnel apunta a algo más que un demo de ti mismo.** El equipo de seguridad puede querer saberlo.
2. **No dejes tunnels persistentes corriendo sin necesidad.** Cada tunnel abierto = superficie de ataque viva.
3. **Si vas a hacer demo a stakeholder externo con datos reales**, escala a `@legal` antes para confirmar que se puede.
4. **Para producción, jamás.** Es una herramienta de dev, no de prod.
