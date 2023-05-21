FROM apache/beam_python3.9_sdk:2.45.0

# google auth
COPY application_default_credentials.json /code/
RUN export GOOGLE_APPLICATION_CREDENTIALS="application_default_credentials.json"
RUN export PUB_SUB_EMULATOR_HOST=localhost:8085
RUN export PUB_SUB_PROJECT_ID=risk-monitoring-361911