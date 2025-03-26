from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from ultralytics import YOLO
import cv2
import numpy as np
import os
from typing import List, Dict
from pydantic import BaseModel
import base64
from io import BytesIO


class DetectedItem(BaseModel):
    id: str
    name: str
    category: str
    confidence: float


class InventoryAnalysis(BaseModel):
    totalCount: int
    categories: Dict[str, int]
    items: List[DetectedItem]
    image: str
    error: str = None


class ImageInput(BaseModel):
    image: str  # base64 encoded image
    selections: List[str] = []  # list of selected items to detect


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load model once when starting the server
model_path = os.path.join(os.path.dirname(__file__), "model", "best4.pt")
model = YOLO(model_path)


def process_image(image_base64: str, selections: List[str] = None) -> InventoryAnalysis:
    try:
        # Convert base64 to bytes
        image_bytes = base64.b64decode(image_base64)
        
        # Convert bytes to numpy array
        nparr = np.frombuffer(image_bytes, np.uint8)
        image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

        # Run detection
        results = model.predict(image, conf=0.5)

        # Process results
        detected_items = []
        categories_count = {}

        for result in results:
            for idx, box in enumerate(result.boxes):
                # Get detection info
                x1, y1, x2, y2 = map(int, box.xyxy[0])
                conf = float(box.conf[0])
                label = result.names[int(box.cls[0])]
                
                # Skip if not in selections (if selections is provided)
                if selections and label.lower() not in [s.lower() for s in selections]:
                    continue

                # Draw on image
                cv2.rectangle(image, (x1, y1), (x2, y2), (0, 255, 0), 2)

                # Add text
                text = f"{label} {conf:.2f}"
                cv2.putText(
                    image,
                    text,
                    (x1, y1 - 10),
                    cv2.FONT_HERSHEY_SIMPLEX,
                    0.5,
                    (0, 255, 0),
                    1,
                )


                # Update categories count
                categories_count[label.lower()] = categories_count.get(label.lower(), 0) + 1

                # Add to items list
                detected_items.append(
                    DetectedItem(
                        id=str(idx), name=label.lower(), category=label.lower(), confidence=conf
                    )
                )

        # Convert processed image to base64
        _, buffer = cv2.imencode(".jpg", image)
        img_base64 = base64.b64encode(buffer).decode()

        return InventoryAnalysis(
            totalCount=len(detected_items),
            categories=categories_count,
            items=detected_items,
            image=img_base64,
        )

    except Exception as e:
        return InventoryAnalysis(
            totalCount=0, categories={}, items=[], image="", error=str(e)
        )


@app.get("/")
async def root():
    return {
        "name": "Drink Cabinet API",
        "version": "1.0.0",
        "endpoints": {
            "/": "API information",
            "/detect": "Detect objects in image (POST)"
        }
    }

@app.post("/detect", response_model=InventoryAnalysis)
async def detect_objects(input_data: ImageInput):
    result = process_image(input_data.image, input_data.selections)
    return result


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)