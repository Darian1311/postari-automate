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

    prompt = f"""Ești copywriter pentru Miomar Universal, un lanț de magazine alimentare din România cu 9 locații în județele Aiud și Ocna Mureș.

Generează o postare caldă și atractivă pentru Facebook:

Produs: {produs}
Preț original: {pret:.2f} lei
Reducere: {discount}%
Preț nou: {pret_nou:.2f} lei
Disponibil în: {locatie}
{perioada_text}

Reguli:
- Scrie DOAR textul postării, fără explicații sau introduceri
- Limbă: română corectă, ton cald și prietenos ca un vecin de încredere
- Începe cu o propoziție atrăgătoare despre produs sau ofertă (nu cu prețul)
- Menționează "Miomar Universal" natural în text
- Emoji-uri: 4-6, relevante și vesele
- 80-120 de cuvinte
- Include beneficiul clientului (economie, calitate, familie)
- Call-to-action puternic la final (ex: "Vino azi!", "Te așteptăm!", "Grăbește-te, stocuri limitate!")
- Hashtag-uri: 3-4, ex: #MiomarUniversal #OfertaZilei #MagazinulTau"""

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        max_tokens=400,
        messages=[{"role": "user", "content": prompt}]
    )
    return response.choices[0].message.content.strip()


def generate_job_text(post: str, magazine: list, cerinte: str = None) -> str:
    locatie = _format_stores(magazine)
    cerinte_text = f"\nCerințe menționate de angajator: {cerinte}" if cerinte else ""

    prompt = f"""Ești recrutor pentru Miomar Universal, un lanț de magazine alimentare cu 9 locații în județele Aiud și Ocna Mureș, Romania.

Generează o postare de angajare călduroasă și motivantă pentru Facebook:

Post vacant: {post}
Locație: {locatie}{cerinte_text}

Reguli:
- Scrie DOAR textul postării, fără explicații sau introduceri
- Limbă: română corectă, ton prietenos și uman — vorbim cu oameni, nu cu CV-uri
- Menționează "Miomar Universal" natural în text
- Emoji-uri: 4-6, relevante
- 90-130 de cuvinte
- Evidențiază: colegi prietenoși, mediu de lucru plăcut, stabilitate, dezvoltare
- Nu inventa salarii sau date de contact specifice
- Call-to-action clar la final (ex: "Scrie-ne în privat!", "Trimite-ne un mesaj!", "Te așteptăm în echipă!")
- Hashtag-uri: 3-4, ex: #MiomarUniversal #AngarjariRomania #OcazieDeMunca"""

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        max_tokens=450,
        messages=[{"role": "user", "content": prompt}]
    )
    return response.choices[0].message.content.strip()
