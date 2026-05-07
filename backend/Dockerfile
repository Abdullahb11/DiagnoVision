FROM python:3.12-slim

# Install system dependencies required by OpenCV
RUN apt-get update && apt-get install -y libgl1 libglib2.0-0 && rm -rf /var/lib/apt/lists/*

# Hugging Face Spaces requires a non-root user
RUN useradd -m -u 1000 user

# Set environment variables
ENV PATH="/home/user/.local/bin:$PATH"
ENV PYTHONUNBUFFERED=1

# Set the working directory
WORKDIR /app

# Copy requirements file and install dependencies
COPY --chown=user requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the backend files
COPY --chown=user . .

# Switch to the non-root user
USER user

# Hugging Face Spaces exposes port 7860 by default
ENV API_PORT=7860
ENV API_HOST=0.0.0.0

# Start the FastAPI app
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "7860"]
