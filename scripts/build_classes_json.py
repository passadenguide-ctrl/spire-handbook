import pymupdf, glob, os, re, json
from equipment_builder import parse_equipment_structure

ID_MAP = {
    'Азурит': 'azurite',
    'Бунтарь': 'firebrand',
    'Вермиссийский Мудрец': 'vermissian-sage',
    'Жрец Падали': 'carrion-priest',
    'Кумир': 'idol',
    'Лайян': 'lahjan',
    'Личина': 'masked',
    'Наделённый': 'bound',
    'Повитуха': 'midwife',
    'Рыцарь': 'knight'
}

NAME_EN_MAP = {
    'Азурит': 'AZURITE',
    'Бунтарь': 'FIREBRAND',
    'Вермиссийский Мудрец': 'VERMISSIAN SAGE',
    'Жрец Падали': 'CARRION-PRIEST',
    'Кумир': 'IDOL',
    'Лайян': 'LAHYAN',
    'Личина': 'MASKED',
    'Наделённый': 'BOUND',
    'Повитуха': 'MIDWIFE',
    'Рыцарь': 'KNIGHT'
}

QUOTES_MAP = {
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

WHO_IS_MAP = {
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

# Verified exact filenames in public/assets/images/classes/
IMAGES_MAP = {
    'Азурит': './assets/images/classes/azurite.png',
    'Бунтарь': './assets/images/classes/firebrand.png',
    'Вермиссийский Мудрец': './assets/images/classes/vermissiyskiy-mudrets.png',
    'Жрец Падали': './assets/images/classes/carrion-priest.png',
    'Кумир': './assets/images/classes/idol.png',
    'Лайян': './assets/images/classes/layyan.png',
    'Личина': './assets/images/classes/lichina.png',
    'Наделённый': './assets/images/classes/bound.png',
    'Повитуха': './assets/images/classes/povitukha.png',
    'Рыцарь': './assets/images/classes/knight.png'
}

def clean_text(text):
    text = re.sub(r'---\s*Page\s*\d+\s*---', '', text)
    text = re.sub(r'\r\n', '\n', text)
    return text.strip()

def split_bullets(text):
    if not text:
        return []
    items = re.split(r'\n\s*[·•]\s*', '\n' + text)
    cleaned = []
    for item in items:
        c = clean_text(item)
        if c:
            cleaned.append(c)
    return cleaned

def extract_abilities_from_section(section_text, tier, class_id):
    lines = section_text.split('\n')
    abilities = []
    curr_title = None
    curr_tags = []
    curr_lines = []
    
    title_re = re.compile(
        r'^\s*(?:[·•]\s*)?([А-ЯЁ\s0-9—–«»’\'\?!,-]+(?:\([A-Z0-9\s\',-—–\?!]+\))?)(?:\.\s*(\[[^\]]+\])|\s*(\[[^\]]+\]))?[\.:]?(?:\s+(.*))?$'
    )
    
    false_positives = [
        'ПРОДВИЖЕНИЯ', 'ОСНОВНЫЕ', 'ЭКИПИРОВКА', 'ХАРАКТЕРИСТИКИ', 'КЛАССОВЫЕ', 'СФЕРЫ',
        'СВЯЗИ', 'ОТДУШИНА', 'ДРУГИЕ ФОРМЫ ИСКУССТВА', 'ФАС!', 'ИЩИ!', 'ГОЛОС!',
        'ОХРАНЯЙ!', 'АПОРТ!', 'НЮХАЙ!', 'СТЕНАМ, ХИТИНОВЫЙ', 'ВЛАДЫЧИЦЫ,', 'ПО СТЕНАМ'
    ]
    
    for line in lines:
        l_str = line.strip()
        if not l_str:
            if curr_lines:
                curr_lines.append('')
            continue
            
        m = title_re.match(l_str)
        is_title = False
        cand_title = ''
        tag = ''
        rest = ''
        
        if m:
            cand_title = m.group(1).strip().rstrip('.:')
            tag = m.group(2) or m.group(3) or ''
            rest = m.group(4) or ''
            
            cand_no_en = re.sub(r'\([^\)]*\)', '', cand_title).strip()
            ru_letters = [c for c in cand_no_en if 'А' <= c <= 'Я' or c == 'Ё' or 'а' <= c <= 'я' or c == 'ё']
            if ru_letters and all('А' <= c <= 'Я' or c == 'Ё' for c in ru_letters) and len(ru_letters) >= 3:
                if not any(fp in cand_title for fp in false_positives):
                    if not cand_title.endswith(','):
                        is_title = True
        
        if is_title:
            if curr_title:
                ab_id = f"{class_id}-{re.sub(r'[^a-zA-Z0-9]+', '-', curr_title).strip('-').lower()}"
                abilities.append({
                    'id': ab_id,
                    'name': curr_title,
                    'tier': tier,
                    'tag': curr_tags[0] if curr_tags else None,
                    'tags': curr_tags,
                    'description': '\n'.join(curr_lines).strip()
                })
            curr_title = cand_title
            curr_tags = [tag.strip('[]')] if tag else []
            curr_lines = [rest] if rest else []
        else:
            if curr_title:
                curr_lines.append(line)
                
    if curr_title:
        ab_id = f"{class_id}-{re.sub(r'[^a-zA-Z0-9]+', '-', curr_title).strip('-').lower()}"
        abilities.append({
            'id': ab_id,
            'name': curr_title,
            'tier': tier,
            'tag': curr_tags[0] if curr_tags else None,
            'tags': curr_tags,
            'description': '\n'.join(curr_lines).strip()
        })
        
    return abilities

def process_all_classes():
    files = sorted(glob.glob(r'C:\Users\Сергей Леонидович\Desktop\Модуль\Spire\Классы\*.pdf'))
    result = []
    
    for f in files:
        base_name = os.path.basename(f).replace('.pdf', '')
        class_id = ID_MAP.get(base_name, base_name.lower())
        doc = pymupdf.open(f)
        full_text = '\n'.join([doc[p].get_text() for p in range(len(doc))])
        
        # Nutshell
        nutshell_match = re.search(r'В двух словах:\s*(.*?)(?=Ключевая механика:|Что вы будете делать\?|Итог:|ОСНОВНЫЕ ЧЕРТЫ)', full_text, re.DOTALL)
        in_a_nutshell = clean_text(nutshell_match.group(1)) if nutshell_match else ''
        
        # Key mechanics (array)
        key_mech_match = re.search(r'Ключевая механика:\s*(.*?)(?=Что вы будете делать\?|Итог:|ОСНОВНЫЕ ЧЕРТЫ)', full_text, re.DOTALL)
        key_mechanics = split_bullets(key_mech_match.group(1)) if key_mech_match else []
        
        # What will you do (array)
        if base_name == 'Азурит':
            what_will_you_do = [
                'Достать что угодно и узнать кого угодно благодаря своим связям.',
                'Откупаться от проблем, перенаправляя урон со своего здоровья (Кровь) на кошелёк (Серебро).',
                'В критический момент подбросить монетку, чтобы решить исход события (Бросок монеты), или даже купить себе назад минуту времени для переигровки неудачи.'
            ]
            summary = 'Выбирайте Азурита, если хотите играть за обаятельного манипулятора, который побеждает не мечом, а кошельком, и любите нестандартные, почти сюрреалистические способы решения проблем («продать врагу его же память»). Это класс для тех, кто предпочитает дипломатию и креативность грубой силе. Этот класс уникален тем, что превращает экономическую механику в основу игрового процесса.'
        else:
            what_do_match = re.search(r'Что вы будете делать\?\s*(.*?)(?=Итог:|ОСНОВНЫЕ ЧЕРТЫ)', full_text, re.DOTALL)
            what_will_you_do = split_bullets(what_do_match.group(1)) if what_do_match else []
            
            summary_match = re.search(r'Итог:\s*(.*?)(?=ОСНОВНЫЕ ЧЕРТЫ)', full_text, re.DOTALL)
            summary = clean_text(summary_match.group(1)) if summary_match else ''
        
        # Resistances
        res_match = re.search(r'ХАРАКТЕРИСТИКИ СОПРОТИВЛЕНИЯ(?:\s*\(Resistances\))?:\s*(.*?)(?=\n[А-ЯЁ\s]+:|\n\n)', full_text)
        resistances = []
        if res_match:
            res_str = res_match.group(1)
            resistances = [r.strip() for r in re.split(r'[,;]\s*', res_str) if r.strip()]
            
        # Refresh
        ref_match = re.search(r'ОТДУШИНА(?:\s*\(Refresh\))?:\s*(.*?)(?=\n[А-ЯЁ\s]+:|\n\n)', full_text)
        refresh = clean_text(ref_match.group(1)) if ref_match else ''
        
        # Skills
        skills_match = re.search(r'(?:КЛАССОВЫЕ НАВЫКИ|Навыки(?:\s*\(Skills\))?):\s*(.*?)(?=\n[А-ЯЁ\s]+:|\n\n)', full_text)
        skills = []
        if skills_match:
            skills = [s.strip() for s in re.split(r'[,;]\s*', skills_match.group(1)) if s.strip()]
            
        # Domains
        domains_match = re.search(r'(?:СФЕРЫ|Сферы(?:\s*\(Domains\))?):\s*(.*?)(?=\n[А-ЯЁ\s]+:|\n\n)', full_text)
        domains = []
        if domains_match:
            domains = [d.strip() for d in re.split(r'[,;]\s*', domains_match.group(1)) if d.strip()]
            
        # Bonds
        bonds_match = re.search(r'СВЯЗИ(?:\s*\(Bonds\))?\s*(.*?)(?=ЭКИПИРОВКА)', full_text, re.DOTALL)
        bonds = []
        if bonds_match:
            bonds_raw = bonds_match.group(1).strip()
            bonds = split_bullets(bonds_raw)
            
        # Equipment raw
        eq_match = re.search(r'ЭКИПИРОВКА(?:\s*\(EQUIPMENT\))?\s*(.*?)(?=(?:ОСНОВНЫЕ СПОСОБНОСТИ|ПРОДВИЖЕНИЯ НИЗКОГО УРОВНЯ|[А-ЯЁ\s]{4,}\s*\([A-Z\s\'-]+\)\.))', full_text, re.DOTALL)
        eq_raw = eq_match.group(1).strip() if eq_match else ''
        starting_equipment = split_bullets(eq_raw)
        structured_equipment = parse_equipment_structure(base_name, eq_raw)
        
        # Section markers
        low_m = re.search(r'ПРОДВИЖЕНИЯ\s+НИЗКОГО\s+УРОВНЯ[^\n]*', full_text)
        med_m = re.search(r'ПРОДВИЖЕНИЯ\s+СРЕДНЕГО\s+УРОВНЯ[^\n]*', full_text)
        high_m = re.search(r'ПРОДВИЖЕНИЯ\s+ВЫСОКОГО\s+УРОВНЯ[^\n]*', full_text)
        
        pre_low = full_text[:low_m.start()]
        eq_matches = list(re.finditer(r'ЭКИПИРОВКА[^\n]*', pre_low))
        core_raw = pre_low[eq_matches[-1].end():] if eq_matches else ''
        
        low_raw = full_text[low_m.end():med_m.start()]
        med_raw = full_text[med_m.end():high_m.start()]
        high_raw = full_text[high_m.end():]
        
        core_abs = extract_abilities_from_section(core_raw, 'core', class_id)
        low_abs = extract_abilities_from_section(low_raw, 'low', class_id)
        med_abs = extract_abilities_from_section(med_raw, 'medium', class_id)
        high_abs = extract_abilities_from_section(high_raw, 'high', class_id)
        
        all_abs = core_abs + low_abs + med_abs + high_abs
        
        class_obj = {
            'id': class_id,
            'nameRu': base_name,
            'nameEn': NAME_EN_MAP.get(base_name, base_name.upper()),
            'quote': QUOTES_MAP.get(base_name, ''),
            'whoIs': WHO_IS_MAP.get(base_name, ''),
            'description': in_a_nutshell,
            'inANutshell': in_a_nutshell,
            'keyMechanics': key_mechanics,
            'whatWillYouDo': what_will_you_do,
            'summary': summary,
            'resistances': resistances,
            'refresh': refresh,
            'skills': skills,
            'domains': domains,
            'bonds': bonds,
            'startingEquipment': starting_equipment,
            'equipment': structured_equipment,
            'image': IMAGES_MAP.get(base_name, ''),
            'abilities': all_abs
        }
        
        result.append(class_obj)
        print(f"Processed {base_name}: {len(all_abs)} abilities (whatWillYouDo: {len(what_will_you_do)}, summary: {bool(summary)}, image: {IMAGES_MAP.get(base_name)})")
        
    out_path = r'C:\Users\Сергей Леонидович\.gemini\antigravity\scratch\spire-handbook\src\data\classes.json'
    with open(out_path, 'w', encoding='utf-8') as f:
        json.dump(result, f, ensure_ascii=False, indent=2)
    print(f"Saved {len(result)} classes to {out_path}")

process_all_classes()
