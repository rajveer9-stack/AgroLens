import tensorflow as tf
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras.layers import Dense, GlobalAveragePooling2D, Dropout
from tensorflow.keras.models import Model
import zipfile
import os

# --- STEP 1: PREPARE DATA ---
# Update this path to your specific file location
zip_path = r"C:\Users\IDEAPAD\Downloads\archive.zip"
extract_path = "dataset_extracted"

print("Unzipping data... (this may take a moment)")
if not os.path.exists(extract_path):
    with zipfile.ZipFile(zip_path, 'r') as zip_ref:
        zip_ref.extractall(extract_path)

# Locate the training directory (assuming standard structure inside zip)
# If your zip structure is different, adjust 'base_dir'
base_dir = os.path.join(extract_path, os.listdir(extract_path)[0]) 
if 'train' in os.listdir(base_dir):
    train_dir = os.path.join(base_dir, 'train')
    val_dir = os.path.join(base_dir, 'valid') # or 'val'
else:
    # Fallback: if images are just in folders directly
    train_dir = base_dir 
    val_dir = base_dir # Using same for simplicity in this snippet, ideally split

print(f"Training data found at: {train_dir}")

# --- STEP 2: DATA PREPROCESSING (MobileNetV2 Standard) ---
IMG_SIZE = (224, 224)
BATCH_SIZE = 32

train_datagen = ImageDataGenerator(
    rescale=1./255,
    rotation_range=20,
    width_shift_range=0.2,
    height_shift_range=0.2,
    horizontal_flip=True,
    validation_split=0.2 # Creating a split if one doesn't exist
)

train_generator = train_datagen.flow_from_directory(
    train_dir,
    target_size=IMG_SIZE,
    batch_size=BATCH_SIZE,
    class_mode='categorical',
    subset='training'
)

validation_generator = train_datagen.flow_from_directory(
    train_dir,
    target_size=IMG_SIZE,
    batch_size=BATCH_SIZE,
    class_mode='categorical',
    subset='validation'
)

# Save class names for the app
class_names = list(train_generator.class_indices.keys())
print(f"Detected Classes: {class_names}")
with open("labels.txt", "w") as f:
    for cls in class_names:
        f.write(cls + "\n")

# --- STEP 3: BUILD LIGHTWEIGHT MODEL ---
# MobileNetV2 is designed for mobile speed
base_model = MobileNetV2(weights='imagenet', include_top=False, input_shape=(224, 224, 3))
base_model.trainable = False # Freeze base layers

x = base_model.output
x = GlobalAveragePooling2D()(x)
x = Dropout(0.2)(x)
predictions = Dense(len(class_names), activation='softmax')(x)

model = Model(inputs=base_model.input, outputs=predictions)

model.compile(optimizer='adam', loss='categorical_crossentropy', metrics=['accuracy'])

# --- STEP 4: TRAIN ---
print("Starting training...")
# Reduced epochs for demonstration. Increase to 10-20 for better results.
model.fit(
    train_generator,
    epochs=5, 
    validation_data=validation_generator
)

# --- STEP 5: CONVERT TO OFFLINE MODEL (.tflite) ---
print("Converting to offline TFLite model...")
converter = tf.lite.TFLiteConverter.from_keras_model(model)

# OPTIMIZATION: Quantization (makes model 4x smaller without losing much accuracy)
converter.optimizations = [tf.lite.Optimize.DEFAULT]

tflite_model = converter.convert()

# Save the file
with open('plant_disease_model.tflite', 'wb') as f:
    f.write(tflite_model)

print("SUCCESS! Files generated:")
print("1. plant_disease_model.tflite (Copy this to Android assets)")
print("2. labels.txt (Copy this to Android assets)")