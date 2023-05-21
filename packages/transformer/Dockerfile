FROM python:3.9
RUN apt-get update
RUN apt-get install -y --no-install-recommends \
       curl \
       cmake \
       make \
       gcc \
       g++
RUN curl -sSL https://install.python-poetry.org | python3 -
RUN apt-get purge -y --auto-remove curl
ENV PATH="/root/.local/bin:$PATH"

# install arrow library
RUN apt-get install -y -V ca-certificates lsb-release wget
RUN wget https://apache.jfrog.io/artifactory/arrow/$(lsb_release --id --short | tr 'A-Z' 'a-z')/apache-arrow-apt-source-latest-$(lsb_release --codename --short).deb -O /tmp/apache-arrow.deb
RUN apt-get -y install /tmp/apache-arrow.deb
RUN apt-get -y update
RUN apt-get -y install libarrow-dev=9.0.0-1 libarrow-python-dev=9.0.0-1

# Copy only requirements to cache them in docker layer
WORKDIR /code
COPY pyproject.toml /code/

RUN poetry config virtualenvs.create false
RUN poetry install

ENTRYPOINT ["python", "src/main.py"]

# google auth
COPY ~/.config/gcloud/application_default_credentials.json /code/