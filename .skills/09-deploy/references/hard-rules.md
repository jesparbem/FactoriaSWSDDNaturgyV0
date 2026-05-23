# Hard Rules · 8 reglas innegociables del despliegue
**Consumido por:** `@deploy`
**Fuente:** All-Deploy (Hainrixz) + endurecidas para Naturgy

Las 8 reglas son **innegociables**. `@deploy` aborta antes de violarlas, sin importar la presión.

## R1 · Nunca saltar la auditoría
**Por qué:** Auditar después de desplegar = auditar después del incidente.
**Cómo se aplica:** Antes de cualquier `deploy` se ejecutan en verde: `@cyber`, `@legal`, `@a11y`, `@perf` y `@qa`. Sin todos en verde → `@deploy` NO procede.
**Excepción:** Ninguna. Si la auditoría falla, se arregla y se reaudita.

## R2 · Nunca producción sin preview verde
**Por qué:** Lo que pasa en local no es lo que pasa en producción. El preview es el último filtro real.
**Cómo se aplica:** Despliega primero a entorno preview (slot, branch, etc.). Hace `curl` al health endpoint. Si la respuesta no es 2xx, ABORTA. Solo si preview está verde, propone promoción.
**Excepción:** Ninguna.

## R3 · Nunca loggear ni commitear secretos
**Por qué:** Un secreto en git history es un secreto comprometido para siempre, aunque se rote.
**Cómo se aplica:** Antes del commit/deploy, `@deploy` comprueba con `@cyber` SecretsScanner. Si detecta secreto → bloquea push y exige purga + rotación. Los logs de despliegue redactan tokens y passwords.
**Excepción:** Ninguna.

## R4 · Nunca auto-instalar CLIs sin permiso del usuario
**Por qué:** Instalar CLIs cambia la máquina del usuario sin que lo sepa. Cosas que parecen inocuas (`curl ... | bash`) pueden traer payloads maliciosos.
**Cómo se aplica:** Si necesita una CLI (vercel, railway, az, kubectl…), el agente la propone con comando exacto, espera "sí" explícito, y muestra qué hace antes de ejecutar.
**Excepción:** Ninguna sin confirmación manual.

## R5 · Nunca esconder comandos de deploy en wrappers
**Por qué:** El usuario debe poder reproducir el deploy manualmente. Magia opaca = imposible de depurar cuando falla.
**Cómo se aplica:** Cada paso del deploy se anuncia con el comando exacto que se ejecuta. Si hay un script `deploy.sh`, su contenido se muestra antes de correrlo. Nada de `npm run deploy` que esconde 20 pasos.
**Excepción:** Ninguna.

## R6 · Nunca modificar código sin mostrar el diff
**Por qué:** Si `@deploy` necesita tocar el código (versión, build flags…), el usuario tiene que verlo antes.
**Cómo se aplica:** Toda modificación de código pre-deploy se muestra como diff y se espera confirmación. Nunca se hace `git commit` sin ese paso.
**Excepción:** Ninguna.

## R7 · Nunca deploy desde git tree sucio sin permiso
**Por qué:** Cambios sin commitear no son reproducibles. El deploy debe estar atado a un SHA concreto.
**Cómo se aplica:** Antes de deploy, `@deploy` ejecuta `git status`. Si hay cambios sin commitear, ABORTA salvo que el usuario confirme explícitamente "sí, sé que el tree está sucio".
**Excepción:** Solo con confirmación explícita y registrada en `DEPLOY-LOG-{fecha}.md`.

## R8 · "Wait" siempre aborta cualquier duda
**Por qué:** En operaciones críticas el botón de pausa debe funcionar SIEMPRE. Si el usuario escribe "wait", "para", "espera", "cancela" → no es debatible.
**Cómo se aplica:** Cualquier mensaje del usuario que contenga `wait|para|espera|stop|cancela|abort` durante un deploy en curso → `@deploy` se detiene, deja el sistema en estado conocido (preview armado pero no promovido), y pide instrucciones.
**Excepción:** Ninguna.

---

## Reglas adicionales Naturgy

### R9 · Nunca deploy en viernes después de 16:00 sin emergencia
**Por qué:** Si rompe, no hay equipo el fin de semana para arreglarlo.
**Excepción:** Hotfix de seguridad o regulatorio, con aprobación explícita.

### R10 · Nunca deploy a producción sin rollback armado
**Por qué:** Si rompe, hay que poder volver atrás en < 5 minutos.
**Cómo se aplica:** `@deploy` genera `ROLLBACK.md` con comando exacto ANTES de promover. Si el rollback no se puede ejecutar (por arquitectura del target), aborta.
**Excepción:** Ninguna.

### R11 · Nunca deploy sin observabilidad mínima
**Por qué:** Sin métricas y alertas, un incidente no se detecta hasta que un usuario se queja.
**Cómo se aplica:** `@deploy` verifica con `@devops` que existen: health endpoint, logs estructurados, métricas básicas y al menos 1 alerta por flujo de negocio.
**Excepción:** Ninguna en producción.

---

## Resumen en una línea

> El deploy es la fase con más blast radius. Si una regla parece exagerada, lo es por diseño — porque el coste de equivocarse en deploy es 10× el coste de equivocarse en cualquier otra fase.
