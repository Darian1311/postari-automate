from groq import Groq
import os

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

STORE_COUNT = 9


def _format_stores(magazine: list) -> str:
    if not magazine or len(magazine) == 0:
        return "toate magazinele noastre"
    if "toate" in [m.lower() for m in magazine] or len(magazine) >= STORE_COUNT:
        return "toate magazinele noastre"
    if len(magazine) == 1:
        return f"magazinul nostru din {magazine[0]}"
    return f"magazinele noastre din: {', '.join(magazine)}"


def generate_promotion_text(produs: str, pret: float, discount: int, magazine: list, perioada: str = None) -> str:
    pret_nou = round(pret * (1 - discount / 100), 2)
    locatie = _format_stores(magazine)
    perioada_text = f"Perioada promoției: {perioada}" if perioada else "Ofertă valabilă în limita stocului disponibil."

    prompt = f"""Ești copywriter pentru un lanț de magazine alimentare din România.
Generează o postare scurtă și atractivă pentru Facebook:

Produs: {produs}
Preț original: {pret:.2f} lei
Reducere: {discount}%
Preț nou: {pret_nou:.2f} lei
Disponibil în: {locatie}
{perioada_text}

Reguli:
- Scrie DOAR textul postării, fără explicații sau introduceri
- Limbă: română
- Emoji-uri: 3-5, relevante
- Maxim 100 de cuvinte
- Include call-to-action (ex: "Grăbește-te!", "Nu rata!", "Vino azi!")
- Ton: entuziast, prietenos
- Hashtag-uri: maxim 3, relevante"""

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        max_tokens=400,
        messages=[{"role": "user", "content": prompt}]
    )
    return response.choices[0].message.content.strip()


def generate_job_text(post: str, magazine: list, cerinte: str = None) -> str:
    locatie = _format_stores(magazine)
    cerinte_text = f"\nCerințe menționate de angajator: {cerinte}" if cerinte else ""

    prompt = f"""Ești recrutor pentru un lanț de magazine alimentare din România.
Generează o postare de angajare pentru Facebook:

Post vacant: {post}
Locație: {locatie}{cerinte_text}

Reguli:
- Scrie DOAR textul postării, fără explicații sau introduceri
- Limbă: română
- Emoji-uri: 3-5, relevante
- Maxim 110 de cuvinte
- Ton: prietenos, profesionist, motivant
- Menționează că oferim condiții bune de muncă și colegi prietenoși
- Include call-to-action (ex: "Trimite-ne CV-ul!" sau "Sună-ne!")
- Nu inventa date de contact specifice"""

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        max_tokens=450,
        messages=[{"role": "user", "content": prompt}]
    )
    return response.choices[0].message.content.strip()
