"""Build the revised feasibility study by appending a dated prototype addendum."""

from pathlib import Path

from pypdf import PdfReader, PdfWriter
from reportlab.lib.colors import HexColor
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import mm
from reportlab.pdfgen.canvas import Canvas
from reportlab.platypus import Paragraph


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "references/ETUDE_PREMIUM.pdf"
TEMP_DIR = ROOT / "tmp/pdfs"
ADDENDUM = TEMP_DIR / "prototype_addendum.pdf"
OUTPUT = ROOT / "output/pdf/Analyse_pilotage_predictif_restaurants_premium_revision.pdf"

NAVY = HexColor("#18344E")
TEAL = HexColor("#2B857D")
AMBER = HexColor("#E39013")
INK = HexColor("#263E52")
MUTED = HexColor("#627689")
PALE = HexColor("#F3F7F8")
TEAL_PALE = HexColor("#E3F1EE")
AMBER_PALE = HexColor("#FFF1D8")
RED_PALE = HexColor("#FBE7E4")
WHITE = HexColor("#FFFFFF")
LINE = HexColor("#CFDCE2")

PAGE_W, PAGE_H = A4
LEFT = 18 * mm
RIGHT = 18 * mm
CONTENT_W = PAGE_W - LEFT - RIGHT


BODY = ParagraphStyle(
    "body",
    fontName="Helvetica",
    fontSize=9.2,
    leading=13.2,
    textColor=INK,
    alignment=TA_LEFT,
)
SMALL = ParagraphStyle(
    "small",
    parent=BODY,
    fontSize=7.7,
    leading=10.5,
    textColor=MUTED,
)
CARD_TITLE = ParagraphStyle(
    "card-title",
    parent=BODY,
    fontName="Helvetica-Bold",
    fontSize=10,
    leading=12,
    textColor=NAVY,
)
WHITE_BODY = ParagraphStyle(
    "white-body",
    parent=BODY,
    fontSize=9.5,
    leading=13.5,
    textColor=WHITE,
)


def paragraph(canvas: Canvas, text: str, x: float, y: float, width: float, style: ParagraphStyle = BODY) -> float:
    item = Paragraph(text, style)
    _, height = item.wrap(width, PAGE_H)
    item.drawOn(canvas, x, y - height)
    return y - height


def header(canvas: Canvas, page_number: int, section: str = "MISE A JOUR DU PROTOTYPE") -> None:
    canvas.setFillColor(NAVY)
    canvas.setFont("Helvetica-Bold", 8.3)
    canvas.drawString(LEFT, PAGE_H - 14 * mm, "PILOTAGE PREDICTIF DES RESTAURANTS")
    canvas.setStrokeColor(LINE)
    canvas.line(LEFT, PAGE_H - 18 * mm, PAGE_W - RIGHT, PAGE_H - 18 * mm)
    canvas.setFillColor(MUTED)
    canvas.setFont("Helvetica", 7.2)
    canvas.drawRightString(PAGE_W - RIGHT, 11 * mm, f"{section}  -  {page_number}")


def title(canvas: Canvas, kicker: str, heading: str, subtitle: str, y: float) -> float:
    canvas.setFillColor(AMBER)
    canvas.setFont("Helvetica-Bold", 8.2)
    canvas.drawString(LEFT, y, kicker.upper())
    y -= 10 * mm
    canvas.setFillColor(NAVY)
    canvas.setFont("Helvetica-Bold", 25)
    for line in heading.split("\n"):
        canvas.drawString(LEFT, y, line)
        y -= 9 * mm
    y -= 1 * mm
    return paragraph(canvas, subtitle, LEFT, y, CONTENT_W, ParagraphStyle("subtitle", parent=BODY, fontSize=10.5, leading=15, textColor=MUTED))


def stat_card(canvas: Canvas, x: float, y: float, width: float, label: str, value: str, note: str, fill=PALE) -> None:
    height = 30 * mm
    canvas.setFillColor(fill)
    canvas.roundRect(x, y - height, width, height, 4 * mm, stroke=0, fill=1)
    canvas.setFillColor(TEAL)
    canvas.setFont("Helvetica-Bold", 7)
    canvas.drawString(x + 4 * mm, y - 6 * mm, label.upper())
    canvas.setFillColor(NAVY)
    canvas.setFont("Helvetica-Bold", 17)
    canvas.drawString(x + 4 * mm, y - 15 * mm, value)
    paragraph(canvas, note, x + 4 * mm, y - 19 * mm, width - 8 * mm, SMALL)


def card(canvas: Canvas, x: float, y: float, width: float, height: float, heading: str, body: str, fill=WHITE, accent=TEAL) -> None:
    canvas.setFillColor(fill)
    canvas.setStrokeColor(LINE)
    canvas.roundRect(x, y - height, width, height, 3 * mm, stroke=1, fill=1)
    canvas.setFillColor(accent)
    canvas.roundRect(x, y - height, 2.2 * mm, height, 1 * mm, stroke=0, fill=1)
    body_y = paragraph(canvas, heading, x + 6 * mm, y - 5 * mm, width - 11 * mm, CARD_TITLE)
    paragraph(canvas, body, x + 6 * mm, body_y - 2 * mm, width - 11 * mm, SMALL)


def bullet(canvas: Canvas, text: str, x: float, y: float, width: float, color=TEAL) -> float:
    canvas.setFillColor(color)
    canvas.circle(x + 1.2 * mm, y - 2.2 * mm, 1 * mm, stroke=0, fill=1)
    return paragraph(canvas, text, x + 5 * mm, y, width - 5 * mm, BODY) - 2.2 * mm


def build_addendum() -> None:
    TEMP_DIR.mkdir(parents=True, exist_ok=True)
    canvas = Canvas(str(ADDENDUM), pagesize=A4)

    # Page 29 - status update.
    header(canvas, 29)
    y = title(
        canvas,
        "Addendum - 17 juillet 2026",
        "Le prototype\nest maintenant démontrable",
        "Cette mise à jour conserve l'étude initiale et précise ce que la construction a prouvé, ce qui reste simulé et la prochaine décision d'investissement.",
        PAGE_H - 31 * mm,
    )
    y -= 9 * mm
    gap = 4 * mm
    width = (CONTENT_W - 2 * gap) / 3
    stat_card(canvas, LEFT, y, width, "Établissements", "3 sites", "République, Liberté et Gare", TEAL_PALE)
    stat_card(canvas, LEFT + width + gap, y, width, "Laboratoire", "6 cas", "Scénarios rejouables", PALE)
    stat_card(canvas, LEFT + 2 * (width + gap), y, width, "Données", "100 %", "Fictives et reproductibles", AMBER_PALE)
    y -= 39 * mm
    canvas.setFillColor(NAVY)
    canvas.setFont("Helvetica-Bold", 15)
    canvas.drawString(LEFT, y, "Ce que cette édition change")
    y -= 8 * mm
    y = bullet(canvas, "Le prototype n'est plus une simple maquette : prévisions, fourchettes, facteurs, abstentions et recommandations sont portés par des scénarios déterministes testés.", LEFT, y, CONTENT_W)
    y = bullet(canvas, "Les six situations sont jouables dans une fenêtre isolée qui ne modifie jamais la session principale.", LEFT, y, CONTENT_W)
    y = bullet(canvas, "Aucun résultat terrain n'est revendiqué : le ROI observé reste vide et toutes les métriques portent sur un monde simulé.", LEFT, y, CONTENT_W)
    y -= 4 * mm
    canvas.setFillColor(NAVY)
    canvas.roundRect(LEFT, y - 31 * mm, CONTENT_W, 31 * mm, 4 * mm, stroke=0, fill=1)
    canvas.setFillColor(TEAL_PALE)
    canvas.setFont("Helvetica-Bold", 7.5)
    canvas.drawString(LEFT + 7 * mm, y - 8 * mm, "VERDICT ACTUALISÉ")
    paragraph(
        canvas,
        "La faisabilité technique du prototype est démontrée. La faisabilité commerciale et opérationnelle reste à établir sur les données d'un groupe pilote.",
        LEFT + 7 * mm,
        y - 13 * mm,
        CONTENT_W - 14 * mm,
        WHITE_BODY,
    )
    canvas.showPage()

    # Page 30 - demonstrated capabilities.
    header(canvas, 30)
    y = title(
        canvas,
        "Preuves disponibles",
        "Spécifications de la démo actuelle",
        "Prototype App organise les preuves en trois destinations et sépare strictement calcul, règle métier et explication.",
        PAGE_H - 31 * mm,
    )
    y -= 8 * mm
    row_gap = 4 * mm
    card_h = 29 * mm
    rows = [
        ("ACCUEIL GROUPE", "Chiffres consolidés, état des trois lieux et une action prioritaire par établissement.", TEAL_PALE, TEAL),
        ("DÉTAIL D'UN LIEU", "Fourchette, confiance, facteurs, horizon fictif à sept jours et échéances utiles.", PALE, TEAL),
        ("DÉCISIONS", "Trois priorités maximum, rôles Salle/Cuisine/Bar, échéances, motif et message préparé.", PALE, TEAL),
        ("JOURNAL", "Décisions de session, gains estimés fictifs et gain observé volontairement indisponible.", PALE, TEAL),
        ("ACTIONS EXTERNES", "Brouillon fournisseur, SMS et WhatsApp nécessitent toujours une confirmation humaine.", TEAL_PALE, TEAL),
        ("QUALITÉ LOGICIELLE", "17 tests web et 22 tests API, lint, types et build. Aucun secret ni donnée personnelle.", PALE, TEAL),
    ]
    for index, (heading, body, fill, accent) in enumerate(rows):
        card(canvas, LEFT, y, CONTENT_W, card_h, heading, body, fill, accent)
        y -= card_h + row_gap
        if index == 2:
            y -= 1 * mm
    canvas.setFillColor(MUTED)
    canvas.setFont("Helvetica-Oblique", 7.5)
    canvas.drawString(LEFT, 17 * mm, "Preuve technique ne signifie pas preuve de gain client.")
    canvas.showPage()

    # Page 31 - six playable scenarios.
    header(canvas, 31)
    y = title(
        canvas,
        "Laboratoire de démonstration",
        "Six exemples jouables et isolés",
        "Chaque cas permet de simuler une décision ou une abstention, puis se ferme sans modifier l'application.",
        PAGE_H - 31 * mm,
    )
    y -= 8 * mm
    col_gap = 5 * mm
    card_w = (CONTENT_W - col_gap) / 2
    card_h = 45 * mm
    scenarios = [
        ("01  Semaine normale", "Gare - briefing 08:00<br/>Comprendre la référence sans perturbation majeure."),
        ("02  Concert et météo sèche", "République - briefing 08:00<br/>Cumuler réservations, événement et terrasse."),
        ("03  Événement annulé", "République - alerte 13:45<br/>Réviser la demande après l'information tardive."),
        ("04  Déséquilibre multi-sites", "Liberté - vue groupe 08:00<br/>Proposer un renfort sans fragiliser la source."),
        ("05  Données insuffisantes", "Liberté - contrôle 08:00<br/>S'abstenir au lieu de fabriquer une précision."),
        ("06  Travaux et livraison", "Gare - alerte accès 08:00<br/>Montrer l'impact local d'une perturbation."),
    ]
    for index, (heading, body) in enumerate(scenarios):
        col = index % 2
        if col == 0 and index > 0:
            y -= card_h + 5 * mm
        card(canvas, LEFT + col * (card_w + col_gap), y, card_w, card_h, heading, body, WHITE, AMBER if index in {2, 4} else TEAL)
    y -= card_h + 10 * mm
    canvas.setFillColor(NAVY)
    canvas.setFont("Helvetica-Bold", 14)
    canvas.drawString(LEFT, y, "Trois responsabilités volontairement séparées")
    y -= 8 * mm
    half = (CONTENT_W - 5 * mm) / 2
    card(canvas, LEFT, y, half, 35 * mm, "PRÉVISION NUMÉRIQUE", "Nombre, fourchette, facteurs et confiance issus du monde fictif déterministe.", TEAL_PALE, TEAL)
    card(canvas, LEFT + half + 5 * mm, y, half, 35 * mm, "RÈGLE ET EXPLICATION", "Action déterministe avec heure limite, puis narration pédagogique clairement distincte.", AMBER_PALE, AMBER)
    canvas.showPage()

    # Page 32 - remaining proof and next decision.
    header(canvas, 32)
    y = title(
        canvas,
        "Décision d'investissement",
        "Ce qui reste à prouver",
        "Le prochain risque n'est plus la construction de l'interface. Il est dans la donnée, l'adoption manager et la valeur mesurée.",
        PAGE_H - 31 * mm,
    )
    y -= 9 * mm
    gap = 4 * mm
    width = (CONTENT_W - 2 * gap) / 3
    card(canvas, LEFT, y, width, 58 * mm, "DONNÉES RÉELLES", "Qualité des exports<br/>Fraîcheur quotidienne<br/>Normalisation des articles<br/>Accès caisse et planning", RED_PALE, AMBER)
    card(canvas, LEFT + width + gap, y, width, 58 * mm, "USAGE MANAGER", "Briefing consulté<br/>Décision réellement changée<br/>Règle jugée exécutable<br/>Temps économisé", AMBER_PALE, AMBER)
    card(canvas, LEFT + 2 * (width + gap), y, width, 58 * mm, "VALEUR ET SÉCURITÉ", "Gain observé<br/>Isolation multi-client<br/>Droits et journalisation<br/>Sauvegarde et restauration", TEAL_PALE, TEAL)
    y -= 69 * mm
    canvas.setFillColor(NAVY)
    canvas.setFont("Helvetica-Bold", 15)
    canvas.drawString(LEFT, y, "Prochaine séquence recommandée")
    y -= 9 * mm
    steps = [
        "Obtenir 12 à 24 mois d'exports anonymisés pour trois établissements d'un même groupe.",
        "Mesurer la qualité et rejouer 8 à 12 semaines sans utiliser d'information future.",
        "Comparer la référence simple, le modèle et la prévision du manager.",
        "Lancer un pilote en parallèle seulement si une recommandation aurait changé une décision.",
    ]
    for index, text in enumerate(steps, start=1):
        canvas.setFillColor(AMBER)
        canvas.circle(LEFT + 4 * mm, y - 2 * mm, 3.5 * mm, stroke=0, fill=1)
        canvas.setFillColor(NAVY)
        canvas.setFont("Helvetica-Bold", 9)
        canvas.drawCentredString(LEFT + 4 * mm, y - 3.2 * mm, str(index))
        y = paragraph(canvas, text, LEFT + 12 * mm, y, CONTENT_W - 12 * mm, BODY) - 4 * mm
    y -= 3 * mm
    canvas.setFillColor(NAVY)
    canvas.roundRect(LEFT, y - 35 * mm, CONTENT_W, 35 * mm, 4 * mm, stroke=0, fill=1)
    canvas.setFillColor(TEAL_PALE)
    canvas.setFont("Helvetica-Bold", 7.5)
    canvas.drawString(LEFT + 7 * mm, y - 8 * mm, "DÉCISION ACTUALISÉE")
    paragraph(
        canvas,
        "Utiliser le prototype comme support d'entretien et de backtest. Investir dans les connecteurs, la sécurité et l'industrialisation uniquement après une preuve sur données réelles.",
        LEFT + 7 * mm,
        y - 14 * mm,
        CONTENT_W - 14 * mm,
        WHITE_BODY,
    )
    canvas.showPage()

    # Page 33 - from field input to group briefing.
    header(canvas, 33, "PARCOURS MÉTIER DU PROTOTYPE")
    y = title(
        canvas,
        "Cas fil rouge - pré-service",
        "Du terrain au briefing groupe",
        "Un signal libre devient une décision seulement après validation, enrichissement traçable et arbitrage humain. Exemple fictif, aucune API ni action externe réellement connectée.",
        PAGE_H - 31 * mm,
    )
    y -= 7 * mm
    canvas.setFillColor(NAVY)
    canvas.roundRect(LEFT, y - 24 * mm, CONTENT_W, 24 * mm, 4 * mm, stroke=0, fill=1)
    canvas.setFillColor(TEAL_PALE)
    canvas.setFont("Helvetica-Bold", 7.4)
    canvas.drawString(LEFT + 6 * mm, y - 7 * mm, "VENDREDI 10:20 - RÉPUBLIQUE - AVANT LE DÎNER")
    paragraph(
        canvas,
        "« Terrasse confirmée, groupe de 22 à 19:30, livraison de glaçons annoncée à 13:30. »",
        LEFT + 6 * mm,
        y - 12 * mm,
        CONTENT_W - 12 * mm,
        WHITE_BODY,
    )
    y -= 32 * mm

    col_gap = 5 * mm
    card_w = (CONTENT_W - col_gap) / 2
    card_h = 37 * mm
    flow = [
        ("01  SAISIE VALIDÉE", "Formulaire ou note vocale. La transcription est relue et confirmée par le manager avant tout calcul.", TEAL_PALE, TEAL),
        ("02  ENRICHISSEMENT", "Caisse, réservations, planning et stock + météo, événements, travaux, trafic, STAR et parkings rennais horodatés.", PALE, TEAL),
        ("03  TROIS PRIORITÉS", "24 portions avant 11:00<br/>40 kg de glaçons avant 14:00<br/>1 serveur décalé sur 19:00-22:00 avant 16:00", AMBER_PALE, AMBER),
        ("04  ARBITRAGE HUMAIN", "Le responsable valide, modifie ou refuse, puis choisit de transmettre. Aucun planning, message ou ordre fournisseur automatique.", TEAL_PALE, TEAL),
    ]
    for index, (heading, body, fill, accent) in enumerate(flow):
        col = index % 2
        if col == 0 and index > 0:
            y -= card_h + 5 * mm
        card(canvas, LEFT + col * (card_w + col_gap), y, card_w, card_h, heading, body, fill, accent)
    y -= card_h + 10 * mm

    canvas.setFillColor(NAVY)
    canvas.setFont("Helvetica-Bold", 14)
    canvas.drawString(LEFT, y, "API et sources rennaises à instruire")
    y -= 7 * mm
    source_gap = 3 * mm
    source_w = (CONTENT_W - 2 * source_gap) / 3
    source_h = 29 * mm
    sources = [
        ("RENNES OPEN DATA", "Travaux · trafic temps réel<br/>parkings disponibles", TEAL_PALE, TEAL),
        ("STAR + AGENDA", "GTFS / GTFS-RT<br/>OpenAgenda Rennes Métropole", PALE, TEAL),
        ("MÉTÉO-FRANCE", "Pluie · température · vent<br/>aux coordonnées de Rennes", AMBER_PALE, AMBER),
    ]
    for index, (heading, body, fill, accent) in enumerate(sources):
        card(canvas, LEFT + index * (source_w + source_gap), y, source_w, source_h, heading, body, fill, accent)
    y -= source_h + 8 * mm

    canvas.setFillColor(NAVY)
    canvas.roundRect(LEFT, y - 23 * mm, CONTENT_W, 23 * mm, 4 * mm, stroke=0, fill=1)
    canvas.setFillColor(TEAL_PALE)
    canvas.setFont("Helvetica-Bold", 7.4)
    canvas.drawString(LEFT + 6 * mm, y - 7 * mm, "GARDE-FOU")
    paragraph(
        canvas,
        "Sources candidates, non connectées dans la démo. Fraîcheur, licence et qualité doivent être contrôlées ; la synthèse reste bornée à trois priorités et la décision finale appartient au responsable.",
        LEFT + 6 * mm,
        y - 12 * mm,
        CONTENT_W - 12 * mm,
        WHITE_BODY,
    )
    canvas.save()


def merge() -> None:
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    writer = PdfWriter()
    source_reader = PdfReader(str(SOURCE))
    addendum_reader = PdfReader(str(ADDENDUM))
    for page in source_reader.pages:
        writer.add_page(page)
    for page in addendum_reader.pages:
        writer.add_page(page)
    metadata = dict(source_reader.metadata or {})
    metadata.update(
        {
            "/Title": "Étude de faisabilité - pilotage prédictif des restaurants - révision prototype",
            "/Subject": "Étude initiale complétée par le bilan du prototype fictif et son parcours terrain vers briefing groupe",
        }
    )
    writer.add_metadata(metadata)
    with OUTPUT.open("wb") as output_file:
        writer.write(output_file)


if __name__ == "__main__":
    build_addendum()
    merge()
    print(OUTPUT)
