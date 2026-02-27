from deepface import DeepFace

result = DeepFace.analyze(
    img_path="test.jpg",
    actions=['age', 'gender'],
    enforce_detection=False
)

print(result)