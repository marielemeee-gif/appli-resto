import Link from "next/link";

const scenarios = [
  { icon: "01", name: "Semaine normale", description: "Une semaine ordinaire, sans perturbation majeure.", signal: "Référence" },
  { icon: "02", name: "Concert & météo sèche", description: "Un concert proche accélère les réservations du vendredi soir.", signal: "Demande forte" },
  { icon: "03", name: "Événement annulé", description: "Une annulation tardive inverse un signal initialement positif.", signal: "Révision" },
  { icon: "04", name: "Déséquilibre multi-sites", description: "Un serveur peut être réaffecté entre République et Liberté.", signal: "Réallocation" },
  { icon: "05", name: "Données insuffisantes", description: "Historique incomplet et doublons : le moteur choisit de s’abstenir.", signal: "Abstention" },
  { icon: "06", name: "Travaux & livraison", description: "Des travaux modifient l’accès et la fenêtre de livraison à Gare.", signal: "Risque local" },
];

export function ScenarioGallery() {
  return (
    <section className="scenario-section" aria-labelledby="scenarios-title">
      <div className="section-intro">
        <div><p className="eyebrow">Terrain d’essai</p><h2 id="scenarios-title">Six situations, toutes fictives</h2></div>
        <p>Chaque scénario est déterministe et rejouable avec la graine <strong>20260717</strong>. Aucun chiffre ne provient d’un restaurant réel.</p>
      </div>
      <div className="scenario-grid">
        {scenarios.map((scenario) => (
          <article className="scenario-card" key={scenario.name}>
            <span className="scenario-number" aria-hidden="true">{scenario.icon}</span>
            <span className="scenario-signal">{scenario.signal}</span>
            <h3>{scenario.name}</h3>
            <p>{scenario.description}</p>
            <small>Scénario simulé</small>
            <Link className="scenario-link" href="/scenarios">Jouer</Link>
          </article>
        ))}
      </div>
      <Link className="button primary scenario-cta" href="/scenarios">Ouvrir le laboratoire des scénarios</Link>
    </section>
  );
}
