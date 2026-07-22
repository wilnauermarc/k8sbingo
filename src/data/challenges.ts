import type { Challenge } from '../types/challenge'

export const FREE_SPACE: Challenge = {
  id: 'free-space',
  title: 'FREE',
  description:
    'Center free space — you already know enough Kubernetes to start. Mark surrounding challenges as you complete them in your local cluster.',
  difficulty: 'beginner',
  category: 'Pods',
  hint: 'No action needed. This square is always completed.',
  exampleSolution: '# Free space — no kubectl required.',
  isFree: true,
}

export const CHALLENGES: Challenge[] = [
  {
    id: 'pod-nginx',
    title: 'Create an nginx Pod',
    description:
      'Create a Pod named nginx using the nginx:1.27 image in your current namespace.',
    difficulty: 'beginner',
    category: 'Pods',
    hint: 'Use kubectl run with --image, or write a small Pod YAML manifest.',
    exampleSolution: `kubectl run nginx --image=nginx:1.27

# Or with YAML:
cat <<'EOF' | kubectl apply -f -
apiVersion: v1
kind: Pod
metadata:
  name: nginx
spec:
  containers:
    - name: nginx
      image: nginx:1.27
EOF`,
  },
  {
    id: 'pod-get-all-ns',
    title: 'List Pods in all namespaces',
    description: 'Display every Pod across the cluster, including system namespaces.',
    difficulty: 'beginner',
    category: 'Pods',
    hint: 'The -A / --all-namespaces flag works with most kubectl get commands.',
    exampleSolution: 'kubectl get pods --all-namespaces\n# or\nkubectl get pods -A',
  },
  {
    id: 'pod-logs',
    title: 'Read Pod logs',
    description:
      'Create a short-lived busybox Pod that prints hello, then retrieve its logs with kubectl.',
    difficulty: 'beginner',
    category: 'Pods',
    hint: 'kubectl logs takes a Pod name. For finished Pods, logs remain available until the Pod is deleted.',
    exampleSolution: `kubectl run hello --image=busybox:1.36 --restart=Never -- echo "hello kubernetes"
kubectl wait --for=condition=Ready=false pod/hello --timeout=60s || true
kubectl logs hello`,
  },
  {
    id: 'pod-exec',
    title: 'Exec into a running Pod',
    description:
      'Start an nginx Pod, wait until it is Ready, then open an interactive shell inside it.',
    difficulty: 'beginner',
    category: 'Pods',
    hint: 'kubectl exec -it uses -- to separate kubectl flags from the container command.',
    exampleSolution: `kubectl run nginx-shell --image=nginx:1.27
kubectl wait --for=condition=Ready pod/nginx-shell --timeout=60s
kubectl exec -it nginx-shell -- /bin/bash`,
  },
  {
    id: 'pod-describe',
    title: 'Describe a Pod',
    description:
      'Inspect a Pod with kubectl describe and identify its IP, node, and recent events.',
    difficulty: 'beginner',
    category: 'Pods',
    hint: 'describe shows Events at the bottom — useful for scheduling and pull errors.',
    exampleSolution: `kubectl run demo --image=nginx:1.27
kubectl describe pod demo`,
  },
  {
    id: 'pod-labels',
    title: 'Label and select a Pod',
    description:
      'Add an app=web label to a Pod, then list only Pods that match that label.',
    difficulty: 'beginner',
    category: 'Pods',
    hint: 'You can set labels at create time with --labels, or afterwards with kubectl label.',
    exampleSolution: `kubectl run web --image=nginx:1.27 --labels=app=web
kubectl get pods -l app=web`,
  },
  {
    id: 'pod-delete',
    title: 'Delete a Pod gracefully',
    description: 'Delete a Pod and confirm it is gone from the namespace.',
    difficulty: 'beginner',
    category: 'Pods',
    hint: 'kubectl delete pod waits for termination by default (grace period).',
    exampleSolution: `kubectl run doomed --image=nginx:1.27
kubectl delete pod doomed
kubectl get pod doomed`,
  },
  {
    id: 'pod-multi-container',
    title: 'Create a multi-container Pod',
    description:
      'Create a Pod with two containers that share the same network namespace (for example nginx and a busybox sidecar).',
    difficulty: 'intermediate',
    category: 'Pods',
    hint: 'Containers in one Pod share localhost and can use an emptyDir volume to share files.',
    exampleSolution: `cat <<'EOF' | kubectl apply -f -
apiVersion: v1
kind: Pod
metadata:
  name: multi
spec:
  containers:
    - name: nginx
      image: nginx:1.27
      ports:
        - containerPort: 80
    - name: sidecar
      image: busybox:1.36
      command: ["sleep", "3600"]
EOF`,
  },
  {
    id: 'pod-resource-requests',
    title: 'Add CPU requests and limits',
    description:
      'Create a Pod that requests 100m CPU / 128Mi memory and limits to 250m CPU / 256Mi memory.',
    difficulty: 'intermediate',
    category: 'Pods',
    hint: 'Set resources.requests and resources.limits under the container spec.',
    exampleSolution: `cat <<'EOF' | kubectl apply -f -
apiVersion: v1
kind: Pod
metadata:
  name: resource-demo
spec:
  containers:
    - name: nginx
      image: nginx:1.27
      resources:
        requests:
          cpu: 100m
          memory: 128Mi
        limits:
          cpu: 250m
          memory: 256Mi
EOF`,
  },
  {
    id: 'deploy-create-3',
    title: 'Create a Deployment with 3 replicas',
    description:
      'Create a Deployment named web that runs nginx:1.27 with three replicas.',
    difficulty: 'beginner',
    category: 'Deployments',
    hint: 'kubectl create deployment accepts --replicas.',
    exampleSolution: `kubectl create deployment web --image=nginx:1.27 --replicas=3
kubectl get deploy web
kubectl get pods -l app=web`,
  },
  {
    id: 'deploy-scale',
    title: 'Scale a Deployment',
    description: 'Scale an existing Deployment to five replicas, then back to two.',
    difficulty: 'beginner',
    category: 'Deployments',
    hint: 'kubectl scale changes the replica count without rewriting the whole manifest.',
    exampleSolution: `kubectl create deployment web --image=nginx:1.27 --replicas=3
kubectl scale deployment web --replicas=5
kubectl scale deployment web --replicas=2`,
  },
  {
    id: 'deploy-rollout',
    title: 'Perform a rollout and undo it',
    description:
      'Update a Deployment image, watch the rollout status, then roll back to the previous revision.',
    difficulty: 'intermediate',
    category: 'Deployments',
    hint: 'kubectl set image triggers a rolling update. kubectl rollout undo reverts it.',
    exampleSolution: `kubectl create deployment web --image=nginx:1.26 --replicas=3
kubectl set image deployment/web nginx=nginx:1.27
kubectl rollout status deployment/web
kubectl rollout undo deployment/web
kubectl rollout history deployment/web`,
  },
  {
    id: 'deploy-status',
    title: 'Inspect Deployment status',
    description:
      'Use kubectl get and describe to check READY replicas, strategy, and events for a Deployment.',
    difficulty: 'beginner',
    category: 'Deployments',
    hint: 'Look at READY (available/desired) and UP-TO-DATE columns.',
    exampleSolution: `kubectl create deployment web --image=nginx:1.27 --replicas=3
kubectl get deployment web -o wide
kubectl describe deployment web`,
  },
  {
    id: 'deploy-yaml',
    title: 'Apply a Deployment from YAML',
    description:
      'Write a Deployment manifest to a file, apply it, then verify the ReplicaSet and Pods.',
    difficulty: 'beginner',
    category: 'Deployments',
    hint: 'apiVersion apps/v1, kind Deployment, and a matching selector/template labels pair are required.',
    exampleSolution: `cat <<'EOF' > web-deploy.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: web-yaml
spec:
  replicas: 2
  selector:
    matchLabels:
      app: web-yaml
  template:
    metadata:
      labels:
        app: web-yaml
    spec:
      containers:
        - name: nginx
          image: nginx:1.27
EOF
kubectl apply -f web-deploy.yaml
kubectl get rs,pods -l app=web-yaml`,
  },
  {
    id: 'deploy-probes',
    title: 'Add readiness and liveness probes',
    description:
      'Configure an nginx Deployment with HTTP readiness and liveness probes on port 80.',
    difficulty: 'intermediate',
    category: 'Deployments',
    hint: 'Readiness controls Service endpoints; liveness triggers container restarts.',
    exampleSolution: `cat <<'EOF' | kubectl apply -f -
apiVersion: apps/v1
kind: Deployment
metadata:
  name: probed
spec:
  replicas: 2
  selector:
    matchLabels:
      app: probed
  template:
    metadata:
      labels:
        app: probed
    spec:
      containers:
        - name: nginx
          image: nginx:1.27
          ports:
            - containerPort: 80
          readinessProbe:
            httpGet:
              path: /
              port: 80
            initialDelaySeconds: 3
            periodSeconds: 5
          livenessProbe:
            httpGet:
              path: /
              port: 80
            initialDelaySeconds: 10
            periodSeconds: 10
EOF`,
  },
  {
    id: 'svc-clusterip',
    title: 'Expose a Deployment with ClusterIP',
    description:
      'Expose a Deployment on port 80 using a ClusterIP Service and verify Endpoints.',
    difficulty: 'beginner',
    category: 'Services',
    hint: 'kubectl expose creates a Service whose selector matches the Deployment labels.',
    exampleSolution: `kubectl create deployment web --image=nginx:1.27 --replicas=2
kubectl expose deployment web --port=80 --target-port=80 --name=web-svc
kubectl get svc web-svc
kubectl get endpoints web-svc`,
  },
  {
    id: 'svc-nodeport',
    title: 'Create a NodePort Service',
    description:
      'Expose an nginx Deployment with a NodePort Service and note the allocated node port.',
    difficulty: 'beginner',
    category: 'Services',
    hint: 'type: NodePort publishes a high port on every node.',
    exampleSolution: `kubectl create deployment web --image=nginx:1.27
kubectl expose deployment web --type=NodePort --port=80 --name=web-nodeport
kubectl get svc web-nodeport`,
  },
  {
    id: 'svc-port-forward',
    title: 'Port-forward to a Service',
    description:
      'Use kubectl port-forward to reach a ClusterIP Service from your laptop on localhost:8080.',
    difficulty: 'beginner',
    category: 'Services',
    hint: 'port-forward works against pods, services, or deployments.',
    exampleSolution: `kubectl create deployment web --image=nginx:1.27
kubectl expose deployment web --port=80 --name=web-svc
kubectl port-forward svc/web-svc 8080:80
# Then open http://127.0.0.1:8080 in a browser`,
  },
  {
    id: 'svc-selector',
    title: 'Fix a broken Service selector',
    description:
      'Create a Service whose selector does not match any Pods, observe empty Endpoints, then fix the selector.',
    difficulty: 'intermediate',
    category: 'Services',
    hint: 'Endpoints stay empty until labels on Pods match the Service selector.',
    exampleSolution: `kubectl create deployment web --image=nginx:1.27
kubectl create service clusterip broken --tcp=80:80
# Initially no endpoints:
kubectl get endpoints broken
kubectl patch svc broken -p '{"spec":{"selector":{"app":"web"}}}'
kubectl get endpoints broken`,
  },
  {
    id: 'cm-create',
    title: 'Create a ConfigMap',
    description:
      'Create a ConfigMap named app-config with keys APP_ENV=dev and LOG_LEVEL=info.',
    difficulty: 'beginner',
    category: 'ConfigMaps and Secrets',
    hint: 'kubectl create configmap --from-literal is quick for a few keys.',
    exampleSolution: `kubectl create configmap app-config \\
  --from-literal=APP_ENV=dev \\
  --from-literal=LOG_LEVEL=info
kubectl get configmap app-config -o yaml`,
  },
  {
    id: 'cm-mount',
    title: 'Mount a ConfigMap into a Pod',
    description:
      'Mount a ConfigMap as files under /etc/config inside a Pod and verify the files exist.',
    difficulty: 'intermediate',
    category: 'ConfigMaps and Secrets',
    hint: 'Use volumes + volumeMounts, or envFrom for environment variables.',
    exampleSolution: `kubectl create configmap app-config --from-literal=APP_ENV=dev
cat <<'EOF' | kubectl apply -f -
apiVersion: v1
kind: Pod
metadata:
  name: cm-mount
spec:
  containers:
    - name: busybox
      image: busybox:1.36
      command: ["sleep", "3600"]
      volumeMounts:
        - name: config
          mountPath: /etc/config
  volumes:
    - name: config
      configMap:
        name: app-config
EOF
kubectl exec cm-mount -- ls /etc/config
kubectl exec cm-mount -- cat /etc/config/APP_ENV`,
  },
  {
    id: 'secret-create',
    title: 'Create a Secret',
    description:
      'Create an Opaque Secret with username and password literals, then inspect it (without printing decoded values in shared logs if possible).',
    difficulty: 'beginner',
    category: 'ConfigMaps and Secrets',
    hint: 'Secret data is base64-encoded at rest in etcd/API responses.',
    exampleSolution: `kubectl create secret generic app-secret \\
  --from-literal=username=admin \\
  --from-literal=password=s3cret
kubectl get secret app-secret
kubectl describe secret app-secret`,
  },
  {
    id: 'secret-env',
    title: 'Inject a Secret as env vars',
    description:
      'Create a Pod that loads Secret keys as environment variables and print one of them.',
    difficulty: 'intermediate',
    category: 'ConfigMaps and Secrets',
    hint: 'env.valueFrom.secretKeyRef references a single key; envFrom can load all keys.',
    exampleSolution: `kubectl create secret generic app-secret \\
  --from-literal=username=admin \\
  --from-literal=password=s3cret
cat <<'EOF' | kubectl apply -f -
apiVersion: v1
kind: Pod
metadata:
  name: secret-env
spec:
  containers:
    - name: busybox
      image: busybox:1.36
      command: ["sh", "-c", "echo user=$USERNAME; sleep 3600"]
      env:
        - name: USERNAME
          valueFrom:
            secretKeyRef:
              name: app-secret
              key: username
EOF
kubectl logs secret-env`,
  },
  {
    id: 'job-once',
    title: 'Run a one-time Job',
    description:
      'Create a Job that runs busybox and prints "job complete", then verify the Job succeeded.',
    difficulty: 'beginner',
    category: 'Jobs and CronJobs',
    hint: 'Jobs create Pods that run to completion. Check .status.succeeded.',
    exampleSolution: `kubectl create job hello-job --image=busybox:1.36 -- echo "job complete"
kubectl wait --for=condition=complete job/hello-job --timeout=60s
kubectl get job hello-job
kubectl logs job/hello-job`,
  },
  {
    id: 'cronjob-create',
    title: 'Create a CronJob',
    description:
      'Create a CronJob that runs every minute and prints the current date, then watch a Job get created.',
    difficulty: 'intermediate',
    category: 'Jobs and CronJobs',
    hint: 'Cron schedule uses standard cron syntax. Use kubectl get jobs -w to watch creations.',
    exampleSolution: `kubectl create cronjob minute-tick \\
  --image=busybox:1.36 \\
  --schedule="*/1 * * * *" \\
  -- date
kubectl get cronjob minute-tick
kubectl get jobs -w`,
  },
  {
    id: 'job-parallel',
    title: 'Run a parallel Job',
    description:
      'Create a Job with completions=4 and parallelism=2, then confirm four successful Pods.',
    difficulty: 'advanced',
    category: 'Jobs and CronJobs',
    hint: 'completions is how many successful Pods you need; parallelism is how many can run at once.',
    exampleSolution: `cat <<'EOF' | kubectl apply -f -
apiVersion: batch/v1
kind: Job
metadata:
  name: parallel-job
spec:
  completions: 4
  parallelism: 2
  template:
    spec:
      restartPolicy: Never
      containers:
        - name: worker
          image: busybox:1.36
          command: ["sh", "-c", "echo done; sleep 2"]
EOF
kubectl wait --for=condition=complete job/parallel-job --timeout=120s
kubectl get pods -l job-name=parallel-job`,
  },
  {
    id: 'trouble-crashloop',
    title: 'Diagnose a CrashLoopBackOff',
    description:
      'Create a Pod that exits immediately, observe CrashLoopBackOff, then use describe/logs to explain the failure.',
    difficulty: 'intermediate',
    category: 'Troubleshooting',
    hint: 'CrashLoopBackOff means the container keeps crashing and Kubernetes is backing off restarts.',
    exampleSolution: `kubectl run crash --image=busybox:1.36 --restart=Always -- /bin/false
kubectl get pod crash
kubectl describe pod crash
kubectl logs crash
# Events and exit code explain the loop`,
  },
  {
    id: 'trouble-imagepull',
    title: 'Diagnose ImagePullBackOff',
    description:
      'Create a Pod with a nonexistent image tag, observe ImagePullBackOff / ErrImagePull, and identify the root cause.',
    difficulty: 'beginner',
    category: 'Troubleshooting',
    hint: 'describe Pod Events usually show Failed to pull image.',
    exampleSolution: `kubectl run bad-image --image=nginx:this-tag-does-not-exist
kubectl get pod bad-image
kubectl describe pod bad-image | sed -n '/Events/,$p'`,
  },
  {
    id: 'trouble-pending',
    title: 'Explain a Pending Pod',
    description:
      'Create a Pod that cannot be scheduled (for example huge CPU request) and use describe to find the scheduling reason.',
    difficulty: 'intermediate',
    category: 'Troubleshooting',
    hint: 'Pending with FailedScheduling often means insufficient CPU/memory or unmet node selectors.',
    exampleSolution: `cat <<'EOF' | kubectl apply -f -
apiVersion: v1
kind: Pod
metadata:
  name: pending-demo
spec:
  containers:
    - name: pause
      image: registry.k8s.io/pause:3.10
      resources:
        requests:
          cpu: "100"
EOF
kubectl describe pod pending-demo | sed -n '/Events/,$p'`,
  },
  {
    id: 'trouble-events',
    title: 'Inspect namespace Events',
    description:
      'List recent Events in your namespace sorted by time and find warnings related to a failing Pod.',
    difficulty: 'beginner',
    category: 'Troubleshooting',
    hint: 'kubectl get events --sort-by=.metadata.creationTimestamp is a classic starting point.',
    exampleSolution: `kubectl get events --sort-by=.metadata.creationTimestamp
kubectl get events --field-selector type=Warning`,
  },
  {
    id: 'trouble-previous-logs',
    title: 'Read previous container logs',
    description:
      'Trigger a container restart, then fetch logs from the previous instance with --previous.',
    difficulty: 'intermediate',
    category: 'Troubleshooting',
    hint: '--previous reads the last terminated container in the same Pod.',
    exampleSolution: `kubectl run flaky --image=busybox:1.36 --restart=Always -- sh -c "echo boom; exit 1"
sleep 5
kubectl logs flaky --previous`,
  },
  {
    id: 'net-dns',
    title: 'Test in-cluster DNS',
    description:
      'From a busybox Pod, resolve kubernetes.default.svc.cluster.local for a Service you created.',
    difficulty: 'intermediate',
    category: 'Networking',
    hint: 'CoreDNS serves *.svc.cluster.local. nslookup works in busybox.',
    exampleSolution: `kubectl create deployment web --image=nginx:1.27
kubectl expose deployment web --port=80 --name=web-svc
kubectl run netshoot --image=busybox:1.36 --restart=Never -- sleep 3600
kubectl wait --for=condition=Ready pod/netshoot --timeout=60s
kubectl exec netshoot -- nslookup web-svc.default.svc.cluster.local`,
  },
  {
    id: 'net-curl-svc',
    title: 'HTTP call a ClusterIP Service',
    description:
      'From a debug Pod, curl an nginx Service by DNS name and confirm you get an HTTP 200 response.',
    difficulty: 'beginner',
    category: 'Networking',
    hint: 'wget -qO- or curl inside a Pod reaches ClusterIP Services directly.',
    exampleSolution: `kubectl create deployment web --image=nginx:1.27
kubectl expose deployment web --port=80 --name=web-svc
kubectl run curlpod --image=busybox:1.36 --restart=Never -- sleep 3600
kubectl wait --for=condition=Ready pod/curlpod --timeout=60s
kubectl exec curlpod -- wget -qO- http://web-svc`,
  },
  {
    id: 'net-networkpolicy-deny',
    title: 'Apply a default-deny NetworkPolicy',
    description:
      'Create a NetworkPolicy that denies all Ingress to Pods labeled app=web, then verify connectivity fails from another Pod.',
    difficulty: 'advanced',
    category: 'Networking',
    hint: 'NetworkPolicies only work if your CNI supports them (Calico, Cilium, etc.). kind/k3d may need the right CNI.',
    exampleSolution: `kubectl create deployment web --image=nginx:1.27
kubectl expose deployment web --port=80 --name=web-svc
kubectl label deployment web app=web --overwrite
kubectl label pod -l app=web app=web --overwrite
cat <<'EOF' | kubectl apply -f -
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: deny-web-ingress
spec:
  podSelector:
    matchLabels:
      app: web
  policyTypes:
    - Ingress
EOF
# From another Pod, wget to web-svc should hang/fail while the policy is active.`,
  },
  {
    id: 'net-ingress-concept',
    title: 'Create an Ingress resource',
    description:
      'Define an Ingress that routes host bingo.local / to a backend Service named web-svc on port 80. (Controller installation optional.)',
    difficulty: 'advanced',
    category: 'Networking',
    hint: 'An Ingress object alone does nothing without an Ingress controller, but writing the resource is still valuable practice.',
    exampleSolution: `kubectl create deployment web --image=nginx:1.27
kubectl expose deployment web --port=80 --name=web-svc
cat <<'EOF' | kubectl apply -f -
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: web-ingress
spec:
  rules:
    - host: bingo.local
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: web-svc
                port:
                  number: 80
EOF
kubectl get ingress web-ingress`,
  },
  {
    id: 'storage-emptydir',
    title: 'Share files with emptyDir',
    description:
      'Create a Pod with two containers that share an emptyDir volume; write a file in one container and read it in the other.',
    difficulty: 'intermediate',
    category: 'Storage',
    hint: 'emptyDir lives as long as the Pod. Both containers mount the same volume name.',
    exampleSolution: `cat <<'EOF' | kubectl apply -f -
apiVersion: v1
kind: Pod
metadata:
  name: share-data
spec:
  containers:
    - name: writer
      image: busybox:1.36
      command: ["sh", "-c", "echo hello > /data/msg; sleep 3600"]
      volumeMounts:
        - name: data
          mountPath: /data
    - name: reader
      image: busybox:1.36
      command: ["sh", "-c", "sleep 2; cat /data/msg; sleep 3600"]
      volumeMounts:
        - name: data
          mountPath: /data
  volumes:
    - name: data
      emptyDir: {}
EOF
kubectl logs share-data -c reader`,
  },
  {
    id: 'storage-pvc',
    title: 'Create a PVC and mount it',
    description:
      'Create a PersistentVolumeClaim requesting 1Gi ReadWriteOnce, mount it in a Pod, and write a test file.',
    difficulty: 'intermediate',
    category: 'Storage',
    hint: 'Local clusters usually have a default StorageClass that dynamically provisions volumes.',
    exampleSolution: `cat <<'EOF' | kubectl apply -f -
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: bingo-pvc
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 1Gi
---
apiVersion: v1
kind: Pod
metadata:
  name: pvc-pod
spec:
  containers:
    - name: app
      image: busybox:1.36
      command: ["sh", "-c", "echo stored > /mnt/data/hello.txt; sleep 3600"]
      volumeMounts:
        - name: data
          mountPath: /mnt/data
  volumes:
    - name: data
      persistentVolumeClaim:
        claimName: bingo-pvc
EOF
kubectl get pvc bingo-pvc
kubectl exec pvc-pod -- cat /mnt/data/hello.txt`,
  },
  {
    id: 'storage-class',
    title: 'Inspect StorageClasses',
    description:
      'List StorageClasses in the cluster and identify which one is the default.',
    difficulty: 'beginner',
    category: 'Storage',
    hint: 'The default StorageClass usually has storageclass.kubernetes.io/is-default-class=true.',
    exampleSolution: `kubectl get storageclass
kubectl get storageclass -o custom-columns=NAME:.metadata.name,DEFAULT:.metadata.annotations.storageclass\\.kubernetes\\.io/is-default-class`,
  },
  {
    id: 'scale-hpa',
    title: 'Create a HorizontalPodAutoscaler',
    description:
      'Create an HPA targeting a Deployment with min=1, max=5, and CPU target 50%. Metrics server may be required.',
    difficulty: 'advanced',
    category: 'Scaling',
    hint: 'kubectl autoscale is the quick path. Without metrics-server, the HPA stays unable to compute replicas.',
    exampleSolution: `kubectl create deployment web --image=nginx:1.27
kubectl autoscale deployment web --cpu-percent=50 --min=1 --max=5
kubectl get hpa
kubectl describe hpa web`,
  },
  {
    id: 'scale-manual',
    title: 'Manually scale with kubectl',
    description:
      'Scale a Deployment up and down and watch ReplicaSets and Pods change accordingly.',
    difficulty: 'beginner',
    category: 'Scaling',
    hint: 'Each scale change updates the Deployment; Pods appear or terminate to match.',
    exampleSolution: `kubectl create deployment web --image=nginx:1.27 --replicas=1
kubectl scale deployment/web --replicas=4
kubectl get pods -w
# Ctrl+C, then:
kubectl scale deployment/web --replicas=1`,
  },
  {
    id: 'scale-pdb',
    title: 'Create a PodDisruptionBudget',
    description:
      'Create a PDB that ensures at least 1 Pod of a labeled app remains available during voluntary disruptions.',
    difficulty: 'advanced',
    category: 'Scaling',
    hint: 'PDBs use minAvailable or maxUnavailable with a label selector.',
    exampleSolution: `kubectl create deployment web --image=nginx:1.27 --replicas=3
cat <<'EOF' | kubectl apply -f -
apiVersion: policy/v1
kind: PodDisruptionBudget
metadata:
  name: web-pdb
spec:
  minAvailable: 1
  selector:
    matchLabels:
      app: web
EOF
kubectl get pdb web-pdb`,
  },
  {
    id: 'sec-sa',
    title: 'Create and use a ServiceAccount',
    description:
      'Create a ServiceAccount and run a Pod that uses it instead of the default ServiceAccount.',
    difficulty: 'intermediate',
    category: 'Security',
    hint: 'Set spec.serviceAccountName on the Pod.',
    exampleSolution: `kubectl create serviceaccount bingo-sa
cat <<'EOF' | kubectl apply -f -
apiVersion: v1
kind: Pod
metadata:
  name: sa-pod
spec:
  serviceAccountName: bingo-sa
  containers:
    - name: pause
      image: registry.k8s.io/pause:3.10
EOF
kubectl get pod sa-pod -o jsonpath='{.spec.serviceAccountName}{"\\n"}'`,
  },
  {
    id: 'sec-readonly-rootfs',
    title: 'Use a read-only root filesystem',
    description:
      'Create a Pod with securityContext.readOnlyRootFilesystem=true and confirm writes to / fail (use an emptyDir for writable paths if needed).',
    difficulty: 'advanced',
    category: 'Security',
    hint: 'Many images need a writable emptyDir mounted at /tmp when the root FS is read-only.',
    exampleSolution: `cat <<'EOF' | kubectl apply -f -
apiVersion: v1
kind: Pod
metadata:
  name: ro-root
spec:
  containers:
    - name: busybox
      image: busybox:1.36
      command: ["sh", "-c", "touch /tmp/ok; touch /deny || true; sleep 3600"]
      securityContext:
        readOnlyRootFilesystem: true
      volumeMounts:
        - name: tmp
          mountPath: /tmp
  volumes:
    - name: tmp
      emptyDir: {}
EOF
kubectl logs ro-root`,
  },
  {
    id: 'sec-nonroot',
    title: 'Run a container as non-root',
    description:
      'Create a Pod that sets runAsNonRoot=true and runAsUser=1000, using an image that supports non-root (for example busybox).',
    difficulty: 'intermediate',
    category: 'Security',
    hint: 'Combine Pod-level and container-level securityContext as needed.',
    exampleSolution: `cat <<'EOF' | kubectl apply -f -
apiVersion: v1
kind: Pod
metadata:
  name: nonroot
spec:
  securityContext:
    runAsNonRoot: true
    runAsUser: 1000
  containers:
    - name: busybox
      image: busybox:1.36
      command: ["sh", "-c", "id; sleep 3600"]
EOF
kubectl logs nonroot`,
  },
  {
    id: 'sec-rbac-role',
    title: 'Create a Role and RoleBinding',
    description:
      'Create a Role that can get/list Pods in the current namespace and bind it to a ServiceAccount.',
    difficulty: 'advanced',
    category: 'Security',
    hint: 'Role is namespaced; ClusterRole is cluster-wide. RoleBinding references subjects and a roleRef.',
    exampleSolution: `kubectl create serviceaccount reader
kubectl create role pod-reader --verb=get,list,watch --resource=pods
kubectl create rolebinding reader-pods --role=pod-reader --serviceaccount=default:reader
kubectl auth can-i get pods --as=system:serviceaccount:default:reader`,
  },
  {
    id: 'sec-network-context',
    title: 'Drop Linux capabilities',
    description:
      'Create a Pod that drops ALL capabilities and adds only NET_BIND_SERVICE, then inspect the securityContext.',
    difficulty: 'advanced',
    category: 'Security',
    hint: 'capabilities.drop: ["ALL"] is a common hardening baseline.',
    exampleSolution: `cat <<'EOF' | kubectl apply -f -
apiVersion: v1
kind: Pod
metadata:
  name: drop-caps
spec:
  containers:
    - name: nginx
      image: nginx:1.27
      securityContext:
        capabilities:
          drop: ["ALL"]
          add: ["NET_BIND_SERVICE"]
        allowPrivilegeEscalation: false
EOF
kubectl get pod drop-caps -o yaml | sed -n '/securityContext:/,/volumeMounts:/p'`,
  },
  {
    id: 'pod-init-container',
    title: 'Use an init container',
    description:
      'Create a Pod with an init container that writes a file into a shared emptyDir before the main container starts.',
    difficulty: 'intermediate',
    category: 'Pods',
    hint: 'Init containers run to completion in order before app containers start.',
    exampleSolution: `cat <<'EOF' | kubectl apply -f -
apiVersion: v1
kind: Pod
metadata:
  name: init-demo
spec:
  initContainers:
    - name: setup
      image: busybox:1.36
      command: ["sh", "-c", "echo ready > /work/status"]
      volumeMounts:
        - name: work
          mountPath: /work
  containers:
    - name: app
      image: busybox:1.36
      command: ["sh", "-c", "cat /work/status; sleep 3600"]
      volumeMounts:
        - name: work
          mountPath: /work
  volumes:
    - name: work
      emptyDir: {}
EOF
kubectl logs init-demo`,
  },
  {
    id: 'ns-create',
    title: 'Create and use a Namespace',
    description:
      'Create a Namespace named bingo-lab and deploy a Pod into it using -n / --namespace.',
    difficulty: 'beginner',
    category: 'Pods',
    hint: 'Resources are namespaced unless they are cluster-scoped (Node, PV, ClusterRole, …).',
    exampleSolution: `kubectl create namespace bingo-lab
kubectl run nginx --image=nginx:1.27 -n bingo-lab
kubectl get pods -n bingo-lab`,
  },
  {
    id: 'ctx-switch',
    title: 'Inspect cluster context',
    description:
      'Show the current kubectl context, cluster, and user, and list available contexts.',
    difficulty: 'beginner',
    category: 'Troubleshooting',
    hint: 'kubectl config current-context and kubectl config get-contexts are everyday commands.',
    exampleSolution: `kubectl config current-context
kubectl config get-contexts
kubectl cluster-info`,
  },
  {
    id: 'node-inspect',
    title: 'Inspect cluster Nodes',
    description:
      'List Nodes with their roles, status, and allocatable resources using kubectl get/describe.',
    difficulty: 'beginner',
    category: 'Troubleshooting',
    hint: 'On kind/k3d/minikube you often have one control-plane node.',
    exampleSolution: `kubectl get nodes -o wide
kubectl describe node`,
  },
  {
    id: 'deploy-envfrom-cm',
    title: 'Load ConfigMap keys as env',
    description:
      'Create a ConfigMap and a Deployment that uses envFrom.configMapRef so all keys become environment variables.',
    difficulty: 'intermediate',
    category: 'ConfigMaps and Secrets',
    hint: 'envFrom is cleaner than listing every key when you want the whole ConfigMap.',
    exampleSolution: `kubectl create configmap app-config \\
  --from-literal=APP_ENV=dev \\
  --from-literal=LOG_LEVEL=info
cat <<'EOF' | kubectl apply -f -
apiVersion: apps/v1
kind: Deployment
metadata:
  name: envfrom-demo
spec:
  replicas: 1
  selector:
    matchLabels:
      app: envfrom-demo
  template:
    metadata:
      labels:
        app: envfrom-demo
    spec:
      containers:
        - name: busybox
          image: busybox:1.36
          command: ["sh", "-c", "env | grep -E 'APP_ENV|LOG_LEVEL'; sleep 3600"]
          envFrom:
            - configMapRef:
                name: app-config
EOF
kubectl logs deploy/envfrom-demo`,
  },
  {
    id: 'svc-headless',
    title: 'Create a headless Service',
    description:
      'Create a headless Service (clusterIP: None) for a Deployment and inspect the DNS A records for individual Pods.',
    difficulty: 'advanced',
    category: 'Services',
    hint: 'Headless Services are often used for StatefulSets and peer discovery.',
    exampleSolution: `kubectl create deployment web --image=nginx:1.27 --replicas=2
cat <<'EOF' | kubectl apply -f -
apiVersion: v1
kind: Service
metadata:
  name: web-headless
spec:
  clusterIP: None
  selector:
    app: web
  ports:
    - port: 80
      targetPort: 80
EOF
kubectl run digpod --image=busybox:1.36 --restart=Never -- sleep 3600
kubectl wait --for=condition=Ready pod/digpod --timeout=60s
kubectl exec digpod -- nslookup web-headless.default.svc.cluster.local`,
  },
  {
    id: 'cronjob-suspend',
    title: 'Suspend a CronJob',
    description:
      'Create a CronJob, suspend it so no new Jobs are scheduled, then resume it.',
    difficulty: 'intermediate',
    category: 'Jobs and CronJobs',
    hint: 'spec.suspend: true stops new schedules without deleting the CronJob.',
    exampleSolution: `kubectl create cronjob tick --image=busybox:1.36 --schedule="*/1 * * * *" -- date
kubectl patch cronjob tick -p '{"spec":{"suspend":true}}'
kubectl get cronjob tick
kubectl patch cronjob tick -p '{"spec":{"suspend":false}}'`,
  },
  {
    id: 'deploy-annotate',
    title: 'Annotate a Deployment',
    description:
      'Add a custom annotation to a Deployment and retrieve it with jsonpath.',
    difficulty: 'beginner',
    category: 'Deployments',
    hint: 'Annotations store non-identifying metadata; labels are for selection.',
    exampleSolution: `kubectl create deployment web --image=nginx:1.27
kubectl annotate deployment web bingo.k8s/owner=you
kubectl get deploy web -o jsonpath='{.metadata.annotations.bingo\\.k8s/owner}{"\\n"}'`,
  },
  {
    id: 'net-endpointslices',
    title: 'Inspect EndpointSlices',
    description:
      'Create a Service for a Deployment and list the related EndpointSlice objects.',
    difficulty: 'intermediate',
    category: 'Networking',
    hint: 'Modern clusters use EndpointSlices; classic Endpoints still exist for compatibility.',
    exampleSolution: `kubectl create deployment web --image=nginx:1.27 --replicas=2
kubectl expose deployment web --port=80 --name=web-svc
kubectl get endpointslices -l kubernetes.io/service-name=web-svc
kubectl get endpoints web-svc`,
  },
  {
    id: 'storage-hostpath-warn',
    title: 'Understand hostPath (lab only)',
    description:
      'In a local lab cluster only, create a Pod that mounts a hostPath directory, write a file, and note why hostPath is risky in production.',
    difficulty: 'advanced',
    category: 'Storage',
    hint: 'hostPath couples a Pod to a specific node filesystem — avoid it outside controlled labs.',
    exampleSolution: `cat <<'EOF' | kubectl apply -f -
apiVersion: v1
kind: Pod
metadata:
  name: hostpath-lab
spec:
  containers:
    - name: app
      image: busybox:1.36
      command: ["sh", "-c", "echo lab > /host/bingo.txt; sleep 3600"]
      volumeMounts:
        - name: host
          mountPath: /host
  volumes:
    - name: host
      hostPath:
        path: /tmp/bingo-hostpath
        type: DirectoryOrCreate
EOF
# Prefer PVCs for real workloads. Delete this Pod after the lab.`,
  },
  {
    id: 'deploy-maxsurge',
    title: 'Tune rolling update surge',
    description:
      'Configure a Deployment with rollingUpdate maxUnavailable=0 and maxSurge=1, then trigger an image update and observe Pod counts.',
    difficulty: 'intermediate',
    category: 'Deployments',
    hint: 'strategy.rollingUpdate controls how many Pods can be added/removed during a rollout.',
    exampleSolution: `cat <<'EOF' | kubectl apply -f -
apiVersion: apps/v1
kind: Deployment
metadata:
  name: surge-demo
spec:
  replicas: 3
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxUnavailable: 0
      maxSurge: 1
  selector:
    matchLabels:
      app: surge-demo
  template:
    metadata:
      labels:
        app: surge-demo
    spec:
      containers:
        - name: nginx
          image: nginx:1.26
EOF
kubectl set image deployment/surge-demo nginx=nginx:1.27
kubectl rollout status deployment/surge-demo`,
  },
  {
    id: 'svc-externalname',
    title: 'Create an ExternalName Service',
    description:
      'Create a Service of type ExternalName that aliases example.com, then inspect its DNS target.',
    difficulty: 'intermediate',
    category: 'Services',
    hint: 'ExternalName returns a CNAME — no selector or cluster IP is used.',
    exampleSolution: `kubectl create service externalname docs --external-name=example.com
kubectl get svc docs -o yaml`,
  },
  {
    id: 'cm-immutable',
    title: 'Create an immutable ConfigMap',
    description:
      'Create a ConfigMap with immutable: true and confirm that updating its data is rejected.',
    difficulty: 'intermediate',
    category: 'ConfigMaps and Secrets',
    hint: 'Immutable ConfigMaps/Secrets cannot change data; you must recreate them.',
    exampleSolution: `cat <<'EOF' | kubectl apply -f -
apiVersion: v1
kind: ConfigMap
metadata:
  name: locked-config
immutable: true
data:
  mode: readonly
EOF
kubectl patch configmap locked-config --type merge -p '{"data":{"mode":"changed"}}' || true`,
  },
  {
    id: 'job-backoff',
    title: 'Limit Job retries with backoffLimit',
    description:
      'Create a Job that always fails with backoffLimit=2, then observe it reach Failed after retries.',
    difficulty: 'intermediate',
    category: 'Jobs and CronJobs',
    hint: 'backoffLimit caps how many times a Job will retry failed Pods.',
    exampleSolution: `cat <<'EOF' | kubectl apply -f -
apiVersion: batch/v1
kind: Job
metadata:
  name: fail-job
spec:
  backoffLimit: 2
  template:
    spec:
      restartPolicy: Never
      containers:
        - name: fail
          image: busybox:1.36
          command: ["sh", "-c", "exit 1"]
EOF
kubectl get job fail-job -w`,
  },
  {
    id: 'trouble-jsonpath',
    title: 'Extract fields with jsonpath',
    description:
      'Use kubectl -o jsonpath to print the image of the first container in a named Pod.',
    difficulty: 'intermediate',
    category: 'Troubleshooting',
    hint: 'jsonpath is ideal for scripting. Escape dots in annotation keys carefully.',
    exampleSolution: `kubectl run jp --image=nginx:1.27
kubectl get pod jp -o jsonpath='{.spec.containers[0].image}{"\\n"}'`,
  },
  {
    id: 'net-pod-to-pod',
    title: 'Connect Pod-to-Pod by IP',
    description:
      'Get the IP of an nginx Pod and curl it from another Pod to confirm flat cluster networking.',
    difficulty: 'intermediate',
    category: 'Networking',
    hint: 'kubectl get pod -o wide shows Pod IPs.',
    exampleSolution: `kubectl run web --image=nginx:1.27
kubectl wait --for=condition=Ready pod/web --timeout=60s
IP=$(kubectl get pod web -o jsonpath='{.status.podIP}')
kubectl run client --image=busybox:1.36 --restart=Never -- wget -qO- http://$IP
kubectl logs client`,
  },
  {
    id: 'storage-volume-mode',
    title: 'Request a Filesystem PVC',
    description:
      'Create a PVC that explicitly sets volumeMode: Filesystem and mount it in a Pod.',
    difficulty: 'intermediate',
    category: 'Storage',
    hint: 'Filesystem is the default volumeMode; Block is for raw devices.',
    exampleSolution: `cat <<'EOF' | kubectl apply -f -
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: fs-pvc
spec:
  accessModes: ["ReadWriteOnce"]
  volumeMode: Filesystem
  resources:
    requests:
      storage: 1Gi
EOF
kubectl get pvc fs-pvc`,
  },
  {
    id: 'scale-replicas-yaml',
    title: 'Change replicas in a manifest',
    description:
      'Edit a Deployment YAML to change replicas, re-apply it, and confirm the new Pod count.',
    difficulty: 'beginner',
    category: 'Scaling',
    hint: 'kubectl apply is declarative — updating replicas in the file is enough.',
    exampleSolution: `kubectl create deployment web --image=nginx:1.27 --replicas=1
kubectl get deploy web -o yaml | sed 's/replicas: 1/replicas: 3/' | kubectl apply -f -
kubectl get pods -l app=web`,
  },
  {
    id: 'sec-seccomp',
    title: 'Apply RuntimeDefault seccomp',
    description:
      'Create a Pod that sets seccompProfile.type=RuntimeDefault and verify it is present in the Pod spec.',
    difficulty: 'advanced',
    category: 'Security',
    hint: 'RuntimeDefault uses the container runtime’s default seccomp profile.',
    exampleSolution: `cat <<'EOF' | kubectl apply -f -
apiVersion: v1
kind: Pod
metadata:
  name: seccomp-pod
spec:
  securityContext:
    seccompProfile:
      type: RuntimeDefault
  containers:
    - name: pause
      image: registry.k8s.io/pause:3.10
      securityContext:
        allowPrivilegeEscalation: false
EOF
kubectl get pod seccomp-pod -o jsonpath='{.spec.securityContext.seccompProfile.type}{"\\n"}'`,
  },
  {
    id: 'sec-limit-range',
    title: 'Create a LimitRange',
    description:
      'Create a LimitRange that sets default CPU/memory requests and limits for containers in a namespace.',
    difficulty: 'advanced',
    category: 'Security',
    hint: 'LimitRanges apply defaults and constraints to Pods created in that namespace.',
    exampleSolution: `kubectl create namespace limited
cat <<'EOF' | kubectl apply -f -
apiVersion: v1
kind: LimitRange
metadata:
  name: defaults
  namespace: limited
spec:
  limits:
    - type: Container
      defaultRequest:
        cpu: 50m
        memory: 64Mi
      default:
        cpu: 200m
        memory: 128Mi
EOF
kubectl run nginx --image=nginx:1.27 -n limited
kubectl get pod nginx -n limited -o yaml | sed -n '/resources:/,/ports:/p'`,
  },
  {
    id: 'sec-resourcequota',
    title: 'Create a ResourceQuota',
    description:
      'Create a ResourceQuota that caps Pods and CPU in a namespace, then try to exceed it.',
    difficulty: 'advanced',
    category: 'Security',
    hint: 'Quotas reject create/update requests that would exceed hard limits.',
    exampleSolution: `kubectl create namespace capped
cat <<'EOF' | kubectl apply -f -
apiVersion: v1
kind: ResourceQuota
metadata:
  name: compute
  namespace: capped
spec:
  hard:
    pods: "2"
    requests.cpu: "500m"
EOF
kubectl create deployment web --image=nginx:1.27 --replicas=3 -n capped || true
kubectl describe quota compute -n capped`,
  },
  {
    id: 'deploy-affinity',
    title: 'Add podAntiAffinity',
    description:
      'Create a Deployment with preferred podAntiAffinity so replicas prefer different nodes (works best on multi-node clusters).',
    difficulty: 'advanced',
    category: 'Deployments',
    hint: 'preferredDuringSchedulingIgnoredDuringExecution is a soft rule; required is hard.',
    exampleSolution: `cat <<'EOF' | kubectl apply -f -
apiVersion: apps/v1
kind: Deployment
metadata:
  name: spread
spec:
  replicas: 2
  selector:
    matchLabels:
      app: spread
  template:
    metadata:
      labels:
        app: spread
    spec:
      affinity:
        podAntiAffinity:
          preferredDuringSchedulingIgnoredDuringExecution:
            - weight: 100
              podAffinityTerm:
                labelSelector:
                  matchLabels:
                    app: spread
                topologyKey: kubernetes.io/hostname
      containers:
        - name: nginx
          image: nginx:1.27
EOF
kubectl get pods -l app=spread -o wide`,
  },
  {
    id: 'net-policy-allow-ns',
    title: 'Allow Ingress from a namespace',
    description:
      'Write a NetworkPolicy that allows Ingress to app=api only from Pods in namespaces labeled purpose=frontend.',
    difficulty: 'advanced',
    category: 'Networking',
    hint: 'Use namespaceSelector together with podSelector in ingress.from.',
    exampleSolution: `cat <<'EOF' | kubectl apply -f -
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: api-allow-frontend
spec:
  podSelector:
    matchLabels:
      app: api
  policyTypes:
    - Ingress
  ingress:
    - from:
        - namespaceSelector:
            matchLabels:
              purpose: frontend
      ports:
        - protocol: TCP
          port: 80
EOF
kubectl get networkpolicy api-allow-frontend`,
  },
  {
    id: 'storage-statefulset',
    title: 'Create a simple StatefulSet',
    description:
      'Create a StatefulSet with 2 replicas and a headless Service, then observe stable Pod names.',
    difficulty: 'advanced',
    category: 'Storage',
    hint: 'StatefulSet Pods are named <statefulset>-<ordinal> and need a headless Service.',
    exampleSolution: `cat <<'EOF' | kubectl apply -f -
apiVersion: v1
kind: Service
metadata:
  name: web-sts
spec:
  clusterIP: None
  selector:
    app: web-sts
  ports:
    - port: 80
---
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: web-sts
spec:
  serviceName: web-sts
  replicas: 2
  selector:
    matchLabels:
      app: web-sts
  template:
    metadata:
      labels:
        app: web-sts
    spec:
      containers:
        - name: nginx
          image: nginx:1.27
          ports:
            - containerPort: 80
EOF
kubectl get pods -l app=web-sts`,
  },
  {
    id: 'scale-vpa-concept',
    title: 'Inspect allocation before scaling',
    description:
      'Before changing replica counts, use kubectl top (if metrics-server is installed) or describe to reason about current resource use.',
    difficulty: 'advanced',
    category: 'Scaling',
    hint: 'kubectl top needs metrics-server. If missing, fall back to describe and requests/limits.',
    exampleSolution: `kubectl create deployment web --image=nginx:1.27 --replicas=2
kubectl top pods || echo "metrics-server not installed — use describe instead"
kubectl describe deployment web | sed -n '/Replicas:/,/Events:/p'`,
  },
  {
    id: 'job-ttl',
    title: 'Auto-clean Jobs with ttlSecondsAfterFinished',
    description:
      'Create a successful Job with ttlSecondsAfterFinished=60 and confirm the TTL field is set.',
    difficulty: 'advanced',
    category: 'Jobs and CronJobs',
    hint: 'TTL controller deletes finished Jobs after the configured seconds.',
    exampleSolution: `cat <<'EOF' | kubectl apply -f -
apiVersion: batch/v1
kind: Job
metadata:
  name: ttl-job
spec:
  ttlSecondsAfterFinished: 60
  template:
    spec:
      restartPolicy: Never
      containers:
        - name: hello
          image: busybox:1.36
          command: ["echo", "done"]
EOF
kubectl get job ttl-job -o jsonpath='{.spec.ttlSecondsAfterFinished}{"\\n"}'`,
  },
  {
    id: 'pod-qos',
    title: 'Create a Guaranteed QoS Pod',
    description:
      'Create a Pod whose container requests equal limits for CPU and memory so QoS Class becomes Guaranteed.',
    difficulty: 'advanced',
    category: 'Pods',
    hint: 'Guaranteed QoS requires every container to set equal requests and limits for CPU and memory.',
    exampleSolution: `cat <<'EOF' | kubectl apply -f -
apiVersion: v1
kind: Pod
metadata:
  name: guaranteed
spec:
  containers:
    - name: nginx
      image: nginx:1.27
      resources:
        requests:
          cpu: 100m
          memory: 128Mi
        limits:
          cpu: 100m
          memory: 128Mi
EOF
kubectl get pod guaranteed -o jsonpath='{.status.qosClass}{"\\n"}'`,
  },
  {
    id: 'trouble-debug-ephemeral',
    title: 'Debug with an ephemeral container',
    description:
      'If your cluster enables ephemeral containers, attach a debug container to a running Pod with kubectl debug.',
    difficulty: 'advanced',
    category: 'Troubleshooting',
    hint: 'kubectl debug can add a busybox/ephemeral container sharing the Pod namespaces.',
    exampleSolution: `kubectl run target --image=nginx:1.27
kubectl wait --for=condition=Ready pod/target --timeout=60s
kubectl debug -it pod/target --image=busybox:1.36 --target=nginx
# If ephemeral containers are disabled, use kubectl exec instead.`,
  },
  {
    id: 'cm-from-file',
    title: 'Create a ConfigMap from a file',
    description:
      'Write a local app.properties file and create a ConfigMap from it with --from-file.',
    difficulty: 'beginner',
    category: 'ConfigMaps and Secrets',
    hint: 'The filename becomes the ConfigMap key by default.',
    exampleSolution: `echo 'color=blue' > app.properties
kubectl create configmap props --from-file=app.properties
kubectl get configmap props -o yaml`,
  },
  {
    id: 'deploy-history',
    title: 'Inspect rollout history',
    description:
      'Change a Deployment image twice, then use rollout history to list revisions.',
    difficulty: 'beginner',
    category: 'Deployments',
    hint: 'Each change creates a new revision recorded by the Deployment controller.',
    exampleSolution: `kubectl create deployment web --image=nginx:1.26
kubectl set image deployment/web nginx=nginx:1.27
kubectl set image deployment/web nginx=nginx:1.27-alpine
kubectl rollout history deployment/web`,
  },
]

export function getChallengeById(id: string): Challenge | undefined {
  if (id === FREE_SPACE.id) return FREE_SPACE
  return CHALLENGES.find((challenge) => challenge.id === id)
}
