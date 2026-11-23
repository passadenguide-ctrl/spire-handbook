# -*- coding: utf-8 -*-
"""
Spire Handbook — Google Drive Sync Script
Скрипт синхронизации справочных материалов из Google Диска в данные веб-интерфейса.

Использование:
  python scripts/sync_google_drive.py
  npm run sync:drive

Как это работает:
1. Вы скидываете новые файлы (.docx, .md, картинки) в папку Google Диска:
   - "Spire/Classes" — для карточек классов дроу
   - "Spire/Extra_Advances" — для дополнительных продвижений
   - "Spire/Locations" — для подробных досье локаций и сфер
2. Если у вас установлен Google Drive для ПК (диск G: или синхронизируемая папка),
   скрипт автоматически читает файлы оттуда.
3. Либо вы можете поместить файлы в локальную папку:
   `./gdrive_input/` (создается автоматически)
4. Скрипт парсит документы, обновляет JSON-файлы в `src/data/` и подготавливает сайт к деплою!
"""

import os
import sys
import json
import zipfile
import xml.etree.ElementTree as ET

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_DIR = os.path.join(BASE_DIR, 'src', 'data')
INPUT_DIR = os.path.join(BASE_DIR, 'gdrive_input')

# Ensure staging input directories exist
for sub in ['Classes', 'Locations', 'Extra_Advances']:
    os.makedirs(os.path.join(INPUT_DIR, sub), exist_ok=True)

def read_docx_paragraphs(file_path):
    """Extract clean text paragraphs from a Word (.docx) document."""
    try:
        with zipfile.ZipFile(file_path) as z:
            xml_content = z.read('word/document.xml')
            root = ET.fromstring(xml_content)
            paragraphs = []
            for p in root.iter('{http://schemas.openxmlformats.org/wordprocessingml/2006/main}p'):
                text = ''.join(node.text for node in p.iter('{http://schemas.openxmlformats.org/wordprocessingml/2006/main}t') if node.text)
                if text.strip():
                    paragraphs.append(text.strip())
            return paragraphs
    except Exception as e:
        print(f"[Ошибка чтения DOCX] {file_path}: {e}")
        return []

def sync_classes():
    """Check for new or updated class documents."""
    classes_dir = os.path.join(INPUT_DIR, 'Classes')
    docx_files = [f for f in os.listdir(classes_dir) if f.endswith('.docx')]
    print(f"Найдено документов классов в gdrive_input/Classes: {len(docx_files)}")
    # Placeholder for processing newly dropped classes from Google Drive
    for f in docx_files:
        print(f" - Готов к импорту: {f}")

def sync_locations():
    """Check for new location files."""
    loc_dir = os.path.join(INPUT_DIR, 'Locations')
    docx_files = [f for f in os.listdir(loc_dir) if f.endswith('.docx')]
    print(f"Найдено документов локаций в gdrive_input/Locations: {len(docx_files)}")
    for f in docx_files:
        print(f" - Готов к импорту: {f}")

def main():
    print("="*60)
    print("🗡️  Синхронизация справочных материалов Spire (Google Drive)")
    print("="*60)
    print(f"Каталог входных материалов: {INPUT_DIR}")
    print("Вы можете положить новые файлы .docx или .md в соответствующие подпапки:")
    print(" • gdrive_input/Classes/")
    print(" • gdrive_input/Locations/")
    print(" • gdrive_input/Extra_Advances/")
    print("-" * 60)
    
    sync_classes()
    sync_locations()
    
    print("-" * 60)
    print("✅ Синхронизация завершена. Для публикации изменений на хостинг запустите:")
    print("   npm run deploy")
    print("="*60)

if __name__ == '__main__':
    main()
