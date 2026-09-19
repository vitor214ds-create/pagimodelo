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
  "Colete",
  "Paletó",
  "Renan Durso",
];

const tailoringAssets = {
  anatomy: "/anatomia/anatomia.webp",
  shirt: "/anatomia/camisa.webp",
  tie: "/anatomia/gravata.webp",
  vest: "/anatomia/colete.webp",
  jacket: "/anatomia/paleto.avif",
};

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
    <div
      className="tailoring-assembly"
      aria-label="Montagem visual do traje do advogado"
    >
      <div className="assembly-grid" aria-hidden="true" />
      <div className="assembly-aura" aria-hidden="true" />
      <div className="assembly-floor" aria-hidden="true" />
      <div className="assembly-axis" aria-hidden="true" />

      <div className="assembly-stage">
        <img
          src={tailoringAssets.anatomy}
          alt=""
          className="assembly-piece assembly-anatomy"
          decoding="async"
          loading="eager"
        />

        <img
          src={tailoringAssets.shirt}
          alt=""
          className="assembly-piece assembly-shirt"
          decoding="async"
          loading="eager"
        />

        <img
          src={tailoringAssets.tie}
          alt=""
          className="assembly-piece assembly-tie"
          decoding="async"
          loading="eager"
        />

        <img
          src={tailoringAssets.vest}
          alt=""
          className="assembly-piece assembly-vest"
          decoding="async"
          loading="eager"
        />

        <div className="assembly-piece assembly-jacket assembly-jacket-left">
          <img
            src={tailoringAssets.jacket}
            alt=""
            decoding="async"
            loading="eager"
          />
        </div>

        <div className="assembly-piece assembly-jacket assembly-jacket-right">
          <img
            src={tailoringAssets.jacket}
            alt=""
            decoding="async"
            loading="eager"
          />
        </div>

        <div className="assembly-final-renan">
          <div className="assembly-renan-halo" aria-hidden="true" />
          <PortraitImage alt="Renan Durso" />
          <div className="assembly-renan-light" aria-hidden="true" />
          <div className="assembly-renan-rim" aria-hidden="true" />
        </div>

        <div className="assembly-scan" aria-hidden="true" />
      </div>

      <div className="assembly-stage-label" aria-hidden="true">
        <span>0{Math.min(step + 1, 6)}</span>
        <strong>{anatomyLabels[step]}</strong>
      </div>

      <div className="assembly-timeline" aria-hidden="true">
        {anatomyLabels.map((label, index) => (
          <i
            key={label}
            className={index <= step ? "active" : ""}
          />
        ))}
      </div>
    </div>
  );
}

function sampleAreaShape(draw, count) {
  const canvas = document.createElement("canvas");
  canvas.width = 420;
  canvas.height = 420;
  const context = canvas.getContext("2d");
  if (!context) return Array.from({ length: count }, () => [0, 0]);

  context.clearRect(0, 0, 420, 420);
  context.strokeStyle = "#fff";
  context.fillStyle = "#fff";
  context.lineWidth = 20;
  context.lineCap = "round";
  context.lineJoin = "round";
  draw(context);

  const data = context.getImageData(0, 0, 420, 420).data;
  const points = [];
  for (let y = 0; y < 420; y += 3) {
    for (let x = 0; x < 420; x += 3) {
      if (data[(y * 420 + x) * 4 + 3] > 24) {
        points.push([x - 210, y - 210]);
      }
    }
  }

  if (!points.length) return Array.from({ length: count }, () => [0, 0]);

  return Array.from({ length: count }, (_, index) => {
    const point = points[Math.floor((index / count) * points.length) % points.length];
    return [point[0], point[1]];
  });
}

function buildAreaTargets(count) {
  const home = sampleAreaShape((ctx) => {
    ctx.beginPath();
    ctx.moveTo(80, 210);
    ctx.lineTo(210, 95);
    ctx.lineTo(340, 210);
    ctx.lineTo(340, 335);
    ctx.lineTo(80, 335);
    ctx.closePath();
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(210, 274);
    ctx.bezierCurveTo(166, 228, 126, 260, 210, 345);
    ctx.bezierCurveTo(294, 260, 254, 228, 210, 274);
    ctx.stroke();
  }, count);

  const medicine = sampleAreaShape((ctx) => {
    ctx.save();
    ctx.translate(210, 210);
    ctx.rotate(-Math.PI / 4);

    const left = -105;
    const right = 105;
    const radius = 48;

    ctx.beginPath();
    ctx.moveTo(left + radius, -radius);
    ctx.lineTo(right - radius, -radius);
    ctx.arc(right - radius, 0, radius, -Math.PI / 2, Math.PI / 2);
    ctx.lineTo(left + radius, radius);
    ctx.arc(left + radius, 0, radius, Math.PI / 2, Math.PI * 1.5);
    ctx.closePath();
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, -radius);
    ctx.lineTo(0, radius);
    ctx.stroke();

    ctx.restore();
  }, count);

  const oncology = sampleAreaShape((ctx) => {
    ctx.beginPath();
    ctx.moveTo(205, 82);
    ctx.bezierCurveTo(135, 105, 140, 190, 194, 230);
    ctx.bezierCurveTo(236, 260, 265, 318, 294, 353);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(222, 83);
    ctx.bezierCurveTo(286, 122, 276, 190, 226, 232);
    ctx.bezierCurveTo(190, 262, 162, 318, 138, 352);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(194, 230);
    ctx.lineTo(226, 232);
    ctx.stroke();
  }, count);

  const surgery = sampleAreaShape((ctx) => {
    ctx.strokeRect(175, 82, 70, 256);
    ctx.strokeRect(82, 175, 256, 70);
    ctx.beginPath();
    ctx.arc(210, 210, 150, 0, Math.PI * 2);
    ctx.stroke();
  }, count);

  return [home, medicine, oncology, surgery];
}

function AreaParticles({ activeArea }) {
  const canvasRef = useRef(null);
  const activeRef = useRef(activeArea);

  useEffect(() => {
    activeRef.current = activeArea;
  }, [activeArea]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    let raf = 0;
    let width = 1;
    let height = 1;
    let dpr = 1;
    let count = 300;
    let particles = [];
    let targets = [];
    let previousTargetIndex = 0;
    let targetIndex = activeRef.current;
    let morph = 1;

    const seed = (index) => {
      const value = Math.sin(index * 912.77 + 43.21) * 43758.5453;
      return value - Math.floor(value);
    };

    const configure = () => {
      const rect = canvas.parentElement?.getBoundingClientRect();
      width = Math.max(rect?.width || canvas.clientWidth || 1, 1);
      height = Math.max(rect?.height || canvas.clientHeight || 1, 1);
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      count = width < 640 ? 190 : 340;

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);

      targets = buildAreaTargets(count);
      particles = Array.from({ length: count }, (_, index) => ({
        x: (seed(index + 20) - .5) * width * .55,
        y: (seed(index + 90) - .5) * height * .55,
        vx: 0,
        vy: 0,
        size: .85 + seed(index + 150) * 1.85,
        phase: seed(index + 230) * Math.PI * 2,
        alpha: .34 + seed(index + 320) * .5,
      }));

      previousTargetIndex = activeRef.current;
      targetIndex = activeRef.current;
      morph = 1;
    };

    const observer = new ResizeObserver(configure);
    if (canvas.parentElement) observer.observe(canvas.parentElement);

    const render = (time) => {
      const requestedTarget = activeRef.current;
      if (requestedTarget !== targetIndex) {
        previousTargetIndex = targetIndex;
        targetIndex = requestedTarget;
        morph = 0;
      }

      morph = Math.min(1, morph + .028);
      const easedMorph = morph * morph * (3 - 2 * morph);

      context.clearRect(0, 0, width, height);

      const from = targets[previousTargetIndex] || targets[0] || [];
      const to = targets[targetIndex] || targets[0] || [];
      const scale = Math.min(width, height) / 455;
      const centerX = width * .5;
      const centerY = height * .49;

      particles.forEach((particle, index) => {
        const fromPoint = from[index % Math.max(from.length, 1)] || [0, 0];
        const toPoint = to[index % Math.max(to.length, 1)] || [0, 0];

        const pointX =
          fromPoint[0] + (toPoint[0] - fromPoint[0]) * easedMorph;
        const pointY =
          fromPoint[1] + (toPoint[1] - fromPoint[1]) * easedMorph;

        const targetX =
          pointX * scale + Math.cos(time * .001 + particle.phase) * 1.8;
        const targetY =
          pointY * scale + Math.sin(time * .0011 + particle.phase) * 1.8;

        particle.vx += (targetX - particle.x) * .03;
        particle.vy += (targetY - particle.y) * .03;
        particle.vx *= .83;
        particle.vy *= .83;
        particle.x += particle.vx;
        particle.y += particle.vy;

        const white = index % 10 === 0;
        context.beginPath();
        context.fillStyle = white
          ? `rgba(255,255,255,${particle.alpha * .86})`
          : `rgba(229,198,142,${particle.alpha})`;
        context.shadowBlur = 8 + particle.size * 2.8;
        context.shadowColor = white
          ? "rgba(255,255,255,.32)"
          : "rgba(229,198,142,.58)";
        context.arc(
          centerX + particle.x,
          centerY + particle.y,
          particle.size,
          0,
          Math.PI * 2,
        );
        context.fill();
      });

      context.shadowBlur = 0;
      raf = requestAnimationFrame(render);
    };

    configure();
    raf = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="area-particles-canvas"
      aria-hidden="true"
    />
  );
}


function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeArea, setActiveArea] = useState(0);
  const [anatomyStep, setAnatomyStep] = useState(0);
  const [contactStatus, setContactStatus] = useState("idle");
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
          anatomyRef.current.style.setProperty("--shirt", String(range(p, 0.14, 0.28)));
          anatomyRef.current.style.setProperty("--tie", String(range(p, 0.28, 0.40)));
          anatomyRef.current.style.setProperty("--vest", String(range(p, 0.40, 0.54)));
          anatomyRef.current.style.setProperty("--jacket", String(range(p, 0.54, 0.70)));
          anatomyRef.current.style.setProperty("--complete", String(range(p, 0.70, 0.79)));
          anatomyRef.current.style.setProperty("--portrait", String(range(p, 0.79, 0.91)));
          anatomyRef.current.style.setProperty("--split", String(range(p, 0.91, 1)));

          const nextStep =
            p < 0.14 ? 0 :
            p < 0.28 ? 1 :
            p < 0.40 ? 2 :
            p < 0.54 ? 3 :
            p < 0.79 ? 4 : 5;

          anatomyRef.current.style.setProperty("--mobile-stage", String(nextStep));
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

  const submitContact = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const payload = {
      name: String(data.get("name") || "").trim(),
      phone: String(data.get("phone") || "").trim(),
      message: String(data.get("message") || "").trim(),
      website: String(data.get("website") || "").trim(),
    };

    if (!payload.name || !payload.message) return;

    setContactStatus("sending");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("contact-api-unavailable");

      setContactStatus("success");
      form.reset();
    } catch {
      setContactStatus("fallback");
      const subject = encodeURIComponent(`Contato pelo site — ${payload.name}`);
      const body = encodeURIComponent(
        `Nome: ${payload.name}\nTelefone: ${payload.phone}\n\nMensagem:\n${payload.message}`,
      );
      window.location.href = `mailto:renandurso@aasp.org.br?subject=${subject}&body=${body}`;
    }
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
              A construção visual acompanha a lógica da alfaiataria: primeiro a
              estrutura, depois cada camada do traje e, por fim, a presença real
              do advogado — com foco, sofisticação e autoridade.
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

          <div className={`anatomy-visual anatomy-step-${anatomyStep}`}>
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
            <div className="area-particles-layer" aria-hidden="true">
              <AreaParticles activeArea={activeArea} />
            </div>
            <div className="area-image-frame">
              {practiceAreas.map((area, index) => (
                <figure
                  key={area.title}
                  className={`area-image ${index === activeArea ? "active" : ""}`}
                >
                  <img src={area.image} alt="" loading="eager" />
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
          <input
            className="contact-honeypot"
            name="website"
            tabIndex="-1"
            autoComplete="off"
            aria-hidden="true"
          />
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
          <button type="submit" disabled={contactStatus === "sending"}>
            {contactStatus === "sending" ? "Enviando..." : "Enviar mensagem"}
            <ArrowUpRight size={16} />
          </button>
          <p className={`contact-status ${contactStatus}`} aria-live="polite">
            {contactStatus === "success" &&
              "Mensagem enviada. O escritório poderá retornar pelos dados informados."}
            {contactStatus === "fallback" &&
              "Abrimos seu aplicativo de e-mail para concluir o contato."}
          </p>
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
