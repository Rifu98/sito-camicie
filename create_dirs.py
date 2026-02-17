import os

base = r"C:\Users\Feder\Desktop\Sito camicie\backend"
dirs = [
    'src/main/java/com/shirtconfig/entity',
    'src/main/java/com/shirtconfig/repository',
    'src/main/java/com/shirtconfig/service',
    'src/main/java/com/shirtconfig/controller',
    'src/main/java/com/shirtconfig/config',
    'src/main/resources',
    'src/test/java/com/shirtconfig'
]

for d in dirs:
    path = os.path.join(base, d)
    os.makedirs(path, exist_ok=True)
    print(f"Created: {path}")

print("\nAll directories created successfully!")
