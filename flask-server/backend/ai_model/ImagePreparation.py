import torch
import cv2
import matplotlib.pyplot as plt
from torchvision import models, transforms
from PIL import Image
import numpy as np

preprocess = transforms.Compose([
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
])

# using yolov5 to detect cars in an image
def detect_car(image_path):
    model = torch.hub.load('ultralytics/yolov5', 'yolov5s')
    img = cv2.imread(image_path)
    results = model(img)
    car_boxes = [box for box in results.xyxy[0] if results.names[int(box[-1])] == 'car']
    print(f"Number of cars detected: {len(car_boxes)}")
    return car_boxes

# using deeplabv3 to remove background from an image
def remove_bg_for_car(image_path, car_boxes):
    segmentation_model = models.segmentation.deeplabv3_resnet101(pretrained=True).eval()
    cars = []

    def crop_image(image_path, box):
        img = Image.open(image_path)
        x1, y1, x2, y2 = map(int, box[:4])
        return img.crop((x1, y1, x2, y2))
    print("Removing background from cars...")
    for i, box in enumerate(car_boxes):
        car_roi = crop_image(image_path, box)
        input_tensor = preprocess(car_roi).unsqueeze(0)
        with torch.no_grad():
            output = segmentation_model(input_tensor)['out'][0]
        output_predictions = output.argmax(0)
        mask = (output_predictions == 7).cpu().numpy().astype('uint8') * 255

        # Filter out disconnected parts of the mask
        num_labels, labels_im = cv2.connectedComponents(mask)
        largest_label = 1 + np.argmax(np.bincount(labels_im.flat)[1:])
        mask = np.uint8(labels_im == largest_label) * 255

        mask_img = Image.fromarray(mask).resize(car_roi.size, Image.NEAREST)
        car_img = Image.composite(car_roi, Image.new('RGB', car_roi.size, (255, 255, 255)), mask_img)
        cars.append(car_img)
    return cars
    

def car_handler(image_path):
    car_boxes = detect_car(image_path)
    if not car_boxes:
        return "No cars detected."
    return remove_bg_for_car(image_path, car_boxes)

if __name__ == "__main__":
    car_handler("/Users/vladyslavnalyvaiko/Desktop/College/Computer science/NEA/Code/testing_images/test7.jpg")

