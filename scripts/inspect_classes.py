import json

with open(r'C:\Users\Сергей Леонидович\.gemini\antigravity\scratch\spire-handbook\src\data\classes.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

for c in data:
    abilities = c.get('abilities', [])
    tiers = {}
    for a in abilities:
        t = a.get('tier', 'unknown')
        tiers[t] = tiers.get(t, 0) + 1
    q = c.get('quote', '').strip().replace('\n', ' ')
    print(f"{c.get('nameRu')} ({c.get('id')}) => total abilities: {len(abilities)}, tiers: {tiers}")
    print(f"   Quote: {q}")
    print(f"   WhoIs: {c.get('whoIs')}")
