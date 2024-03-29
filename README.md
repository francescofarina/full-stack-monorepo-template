# Monorepo template
This repository can be used as a starting point to create and deploy projects with Python backends and JS/TS/React frontends. Basic authentication functionalities via jwt are provided and Postgres is used as a database.

> Note: this is mainly based on personal preferences and practices I've seen over the past. For some extra info on the K8S config and deployment steps, a good step-by-step guide is [here](https://datagraphi.com/blog/post/2021/2/10/kubernetes-guide-deploying-a-machine-learning-app-built-with-django-react-and-postgresql-using-kubernetes).

## Local development
- Run `docker-compose up` to launch the postgres database and the django backend
- Run `npm start` to launch the frontend

## Local production-like setup
We use minikube to simulate a production setup locally.
- `minikube start` (possibly provide an amount of resources `minikube start --cpus=4 --memory=10000 --disk-size=40g`)
- Encode secrets (`echo -n "admin_password" | base64`), copy them in `app_secrets.yaml` and run `kubectl apply -f infrastructure/app_secrets.yaml`
- `kubectl apply -f infrastructure/app_variables.yaml`
- Create PV on node machine
    - `minikube ssh`
    - Create Persisted Volumes (PV)
    ```
    sudo su
    if [ ! -d /var/lib/data/postgres_data ]; then
        mkdir -p /var/lib/data/postgres_data;
    fi;
    chmod -R 777 /var/lib/data/postgres_data;
    chown -R 999:999 /var/lib/data/postgres_data;

    if [ ! -d /var/lib/data/static_assets_data ]; then
        mkdir -p /var/lib/data/static_assets_data;
    fi;
    chmod -R 777 /var/lib/data/static_assets_data;
    chown -R 999:999 /var/lib/data/static_assets_data;
    ```
- `kubectl apply -f infrastructure/component_postgres.yaml`

- Setup Minikube docker-env `eval $(minikube docker-env)`
- Create backend image `docker build -t ffsquared/backend_image:latest -f ./backend/Dockerfile.prod ./backend`
- `kubectl apply -f infrastructure/job_django.yaml`

- Create nginx image `docker build -t ffsquared/nginx_image:latest -f ./nginx/Dockerfile.prod ./nginx`
- `kubectl apply -f infrastructure/component_static_assets.yaml`
- `kubectl apply -f infrastructure/component_django.yaml`

- Create frontend image `docker build -t ffsquared/frontend_image:latest -f ./frontend/Dockerfile.prod ./frontend`
- `kubectl apply -f infrastructure/component_react.yaml`

- Enable ingress `minikube addons enable ingress`
- `kubectl apply -f infrastructure/ingress_service.yaml` (NB: this may fail from time to time because of the webhook)

- On MacOS (https://github.com/kubernetes/minikube/issues/13951, https://github.com/deepmodeling/dflow/issues/453)
    - Option 1 (requires sudo permission):
        - `minikube tunnel`
        - the frontend is available at 127.0.0.1
    - Option 2 (may not work):
        - `kubectl port-forward services/react-cluster-ip-service  8080:3000`
        - the frontend is available at `localhost:8080`

- `minikube dashboar` to access the dashboard

### Shut down
- `eval $(minikube docker-env -u)`
- `minikube stop && minikube delete`


## Deploying
### TODOs
- `DJANGO_ALLOWED_HOSTS` in `infrastructre/app_variables.yaml`. On the actual cloud deployment, after you create your Kubernetes cluster, you would first need to get the external IP address of your Kubernetes Cluster VM and then change the value of the variable 'DJANGO_ALLOWED_HOSTS' to this IP address. Or if you plan to use your own domain, you could also put that value for this variable. So the value of this variable should look like below on your actual cloud deployment file.

    `DJANGO_ALLOWED_HOSTS: "your_kubernetes_cluster_IP_address www.yourwebsite.com [::1]"`
  
- names and passwords in `infrastructre/app_secrets.yaml` and `infrastructre/app_variables.yaml`
- Store images in container registry and pull them (remove `imagePullPolicy: Never` from `yaml` files)
