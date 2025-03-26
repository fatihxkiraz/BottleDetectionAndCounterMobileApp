FROM python:3.10-slim

WORKDIR /app

# Install system dependencies for OpenCV
RUN apt-get update && apt-get install -y \
    libgl1-mesa-glx \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements first for better caching
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application
COPY . .

# Ensure the model directory exists and is accessible
RUN mkdir -p /app/model

# Make port 8048 available
EXPOSE 8048

# Start the application
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8048"]
