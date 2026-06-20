from tkinter import messagebox
import re

def validate_entry_fields(entry_fields):
    for entry_field in entry_fields:
        if not entry_field.valid:
            messagebox.showerror("Błąd", "Proszę poprawnie wypełnić wszystkie pola!")
            return False
    return True

def validate_data(value, field_type):
    if field_type == "IP_ADDRESS":
        pattern = r"^(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)\.(\b25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?){3}$"
        if not re.match(pattern, value):
            messagebox.showerror("Błąd", "Niepoprawny format adresu IP.")
            return False
    elif field_type == "PORT":
        try:
            port = int(value)
            if port < 0 or port > 65535:
                messagebox.showerror("Błąd", "Niepoprawny numer portu. Musi być pomiędzy 0 a 65535.")
                return False
        except ValueError:
            messagebox.showerror("Błąd", "Niepoprawny numer portu. Musi być liczbą całkowitą.")
            return False
    elif field_type in ["DATABASE_NAME", "SCHEMA", "USERNAME"]:
        allowed_chars = r"^[a-zA-Z0-9_-]+$"
        if not re.match(allowed_chars, value):
            messagebox.showerror("Błąd", f"Niepoprawna nazwa {field_type.lower()}. Dozwolone znaki: a-z, A-Z, 0-9, _, -.")
            return False
    return True
