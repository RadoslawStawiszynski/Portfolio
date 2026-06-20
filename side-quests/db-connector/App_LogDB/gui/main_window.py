import tkinter as tk
from tkinter import messagebox
from gui.entry_field import EntryField
from gui.button import Button
from logic.connection import DatabaseConnector
from utils.logger import logger
from utils.validation import validate_entry_fields


class MainWindow:
    def __init__(self):
        self.window = tk.Tk() # Utworzenie głównego okna tkinter
        self.window.title("Aplikacja do łączenia z bazami danych")
        self.db_type_var = tk.StringVar(value="PostgreSQL")# Inicjalizacja zmiennej tkinter po utworzeniu okna
        self.setup_gui()

    def setup_gui(self):
        # Ramka do wyboru typu bazy danych
        db_type_frame = tk.LabelFrame(self.window, text="Rodzaj bazy danych:")
        db_type_frame.grid(row=0, column=0, columnspan=2, pady=10)

        # Opcje wyboru typu bazy danych
        db_type_options = ["PostgreSQL", "MSSQL", "IBM DB2"]
        for option in db_type_options:
            radio_button = tk.Radiobutton(db_type_frame, text=option, variable=self.db_type_var, value=option)
            radio_button.pack(side=tk.LEFT, padx=5)

        # Dodanie pól do wpisywania danych
        self.entry_fields = []
        self.add_entry_field("Adres IP serwera:", "IP_ADDRESS")
        self.add_entry_field("Port:", "PORT")
        self.add_entry_field("Nazwa bazy:", "DATABASE_NAME")
        self.add_entry_field("Schemat:", "SCHEMA")
        self.add_entry_field("Użytkownik:", "USERNAME")
        self.add_entry_field("Hasło:", None, show="*")

        # Przycisk "Ping / Połącz"
        self.ping_button = Button(self.window, text="Ping / Połącz", command=self.ping_database)
        self.ping_button.grid(row=7, column=0, columnspan=2, pady=10)

        # Pole do wyświetlania komunikatów
        self.message_label = tk.Label(self.window, text="", width=50, wraplength=500)
        self.message_label.grid(row=8, column=0, columnspan=2)

        # Logowanie uruchomienia aplikacji
        logger.info("Aplikacja uruchomiona.")

    def add_entry_field(self, label_text, field_type, **kwargs):
        row = len(self.entry_fields) + 1
        label = tk.Label(self.window, text=label_text)
        entry = EntryField(self.window, field_type=field_type, **kwargs)
        label.grid(row=row, column=0, sticky=tk.W, padx=(45, 1), pady=5)
        entry.grid(row=row, column=1, padx=(1, 5), pady=5, sticky=tk.W)
        self.entry_fields.append(entry)

    def ping_database(self):
        # Pobranie danych z pól tekstowych
        connection_params = {
            "db_type": self.db_type_var.get(),
            "ip_address": self.entry_fields[0].get(),
            "port": self.entry_fields[1].get(),
            "database_name": self.entry_fields[2].get(),
            "schema": self.entry_fields[3].get(),
            "username": self.entry_fields[4].get(),
            "password": self.entry_fields[5].get(),
        }

        # Logowanie rozpoczęcia testowania połączenia
        logger.info("Rozpoczęcie testowania połączenia z bazą danych.")

        # Walidacja pól tekstowych
        if not validate_entry_fields(self.entry_fields):
            return

        try:
            # Próba połączenia z bazą danych
            db_connector = DatabaseConnector(connection_params)
            connection = db_connector.connect()
            cursor = connection.cursor()
            cursor.execute("SELECT 1")
            cursor.close()
            connection.close()

            # Wyświetlenie komunikatu o powodzeniu połączenia
            self.message_label.config(text="Połączenie z bazą danych pomyślne!")
            logger.info("Połączenie z bazą danych pomyślne!")
        except Exception as e:
            # Wyświetlenie komunikatu o błędzie połączenia
            self.message_label.config(text=f"Błąd połączenia z bazą danych: {e}")
            logger.error(f"Błąd połączenia z bazą danych: {e}")
        finally:
            # Dodanie poziomej linii na końcu logu
            with open("utils/app.log", "a") as log_file:
                log_file.write("\n" + "-" * 50 + "\n")
