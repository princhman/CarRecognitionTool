from PIL import Image
import requests
from .ImagePreparation import car_handler
import matplotlib.pyplot as plt
import numpy as np
import os


class CarImageProcessor: 
    def __init__(self, url, debug=False, imagePath=None):
        self.url = url
        self.debug = debug
        if imagePath is None:
            self.imagePath = self.download_image()
        else:
            self.imagePath = imagePath

    def download_image(self):
        response = requests.get(self.url)
        imagePath = self.url.split("/")[-1]
        with open(imagePath, "wb") as file:
            file.write(response.content)
        return imagePath

    def delete_image(self):
        os.remove(self.imagePath)

    def process_image(self):
        car_images = car_handler(self.imagePath)
        car_images_array = []
        if car_images == "No cars detected." or len(car_images) == 0:
            print("No cars detected.")
            return

        for i, car in enumerate(car_images):
            if self.debug:
                img = Image.open(self.imagePath)
                img.show()
            path = f"/Users/vladyslavnalyvaiko/Desktop/College/Computer science/NEA/Code/flask-server/backend/ai_model/workingImages/car{i+1}.jpg"
            car.save(path)
            car_images_array.append(path)
        
        return car_images_array

    # for situations where we have multiple cars in an image
    def recognise_cars(self, images_paths):
        all_results = []
        for imageg_path in images_paths:
            results = self.recognise_car(imageg_path)
            all_results.append(results)
        return all_results


    def recognise_car(self, image_path): # for now only this one is used
        print("Recognising car...")

        # This is a placeholder for an actual algorithm
        models = ["Toyota Camry", "Honda Civic", "Ford F-150", "Tesla Model 3", "Chevrolet Malibu"]
        confidences = [0.92, 0.87, 0.95, 0.89, 0.91]
        
        results = []
        for model, confidence in zip(models, confidences):
            results.append({
                "make+model": model,
                "confidence": confidence
            })
        
        if self.debug != True:
            os.remove(image_path)

        return results



def main():
    choice = "Y"
    print("Welcome to the car recognition tool! Please enter the URL of the image you would like to process.")
    while choice.upper() == "Y":
        url = input("Enter the URL of the image: ")
        mainClass = CarImageProcessor(url)
        mainClass.process_image()
        choice = input("Would you like to process another image? (Y/N): ")

if __name__ == "__main__":
    main()