#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Spire PDF Parser: Extracts Class or Extra Advance data and cover artwork from PDF.
"""
import sys
import os
import re
import json

try:
    import fitz  # PyMuPDF
except ImportError:
    print("PyMuPDF not found. Please install pymupdf (pip install pymupdf)")
    sys.exit(1)

def slugify(text):
    text = text.lower().strip()
    translit = {
        'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'e',
        'ж': 'zh', 'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm',
        'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u',
        'ф': 'f', 'х': 'kh', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'shch',
        'ъ': '', 'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya',
        ' ': '-', '_': '-'
    }
    res = []
    for char in text:
        if char in translit:
            res.append(translit[char])
        elif char.isalnum() or char == '-':
            res.append(char)
    clean = ''.join(res)
    return re.sub(r'-+', '-', clean).strip('-')

def extract_cover_art(doc, output_img_path):
    """Render page 1 to an image or extract the largest image on page 1."""
    os.makedirs(os.path.dirname(output_img_path), exist_ok=True)
    if len(doc) > 0:
        page = doc[0]
        # Render high-quality pixmap (dpi=150)
        pix = page.get_pixmap(dpi=150)
        pix.save(output_img_path)
        return True
    return False

def parse_spire_pdf(pdf_path, project_root):
    doc = fitz.open(pdf_path)
    total_pages = len(doc)
    all_text = ""
    for page in doc:
        all_text += page.get_text() + "\n"

    filename = os.path.basename(pdf_path)
    base_name = os.path.splitext(filename)[0]

    # Detect whether this is an Extra Advance or a Core Class
    is_extra = "требование:" in all_text.lower() and "характеристики сопротивления" not in all_text.lower()

    if is_extra:
        return parse_extra_advance(doc, all_text, base_name, project_root)
    else:
        return parse_core_class(doc, all_text, base_name, project_root)

def parse_core_class(doc, text, default_name, project_root):
    # Determine Class Name
    name_match = re.search(r'([А-ЯЁ\s]+)\s*\(([^)]+)\)', text[:1500])
    if name_match:
        name_ru = name_match.group(1).strip()
        name_en = name_match.group(2).strip()
    else:
        name_ru = default_name
        name_en = default_name

    class_id = slugify(name_en if name_en != default_name else name_ru)

    # Save cover art
    img_rel_path = f"assets/images/classes/{class_id}.png"
    img_abs_path = os.path.join(project_root, "public", "assets", "images", "classes", f"{class_id}.png")
    extract_cover_art(doc, img_abs_path)

    # Extract Quote
    quote_match = re.search(r'[«"]([^»"\n]{10,200})[»"]', text[:2000])
    quote = quote_match.group(1).strip() if quote_match else ""

    # Extract Intro Description
    intro = ""
    desc_match = re.search(r'«[^»]+»\s*([\s\S]*?)(?=Основные черты|Азурит:|Ключевая механика:|$)', text[:3000])
    if desc_match:
        intro = " ".join([l.strip() for l in desc_match.group(1).splitlines() if l.strip()])

    # Resistances
    resistances = []
    res_match = re.search(r'Характеристики сопротивления[^\n:]*:\s*([^\n]+)', text, re.IGNORECASE)
    if res_match:
        resistances = [r.strip() for r in res_match.group(1).split(',') if r.strip()]

    # Refresh
    refresh = ""
    ref_match = re.search(r'Отдушина[^\n:]*:\s*([^\n]+(?:\n[^\n]+)?)', text, re.IGNORECASE)
    if ref_match:
        refresh = " ".join([l.strip() for l in ref_match.group(1).splitlines() if l.strip()])

    # Skills
    skills = []
    skills_match = re.search(r'Навыки[^\n:]*:\s*([^\n]+)', text, re.IGNORECASE)
    if skills_match:
        skills = [s.strip() for s in skills_match.group(1).split(',') if s.strip()]

    # Domains
    domains = []
    dom_match = re.search(r'Сферы[^\n:]*:\s*([^\n]+)', text, re.IGNORECASE)
    if dom_match:
        domains = [d.strip() for d in dom_match.group(1).split(',') if d.strip()]

    # Equipment
    starting_equipment = []
    eq_match = re.search(r'Снаряжение[^\n:]*:\s*([^\n]+)', text, re.IGNORECASE)
    if eq_match:
        starting_equipment = [e.strip() for e in eq_match.group(1).split(',') if e.strip()]

    # Parse abilities
    abilities = parse_abilities(text)

    class_data = {
        "id": class_id,
        "nameRu": name_ru,
        "nameEn": name_en,
        "quote": quote,
        "description": intro,
        "resistances": resistances,
        "refresh": refresh,
        "skills": skills,
        "domains": domains,
        "startingEquipment": starting_equipment,
        "image": img_rel_path,
        "abilities": abilities
    }
    return ("class", class_data)

def parse_extra_advance(doc, text, default_name, project_root):
    title = default_name.upper()
    title_match = re.search(r'^([А-ЯЁ\s]{3,30})\n', text.strip())
    if title_match:
        title = title_match.group(1).strip()

    extra_id = slugify(title)
    img_rel_path = f"assets/images/extra/{extra_id}.png"
    img_abs_path = os.path.join(project_root, "public", "assets", "images", "extra", f"{extra_id}.png")
    extract_cover_art(doc, img_abs_path)

    # Requirement
    req = ""
    req_match = re.search(r'Требовани[ея][^\n:]*:\s*([^\n]+(?:\n[^\n]+)?)', text, re.IGNORECASE)
    if req_match:
        req = " ".join([l.strip() for l in req_match.group(1).splitlines() if l.strip()])

    # Refresh
    refresh = ""
    ref_match = re.search(r'Отдушина[^\n:]*:\s*([^\n]+(?:\n[^\n]+)?)', text, re.IGNORECASE)
    if ref_match:
        refresh = " ".join([l.strip() for l in ref_match.group(1).splitlines() if l.strip()])

    abilities = parse_abilities(text)

    extra_data = {
        "id": extra_id,
        "nameRu": title.title(),
        "requirement": req,
        "refresh": refresh,
        "image": img_rel_path,
        "abilities": abilities
    }
    return ("extra", extra_data)

def parse_abilities(text):
    abilities = []
    # Find headers for advances
    sections = re.split(r'(ПРОДВИЖЕНИЯ\s+(?:НИЗКОГО|СРЕДНЕГО|ВЫСОКОГО)\s+УРОВНЯ|КЛЮЧЕВЫЕ\s+СПОСОБНОСТИ)', text, flags=re.IGNORECASE)
    
    current_tier = "core"
    for sec in sections:
        sec_upper = sec.strip().upper()
        if "НИЗКОГО" in sec_upper:
            current_tier = "low"
            continue
        elif "СРЕДНЕГО" in sec_upper:
            current_tier = "medium"
            continue
        elif "ВЫСОКОГО" in sec_upper:
            current_tier = "high"
            continue
        elif "КЛЮЧЕВЫЕ" in sec_upper:
            current_tier = "core"
            continue

        # Split abilities by uppercase title pattern
        raw_items = re.split(r'\n(?=[А-ЯЁA-Z\s]{3,35}(?:\s*\([^)]*\))?\.\s*)', sec)
        for item in raw_items:
            item = item.strip()
            if not item:
                continue
            # Match title: NAME (ENGLISH NAME). [Tag] Description
            ab_match = re.match(r'^([А-ЯЁA-Z\s0-9\'-]+(?:\s*\([^)]*\))?)\.\s*(\[[^\]]+\])?\s*([\s\S]*)', item)
            if ab_match:
                ab_name = ab_match.group(1).strip()
                tag = ab_match.group(2) or ""
                desc = " ".join([l.strip() for l in ab_match.group(3).splitlines() if l.strip()])
                if len(desc) > 5 and len(ab_name) < 40:
                    abilities.append({
                        "id": slugify(ab_name),
                        "name": ab_name.title(),
                        "tier": current_tier,
                        "tag": tag.strip("[] "),
                        "description": desc
                    })
    return abilities

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python import_pdf.py <path_to_pdf>")
        sys.exit(1)

    pdf_file = sys.argv[1]
    root = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
    item_type, data = parse_spire_pdf(pdf_file, root)

    target_json = os.path.join(root, "src", "data", "classes.json" if item_type == "class" else "extra_advances.json")
    os.makedirs(os.path.dirname(target_json), exist_ok=True)

    existing = []
    if os.path.exists(target_json):
        try:
            with open(target_json, "r", encoding="utf-8") as f:
                existing = json.load(f)
        except Exception:
            existing = []

    # Update or insert
    updated = False
    for i, it in enumerate(existing):
        if it.get("id") == data["id"]:
            existing[i] = data
            updated = True
            break
    if not updated:
        existing.append(data)

    with open(target_json, "w", encoding="utf-8") as f:
        json.dump(existing, f, ensure_ascii=False, indent=2)

    print(f"Successfully processed {item_type}: {data.get('nameRu')} -> {target_json}")
