FROM apache/beam_python3.9_sdk:2.45.0

# alternative https://cloud.google.com/sdk/docs/install
# or https://cloud.google.com/sdk/docs/downloads-docker
#RUN echo "deb [signed-by=/usr/share/keyrings/cloud.google.gpg] http://packages.cloud.google.com/apt cloud-sdk main" | tee -a /etc/apt/sources.list.d/google-cloud-sdk.list && curl https://packages.cloud.google.com/apt/doc/apt-key.gpg | apt-key --keyring /usr/share/keyrings/cloud.google.gpg  add - && apt-get update -y && apt-get install google-cloud-cli -y

# google auth
COPY application_default_credentials.json /code/
RUN export GOOGLE_APPLICATION_CREDENTIALS="./application_default_credentials.json"


# pubsub
RUN apt-get install apt-transport-https ca-certificates gnupg
RUN echo "deb [signed-by=/usr/share/keyrings/cloud.google.gpg] https://packages.cloud.google.com/apt cloud-sdk main" | tee -a /etc/apt/sources.list.d/google-cloud-sdk.list
RUN curl https://packages.cloud.google.com/apt/doc/apt-key.gpg | apt-key --keyring /usr/share/keyrings/cloud.google.gpg add -
RUN apt-get update && apt-get install google-cloud-cli -y
RUN gcloud components list
RUN apt-get install google-cloud-sdk-pubsub-emulator -y
RUN gcloud components install beta
RUN gcloud init
# sets the PUBSUB_EMULATOR_HOST environment variable to its configured --host-port value
RUN $(gcloud beta emulators pubsub env-init)
#RUN export PUB_SUB_EMULATOR_HOST=localhost:8085 (same as line above)
RUN export PUB_SUB_PROJECT_ID=risk-monitoring-361911-test
RUN gcloud beta emulators pubsub start --project=risk-monitoring-361911-test --host-port=localhost:8085
RUN gcloud beta emulators pubsub env-init