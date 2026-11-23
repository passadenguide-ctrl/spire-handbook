# -*- coding: utf-8 -*-
"""
Generate lore_knowledge_base.json for the embedded client-side RAG engine.
Combines:
- Core game rules and dice resolution
- Stress and Fallout definitions
- Terminology and glossary
- Classes and their philosophies
- Districts and their key dynamics
- Domain locations and GM hooks
- Major factions
"""

import json
import os

base_dir = r'C:\Users\Сергей Леонидович\.gemini\antigravity\scratch\spire-handbook\src\data'

classes = json.load(open(os.path.join(base_dir, 'classes.json'), encoding='utf-8'))
districts = json.load(open(os.path.join(base_dir, 'districts.json'), encoding='utf-8'))
extra_advances = json.load(open(os.path.join(base_dir, 'extra_advances.json'), encoding='utf-8'))
domain_locs = json.load(open(os.path.join(base_dir, 'domain_locations.json'), encoding='utf-8'))

kb = {
    "systemInfo": {
        "title": "Spire: The City Must Fall (Шпиль: Город Должен Пасть)",
        "setting": "Фэнтези-панк с революционной эстетикой. Город-башня Шпиль высотой в милю. Угнетенные темные эльфы (дроу) ведут партизанскую войну против жестоких правящих светлых эльфов (аэльфиров).",
        "glossaryRules": {
            "aelfir": "Аэльфиры (Aelfir) — правящие жестокие высшие эльфы Севера в масках, захватившие Шпиль 200 лет назад.",
            "drow": "Дроу (Drow) — коренные темные эльфы, строители Шпиля, угнетенный рабочий класс, ведущий тайную борьбу.",
            "vermissian": "Вермисиан (Vermisian) — проклятый оккультный ретро-метрополитен, искажающий пространство и время.",
            "ministry": "Министерство Нашей Владычицы Безмолвной Маски — тайная религиозная повстанческая организация дроу.",
            "the_heart": "Сердце (The Heart) — пульсирующая оккультная бездна под основанием Шпиля, источник мутаций и безумия."
        }
    },
    "rules": {
        "coreMechanic": {
            "title": "Основная механика d10",
            "text": "Когда персонаж совершает действие с риском, игрок бросает пул костей d10:\n- Базовый пул: 1d10.\n- Если есть подходящий Навык: +1d10.\n- Если есть подходящая Сфера: +1d10.\n- Если есть Мастерство (Mastery) в действии/навыке/сфере: +1d10.\nБерется НАИВЫСШИЙ результат:\n1: Критический провал (двойной стресс)\n2-5: Провал (вы получаете стресс)\n6-7: Успех, но ценой (действие удалось, но вы получаете стресс)\n8-9: Чистый успех (действие удалось, стресса нет)\n10: Критический успех (+1 стресс наносится врагу за каждую выпавшую 10).\nСложность: уменьшает пул костей на 1 или 2."
        },
        "stressAndFallout": {
            "title": "Стресс и Последствия (Fallout)",
            "resistances": {
                "Blood": "Кровь — физические раны, истощение, кровотечения.",
                "Mind": "Разум — психическое напряжение, паника, безумие, галлюцинации.",
                "Silver": "Серебро — потеря денег, долги, уничтожение ресурсов и снаряжения.",
                "Shadow": "Тень — компрометация прикрытия, подозрения властей, слежка Стражи.",
                "Reputation": "Репутация — потеря статуса в ячейке, презрение общины, утрата связей."
            },
            "falloutCheck": "После получения стресса ведущий бросает d10. Если выпавшее число МЕНЬШЕ ИЛИ РАВНО текущему суммарному стрессу персонажа, наступает Последствие (Fallout): Легкое (Minor, стресс 2-4), Среднее (Moderate, стресс 5-8) или Тяжелое/Смертельное (Severe, стресс 9+). После получения Fallout стресс сбрасывается."
        },
        "refresh": {
            "title": "Отдушина (Refresh)",
            "text": "Отдушина — способ снять накопленный стресс. Каждый класс имеет свою уникальную отдушину (например, месть обидчику, молитва при лунном свете, покупка предметов роскоши, выступление перед толпой, пьянство в трущобах)."
        }
    },
    "classes": [
        {
            "id": c["id"],
            "nameRu": c["nameRu"],
            "nameEn": c["nameEn"],
            "summary": c.get("summary", c.get("whoIs", "")),
            "whoIs": c.get("whoIs", ""),
            "resistances": c.get("resistances", {}),
            "skills": c.get("skills", []),
            "domains": c.get("domains", []),
            "refresh": c.get("refresh", ""),
            "quote": c.get("quote", ""),
            "description": c.get("description", ""),
            "keyMechanics": c.get("keyMechanics", ""),
            "abilitiesCount": len(c.get("abilities", []))
        }
        for c in classes
    ],
    "districts": [
        {
            "id": d["id"],
            "nameRu": d["nameRu"],
            "nameEn": d["nameEn"],
            "level": d.get("level", ""),
            "domains": d.get("domains", []),
            "atmosphere": d.get("atmosphere", ""),
            "bookQuote": d.get("bookQuote", ""),
            "description": d.get("description", ""),
            "longDescription": d.get("longDescription", ""),
            "landmarks": [l["name"] if isinstance(l, dict) else str(l) for l in d.get("landmarks", [])]
        }
        for d in districts
    ],
    "domainLocations": domain_locs
}

output_path = os.path.join(base_dir, 'lore_knowledge_base.json')
with open(output_path, 'w', encoding='utf-8') as f:
    json.dump(kb, f, ensure_ascii=False, indent=2)

print(f"Generated comprehensive lore_knowledge_base.json ({len(domain_locs)} domain locations, {len(classes)} classes, {len(districts)} districts)")
