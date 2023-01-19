oc delete project phone-md
sleep 20
oc new-project phone-md

oc create configmap phone-md-app-config --from-file=.env.local 

oc apply -k . 

oc set env --from=configmap/phone-md-config deploymentconfig/phone-md-app 

oc start-build phone-md-app