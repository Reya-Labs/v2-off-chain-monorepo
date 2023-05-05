FROM python:3.11-slim
WORKDIR /
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
&& curl -sSL https://install.python-poetry.org | python3 - \
&& apt-get purge -y --auto-remove curl

RUN poetry config virtualenvs.create false \
    && poetry install --no-interaction --no-ansi --no-dev
 \
ENTRYPOINT ["python", "src/main.py"]