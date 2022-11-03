FROM tiangolo/uvicorn-gunicorn-fastapi:python3.9

WORKDIR /app

COPY backend/requirements.txt /app
RUN pip install --no-cache-dir --upgrade -r requirements.txt

COPY backend/ /app

CMD ["uvicorn", "src.app:app", "--host", "0.0.0.0", "--port", "5001", "--debug", "--reload-dir", "/app", "--log-level", "debug"]