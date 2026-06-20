# Specyfikacja dla PyInstaller
# Wygenerowane przez: `pyi-makespec --onefile --windowed app.py`

# -*- mode: python ; coding: utf-8 -*-
# Uruchomienie: pyinstaller App_LogDB.spec

block_cipher = None

# Analiza plików projektu
a = Analysis(
    ['app.py'],  # Główny plik wejściowy
    pathex=[],  # Dodatkowe ścieżki, w których PyInstaller będzie szukać plików
    binaries=[('venv/Lib/site-packages/clidriver/bin/', 'clidriver/bin')],  # Dodatkowe pliki binarne do dołączenia
    datas=[
        ('utils/secret.key', 'utils'),  # Dodanie pliku klucza szyfrowania
        ('utils/app.log', '.'),  # Dodanie pliku logów do głównego katalogu
        ('venv/Lib/site-packages/clidriver/bin/*', 'clidriver/bin'),  # Dodanie plików DLL dla ibm_db
        ('venv/Lib/site-packages/psycopg2', 'psycopg2'),  # Dodanie plików dla psycopg2
    ],
    hiddenimports=['mx.DateTime', 'psycopg2', 'json', 'pyodbc', 'ibm_db', 'ibm_db_dbi', 'ibm_db_tests', 'ibm_db-3.2.3.dist-info', 'ibm_db_sa.ibm_db', ''],  # Ukryte importy, które PyInstaller powinien uwzględnić
    hookspath=[],  # Ścieżki do dodatkowych skryptów hook
    hooksconfig={},
    runtime_hooks=[],  # Skrypty, które mają być uruchamiane podczas startu aplikacji
    excludes=[],  # Moduły, które mają być wykluczone z pakietu
    win_no_prefer_redirects=False,  # Użycie preferowanych redirektów w systemie Windows
    win_private_assemblies=False,  # Użycie prywatnych assembly w systemie Windows
    win_obfuscate=True,
    cipher=block_cipher,  # Szyfrowanie plików Python
    optimize=0,
    **{
        'onefile': True,
        'windowed': True,
    }
)

# Kompresja skryptów do jednego pliku .pyz
pyz = PYZ(a.pure, a.zipped_data, cipher=block_cipher)

# Tworzenie pliku wykonywalnego .exe w trybie onefile
exe = EXE(
    pyz,
    a.scripts,
    a.binaries,
    a.zipfiles,
    a.datas,
    [],
    exclude_binaries=False,  # Nie wyklucza plików binarnych z głównego pliku .exe
    name='App_LogDB',  # Nazwa pliku wykonywalnego
    debug=False,  # Wyłączenie trybu debugowania
    bootloader_ignore_signals=False,  # Ignorowanie sygnałów bootloadera
    strip=False,  # Nie usuwa symboli debugowania
    upx=True,  # Kompresja przy użyciu UPX
    upx_exclude=[],  # Pliki wykluczone z kompresji UPX
    runtime_tmpdir=None,  # Tymczasowy katalog podczas uruchamiania
    console=False,  # Nie otwieranie konsoli (tryb windowed)
    disable_windowed_traceback=False,
    argv_emulation=False,
    target_arch=None,
    icon=None,  # Ikona pliku wykonywalnego
    codesign_identity=None,
    entitlements_file=None,
    onefile=True  # Włączenie trybu onefile
)

# Zbieranie wszystkich plików do jednego pliku .exe
coll = COLLECT(
    exe,
    a.binaries,
    a.zipfiles,
    a.datas,
    strip=False,  # Nie usuwa symboli debugowania
    upx=True,  # Kompresja przy użyciu UPX
    upx_exclude=[],  # Pliki wykluczone z kompresji UPX
    name='App_LogDB',  # Nazwa końcowego katalogu
    onefile=True  # Włączenie trybu onefile
)
