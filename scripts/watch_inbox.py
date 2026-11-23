#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Watch Inbox Folder for Spire Handbook:
Monitors 'inbox/classes/' and 'inbox/extra_advances/' for new PDF or DOCX files.
Automatically parses them, extracts cover artwork, and updates the website database in real-time.
"""

import os
import sys
import time
import subprocess

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
INBOX_CLASSES = os.path.join(ROOT, "inbox", "classes")
INBOX_EXTRA = os.path.join(ROOT, "inbox", "extra_advances")
SCRIPT_IMPORT = os.path.join(ROOT, "scripts", "import_pdf.py")

os.makedirs(INBOX_CLASSES, exist_ok=True)
os.makedirs(INBOX_EXTRA, exist_ok=True)

processed_files = set()

def scan_and_process():
    # 1. Scan classes
    for fname in os.listdir(INBOX_CLASSES):
        if fname.lower().endswith(".pdf") or fname.lower().endswith(".docx"):
            fpath = os.path.join(INBOX_CLASSES, fname)
            mtime = os.path.getmtime(fpath)
            key = (fpath, mtime)
            if key not in processed_files:
                print(f"\n[+] New class detected: {fname}!")
                print(f"[*] Processing through import_pdf.py...")
                res = subprocess.run([sys.executable, SCRIPT_IMPORT, fpath], capture_output=True, text=True)
                if res.returncode == 0:
                    print(f"[✓] Success: {fname} added to website!")
                    print(res.stdout.strip())
                else:
                    print(f"[!] Error processing {fname}: {res.stderr}")
                processed_files.add(key)

    # 2. Scan extra advances
    for fname in os.listdir(INBOX_EXTRA):
        if fname.lower().endswith(".pdf") or fname.lower().endswith(".docx"):
            fpath = os.path.join(INBOX_EXTRA, fname)
            mtime = os.path.getmtime(fpath)
            key = (fpath, mtime)
            if key not in processed_files:
                print(f"\n[+] New Extra Advance detected: {fname}!")
                print(f"[*] Processing through import_pdf.py...")
                res = subprocess.run([sys.executable, SCRIPT_IMPORT, fpath], capture_output=True, text=True)
                if res.returncode == 0:
                    print(f"[✓] Success: {fname} added to website!")
                    print(res.stdout.strip())
                else:
                    print(f"[!] Error processing {fname}: {res.stderr}")
                processed_files.add(key)

def main():
    print("=" * 60)
    print(" SPIRE HANDBOOK - INBOX WATCHER ")
    print("=" * 60)
    print(f"Watching for new classes in: {INBOX_CLASSES}")
    print(f"Watching for extra advances in: {INBOX_EXTRA}")
    print("Drop any PDF or DOCX file here to auto-add it to the website!")
    print("Press Ctrl+C to stop.")
    print("-" * 60)

    try:
        while True:
            scan_and_process()
            time.sleep(2)
    except KeyboardInterrupt:
        print("\nWatcher stopped.")

if __name__ == "__main__":
    main()
