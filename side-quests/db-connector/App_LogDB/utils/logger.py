import logging
import os
import sys

def setup_logger():
    logger = logging.getLogger("AppLog")
    logger.setLevel(logging.INFO)

    if not logger.handlers:
        # Określenie ścieżki do pliku logów
        if getattr(sys, 'frozen', False):
            # Jeśli uruchomiony w środowisku zbudowanym przez PyInstaller
            log_path = os.path.join(sys._MEIPASS, 'app.log')
        else:
            # Jeśli uruchomiony w środowisku deweloperskim
            log_path = os.path.join(os.path.dirname(__file__), 'utils/app.log')

        # Tworzenie katalogu, jeśli nie istnieje
        os.makedirs(os.path.dirname(log_path), exist_ok=True)

        file_handler = logging.FileHandler(log_path)
        formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
        file_handler.setFormatter(formatter)

        logger.addHandler(file_handler)

    return logger

logger = setup_logger()
