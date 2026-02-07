import os
import zipfile
import shutil

# --- Configuration ---
# Source
ZIP_PATH = r"C:\Users\IDEAPAD\Downloads\archive.zip" # Using the one we confirmed exists and has data

# Destination
DATASET_ROOT = r"C:\Users\IDEAPAD\OneDrive\Rajveer code\AgroLens\ml_training\dataset"
OUTPUT_MODEL_PATH = r"C:\Users\IDEAPAD\OneDrive\Rajveer code\AgroLens\ml_training\models"

# Target Major Indian Crops
TARGET_CROPS = [
    'rice', 'wheat', 'sugarcane', 'potato', 'corn', 'cotton', 'tomato', 'tea'
]

# --- Helper Function ---
def setup_directories():
    if not os.path.exists(DATASET_ROOT):
        os.makedirs(DATASET_ROOT)
        print(f"Created dataset root: {DATASET_ROOT}")
    if not os.path.exists(OUTPUT_MODEL_PATH):
        os.makedirs(OUTPUT_MODEL_PATH)
        print(f"Created model output dir: {OUTPUT_MODEL_PATH}")

def extract_and_organize():
    print("--- Starting Extraction & Organization ---")
    
    with zipfile.ZipFile(ZIP_PATH, 'r') as zip_ref:
        files = zip_ref.namelist()
        total_files = len(files)
        print(f"Total files in archive: {total_files}")
        
        extracted_count = 0
        
        for file in files:
            # Check if it's an image file
            if not file.lower().endswith(('.jpg', '.jpeg', '.png')):
                continue
            
            # Check if it matches our target crops
            file_lower = file.lower()
            target_crop = None
            original_folder_name = os.path.dirname(file).split('/')[-1] # e.g. "Corn___Common_Rust"
            
            # Check if crop name is in the path
            for crop in TARGET_CROPS:
                if crop in file_lower:
                    target_crop = crop
                    break
            
            if target_crop:
                # Create a standardized folder name: e.g. "rice_disease_name"
                # Use the original folder name but sanitized
                sanitized_cls = original_folder_name.replace(" ", "_").replace("(", "").replace(")", "")
                dest_dir = os.path.join(DATASET_ROOT, sanitized_cls)
                
                if not os.path.exists(dest_dir):
                    os.makedirs(dest_dir)
                
                # Extract file
                filename = os.path.basename(file)
                source = zip_ref.open(file)
                dest_path = os.path.join(dest_dir, filename)
                
                with open(dest_path, "wb") as f:
                    f.write(source.read())
                
                extracted_count += 1
                if extracted_count % 100 == 0:
                    print(f"Extracted {extracted_count} images...")

    print(f"--- Dataset Preparation Complete ---")
    print(f"Total images extracted: {extracted_count}")
    print(f"Location: {DATASET_ROOT}")
    print("This dataset is now ready for TensorFlow / PyTorch training scripts.")

if __name__ == "__main__":
    setup_directories()
    extract_and_organize()
