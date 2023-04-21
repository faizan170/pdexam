FROM node:16-alpine as build-step
WORKDIR /app


ENV PATH /app/node_modules/.bin:$PATH
COPY ./frontend/. .

RUN npm install
RUN npm run build


FROM python:3.9-slim
ENV DEBIAN_FRONTEND noninteractive
COPY --from=build-step /app/build ./build

RUN apt-get update && apt-get install -y libportaudio2 libsndfile1 ffmpeg libreoffice && rm -rf /var/lib/apt/lists/*

ADD backend/requirements.txt .


RUN pip install --no-cache-dir -r requirements.txt

WORKDIR /app
COPY backend/ ./

# Service must listen to $PORT environment variable.
# This default value facilitates local development.
ENV PORT 8080

# Run the web service on container startup. Here we use the gunicorn
# webserver, with one worker process and 8 threads.
# For environments with multiple CPU cores, increase the number of workers
# to be equal to the cores available.
#CMD ["python", "main.py"]
CMD exec gunicorn --bind 0.0.0.0:$PORT --workers 1 --threads 8 --timeout 0 main:app
#CMD exec gunicorn --bind 0.0.0.0:$PORT -w 1 --timeout 0 main:app
#CMD exec gunicorn --worker-class eventlet -w 1 -b 0.0.0.0:5000 app:app