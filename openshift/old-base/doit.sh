oc delete project phone-md-hp
sleep 20
oc new-project phone-md-hp

oc create configmap phone-md-hp-app-config --from-file=../.env.local 

oc apply -k . 

oc set env --from=configmap/phone-md-hp-app-config deploymentconfig/phone-md-hp-app 

oc start-build phone-md-hp-app