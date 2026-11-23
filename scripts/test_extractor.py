import pymupdf, glob, os, re, json

CLASSES_DIR = r'C:\Users\Сергей Леонидович\Desktop\Модуль\Spire\Классы'

def clean_text(text):
    text = re.sub(r'---\s*Page\s*\d+\s*---', '', text)
    text = re.sub(r'\r\n', '\n', text)
    return text.strip()

def parse_class_pdf(pdf_path):
    doc = pymupdf.open(pdf_path)
    base_name = os.path.basename(pdf_path).replace('.pdf', '')
    
    # Page texts
    p_texts = [doc[i].get_text() for i in range(len(doc))]
    full_text = '\n'.join(p_texts)
    
    # 1. Header info from page 2 (index 1)
    p2 = p_texts[1] if len(p_texts) > 1 else p_texts[0]
    
    # Extract Title and En name
    title_match = re.search(r'([А-ЯЁ\s]+)(?:\(([A-Z\s\'-]+)\))?', p2)
    name_ru = base_name
    name_en = ''
    if title_match:
        name_en = title_match.group(2) or ''
    
    # Specific quotes map for 100% precision
    quotes = {
        'Азурит': '«У каждого есть своя цена. Даже у вас, мой господин.»',
        'Бунтарь': '«Они не справятся со всеми нами. Не со всеми. Сегодня ночью мы покажем им, кто здесь на самом деле хозяин».',
        'Вермиссийский Мудрец': '«Полагаю, у меня как раз есть нужная вам книга – беда в том, что она в восьми станциях вниз и пяти поперёк, так что, возможно, вам стоит захватить провизию».',
        'Жрец Падали': '«Сегодня ночью пирует наш Чарнел, братья! И мы пируем вместе с ним!»',
        'Кумир': '«Истина? Что есть истина, когда у тебя есть красота?»',
        'Лайян': '«Наша Госпожа защищает, милый. Держи её в своём сердце, и она облегчит твой уход».',
        'Личина': '«Ах, мой господин, приношу свои глубочайшие извинения — вот верные манифесты, а не те, что у вас. Я уже казнил мальчика-доставщика, предвосхищая ваше желание».',
        'Наделённый': '«Верёвка, удержи меня. Доспех, защити меня. Клинок, обескровь их».',
        'Повитуха': '«Разумеется, я буду сражаться за тебя; паутина связывает нас всех, брат».',
        'Рыцарь': '«Клянусь нашей Владычицей, этим похмельем можно повалить небесного кита. Мы победили?»'
    }
    quote = quotes.get(base_name, '')
    
    who_is_map = {
        'Азурит': '«Торговец, которого слушается сам бог»',
        'Бунтарь': '«Голос восстания, зажигающий искру в сердцах угнетённых»',
        'Вермиссийский Мудрец': '«Учёный-архивариус, который находит нужные ответы в неправильных местах и использует законы реальности как рекомендации»',
        'Жрец Падали': '«Священник-охотник, чей бог жаждет плоти»',
        'Кумир': '«Звезда, чьё искусство перекраивает реальность»',
        'Лайян': '«Жрец лунного культа, в чьих руках милость богини становится оружием, а проповедь — прикрытием для тихой войны»',
        'Личина': '«Слуга с тысячей лиц, для которого ложь — это доспехи, а маска — настоящее лицо»',
        'Наделённый': '«Бэтмен Шпиля с одушевлёнными гаджетами»',
        'Повитуха': '«Боевая жрица паутины, чья магия сплетает раны, судьбы и кошмары»',
        'Рыцарь': '«Бронированный бандит с остатками благородства и правом носить большое оружие»'
    }
    who_is = who_is_map.get(base_name, '')
    
    # In a nutshell
    nutshell_match = re.search(r'В двух словах:\s*(.*?)(?=Ключевая механика:|Что вы будете делать\?|Итог:|ОСНОВНЫЕ ЧЕРТЫ)', full_text, re.DOTALL)
    in_a_nutshell = clean_text(nutshell_match.group(1)) if nutshell_match else ''
    
    # Key mechanics
    key_mech_match = re.search(r'Ключевая механика:\s*(.*?)(?=Что вы будете делать\?|Итог:|ОСНОВНЫЕ ЧЕРТЫ)', full_text, re.DOTALL)
    key_mechanics = clean_text(key_mech_match.group(1)) if key_mech_match else ''
    
    # What will you do
    what_do_match = re.search(r'Что вы будете делать\?\s*(.*?)(?=Итог:|ОСНОВНЫЕ ЧЕРТЫ)', full_text, re.DOTALL)
    what_will_you_do = clean_text(what_do_match.group(1)) if what_do_match else ''
    
    # Summary
    summary_match = re.search(r'Итог:\s*(.*?)(?=ОСНОВНЫЕ ЧЕРТЫ)', full_text, re.DOTALL)
    summary = clean_text(summary_match.group(1)) if summary_match else ''
    
    # Resistances
    res_match = re.search(r'ХАРАКТЕРИСТИКИ СОПРОТИВЛЕНИЯ:\s*(.*?)(?=\n[А-ЯЁ\s]+:|\n\n)', full_text)
    resistances = []
    if res_match:
        res_str = res_match.group(1)
        resistances = [r.strip() for r in re.split(r'[,;]\s*', res_str) if r.strip()]
        
    # Refresh (Отдушина)
    ref_match = re.search(r'ОТДУШИНА:\s*(.*?)(?=\n[А-ЯЁ\s]+:|\n\n)', full_text)
    refresh = clean_text(ref_match.group(1)) if ref_match else ''
    
    # Skills
    skills_match = re.search(r'КЛАССОВЫЕ НАВЫКИ:\s*(.*?)(?=\n[А-ЯЁ\s]+:|\n\n)', full_text)
    skills = []
    if skills_match:
        skills = [s.strip() for s in re.split(r'[,;]\s*', skills_match.group(1)) if s.strip()]
        
    # Domains
    domains_match = re.search(r'СФЕРЫ:\s*(.*?)(?=\n[А-ЯЁ\s]+:|\n\n)', full_text)
    domains = []
    if domains_match:
        domains = [d.strip() for d in re.split(r'[,;]\s*', domains_match.group(1)) if d.strip()]
        
    # Bonds
    bonds_match = re.search(r'СВЯЗИ\s*(.*?)(?=ЭКИПИРОВКА)', full_text, re.DOTALL)
    bonds = []
    if bonds_match:
        bonds_raw = bonds_match.group(1).strip()
        b_items = re.split(r'\n\s*[·•]\s*', '\n' + bonds_raw)
        bonds = [clean_text(b) for b in b_items if b.strip()]
        
    # Equipment
    eq_match = re.search(r'ЭКИПИРОВКА(?:\s*\(EQUIPMENT\))?\s*(.*?)(?=(?:ОСНОВНЫЕ СПОСОБНОСТИ|ПРОДВИЖЕНИЯ НИЗКОГО УРОВНЯ|[А-ЯЁ\s]{4,}\s*\([A-Z\s\'-]+\)\.))', full_text, re.DOTALL)
    starting_equipment = clean_text(eq_match.group(1)) if eq_match else ''
    
    return {
        'base_name': base_name,
        'name_en': name_en,
        'quote': quote,
        'who_is': who_is,
        'in_a_nutshell': in_a_nutshell,
        'key_mechanics': key_mechanics,
        'what_will_you_do': what_will_you_do,
        'summary': summary,
        'resistances': resistances,
        'refresh': refresh,
        'skills': skills,
        'domains': domains,
        'bonds': bonds,
        'starting_equipment': starting_equipment,
        'full_text': full_text
    }

print("Extractor defined successfully.")
