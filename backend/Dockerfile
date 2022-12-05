FROM tiangolo/uvicorn-gunicorn-fastapi:python3.9

WORKDIR /app

COPY . . 

RUN pip install --no-cache-dir --upgrade -r requirements.txt

CMD ["uvicorn", "src.app:app", "--host", "0.0.0.0", "--port", "5001", "--reload-dir", "/app", "--log-level", "debug"]