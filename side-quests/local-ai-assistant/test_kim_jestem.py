import time
import platform
import os
import psutil
import socket
import importlib.metadata
import sys

print("=== Testy identyfikacyjne ===")

# 1. Sprawdzenie systemu operacyjnego
print("1. System operacyjny:")
print("   System:", platform.system())
print("   Wersja:", platform.version())
print("   Architektura:", platform.architecture())
print("   Nazwa komputera:", platform.node())
print("   Wersja Pythona:", platform.python_version())
print("   Katalog roboczy:", os.getcwd())

# 2. Sprawdzenie informacji o pamięci
print("\n2. Informacje o pamięci:")
try:
    memory = psutil.virtual_memory()
    print("   Całkowita pamięć RAM:", memory.total)
    print("   Dostępna pamięć RAM:", memory.available)
    print("   Procent pamięci używanej:", memory.percent)
except Exception as e:
    print("   Błąd przy sprawdzaniu pamięci (psutil):", e)

# 3. Sprawdzenie informacji o procesorze
print("\n3. Informacje o procesorze:")
try:
    cpu_count = psutil.cpu_count()
    print("   Liczba rdzeni procesora:", cpu_count)
except Exception as e:
    print("   Błąd przy sprawdzaniu CPU (psutil):", e)

# 4. Sprawdzenie dostępu do internetu
print("\n4. Dostęp do internetu:")
try:
    # Próba rozwiązania DNS i połączenia
    host = socket.gethostbyname("www.google.com")
    s = socket.create_connection((host, 80), 2)
    s.close()
    print("   Połączenie z internetem: Dostępne")
except OSError:
    print("   Połączenie z internetem: Brak dostępu")

# 5. Sprawdzenie dostępności katalogów systemowych
print("\n5. Dostępność katalogów systemowych:")
system_dirs = ["/etc", "/usr", "/var"]
for directory in system_dirs:
    try:
        if os.path.exists(directory):
            print(f"   Dostęp do katalogu {directory}: Tak")
        else:
            print(f"   Dostęp do katalogu {directory}: Nie")
    except Exception as e:
        print(f"   Błąd przy sprawdzaniu katalogu {directory}: {e}")

# 6. Sprawdzenie dostępności plików konfiguracyjnych
print("\n6. Dostępność plików konfiguracyjnych:")
config_files = ["config.json", "model.yaml", "settings.ini"]
for file in config_files:
    try:
        if os.path.exists(file):
            print(f"   Dostęp do pliku {file}: Tak")
        else:
            print(f"   Dostęp do pliku {file}: Nie")
    except Exception as e:
        print(f"   Błąd przy sprawdzaniu pliku {file}: {e}")

# 7. Sprawdzenie danych o użytkowniku
print("\n7. Informacje o użytkowniku:")
print("   Nazwa użytkownika:", os.environ.get('USER', 'Nieznany'))
print("   Katalog domowy:", os.path.expanduser("~"))

# 8. Sprawdzenie zainstalowanych bibliotek
print("\n8. Zainstalowane biblioteki:")
try:
    installed_packages = [dist.metadata['Name']
                          for dist in importlib.metadata.distributions()]
    print("   Liczba zainstalowanych bibliotek:", len(installed_packages))
    print("   Kluczowe pakiety:", [p for p in installed_packages if p in [
          'torch', 'tensorflow', 'pandas']][:5])
except Exception as e:
    print("   Błąd podczas pobierania listy bibliotek:", e)

# 9. Sprawdzenie zainstalowanych bibliotek Pythona
print("\n9. Sprawdzenie specyficznych bibliotek:")
libraries = ['torch', 'tensorflow', 'scikit-learn', 'numpy', 'pandas',
             'matplotlib', 'seaborn', 'requests', 'beautifulsoup4', 'scipy', 'nltk']
for lib in libraries:
    try:
        __import__(lib)
        print(f"   {lib}: Zainstalowana")
    except ImportError:
        print(f"   {lib}: Nie zainstalowana")

# 10. Sprawdzenie środowiska
print("\n10. Informacje o środowisku:")
print("   PATH:", os.environ.get('PATH', 'Nie ustawione'))
print("   PYTHONPATH:", os.environ.get('PYTHONPATH', 'Nie ustawione'))

# 11. Sprawdzenie katalogów domowych
print("\n11. Katalogi domowe:")
home_dir = os.path.expanduser("~")
print("   Katalog domowy:", home_dir)
try:
    home_contents = os.listdir(home_dir)
    print("   Zawartość katalogu domowego:", home_contents[:10])
except Exception as e:
    print("   Błąd podczas odczytu katalogu domowego:", e)

# 12. Sprawdzenie zainstalowanych pakietów pip
print("\n12. Pakiety pip:")
try:
    installed_packages = sorted([dist.metadata['Name']
                                for dist in importlib.metadata.distributions()])
    print("   Zainstalowane pakiety pip:", installed_packages[:10])
except Exception as e:
    print("   Błąd podczas pobierania listy pakietów pip:", e)

# 13. Sprawdzenie systemu plików
print("\n13. System plików:")
print("   Typ systemu plików:", os.name)
print("   Separator ścieżek:", os.sep)
print("   Separator ścieżek (alt):", os.altsep)

# 14. Sprawdzenie informacji o procesie
print("\n14. Informacje o procesie:")
print("   ID procesu:", os.getpid())
print("   ID procesu rodzica:", os.getppid())

# 15. Sprawdzenie czasu systemowego
print("\n15. Czas systemowy:")
print("   Czas systemowy:", time.time())
print("   Czas lokalny:", time.ctime())

print("\n=== Koniec testów ===")
