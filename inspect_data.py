import zipfile
import os

zip_paths = [
    r"C:\Users\IDEAPAD\Downloads\archive.zip",
    r"C:\Users\IDEAPAD\Downloads\archive (1).zip"
]

def inspect_zip(path):
    print(f"--- Inspecting {path} ---")
    if not os.path.exists(path):
        print("File not found.")
        return

    try:
        with zipfile.ZipFile(path, 'r') as zip_ref:
            # List first 20 files to guess structure
            file_list = zip_ref.namelist()
            print(f"Total files: {len(file_list)}")
            print("First 20 files:")
            for f in file_list[:20]:
                print(f)
            
            # Check for common Indian crops folders
            indian_crops = ['rice', 'wheat', 'cotton', 'sugarcane', 'tomato', 'potato', 'corn', 'maize', 'grape', 'mango']
            print("\nSearching for Indian crops in paths:")
            found_crops = set()
            for f in file_list:
                lower_f = f.lower()
                for crop in indian_crops:
                    if crop in lower_f:
                        found_crops.add(crop)
            print(f"Found crops: {list(found_crops)}")
            
    except zipfile.BadZipFile:
        print("Invalid zip file.")
    except Exception as e:
        print(f"Error: {e}")

for p in zip_paths:
    inspect_zip(p)
