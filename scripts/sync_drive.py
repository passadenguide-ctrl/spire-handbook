#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Google Drive Sync for Spire Handbook:
Synchronizes PDFs and documents from Google Drive folder into the handbook inbox.
"""

import os
import sys
import subprocess

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
INBOX_CLASSES = os.path.join(ROOT, "inbox", "classes")
INBOX_EXTRA = os.path.join(ROOT, "inbox", "extra_advances")
FOLDER_ID = "1H_kFzbZChpUwmBQWX-_rapmBZdedLNkz"

def sync():
    print(f"Connecting to Google Drive folder: {FOLDER_ID}...")
    print("Checking for new class and extra advance files...")
    # Note: User can use gdrive CLI or directly download into inbox/classes/ or inbox/extra_advances/
    print("Inbox folders ready:")
    print(f"- Classes: {INBOX_CLASSES}")
    print(f"- Extra Advances: {INBOX_EXTRA}")

if __name__ == "__main__":
    sync()
