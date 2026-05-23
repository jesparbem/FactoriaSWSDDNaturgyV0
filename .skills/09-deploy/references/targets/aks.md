# Target · Azure Kubernetes Service (AKS)
**Cuándo se usa:** Apps multi-servicio complejas con necesidad de orquestación fina, sidecars, service mesh, escalado avanzado. NO el default — preferir Container Apps salvo justificación.

## Cuándo SÍ usar AKS
- > 10 microservicios independientes.
- Necesidad de service mesh (Istio, Linkerd).
- Workloads stateful complejos (operators).
- Equipo con experiencia k8s.
- Multi-tenant con namespaces.

## Cuándo NO usar AKS
- 1-3 contenedores → usa Container Apps.
- Equipo sin experiencia k8s → curva de aprendizaje cara.
- App estándar web stateless → App Service.

## Prerrequisitos
- AKS cluster aprovisionado por equipo de infra Naturgy.
- `kubectl` y `helm` instalados, contexto configurado.
- ACR conectado al cluster (sin imagePullSecrets manuales).
- Ingress controller instalado (NGINX o Application Gateway).
- cert-manager para TLS automático.

## Estructura recomendada del proyecto

```
infra/
├── helm/
│   └── {app-name}/
│       ├── Chart.yaml
│       ├── values.yaml              ← defaults
│       ├── values.staging.yaml
│       ├── values.production.yaml
│       └── templates/
│           ├── deployment.yaml
│           ├── service.yaml
│           ├── ingress.yaml
│           ├── hpa.yaml             ← autoscaler
│           ├── pdb.yaml             ← pod disruption budget
│           └── configmap.yaml
└── kustomize/  (alternativa a helm)
```

## Deploy preview (namespace dedicado)

```bash
APP=mi-app
TAG=$(git rev-parse --short HEAD)
PREVIEW_NS=preview-${APP}-${TAG}

# Crear namespace temporal
kubectl create namespace $PREVIEW_NS

# Deploy con helm
helm upgrade --install ${APP}-preview ./infra/helm/${APP} \
  --namespace $PREVIEW_NS \
  -f ./infra/helm/${APP}/values.staging.yaml \
  --set image.tag=$TAG \
  --wait --timeout 5m
```

## Health check

```bash
# Esperar a que el pod esté Ready
kubectl wait --for=condition=ready pod -l app=${APP} -n $PREVIEW_NS --timeout=120s

# Health endpoint vía port-forward (preview interno) o ingress (si público)
kubectl port-forward -n $PREVIEW_NS svc/${APP} 8080:80 &
PF_PID=$!
sleep 2
curl -fsS http://localhost:8080/health
curl -fsS http://localhost:8080/health/ready
kill $PF_PID
```

## Promoción a producción

Dos estrategias estándar:

### Rolling Update (default)
```bash
helm upgrade ${APP} ./infra/helm/${APP} \
  --namespace prod \
  -f ./infra/helm/${APP}/values.production.yaml \
  --set image.tag=$TAG \
  --wait --timeout 10m
```

### Canary con Argo Rollouts (recomendado para apps críticas)
```yaml
# infra/helm/{app}/templates/rollout.yaml
apiVersion: argoproj.io/v1alpha1
kind: Rollout
spec:
  strategy:
    canary:
      steps:
      - setWeight: 10
      - pause: {duration: 5m}
      - setWeight: 50
      - pause: {duration: 10m}
      - setWeight: 100
```

## Rollback

```bash
# Histórico de revisiones
helm history ${APP} -n prod

# Rollback a la versión anterior
helm rollback ${APP} -n prod
```

Tiempo de rollback: **< 30 segundos** (depende de readiness probes).

## Secretos

- Azure Key Vault + CSI driver (`SecretProviderClass`).
- NUNCA Secrets nativos de k8s sin encriptación de etcd.
- Managed Identity para acceso a Key Vault.

```yaml
# Ejemplo CSI
apiVersion: secrets-store.csi.x-k8s.io/v1
kind: SecretProviderClass
metadata:
  name: ${APP}-kv
spec:
  provider: azure
  parameters:
    keyvaultName: kv-naturgy
    objects: |
      array:
        - |
          objectName: db-url
          objectType: secret
```

## Observabilidad

- Logs → Azure Monitor for containers (Container Insights).
- Métricas → Prometheus + Grafana (gestionados o managed).
- Trazas → OpenTelemetry → App Insights.
- Eventos cluster → kubectl events / Kured.

## Anti-patrones

- ❌ AKS para 1 contenedor.
- ❌ `kubectl apply` manual en producción (siempre helm/kustomize + git).
- ❌ Sin PDB (Pod Disruption Budget) → upgrades del cluster matan la app.
- ❌ Sin HPA → no escala.
- ❌ Secrets en ConfigMaps.
- ❌ Latest tag en producción → imposible rollback determinista.
- ❌ Sin resource requests/limits → noisy neighbors / OOMKills.
