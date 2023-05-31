FROM python:3.11-slim
RUN apt-get update
RUN apt-get install -y --no-install-recommends curl

RUN curl -sSL https://install.python-poetry.org | python3 -
RUN apt-get purge -y --auto-remove curl
ENV PATH="/root/.local/bin:$PATH"

# Copy only requirements to cache them in docker layer
WORKDIR /code
COPY pyproject.toml /code/

RUN poetry config virtualenvs.create false
RUN poetry install