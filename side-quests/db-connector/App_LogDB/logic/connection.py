import os
import sys
from pathlib import Path
import psycopg2
import pyodbc

from utils.logger import logger

# Określenie ścieżki do katalogu z plikami DLL dla ibm_db 
# Poniższy kod musi być dodany przed importem bazy według README ibm_db
if getattr(sys, 'frozen', False):
    # Jeśli uruchomiony w środowisku zbudowanym przez PyInstaller
    base_path = sys._MEIPASS
else:
    # Jeśli uruchomiony w środowisku deweloperskim
    base_path = Path(__file__).parent.parent / 'venv' / 'Lib' / 'site-packages' / 'clidriver' / 'bin'
    # base_path = 'C:\\Users\\rados\\Desktop\\CODE\\3_GIT_Reposytoria\\App_LogDB\\venv\\Lib\\site-packages\\clidriver\\bin'
    # base_path = 'C:\\Users\\rados\\Lib\\site-packages\\clidriver\\bin'

# Dodanie katalogu do ścieżki DLL
os.add_dll_directory(str(base_path))

import ibm_db
import ibm_db_dbi


class DatabaseConnector:
    def __init__(self, connection_params):
        self.connection_params = connection_params
        self.db_type = connection_params["db_type"].lower()

    def connect(self):
        try:
            if self.db_type == "postgresql":
                return self._connect_postgresql()
            elif self.db_type == "mssql":
                return self._connect_mssql()
            elif self.db_type == "ibm db2":
                return self._connect_db2()
            else:
                raise ValueError(f"Nieobsługiwany typ bazy danych: {self.db_type}")
        except Exception as e:
            logger.error(f"Błąd połączenia z bazą danych: {e}")
            raise

    def _connect_postgresql(self):
        try:
            connection = psycopg2.connect(
                host=self.connection_params["ip_address"],
                port=self.connection_params["port"],
                dbname=self.connection_params["database_name"],
                user=self.connection_params["username"],
                password=self.connection_params["password"]
            )
            logger.info(
                f"Połączono z bazą danych PostgreSQL na {self.connection_params['ip_address']}:{self.connection_params['port']}")
            return connection
        except Exception as e:
            logger.error(f"Błąd połączenia z bazą danych PostgreSQL: {e}")
            raise

    def _connect_mssql(self):
        try:
            connection = pyodbc.connect(
                server=self.connection_params["ip_address"],
                port=self.connection_params["port"],
                user=self.connection_params["username"],
                password=self.connection_params["password"],
                database=self.connection_params["database_name"]
            )
            logger.info(
                f"Połączono z bazą danych MSSQL na {self.connection_params['ip_address']}:{self.connection_params['port']}")
            return connection
        except Exception as e:
            logger.error(f"Błąd połączenia z bazą danych MSSQL: {e}")
            raise

    def _connect_db2(self):
        try:
            conn_str = (
                f"DATABASE={self.connection_params['database_name']};"
                f"HOSTNAME={self.connection_params['ip_address']};"
                f"PORT={self.connection_params['port']};"
                f"PROTOCOL=TCPIP;"
                f"UID={self.connection_params['username']};"
                f"PWD={self.connection_params['password']};"
            )
            ibm_db_conn = ibm_db.connect(conn_str, "", "")
            connection = ibm_db_dbi.Connection(ibm_db_conn)
            logger.info(
                f"Połączono z bazą danych IBM DB2 na {self.connection_params['ip_address']}:{self.connection_params['port']}")
            return connection
        except Exception as e:
            logger.error(f"Błąd połączenia z bazą danych IBM DB2: {e}")
            raise
