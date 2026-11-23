import json

with open(r'C:\Users\Сергей Леонидович\.gemini\antigravity\scratch\spire-handbook\src\data\extra_advances.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

print('Count of items:', len(data))
for item in data:
    advs = item.get('advances', [])
    print(f"- {item.get('id')}: {item.get('nameRu')} ({item.get('nameEn')}) - {len(advs)} advances")
