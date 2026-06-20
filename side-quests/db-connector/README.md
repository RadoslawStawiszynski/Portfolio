# DB Connector — Multi-Database GUI Tool

A Python desktop application for testing and managing connections to multiple database engines. Built with a clean 3-layer architecture, encrypted credential storage, and a Tkinter GUI.

## What it does

- Connect to **PostgreSQL**, **MSSQL**, and **IBM DB2** from a single GUI
- **Ping / Connect** button validates connectivity and displays success or detailed error messages
- Credentials are encrypted at rest using **Fernet symmetric encryption**
- Structured logging captures all connection events and errors
- Input validation prevents malformed connection parameters before any network call is made

## Architecture

```
App_LogDB/
├── app.py               ← entry point
├── gui/                 ← Presentation layer (Tkinter)
│   ├── main_window.py   ← main form, radio buttons, ping button
│   ├── entry_field.py   ← reusable input component
│   └── button.py        ← styled button component
├── logic/
│   └── connection.py    ← Business logic: DB connector (psycopg2 / pyodbc / ibm_db)
└── utils/
    ├── encryption.py    ← Fernet key generation, encrypt/decrypt
    ├── validation.py    ← input validation
    └── logger.py        ← structured file + console logging
```

## Stack

| Component | Technology |
|-----------|-----------|
| Language | Python 3.x |
| GUI | Tkinter |
| PostgreSQL | psycopg2 |
| MSSQL | pyodbc |
| IBM DB2 | ibm_db / ibm_db_dbi |
| Encryption | cryptography (Fernet) |
| Packaging | PyInstaller (executable) |

## How to run

```bash
# Install dependencies
pip install psycopg2-binary pyodbc ibm_db cryptography

# Run
python app.py
```

> **Note:** IBM DB2 requires `clidriver` DLLs. See `logic/connection.py` for path configuration.

## What I learned

- How to structure a desktop Python app with clear separation of concerns (GUI / Logic / Data)
- Fernet symmetric encryption for securing credentials stored locally
- Connecting to three different database engines with their respective Python drivers
- Building reusable Tkinter components and handling edge cases in GUI state management
- PyInstaller packaging for distributing a Python app without requiring a Python runtime

## Tags

`Python` · `Tkinter` · `PostgreSQL` · `MSSQL` · `IBM DB2` · `Desktop App` · `Encryption` · `Database Tools`
