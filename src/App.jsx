import { ArrowDown, ArrowUpRight, Mail, MapPin, Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const portraitUrl =
  "https://renandurso.lovable.app/__l5e/assets-v1/627158e5-171e-4d04-a900-3ab4beb348d8/adv-1.png";
const portraitFallbackUrl =
  "https://jc-fotos-correspondentes.s3.amazonaws.com/452503/RENAN_DURSO_PEREIRA-20191021135624_120x120.jpg";

const practiceAreas = [
  {
    number: "01",
    title: "Home Care",
    short: "Continuidade do cuidado em casa.",
    description:
      "Atuação em negativas de internação domiciliar, equipe, insumos e continuidade do tratamento prescrito.",
    image:
      "https://images.pexels.com/photos/7659685/pexels-photo-7659685.jpeg?auto=compress&cs=tinysrgb&w=1600",
  },
  {
    number: "02",
    title: "Medicamentos",
    short: "Acesso ao tratamento prescrito.",
    description:
      "Medidas relacionadas a medicamentos de alto custo, uso contínuo, importados e negativas de cobertura.",
    image:
      "https://images.pexels.com/photos/4989187/pexels-photo-4989187.jpeg?auto=compress&cs=tinysrgb&w=1600",
  },
  {
    number: "03",
    title: "Oncologia",
    short: "Tempo importa quando o tratamento é urgente.",
    description:
      "Atuação em negativas envolvendo quimioterapia, imunoterapia, radioterapia e tratamentos indispensáveis.",
    image:
      "https://images.pexels.com/photos/7659870/pexels-photo-7659870.jpeg?auto=compress&cs=tinysrgb&w=1600",
  },
  {
    number: "04",
    title: "Cirurgias e terapias",
    short: "Proteção jurídica diante da negativa.",
    description:
      "Análise de negativas de cirurgias, exames, próteses, terapias multidisciplinares e outros procedimentos.",
    image:
      "https://images.pexels.com/photos/28736007/pexels-photo-28736007.jpeg?auto=compress&cs=tinysrgb&w=1600",
  },
];

const anatomyLabels = ["Estrutura", "Camisa", "Gravata", "Colete", "Paletó", "Presença"];
const spriteChunks = Array.from(
  { length: 13 },
  (_, index) => `/anatomia/safe-${String(index).padStart(2, "0")}.txt`,
);

const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
const range = (value, start, end) => clamp((value - start) / Math.max(end - start, 0.001));

function Portrait({ alt = "", className = "", loading = "eager" }) {
  return (
    <img
      src={portraitUrl}
      alt={alt}
      className={className}
      loading={loading}
      decoding="async"
      onError={(event) => {
        const image = event.currentTarget;
        if (!image.src.includes("RENAN_DURSO_PEREIRA")) image.src = portraitFallbackUrl;
      }}
    />
  );
}

function TailoringAssembly({ step }) {
  const [spriteUrl, setSpriteUrl] = useState("");

  useEffect(() => {
    let cancelled = false;
    let objectUrl = "";
    Promise.all(
      spriteChunks.map(async (url) => {
        const response = await fetch(url, { cache: "force-cache" });
        if (!response.ok) throw new Error(`Falha ao carregar ${url}`);
        return response.text();
      }),
    )
      .then((parts) => {
        const binary = atob(parts.join(""));
        const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));
        objectUrl = URL.createObjectURL(new Blob([bytes], { type: "image/webp" }));
        if (!cancelled) setSpriteUrl(objectUrl);
      })
      .catch((error) => console.error("Erro na montagem de alfaiataria:", error));
    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, []);

  return (
    <div className="tailoring" style={{ "--sprite": spriteUrl ? `url(${spriteUrl})` : "none" }}>
      <div className="tailoring-ruler" aria-hidden="true" />
      <div className="tailoring-light" aria-hidden="true" />
      <div className="tailoring-canvas" aria-label="Construção visual de um traje sob medida">
        {[
          ["body", "Estrutura"],
          ["shirt", "Camisa"],
          ["tie", "Gravata"],
          ["vest", "Colete"],
        ].map(([piece, label]) => (
          <div key={piece} className={`tailor-layer tailor-${piece}`} aria-label={label} />
        ))}
        <div className="tailor-layer tailor-jacket tailor-jacket-left"><i /></div>
        <div className="tailor-layer tailor-jacket tailor-jacket-right"><i /></div>
        <div className="tailor-final">
          <Portrait alt="Renan Durso" />
          <span aria-hidden="true" />
        </div>
      </div>
      <div className="tailoring-caption">
        <span>0{step + 1}</span>
        <strong>{anatomyLabels[step]}</strong>
      </div>
      <div className="tailoring-progress" aria-hidden="true">
        {anatomyLabels.map((label, index) => <i key={label} className={index <= step ? "active" : ""} />)}
      </div>
    </div>
  );
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [headerSolid, setHeaderSolid] = useState(false);
  const [anatomyStep, setAnatomyStep] = useState(0);
  const [activeArea, setActiveArea] = useState(0);
  const [contactStatus, setContactStatus] = useState("idle");
  const anatomyRef = useRef(null);
  const areasRef = useRef(null);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const height = Math.max(document.documentElement.scrollHeight - innerHeight, 1);
        document.documentElement.style.setProperty("--page-progress", String(scrollY / height));
        setHeaderSolid(scrollY > 80);

        document.querySelectorAll("[data-scene]").forEach((scene) => {
          const rect = scene.getBoundingClientRect();
          const travel = Math.max(scene.offsetHeight - innerHeight, 1);
          scene.style.setProperty("--scene", String(clamp(-rect.top / travel)));
        });

        if (anatomyRef.current) {
          const rect = anatomyRef.current.getBoundingClientRect();
          const progress = clamp(-rect.top / Math.max(anatomyRef.current.offsetHeight - innerHeight, 1));
          anatomyRef.current.style.setProperty("--body", "1");
          anatomyRef.current.style.setProperty("--shirt", String(range(progress, 0.08, 0.24)));
          anatomyRef.current.style.setProperty("--tie", String(range(progress, 0.23, 0.38)));
          anatomyRef.current.style.setProperty("--vest", String(range(progress, 0.37, 0.53)));
          anatomyRef.current.style.setProperty("--jacket", String(range(progress, 0.52, 0.71)));
          anatomyRef.current.style.setProperty("--portrait", String(range(progress, 0.76, 0.94)));
          const next = progress < 0.08 ? 0 : progress < 0.23 ? 1 : progress < 0.37 ? 2 : progress < 0.52 ? 3 : progress < 0.76 ? 4 : 5;
          setAnatomyStep((current) => current === next ? current : next);
        }

        if (areasRef.current) {
          const rect = areasRef.current.getBoundingClientRect();
          const progress = clamp(-rect.top / Math.max(areasRef.current.offsetHeight - innerHeight, 1));
          areasRef.current.style.setProperty("--areas", String(progress));
          const next = Math.min(3, Math.floor(progress * 4));
          setActiveArea((current) => current === next ? current : next);
        }
      });
    };
    const pointer = (event) => {
      document.documentElement.style.setProperty("--mx", String(event.clientX / innerWidth - 0.5));
      document.documentElement.style.setProperty("--my", String(event.clientY / innerHeight - 0.5));
    };
    update();
    addEventListener("scroll", update, { passive: true });
    addEventListener("resize", update);
    addEventListener("pointermove", pointer, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      removeEventListener("scroll", update);
      removeEventListener("resize", update);
      removeEventListener("pointermove", pointer);
    };
  }, []);

  const goTo = (id) => {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const selectArea = (index) => {
    const section = areasRef.current;
    if (!section) return;
    const travel = section.offsetHeight - innerHeight;
    scrollTo({ top: section.offsetTop + travel * (index / 3), behavior: "smooth" });
  };

  const submitContact = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const payload = Object.fromEntries(["name", "phone", "message", "website"].map((key) => [key, String(data.get(key) || "").trim()]));
    if (!payload.name || !payload.message) return;
    setContactStatus("sending");
    try {
      const response = await fetch("/api/contact", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(payload) });
      if (!response.ok) throw new Error("contact-api-unavailable");
      setContactStatus("success");
      form.reset();
    } catch {
      setContactStatus("fallback");
      const subject = encodeURIComponent(`Contato pelo site — ${payload.name}`);
      const body = encodeURIComponent(`Nome: ${payload.name}\nTelefone: ${payload.phone}\n\nMensagem:\n${payload.message}`);
      location.href = `mailto:renandurso@aasp.org.br?subject=${subject}&body=${body}`;
    }
  };

  return (
    <main className="site-shell">
      <div className="page-progress" aria-hidden="true" />
      <header className={`site-header ${headerSolid ? "solid" : ""}`}>
        <button className="wordmark" onClick={() => goTo("inicio")} aria-label="Voltar ao início">
          <strong>RD</strong><span>Renan Durso<small>Direito Médico e da Saúde</small></span>
        </button>
        <nav className="desktop-nav" aria-label="Navegação principal">
          <button onClick={() => goTo("construcao")}>A construção</button>
          <button onClick={() => goTo("atuacao")}>Atuação</button>
          <button onClick={() => goTo("sobre")}>Sobre</button>
          <button className="nav-contact" onClick={() => goTo("contato")}>Contato <ArrowUpRight size={13} /></button>
        </nav>
        <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}>{menuOpen ? <X /> : <Menu />}</button>
        <div className={`mobile-nav ${menuOpen ? "open" : ""}`}>
          {[['inicio','Início'],['construcao','A construção'],['atuacao','Atuação'],['sobre','Sobre'],['contato','Contato']].map(([id,label]) => <button key={id} onClick={() => goTo(id)}>{label}</button>)}
        </div>
      </header>

      <section id="inicio" className="hero-scroll" data-scene>
        <div className="sticky hero">
          <div className="hero-index">01 — 06</div>
          <div className="hero-portrait"><Portrait alt="Retrato de Renan Durso" /><i aria-hidden="true" /></div>
          <div className="hero-name hero-name-back" aria-hidden="true"><span>RENAN</span><span>DURSO</span></div>
          <h1 className="hero-name hero-name-front"><span>RENAN</span><span>DURSO</span></h1>
          <div className="hero-intro">
            <p>Advocacia · Direito Médico e da Saúde</p>
            <button onClick={() => goTo("contato")}>Falar com Renan Durso <ArrowUpRight size={15} /></button>
          </div>
          <p className="hero-thesis">Estratégia jurídica para situações em que tratamento, cuidado, cobertura e tempo precisam ser analisados com precisão.</p>
          <button className="scroll-cue" onClick={() => goTo("construcao")} aria-label="Ir para a construção da defesa"><span>Descobrir</span><ArrowDown size={15} /></button>
        </div>
      </section>

      <section id="construcao" ref={anatomyRef} className="anatomy-scroll">
        <div className="sticky anatomy-scene">
          <div className="scene-heading">
            <p>02 / A construção da defesa</p>
            <h2>Precisão,<br/><em>camada por camada.</em></h2>
            <div className="scene-copy">A estratégia jurídica, como a alfaiataria, começa pela leitura precisa da estrutura. Cada camada responde a um contexto. O resultado é construído sob medida.</div>
          </div>
          <div className="anatomy-visual"><TailoringAssembly step={anatomyStep} /></div>
          <div className="anatomy-word" aria-hidden="true">ESTRATÉGIA</div>
        </div>
      </section>

      <section className="editorial-bridge">
        <p>Saúde · Direito · Urgência · Proteção</p>
        <h2>Cada caso tem uma história.<br/><em>Cada estratégia precisa entender o contexto.</em></h2>
      </section>

      <section id="atuacao" ref={areasRef} className="areas-scroll">
        <div className="sticky areas-scene">
          <div className="areas-kicker">03 / Áreas de atuação</div>
          <div className="area-images">
            {practiceAreas.map((area, index) => <figure key={area.title} className={index === activeArea ? "active" : ""}><img src={area.image} alt="" loading="eager" /><i /></figure>)}
          </div>
          <div className="area-content">
            {practiceAreas.map((area, index) => (
              <article key={area.title} className={index === activeArea ? "active" : ""}>
                <span>{area.number}</span><h2>{area.title}</h2><strong>{area.short}</strong><p>{area.description}</p>
                <button onClick={() => goTo("contato")}>Falar sobre este caso <ArrowUpRight size={15} /></button>
              </article>
            ))}
          </div>
          <div className="area-tabs" aria-label="Selecionar área">
            {practiceAreas.map((area, index) => <button key={area.title} className={index === activeArea ? "active" : ""} onClick={() => selectArea(index)}><span>{area.number}</span>{area.title}</button>)}
          </div>
          <div className="area-counter">0{activeArea + 1}<span>/ 04</span></div>
        </div>
      </section>

      <section id="sobre" className="about-section" data-scene>
        <div className="about-label">04 / Sobre Renan</div>
        <figure><Portrait alt="Renan Durso" loading="lazy" /><figcaption>São Paulo — SP</figcaption></figure>
        <div className="about-copy">
          <p className="about-lead">Quando a saúde não pode esperar, clareza e estratégia orientam cada decisão.</p>
          <div className="about-body">
            <p>Atuação em Direito Médico e da Saúde, com análise individualizada de situações que envolvem tratamento, cuidado, cobertura e urgência.</p>
            <p>Documentos, prescrição, negativa e contexto são organizados em uma visão única antes da definição do caminho jurídico adequado.</p>
          </div>
          <dl><div><dt>01</dt><dd>Leitura do caso</dd></div><div><dt>02</dt><dd>Estratégia</dd></div><div><dt>03</dt><dd>Comunicação</dd></div></dl>
        </div>
      </section>

      <section className="manifesto-section">
        <p>05 / Princípio</p>
        <h2>Clareza antes<br/>da decisão.<br/><em>Estratégia antes da ação.</em></h2>
        <span>Direito Médico e da Saúde</span>
      </section>

      <section id="contato" className="contact-section">
        <div className="contact-heading">
          <p>06 / Contato</p>
          <h2>Fale com<br/><em>Renan Durso.</em></h2>
          <div className="contact-intro">Conte o que aconteceu. Organize os principais documentos e entre em contato para uma análise inicial do contexto.</div>
          <div className="contact-details"><a href="mailto:renandurso@aasp.org.br"><Mail size={16}/>renandurso@aasp.org.br</a><span><MapPin size={16}/>São Paulo — SP</span></div>
        </div>
        <form className="contact-form" onSubmit={submitContact}>
          <input className="honeypot" name="website" tabIndex="-1" autoComplete="off" aria-hidden="true" />
          <label><span>01</span> Nome<input name="name" required placeholder="Como podemos chamar você?" /></label>
          <label><span>02</span> Telefone<input name="phone" placeholder="(00) 00000-0000" /></label>
          <label><span>03</span> Conte brevemente o caso<textarea name="message" required rows="4" placeholder="Explique a situação em poucas linhas." /></label>
          <button type="submit" disabled={contactStatus === "sending"}>{contactStatus === "sending" ? "Enviando..." : "Enviar mensagem"}<ArrowUpRight size={17}/></button>
          <p className={`contact-status ${contactStatus}`} aria-live="polite">{contactStatus === "success" && "Mensagem enviada. O escritório poderá retornar pelos dados informados."}{contactStatus === "fallback" && "Abrimos seu aplicativo de e-mail para concluir o contato."}</p>
        </form>
        <footer><div><strong>RD</strong><span>Renan Durso<br/><small>Direito Médico e da Saúde</small></span></div><p>Conteúdo institucional de caráter informativo.</p><button onClick={() => goTo("inicio")}>Voltar ao topo <ArrowUpRight size={13}/></button></footer>
      </section>
    </main>
  );
}

export default App;