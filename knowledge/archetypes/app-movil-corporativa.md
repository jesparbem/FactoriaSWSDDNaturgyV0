# Arquetipo · App Móvil Corporativa
**Cuándo aplica:** App para personal de campo Naturgy (técnicos, comerciales, supervisores) o app pública para clientes.

## Características típicas
- Audiencia interna o externa según caso.
- Offline-first cuando hay personal de campo (cobertura irregular).
- Push notifications.
- Acceso a hardware: cámara, GPS, biometría, NFC.
- Distribución: corporativa (Intune / MDM) o tiendas (App Store / Play Store).

## Stack por defecto
| Capa | Tecnología recomendada | Alternativa |
|---|---|---|
| Móvil | React Native + Expo | Flutter (si el equipo lo domina) |
| PWA | Next.js + service worker | — |
| Backend | mismo BFF que web (compartido) | — |
| Offline cache | SQLite (op-sqlite) o WatermelonDB | — |
| Auth | Azure AD MSAL + biometría | — |
| Push | Azure Notification Hubs | Firebase (con cuidado por datos en USA) |
| Distribución interna | Microsoft Intune (MDM) | — |
| Distribución externa | App Store + Play Store + revisión legal | — |

## 5 decisiones típicas que `@architect` debe forzar
1. **¿Nativo, RN o PWA?** PWA si no necesita hardware avanzado / cobertura crítica. RN/Expo si sí.
2. **¿Offline-first?** Sí casi siempre para personal de campo; sincronización en background.
3. **¿MDM corporativo?** Sí para apps internas (Intune).
4. **¿Biometría?** Sí para login secundario; complementaria a MFA, no sustituta.
5. **¿Push genéricas o por usuario?** Por usuario con consentimiento explícito.

## Riesgos Naturgy específicos
- **Datos sensibles offline** → cifrado en reposo obligatorio (SQLCipher / Keychain / KeyStore).
- **Personal de campo**: dispositivo personal vs corporativo cambia la postura de seguridad — siempre corporativo si maneja datos cliente.
- **Push notifications**: contenido nunca debe revelar datos personales (no "Factura de Juan Pérez 145€"; sí "Tienes una factura nueva").
- **Tiendas públicas**: revisión legal + accesibilidad obligatoria antes de subir.

## Ejemplos de proyectos de esta tipología
- App técnico de campo (órdenes de trabajo, partes, fotos).
- App comercial puerta-a-puerta (catálogo + firma + simulador).
- App de cliente final (consumos, facturas, alertas).

## Playbook recomendado
`playbooks/feature-empresarial.md` con `@a11y` reforzado (accesibilidad móvil) + `@cyber` (móvil-specific OWASP MASVS).
