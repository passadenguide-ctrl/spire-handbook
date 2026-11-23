#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Precise extractor for Spire core classes matching the exact PDF layout.
"""

import os
import re
import json
import fitz

CLASSES_DIR = r"C:\Users\Сергей Леонидович\Desktop\Модуль\Spire\Классы"
OUT_FILE = r"C:\Users\Сергей Леонидович\.gemini\antigravity\scratch\spire-handbook\src\data\classes.json"

CLASS_MAP = {
    "Азурит.pdf": {
        "id": "azurite",
        "nameRu": "Азурит",
        "nameEn": "Azurite",
        "quote": "«У каждого есть своя цена. Даже у вас, мой господин.»",
        "whoIs": "«Торговец, которого слушается сам бог»",
        "image": "assets/images/classes/azurite.png"
    },
    "Бунтарь.pdf": {
        "id": "firebrand",
        "nameRu": "Бунтарь",
        "nameEn": "Firebrand",
        "quote": "«Они не справятся со всеми нами. Не со всеми. Сегодня ночью мы покажем им, кто здесь на самом деле хозяин».",
        "whoIs": "«Голос восстания, зажигающий искру в сердцах угнетённых»",
        "image": "assets/images/classes/firebrand.png"
    },
    "Вермиссийский Мудрец.pdf": {
        "id": "vermissian-sage",
        "nameRu": "Вермиссийский Мудрец",
        "nameEn": "Vermissian Sage",
        "quote": "«Полагаю, у меня как раз есть нужная вам книга – беда в том, что она в восьми станциях вниз и пяти поперёк, так что, возможно, вам стоит захватить провизию».",
        "whoIs": "«Учёный-архивариус, который находит нужные ответы в неправильных местах и использует законы реальности как рекомендации»",
        "image": "assets/images/classes/vermissiyskiy-mudrets.png"
    },
    "Жрец Падали.pdf": {
        "id": "carrion-priest",
        "nameRu": "Жрец Падали",
        "nameEn": "Carrion Priest",
        "quote": "«Сегодня ночью пирует наш Чарнел, братья! И мы пируем вместе с ним!»",
        "whoIs": "«Священник-охотник, чей бог жаждет плоти»",
        "image": "assets/images/classes/carrion-priest.png"
    },
    "Кумир.pdf": {
        "id": "idol",
        "nameRu": "Кумир",
        "nameEn": "Idol",
        "quote": "«Истина? Что есть истина, когда у тебя есть красота?»",
        "whoIs": "«Звезда, чьё искусство перекраивает реальность»",
        "image": "assets/images/classes/idol.png"
    },
    "Лайян.pdf": {
        "id": "lahjan",
        "nameRu": "Лайян",
        "nameEn": "Lahjan",
        "quote": "«Наша Госпожа защищает, милый. Держи её в своём сердце, и она облегчит твой уход».",
        "whoIs": "«Жрец лунного культа, в чьих руках милость богини становится оружием, а проповедь — прикрытием для тихой войны»",
        "image": "assets/images/classes/layyan.png"
    },
    "Личина.pdf": {
        "id": "masked",
        "nameRu": "Личина",
        "nameEn": "Masked",
        "quote": "«Ах, мой господин, приношу свои глубочайшие извинения — вот верные манифесты, а не те, что у вас. Я уже казнил мальчика-доставщика, предвосхищая ваше желание».",
        "whoIs": "«Слуга с тысячей лиц, для которого ложь — это доспехи, а маска — настоящее лицо»",
        "image": "assets/images/classes/lichina.png"
    },
    "Наделённый.pdf": {
        "id": "bound",
        "nameRu": "Наделённый",
        "nameEn": "Bound",
        "quote": "«Верёвка, удержи меня. Доспех, защити меня. Клинок, обескровь их».",
        "whoIs": "«Бэтмен Шпиля с одушевлёнными гаджетами»",
        "image": "assets/images/classes/bound.png"
    },
    "Повитуха.pdf": {
        "id": "midwife",
        "nameRu": "Повитуха",
        "nameEn": "Midwife",
        "quote": "«Разумеется, я буду сражаться за тебя; паутина связывает нас всех, брат».",
        "whoIs": "«Боевая жрица паутины, чья магия сплетает раны, судьбы и кошмары»",
        "image": "assets/images/classes/povitukha.png"
    },
    "Рыцарь.pdf": {
        "id": "knight",
        "nameRu": "Рыцарь",
        "nameEn": "Knight",
        "quote": "«Клянусь нашей Владычицей, этим похмельем можно повалить небесного кита. Мы победили?»",
        "whoIs": "«Бронированный бандит с остатками благородства и правом носить большое оружие»",
        "image": "assets/images/classes/knight.png"
    }
}

def extract_class(filename, meta):
    fpath = os.path.join(CLASSES_DIR, filename)
    doc = fitz.open(fpath)
    full_text = "\n".join([page.get_text() for page in doc])

    # 1. In a nutshell (В двух словах)
    nutshell = ""
    n_match = re.search(r'В двух словах:\s*([\s\S]*?)(?=Ключевая механика:|$)', full_text, re.IGNORECASE)
    if n_match:
        nutshell = " ".join([l.strip() for l in n_match.group(1).splitlines() if l.strip()])

    # 2. Core mechanics (Ключевая механика)
    key_mechanics = []
    km_match = re.search(r'Ключевая механика:\s*([\s\S]*?)(?=Что вы будете делать\?|Итог:|Основные черты|$)', full_text, re.IGNORECASE)
    if km_match:
        items = re.split(r'\n\s*·\s*', km_match.group(1))
        for it in items:
            it = " ".join([l.strip() for l in it.splitlines() if l.strip()])
            if it:
                key_mechanics.append(it)

    # 3. What will you do (Что вы будете делать?)
    what_do = []
    wd_match = re.search(r'Что вы будете делать\?\s*([\s\S]*?)(?=Итог:|Основные черты|$)', full_text, re.IGNORECASE)
    if wd_match:
        items = re.split(r'\n\s*·\s*', wd_match.group(1))
        for it in items:
            it = " ".join([l.strip() for l in it.splitlines() if l.strip()])
            if it:
                what_do.append(it)

    # 4. Summary (Итог)
    summary = ""
    sum_match = re.search(r'Итог:\s*([\s\S]*?)(?=Основные черты|ОСНОВНЫЕ ЧЕРТЫ|$)', full_text, re.IGNORECASE)
    if sum_match:
        summary = " ".join([l.strip() for l in sum_match.group(1).splitlines() if l.strip()])

    # 5. Core Traits: Resistances, Refresh, Skills, Domains
    resistances = []
    res_m = re.search(r'ХАРАКТЕРИСТИКИ СОПРОТИВЛЕНИЯ[^\n:]*:\s*([^\n]+)', full_text, re.IGNORECASE)
    if res_m:
        resistances = [r.strip() for r in res_m.group(1).split(',') if r.strip()]

    refresh = ""
    ref_m = re.search(r'ОТДУШИНА[^\n:]*:\s*([^\n]+(?:\n[^\n]+)?)', full_text, re.IGNORECASE)
    if ref_m:
        refresh = " ".join([l.strip() for l in ref_m.group(1).splitlines() if l.strip()])

    skills = []
    sk_m = re.search(r'НАВЫКИ[^\n:]*:\s*([^\n]+)', full_text, re.IGNORECASE)
    if sk_m:
        skills = [s.strip() for s in sk_m.group(1).split(',') if s.strip()]

    domains = []
    dom_m = re.search(r'СФЕРЫ[^\n:]*:\s*([^\n]+)', full_text, re.IGNORECASE)
    if dom_m:
        domains = [d.strip() for d in dom_m.group(1).split(',') if d.strip()]

    # 6. Bonds (Связи)
    bonds = []
    bonds_m = re.search(r'СВЯЗИ[^\n]*\n([\s\S]*?)(?=ЭКИПИРОВКА|ОСНОВНЫЕ СПОСОБНОСТИ|КЛЮЧЕВЫЕ СПОСОБНОСТИ|$)', full_text, re.IGNORECASE)
    if bonds_m:
        items = re.split(r'\n\s*·\s*', bonds_m.group(1))
        for it in items:
            it = " ".join([l.strip() for l in it.splitlines() if l.strip()])
            if len(it) > 5:
                bonds.append(it)

    # 7. Equipment
    equipment = []
    eq_m = re.search(r'ЭКИПИРОВКА[^\n]*\n([\s\S]*?)(?=ОСНОВНЫЕ СПОСОБНОСТИ|КЛЮЧЕВЫЕ СПОСОБНОСТИ|$)', full_text, re.IGNORECASE)
    if eq_m:
        items = re.split(r'\n\s*·\s*', eq_m.group(1))
        for it in items:
            it = " ".join([l.strip() for l in it.splitlines() if l.strip()])
            if len(it) > 3:
                equipment.append(it)

    # 8. Abilities
    abilities = []
    sections = re.split(r'(ПРОДВИЖЕНИЯ\s+(?:НИЗКОГО|СРЕДНЕГО|ВЫСОКОГО)\s+УРОВНЯ|ОСНОВНЫЕ\s+СПОСОБНОСТИ|КЛЮЧЕВЫЕ\s+СПОСОБНОСТИ)', full_text, flags=re.IGNORECASE)
    current_tier = "core"
    for sec in sections:
        sec_up = sec.strip().upper()
        if "НИЗКОГО" in sec_up:
            current_tier = "low"
            continue
        elif "СРЕДНЕГО" in sec_up:
            current_tier = "medium"
            continue
        elif "ВЫСОКОГО" in sec_up:
            current_tier = "high"
            continue
        elif "ОСНОВНЫЕ" in sec_up or "КЛЮЧЕВЫЕ" in sec_up:
            current_tier = "core"
            continue

        raw_items = re.split(r'\n(?=[А-ЯЁA-Z\s]{3,40}(?:\s*\([^)]*\))?\.\s*)', sec)
        for item in raw_items:
            item = item.strip()
            if not item:
                continue
            ab_match = re.match(r'^([А-ЯЁA-Z\s0-9\'-]+(?:\s*\([^)]*\))?)\.\s*(\[[^\]]+\])?\s*([\s\S]*)', item)
            if ab_match:
                ab_name = ab_match.group(1).strip()
                tag = ab_match.group(2) or ""
                desc = " ".join([l.strip() for l in ab_match.group(3).splitlines() if l.strip()])
                if len(desc) > 5 and len(ab_name) < 45:
                    abilities.append({
                        "id": re.sub(r'[^a-zA-Z0-9]+', '-', ab_name.lower()).strip('-'),
                        "name": ab_name.title(),
                        "tier": current_tier,
                        "tag": tag.strip("[] "),
                        "description": desc
                    })

    return {
        "id": meta["id"],
        "nameRu": meta["nameRu"],
        "nameEn": meta["nameEn"],
        "quote": meta["quote"],
        "whoIs": meta["whoIs"],
        "inANutshell": nutshell,
        "keyMechanics": key_mechanics,
        "whatWillYouDo": what_do,
        "summary": summary,
        "resistances": resistances,
        "refresh": refresh,
        "skills": skills,
        "domains": domains,
        "bonds": bonds,
        "startingEquipment": equipment,
        "image": meta["image"],
        "abilities": abilities
    }

classes_out = []
for filename, meta in CLASS_MAP.items():
    cdata = extract_class(filename, meta)
    classes_out.append(cdata)
    print(f"Extracted {cdata['nameRu']} ({len(cdata['abilities'])} abilities, {len(cdata['keyMechanics'])} key mechanics)")

with open(OUT_FILE, "w", encoding="utf-8") as f:
    json.dump(classes_out, f, ensure_ascii=False, indent=2)

print(f"Successfully saved {len(classes_out)} classes to {OUT_FILE}!")
