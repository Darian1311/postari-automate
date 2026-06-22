"""
Rulează: python create_user.py
Generează hash bcrypt pentru adăugarea unui utilizator în USERS_JSON.
"""
import getpass
import bcrypt

username = input("Username: ").strip()
if not username:
    print("Username-ul nu poate fi gol.")
    exit(1)

password = getpass.getpass("Parolă: ")
confirm = getpass.getpass("Confirmă parola: ")

if password != confirm:
    print("Parolele nu coincid.")
    exit(1)

if len(password) < 8:
    print("Parola trebuie să aibă cel puțin 8 caractere.")
    exit(1)

hashed = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")

print(f'\nEntry pentru USERS_JSON:')
print(f'{{"username": "{username}", "password_hash": "{hashed}"}}')
print("\nAdaugă în .env la USERS_JSON (array JSON, virgulă între utilizatori).")
