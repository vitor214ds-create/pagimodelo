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
      "https://images.pexels.com/photos/7659685/pexels-photo-7659685.jpeg?auto=compress&cs=tinysrgb&w=1800",
  },
  {
    number: "02",
    title: "Medicamentos",
    short: "Acesso ao tratamento prescrito.",
    description:
      "Medidas relacionadas a medicamentos de alto custo, uso contínuo, importados e negativas de cobertura.",
    icon: Stethoscope,
    image:
      "https://images.pexels.com/photos/4989187/pexels-photo-4989187.jpeg?auto=compress&cs=tinysrgb&w=1800",
  },
  {
    number: "03",
    title: "Oncologia",
    short: "Tempo importa quando o tratamento é urgente.",
    description:
      "Atuação em negativas envolvendo quimioterapia, imunoterapia, radioterapia e tratamentos indispensáveis.",
    icon: Activity,
    image:
      "https://images.pexels.com/photos/7659870/pexels-photo-7659870.jpeg?auto=compress&cs=tinysrgb&w=1800",
  },
  {
    number: "04",
    title: "Cirurgias e terapias",
    short: "Proteção jurídica diante da negativa.",
    description:
      "Análise de negativas de cirurgias, exames, próteses, terapias multidisciplinares e outros procedimentos.",
    icon: ShieldCheck,
    image:
      "https://images.pexels.com/photos/28736007/pexels-photo-28736007.jpeg?auto=compress&cs=tinysrgb&w=1800",
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

const tailoringVideoChunks = Array.from(
  { length: 31 },
  (_, index) => `/anatomia/video-${String(index).padStart(2, "0")}.txt`,
);

function clamp(value, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value));
}

function range(value, start, end) {
  return clamp((value - start) / Math.max(end - start, 0.0001));
}

function smooth(value) {
  const t = clamp(value);
  return t * t * (3 - 2 * t);
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

function TailoringSequence() {
  const videoRef = useRef(null);
  const rootRef = useRef(null);
  const [videoUrl, setVideoUrl] = useState("");

  useEffect(() => {
    let cancelled = false;
    let objectUrl = "";

    async function loadVideo() {
      try {
        const parts = await Promise.all(
          tailoringVideoChunks.map(async (url) => {
            const response = await fetch(url, { cache: "force-cache" });
            if (!response.ok) throw new Error(`video-${response.status}`);
            return response.text();
          }),
        );

        const base64 = parts.join("");
        if (base64.length !== 183016) {
          throw new Error(`video-incompleto-${base64.length}`);
        }

        const binary = atob(base64);
        const bytes = new Uint8Array(binary.length);
        for (let index = 0; index < binary.length; index += 1) {
          bytes[index] = binary.charCodeAt(index);
        }

        objectUrl = URL.createObjectURL(
          new Blob([bytes], { type: "video/mp4" }),
        );

        if (!cancelled) setVideoUrl(objectUrl);
      } catch (error) {
        console.error("Não foi possível carregar a animação de alfaiataria.", error);
      }
    }

    loadVideo();

    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    const root = rootRef.current;
    if (!video || !root || !videoUrl) return undefined;

    let raf = 0;
    let dead = false;
    let current = 0;

    const tick = () => {
      if (dead) return;

      const section = root.closest(".anatomy-scene");
      const progress = clamp(
        Number.parseFloat(
          getComputedStyle(section).getPropertyValue("--scene-progress") || "0",
        ),
      );

      if (video.readyState >= 1 && Number.isFinite(video.duration) && video.duration > 0) {
        const scrubProgress = smooth(range(progress, 0.02, 0.88));
        const target = scrubProgress * Math.max(video.duration - 0.035, 0);
        current += (target - current) * 0.26;

        if (Math.abs(video.currentTime - current) > 0.012) {
          video.currentTime = current;
        }
      }

      raf = requestAnimationFrame(tick);
    };

    const onLoaded = () => {
      video.pause();
      video.currentTime = 0;
      current = 0;
    };

    video.addEventListener("loadedmetadata", onLoaded);
    raf = requestAnimationFrame(tick);

    return () => {
      dead = true;
      cancelAnimationFrame(raf);
      video.removeEventListener("loadedmetadata", onLoaded);
    };
  }, [videoUrl]);

  return (
    <div ref={rootRef} className="tailoring-master">
      <video
        ref={videoRef}
        className="tailoring-video"
        src={videoUrl || undefined}
        muted
        playsInline
        preload="auto"
        aria-label="Animação contínua da construção do traje"
      />
      <div className="tailoring-rings" aria-hidden="true">
        <i />
        <i />
        <i />
      </div>
      <div className="tailoring-renan">
        <PortraitImage alt="Renan Durso" />
        <div className="renan-rim" />
      </div>
    </div>
  );
}

function createShape(index, count = 260) {
  const points = [];
  const addLine = (x1, y1, x2, y2, n) => {
    for (let i = 0; i < n; i += 1) {
      const t = n === 1 ? 0 : i / (n - 1);
      points.push([x1 + (x2 - x1) * t, y1 + (y2 - y1) * t]);
    }
  };

  if (index === 0) {
    addLine(0.5, 0.18, 0.5, 0.82, 120);
    addLine(0.27, 0.5, 0.73, 0.5, 100);
  } else if (index === 1) {
    const loops = 5;
    for (let loop = 0; loop < loops; loop += 1) {
      const radius = 0.13 + loop * 0.035;
      for (let i = 0; i < 44; i += 1) {
        const a = (Math.PI * 2 * i) / 44 + loop * 0.2;
        points.push([0.5 + Math.cos(a) * radius, 0.5 + Math.sin(a) * radius * 0.66]);
      }
    }
  } else if (index === 2) {
    for (let i = 0; i < 200; i += 1) {
      const t = i / 199;
      const x = 0.16 + t * 0.68;
      const pulse =
        Math.exp(-Math.pow((t - 0.38) * 17, 2)) * -0.19 +
        Math.exp(-Math.pow((t - 0.5) * 19, 2)) * 0.31 +
        Math.exp(-Math.pow((t - 0.61) * 18, 2)) * -0.12;
      points.push([x, 0.5 + pulse]);
    }
  } else {
    const polygon = [
      [0.5, 0.13],
      [0.76, 0.24],
      [0.73, 0.58],
      [0.5, 0.84],
      [0.27, 0.58],
      [0.24, 0.24],
      [0.5, 0.13],
    ];
    for (let p = 0; p < polygon.length - 1; p += 1) {
      addLine(...polygon[p], ...polygon[p + 1], 34);
    }
    addLine(0.38, 0.5, 0.47, 0.6, 28);
    addLine(0.47, 0.6, 0.65, 0.39, 42);
  }

  while (points.length < count) {
    const source = points[points.length % Math.max(points.length, 1)] || [0.5, 0.5];
    points.push(source);
  }
  return points.slice(0, count);
}

function AreaParticles() {
  const canvasRef = useRef(null);
  const shapes = useMemo(
    () => [0, 1, 2, 3].map((index) => createShape(index)),
    [],
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    let raf = 0;

    function render() {
      const section = canvas.closest(".areas-scene");
      if (!section) {
        raf = requestAnimationFrame(render);
        return;
      }

      const progress = clamp(
        Number.parseFloat(
          getComputedStyle(section).getPropertyValue("--scene-progress") || "0",
        ),
      );

      const scaled = progress * 4;
      const from = Math.min(3, Math.floor(scaled));
      const to = Math.min(3, from + 1);
      const local = smooth(scaled - Math.floor(scaled));

      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.round(rect.width * dpr));
      canvas.height = Math.max(1, Math.round(rect.height * dpr));
      const ctx = canvas.getContext("2d");
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, rect.width, rect.height);

      const a = shapes[from];
      const b = shapes[to];
      const size = Math.min(rect.width, rect.height) * 0.82;
      const ox = (rect.width - size) / 2;
      const oy = (rect.height - size) / 2;

      ctx.fillStyle = "rgba(226, 195, 141, .88)";
      ctx.shadowColor = "rgba(226, 195, 141, .42)";
      ctx.shadowBlur = 8;

      for (let i = 0; i < a.length; i += 1) {
        const x = a[i][0] + (b[i][0] - a[i][0]) * local;
        const y = a[i][1] + (b[i][1] - a[i][1]) * local;
        const wobble = Math.sin(i * 1.71 + progress * 18) * 0.8;
        ctx.beginPath();
        ctx.arc(ox + x * size + wobble, oy + y * size, 1.25, 0, Math.PI * 2);
        ctx.fill();
      }

      raf = requestAnimationFrame(render);
    }

    render();
    return () => cancelAnimationFrame(raf);
  }, [shapes]);

  return <canvas ref={canvasRef} className="area-particles" aria-hidden="true" />;
}

function App() {
  const heroRef = useRef(null);
  const anatomyRef = useRef(null);
  const areasRef = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [anatomyStep, setAnatomyStep] = useState(0);
  const [activeArea, setActiveArea] = useState(0);
  const [contactStatus, setContactStatus] = useState("idle");

  useEffect(() => {
    let raf = 0;

    function update() {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const scrollRange = Math.max(
          document.documentElement.scrollHeight - window.innerHeight,
          1,
        );
        document.documentElement.style.setProperty(
          "--page-progress",
          String(window.scrollY / scrollRange),
        );

        const scenes = [
          [heroRef.current, "hero"],
          [anatomyRef.current, "anatomy"],
          [areasRef.current, "areas"],
        ];

        scenes.forEach(([element, name]) => {
          if (!element) return;
          const rect = element.getBoundingClientRect();
          const travel = Math.max(element.offsetHeight - window.innerHeight, 1);
          const progress = clamp(-rect.top / travel);
          element.style.setProperty("--scene-progress", String(progress));

          if (name === "anatomy") {
            const step =
              progress < 0.12
                ? 0
                : progress < 0.36
                  ? 1
                  : progress < 0.51
                    ? 2
                    : progress < 0.70
                      ? 3
                      : progress < 0.90
                        ? 4
                        : 5;
            setAnatomyStep((current) => (current === step ? current : step));
            element.style.setProperty(
              "--portrait-progress",
              String(smooth(range(progress, 0.9, 0.98))),
            );
          }

          if (name === "areas") {
            const area = Math.min(3, Math.floor(progress * 4));
            setActiveArea((current) => (current === area ? current : area));
          }
        });
      });
    }

    function pointer(event) {
      document.documentElement.style.setProperty("--pointer-x", `${event.clientX}px`);
      document.documentElement.style.setProperty("--pointer-y", `${event.clientY}px`);
    }

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
    <main className="site">
      <div className="progress-bar" aria-hidden="true" />
      <div className="cursor-light" aria-hidden="true" />

      <header className="header">
        <button className="brand" onClick={() => goTo("inicio")}>
          <span className="brand-mark">RD</span>
          <span>
            <strong>Renan Durso</strong>
            <small>Direito Médico e da Saúde</small>
          </span>
        </button>

        <nav>
          <button onClick={() => goTo("anatomia")}>Experiência</button>
          <button onClick={() => goTo("atuacao")}>Atuação</button>
          <button onClick={() => goTo("contato")}>Contato</button>
          <button className="header-cta" onClick={() => goTo("contato")}>
            Falar com o escritório <ArrowUpRight size={14} />
          </button>
        </nav>

        <button
          className="menu-button"
          onClick={() => setMenuOpen((value) => !value)}
          aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
        >
          {menuOpen ? <X /> : <Menu />}
        </button>

        <div className={`mobile-nav ${menuOpen ? "open" : ""}`}>
          <button onClick={() => goTo("inicio")}>Início</button>
          <button onClick={() => goTo("anatomia")}>Experiência</button>
          <button onClick={() => goTo("atuacao")}>Atuação</button>
          <button onClick={() => goTo("contato")}>Contato</button>
        </div>
      </header>

      <section id="inicio" ref={heroRef} className="hero-scene scroll-scene">
        <div className="scene-sticky hero-stage">
          <div className="hero-grid" aria-hidden="true" />
          <div className="hero-copy">
            <p className="kicker"><i />Direito médico e da saúde</p>
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
              <button className="text-button" onClick={() => goTo("anatomia")}>
                Conhecer a atuação <ArrowDown size={15} />
              </button>
            </div>
          </div>

          <div className="hero-person">
            <div className="portrait-halo" />
            <PortraitImage alt="Renan Durso" />
            <div className="portrait-line" />
            <div className="portrait-caption">
              <small>ADVOCACIA</small>
              <strong>RENAN DURSO</strong>
            </div>
          </div>

          <div className="scroll-cue">
            <span>Role para explorar</span>
            <i />
          </div>
        </div>
      </section>

      <section id="anatomia" ref={anatomyRef} className="anatomy-scene scroll-scene">
        <div className="scene-sticky anatomy-stage">
          <div className="anatomy-copy">
            <p className="kicker light"><i />A anatomia da advocacia</p>
            <h2>
              Presença.
              <em>Estratégia.</em>
            </h2>
            <p>
              Como na alfaiataria, a construção é feita em camadas: estrutura,
              precisão e presença. Cada elemento ocupa seu lugar antes do próximo
              movimento começar.
            </p>

            <div className="anatomy-nav">
              {anatomyLabels.map((label, index) => (
                <span key={label} className={anatomyStep === index ? "active" : ""}>
                  <i />
                  0{index + 1} — {label}
                </span>
              ))}
            </div>
          </div>

          <div className="anatomy-visual">
            <TailoringSequence />
          </div>

          <div className="anatomy-word" aria-hidden="true">COUNSEL</div>
        </div>
      </section>

      <section className="editorial-break">
        <p className="kicker"><i />Defesa com contexto</p>
        <h2>
          Cada caso tem uma história.
          <em>Cada estratégia precisa entender o contexto.</em>
        </h2>
      </section>

      <section id="atuacao" ref={areasRef} className="areas-scene scroll-scene">
        <div className="scene-sticky areas-stage">
          <div className="areas-copy">
            <p className="kicker light"><i />Áreas de atuação</p>
            {practiceAreas.map((area, index) => {
              const Icon = area.icon;
              return (
                <article
                  key={area.title}
                  className={`area-copy ${activeArea === index ? "active" : ""}`}
                >
                  <span className="area-number">{area.number}</span>
                  <Icon size={22} />
                  <h2>{area.title}</h2>
                  <strong>{area.short}</strong>
                  <p>{area.description}</p>
                  <button onClick={() => goTo("contato")}>
                    Falar sobre este caso <ArrowUpRight size={14} />
                  </button>
                </article>
              );
            })}
            <div className="area-dots">
              {practiceAreas.map((area, index) => (
                <i key={area.number} className={activeArea === index ? "active" : ""} />
              ))}
            </div>
          </div>

          <div className="areas-visual">
            <AreaParticles />
            <div className="area-photo-frame">
              {practiceAreas.map((area, index) => (
                <img
                  key={area.title}
                  src={area.image}
                  alt=""
                  className={activeArea === index ? "active" : ""}
                  loading="eager"
                />
              ))}
              <div className="area-photo-shade" />
            </div>
          </div>
        </div>
      </section>

      <section className="method-section">
        <div className="method-heading">
          <p className="kicker"><i />Método</p>
          <h2>
            Clareza antes da decisão.
            <em>Estratégia antes da ação.</em>
          </h2>
        </div>

        <div className="method-list">
          {[
            ["01", "Leitura do caso", "Documentos, prescrição, urgência e negativa organizados em uma visão única."],
            ["02", "Estratégia", "Definição do caminho jurídico adequado ao contexto e ao objetivo do paciente."],
            ["03", "Comunicação", "Próximos passos explicados com linguagem clara e acompanhamento objetivo."],
          ].map(([number, title, copy]) => (
            <article key={number}>
              <span>{number}</span>
              <div>
                <h3>{title}</h3>
                <p>{copy}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="contato" className="contact-section">
        <div className="contact-copy">
          <p className="kicker light"><i />Contato</p>
          <h2>
            Quando o cuidado é urgente,
            <em>a informação precisa ser clara.</em>
          </h2>
          <p>
            Conte o que aconteceu. Organize os principais documentos e entre em
            contato para uma análise inicial do contexto.
          </p>

          <div className="contact-info">
            <div><Mail size={16} /><a href="mailto:renandurso@aasp.org.br">renandurso@aasp.org.br</a></div>
            <div><MapPin size={16} /><span>São Paulo — SP</span></div>
            <div><Scale size={16} /><span>Direito Médico e da Saúde</span></div>
          </div>
        </div>

        <form className="contact-form" onSubmit={submitContact}>
          <div className="form-kicker"><Sparkles size={15} />Iniciar uma conversa</div>
          <input className="honeypot" name="website" tabIndex="-1" autoComplete="off" aria-hidden="true" />
          <label>
            Nome
            <input name="name" required placeholder="Seu nome" />
          </label>
          <label>
            Telefone
            <input name="phone" placeholder="(11) 99999-9999" />
          </label>
          <label>
            Como podemos ajudar?
            <textarea name="message" required rows="5" placeholder="Conte brevemente o que aconteceu." />
          </label>
          <button type="submit" disabled={contactStatus === "sending"}>
            {contactStatus === "sending" ? "Enviando..." : "Enviar mensagem"}
            <ArrowUpRight size={15} />
          </button>
          {contactStatus === "success" && <p className="form-status">Mensagem enviada.</p>}
        </form>
      </section>

      <footer>
        <strong>Renan Durso</strong>
        <span>Direito Médico e da Saúde</span>
        <small>© {new Date().getFullYear()}</small>
      </footer>
    </main>
  );
}

export default App;
