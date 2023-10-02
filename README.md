- eksctl create cluster --region=us-west-1 --name=rm2
- eksctl get cluster --region us-west-1
- kubectl get pods --all-namespaces
- aws eks update-kubeconfig --region us-west-1 --name rm2
- kubectl get all
- kubectl get pods --all-namespaces
- kubectl exec -it rm2-57ccf668dd-fwxbm  -- /bin/bash
- kubectl set env pod/rm2-57ccf668dd-fwxbm MONGO_URL=





- pcx-0571f2084bdfe7c74	172.16.0.0/21 (us-west-1)