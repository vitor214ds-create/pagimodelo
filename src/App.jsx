import {
  Activity,
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  HeartPulse,
  Mail,
  MapPin,
  Menu,
  Scale,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  X,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

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
    icon: HeartPulse,
    image:
      "https://images.pexels.com/photos/7659685/pexels-photo-7659685.jpeg?auto=compress&cs=tinysrgb&w=1600",
  },
  {
    number: "02",
    title: "Medicamentos",
    short: "Acesso ao tratamento prescrito.",
    description:
      "Medidas relacionadas a medicamentos de alto custo, uso contínuo, importados e negativas de cobertura.",
    icon: Stethoscope,
    image:
      "https://images.pexels.com/photos/4989187/pexels-photo-4989187.jpeg?auto=compress&cs=tinysrgb&w=1600",
  },
  {
    number: "03",
    title: "Oncologia",
    short: "Tempo importa quando o tratamento é urgente.",
    description:
      "Atuação em negativas envolvendo quimioterapia, imunoterapia, radioterapia e tratamentos indispensáveis.",
    icon: Activity,
    image:
      "https://images.pexels.com/photos/7659870/pexels-photo-7659870.jpeg?auto=compress&cs=tinysrgb&w=1600",
  },
  {
    number: "04",
    title: "Cirurgias e terapias",
    short: "Proteção jurídica diante da negativa.",
    description:
      "Análise de negativas de cirurgias, exames, próteses, terapias multidisciplinares e outros procedimentos.",
    icon: ShieldCheck,
    image:
      "https://images.pexels.com/photos/28736007/pexels-photo-28736007.jpeg?auto=compress&cs=tinysrgb&w=1600",
  },
];

const anatomyLabels = [
  "Estrutura",
  "Camisa",
  "Gravata",
  "Paletó",
  "Advogado",
  "Renan Durso",
];

function clamp(value, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value));
}

function range(value, start, end) {
  return clamp((value - start) / Math.max(end - start, 0.0001));
}

function PortraitImage({ alt = "", className = "" }) {
  return (
    <img
      src={portraitUrl}
      alt={alt}
      className={className}
      loading="eager"
      decoding="async"
      fetchPriority="high"
      onError={(event) => {
        const image = event.currentTarget;
        if (!image.src.includes("RENAN_DURSO_PEREIRA")) {
          image.src = portraitFallbackUrl;
        }
      }}
    />
  );
}

function AnatomyFigure({ step }) {
  return (
    <div className="anatomy-figure" aria-label="Animação de montagem de um advogado">
      <div className="anatomy-aura" aria-hidden="true" />
      <div className="anatomy-floor" aria-hidden="true" />

      <svg className="anatomy-linework" viewBox="0 0 500 760" aria-hidden="true">
        <defs>
          <linearGradient id="bodyLine" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#f1dec0" />
            <stop offset="100%" stopColor="#9d7a46" />
          </linearGradient>
        </defs>
        <ellipse cx="250" cy="112" rx="66" ry="82" />
        <path d="M212 178 C206 205 196 224 179 240" />
        <path d="M288 178 C294 205 304 224 321 240" />
        <path d="M179 240 C132 268 110 332 105 432" />
        <path d="M321 240 C368 268 390 332 395 432" />
        <path d="M179 240 C196 296 205 357 204 455" />
        <path d="M321 240 C304 296 295 357 296 455" />
        <path d="M204 455 C198 526 184 600 174 704" />
        <path d="M296 455 C302 526 316 600 326 704" />
        <path d="M105 432 C110 520 119 606 128 686" />
        <path d="M395 432 C390 520 381 606 372 686" />
        <path d="M204 455 C229 472 271 472 296 455" />
        <path d="M225 246 L225 445" />
        <path d="M275 246 L275 445" />
        <path d="M196 282 C225 298 275 298 304 282" />
        <path d="M190 322 C226 340 274 340 310 322" />
        <path d="M188 364 C226 383 274 383 312 364" />
        <path d="M190 407 C226 424 274 424 310 407" />
        <path d="M250 194 L250 466" />
      </svg>

      <svg className="wardrobe wardrobe-shirt" viewBox="0 0 500 760" aria-hidden="true">
        <path
          d="M188 226 L222 200 L250 222 L278 200 L312 226 L344 270 L316 300 L300 474 L200 474 L184 300 L156 270 Z"
          fill="#f1eee7"
        />
        <path d="M222 200 L250 246 L278 200" fill="#d8d1c5" />
        <path d="M250 246 L250 466" stroke="#c7beb0" strokeWidth="3" />
        <circle cx="250" cy="286" r="3" fill="#a89f92" />
        <circle cx="250" cy="326" r="3" fill="#a89f92" />
        <circle cx="250" cy="366" r="3" fill="#a89f92" />
        <circle cx="250" cy="406" r="3" fill="#a89f92" />
      </svg>

      <svg className="wardrobe wardrobe-tie" viewBox="0 0 500 760" aria-hidden="true">
        <path d="M236 232 L264 232 L270 256 L250 284 L230 256 Z" fill="#171c22" />
        <path d="M250 282 L270 426 L250 464 L230 426 Z" fill="#11161c" />
        <path d="M238 236 L250 248 L262 236" stroke="#c8a66e" strokeWidth="2" />
      </svg>

      <svg className="wardrobe wardrobe-jacket wardrobe-left" viewBox="0 0 500 760" aria-hidden="true">
        <path
          d="M166 238 L220 208 L250 248 L236 300 L214 330 L198 484 L136 486 L124 316 Z"
          fill="#111820"
        />
        <path d="M220 208 L250 248 L222 346 L190 288 Z" fill="#202934" />
        <path d="M174 354 L214 354" stroke="#c5a36a" strokeWidth="3" />
      </svg>

      <svg className="wardrobe wardrobe-jacket wardrobe-right" viewBox="0 0 500 760" aria-hidden="true">
        <path
          d="M334 238 L280 208 L250 248 L264 300 L286 330 L302 484 L364 486 L376 316 Z"
          fill="#111820"
        />
        <path d="M280 208 L250 248 L278 346 L310 288 Z" fill="#202934" />
        <path d="M286 354 L326 354" stroke="#c5a36a" strokeWidth="3" />
      </svg>

      <div className="wardrobe-cuff wardrobe-cuff-left" aria-hidden="true" />
      <div className="wardrobe-cuff wardrobe-cuff-right" aria-hidden="true" />
      <div className="wardrobe-pocket-square" aria-hidden="true" />

      <div className="renan-final">
        <PortraitImage alt="Renan Durso" />
        <div className="renan-final-light" aria-hidden="true" />
      </div>

      <div className="renan-triptych" aria-hidden="true">
        <div className="renan-slice renan-slice-left">
          <PortraitImage />
        </div>
        <div className="renan-slice renan-slice-center">
          <PortraitImage />
        </div>
        <div className="renan-slice renan-slice-right">
          <PortraitImage />
        </div>
      </div>

      <div className="anatomy-phase" aria-hidden="true">
        <span>0{Math.min(step + 1, 6)}</span>
        <strong>{anatomyLabels[step]}</strong>
      </div>
    </div>
  );
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeArea, setActiveArea] = useState(0);
  const [anatomyStep, setAnatomyStep] = useState(0);
  const anatomyRef = useRef(null);
  const areasRef = useRef(null);

  const dust = useMemo(
    () => Array.from({ length: 28 }, (_, index) => index),
    [],
  );

  useEffect(() => {
    let raf = 0;

    const update = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const root = document.documentElement;
        const scrollRange = Math.max(
          document.documentElement.scrollHeight - window.innerHeight,
          1,
        );
        root.style.setProperty("--page-progress", String(window.scrollY / scrollRange));

        document.querySelectorAll("[data-scroll-scene]").forEach((element) => {
          const rect = element.getBoundingClientRect();
          const travel = Math.max(element.offsetHeight - window.innerHeight, 1);
          const progress = clamp(-rect.top / travel);
          element.style.setProperty("--progress", String(progress));
        });

        if (anatomyRef.current) {
          const rect = anatomyRef.current.getBoundingClientRect();
          const travel = Math.max(anatomyRef.current.offsetHeight - window.innerHeight, 1);
          const p = clamp(-rect.top / travel);

          anatomyRef.current.style.setProperty("--anatomy", String(range(p, 0.03, 0.14)));
          anatomyRef.current.style.setProperty("--shirt", String(range(p, 0.14, 0.3)));
          anatomyRef.current.style.setProperty("--tie", String(range(p, 0.3, 0.42)));
          anatomyRef.current.style.setProperty("--jacket", String(range(p, 0.42, 0.62)));
          anatomyRef.current.style.setProperty("--complete", String(range(p, 0.62, 0.72)));
          anatomyRef.current.style.setProperty("--portrait", String(range(p, 0.72, 0.86)));
          anatomyRef.current.style.setProperty("--split", String(range(p, 0.86, 1)));

          const nextStep =
            p < 0.14 ? 0 :
            p < 0.3 ? 1 :
            p < 0.42 ? 2 :
            p < 0.62 ? 3 :
            p < 0.78 ? 4 : 5;

          setAnatomyStep((current) => (current === nextStep ? current : nextStep));
        }

        if (areasRef.current) {
          const rect = areasRef.current.getBoundingClientRect();
          const travel = Math.max(areasRef.current.offsetHeight - window.innerHeight, 1);
          const p = clamp(-rect.top / travel);
          const nextArea = Math.min(3, Math.floor(p * 4.001));
          setActiveArea((current) => (current === nextArea ? current : nextArea));
          areasRef.current.style.setProperty("--area-progress", String(p));
        }
      });
    };

    const pointer = (event) => {
      document.documentElement.style.setProperty("--pointer-x", `${event.clientX}px`);
      document.documentElement.style.setProperty("--pointer-y", `${event.clientY}px`);
      document.documentElement.style.setProperty(
        "--pointer-nx",
        String(event.clientX / window.innerWidth - 0.5),
      );
      document.documentElement.style.setProperty(
        "--pointer-ny",
        String(event.clientY / window.innerHeight - 0.5),
      );
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    window.addEventListener("pointermove", pointer, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      window.removeEventListener("pointermove", pointer);
    };
  }, []);

  const goTo = (id) => {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const submitContact = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = data.get("name") || "";
    const phone = data.get("phone") || "";
    const message = data.get("message") || "";
    const subject = encodeURIComponent(`Contato pelo site — ${name}`);
    const body = encodeURIComponent(
      `Nome: ${name}\nTelefone: ${phone}\n\nMensagem:\n${message}`,
    );
    window.location.href = `mailto:renandurso@aasp.org.br?subject=${subject}&body=${body}`;
  };

  return (
    <main className="site-shell">
      <div className="page-progress" aria-hidden="true" />
      <div className="cursor-glow" aria-hidden="true" />

      <div className="ambient-dust" aria-hidden="true">
        {dust.map((item) => (
          <i key={item} style={{ "--dust": item }} />
        ))}
      </div>

      <header className="site-header">
        <button className="brand" onClick={() => goTo("inicio")}>
          <span className="brand-seal">RD</span>
          <span className="brand-copy">
            <strong>Renan Durso</strong>
            <small>Direito Médico e da Saúde</small>
          </span>
        </button>

        <nav className="desktop-nav">
          <button onClick={() => goTo("anatomia")}>Experiência</button>
          <button onClick={() => goTo("atuacao")}>Atuação</button>
          <button onClick={() => goTo("contato")}>Contato</button>
          <button className="nav-cta" onClick={() => goTo("contato")}>
            Falar com o escritório <ArrowUpRight size={14} />
          </button>
        </nav>

        <button
          className="mobile-menu"
          onClick={() => setMenuOpen((value) => !value)}
          aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
        >
          {menuOpen ? <X /> : <Menu />}
        </button>

        <div className={`mobile-drawer ${menuOpen ? "open" : ""}`}>
          <button onClick={() => goTo("inicio")}>Início</button>
          <button onClick={() => goTo("anatomia")}>Experiência</button>
          <button onClick={() => goTo("atuacao")}>Atuação</button>
          <button onClick={() => goTo("contato")}>Contato</button>
        </div>
      </header>

      <section
        id="inicio"
        className="hero-scroll"
        data-scroll-scene
      >
        <div className="sticky hero">
          <div className="hero-grid" aria-hidden="true" />
          <div className="hero-beam hero-beam-one" aria-hidden="true" />
          <div className="hero-beam hero-beam-two" aria-hidden="true" />
          <div className="hero-orbit" aria-hidden="true" />
          <div className="hero-backword" aria-hidden="true">HEALTH / LAW</div>

          <div className="hero-copy">
            <p className="eyebrow">
              <span />
              Direito médico e da saúde
            </p>

            <h1>
              <span>Quando a saúde</span>
              <em>não pode esperar.</em>
            </h1>

            <p className="hero-lead">
              Estratégia jurídica para situações em que tratamento, cuidado,
              cobertura e tempo precisam ser analisados com precisão.
            </p>

            <div className="hero-actions">
              <button onClick={() => goTo("contato")}>
                Falar com o escritório <ArrowRight size={16} />
              </button>
              <button className="ghost-button" onClick={() => goTo("anatomia")}>
                Conhecer a atuação <ArrowDown size={16} />
              </button>
            </div>

            <div className="hero-meta">
              <span>Direito da Saúde</span>
              <span>Atuação estratégica</span>
              <span>Atendimento individualizado</span>
            </div>
          </div>

          <div className="hero-portrait">
            <div className="hero-portrait-back" aria-hidden="true" />
            <PortraitImage alt="Renan Durso" />
            <div className="hero-portrait-shine" aria-hidden="true" />
            <div className="hero-name">
              <small>ADVOCACIA</small>
              <strong>RENAN DURSO</strong>
            </div>
          </div>

          <div className="hero-scroll-note">
            <span>Role para explorar</span>
            <i />
          </div>
        </div>
      </section>

      <section
        id="anatomia"
        ref={anatomyRef}
        className="anatomy-scroll"
      >
        <div className="sticky anatomy-stage">
          <div className="anatomy-copy">
            <p className="eyebrow light">
              <span />
              A anatomia da advocacia
            </p>
            <h2>
              Presença.
              <em>Estratégia.</em>
            </h2>
            <p>
              Uma construção visual inspirada na lógica dos vídeos de referência:
              estrutura, traje, presença e, no final, o advogado real.
            </p>

            <div className="anatomy-steps">
              {anatomyLabels.map((label, index) => (
                <span
                  key={label}
                  className={index === anatomyStep ? "active" : ""}
                >
                  0{index + 1} — {label}
                </span>
              ))}
            </div>
          </div>

          <div className="anatomy-visual">
            <AnatomyFigure step={anatomyStep} />
          </div>

          <div className="anatomy-sideword" aria-hidden="true">
            COUNSEL
          </div>
        </div>
      </section>

      <section className="statement-section">
        <div className="statement-line">
          <span>Saúde</span>
          <i />
          <span>Direito</span>
          <i />
          <span>Urgência</span>
          <i />
          <span>Proteção</span>
        </div>
        <h2>
          Cada caso tem uma história.
          <em>Cada estratégia precisa entender o contexto.</em>
        </h2>
      </section>

      <section
        id="atuacao"
        ref={areasRef}
        className="areas-scroll"
      >
        <div className="sticky areas-stage">
          <div className="areas-copy">
            <p className="eyebrow">
              <span />
              Áreas de atuação
            </p>

            <div className="area-text-stack">
              {practiceAreas.map((area, index) => {
                const Icon = area.icon;
                return (
                  <article
                    key={area.title}
                    className={`area-text ${index === activeArea ? "active" : ""}`}
                  >
                    <span className="area-number">{area.number}</span>
                    <Icon size={24} />
                    <h2>{area.title}</h2>
                    <strong>{area.short}</strong>
                    <p>{area.description}</p>
                    <button onClick={() => goTo("contato")}>
                      Falar sobre este caso <ArrowUpRight size={15} />
                    </button>
                  </article>
                );
              })}
            </div>

            <div className="area-progress">
              {practiceAreas.map((area, index) => (
                <button
                  key={area.title}
                  className={index === activeArea ? "active" : ""}
                  onClick={() => {
                    const section = areasRef.current;
                    if (!section) return;
                    const target =
                      section.offsetTop +
                      ((section.offsetHeight - window.innerHeight) * index) / 3;
                    window.scrollTo({ top: target, behavior: "smooth" });
                  }}
                  aria-label={`Ver ${area.title}`}
                />
              ))}
            </div>
          </div>

          <div className="area-visual">
            <div className="area-image-frame">
              {practiceAreas.map((area, index) => (
                <figure
                  key={area.title}
                  className={`area-image ${index === activeArea ? "active" : ""}`}
                >
                  <img src={area.image} alt="" loading="lazy" />
                  <figcaption>
                    <span>{area.number}</span>
                    <strong>{area.title}</strong>
                  </figcaption>
                </figure>
              ))}
              <div className="area-image-grid" aria-hidden="true" />
              <div className="area-image-scan" aria-hidden="true" />
            </div>

            <div className="area-orbit orbit-a" aria-hidden="true" />
            <div className="area-orbit orbit-b" aria-hidden="true" />
          </div>
        </div>
      </section>

      <section className="method-section">
        <div className="method-heading">
          <p className="eyebrow">
            <span />
            Método
          </p>
          <h2>
            Clareza antes da decisão.
            <em>Estratégia antes da ação.</em>
          </h2>
        </div>

        <div className="method-grid">
          {[
            ["01", "Leitura do caso", "Documentos, prescrição, urgência e negativa organizados em uma visão única."],
            ["02", "Estratégia", "Definição do caminho jurídico adequado ao contexto e ao objetivo do paciente."],
            ["03", "Comunicação", "Próximos passos explicados com linguagem clara e acompanhamento objetivo."],
          ].map(([number, title, copy]) => (
            <article key={number}>
              <span>{number}</span>
              <h3>{title}</h3>
              <p>{copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="contato" className="contact-section">
        <div className="contact-background" aria-hidden="true">
          <div />
          <div />
        </div>

        <div className="contact-copy">
          <p className="eyebrow light">
            <span />
            Contato
          </p>
          <h2>
            Quando o cuidado é urgente,
            <em>a informação precisa ser clara.</em>
          </h2>
          <p>
            Conte o que aconteceu. Organize os principais documentos e entre em
            contato para uma análise inicial do contexto.
          </p>

          <div className="contact-info">
            <div>
              <Mail size={17} />
              <a href="mailto:renandurso@aasp.org.br">renandurso@aasp.org.br</a>
            </div>
            <div>
              <MapPin size={17} />
              <span>São Paulo — SP</span>
            </div>
            <div>
              <Scale size={17} />
              <span>Direito Médico e da Saúde</span>
            </div>
          </div>
        </div>

        <form className="contact-form" onSubmit={submitContact}>
          <div className="form-kicker">
            <Sparkles size={16} />
            Iniciar uma conversa
          </div>
          <label>
            Nome
            <input name="name" required placeholder="Como podemos chamar você?" />
          </label>
          <label>
            Telefone
            <input name="phone" placeholder="(00) 00000-0000" />
          </label>
          <label>
            Conte brevemente o caso
            <textarea
              name="message"
              required
              rows="5"
              placeholder="Explique a situação em poucas linhas."
            />
          </label>
          <button type="submit">
            Enviar mensagem <ArrowUpRight size={16} />
          </button>
        </form>

        <footer className="site-footer">
          <div className="brand footer-brand">
            <span className="brand-seal">RD</span>
            <span className="brand-copy">
              <strong>Renan Durso</strong>
              <small>Direito Médico e da Saúde</small>
            </span>
          </div>
          <p>Conteúdo institucional de caráter informativo.</p>
          <button onClick={() => goTo("inicio")}>
            Voltar ao topo <ArrowUpRight size={14} />
          </button>
        </footer>
      </section>
    </main>
  );
}

export default App;
