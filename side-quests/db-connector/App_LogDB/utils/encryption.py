from cryptography.fernet import Fernet

from utils.encryption import generate_key
generate_key()

class Encryption:
    def __init__(self, key):
        self.cipher = Fernet(key)

    def encrypt(self, data):
        return self.cipher.encrypt(data.encode())

    def decrypt(self, data):
        return self.cipher.decrypt(data).decode()


# Generowanie i zapisywanie klucza
def generate_key():
    key = Fernet.generate_key()
    with open("utils/secret.key", "wb") as key_file:
        key_file.write(key)


# Odczytywanie klucza
def load_key():
    return open("utils/secret.key", "rb").read()
