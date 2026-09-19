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

const tailoringMasterChunks = Array.from(
  { length: 12 },
  (_, index) => `/anatomia/master-${String(index).padStart(2, "0")}.txt`,
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
  const canvasRef = useRef(null);
  const rootRef = useRef(null);
  const [spriteUrl, setSpriteUrl] = useState("");

  useEffect(() => {
    let cancelled = false;
    let objectUrl = "";

    async function loadMaster() {
      try {
        const parts = await Promise.all(
          tailoringMasterChunks.map(async (url) => {
            const response = await fetch(url, { cache: "force-cache" });
            if (!response.ok) throw new Error(`asset-${response.status}`);
            return response.text();
          }),
        );

        const base64 = parts.join("");
        if (base64.length !== 69568) {
          throw new Error(`master-incompleto-${base64.length}`);
        }

        const binary = atob(base64);
        const bytes = new Uint8Array(binary.length);
        for (let index = 0; index < binary.length; index += 1) {
          bytes[index] = binary.charCodeAt(index);
        }

        objectUrl = URL.createObjectURL(
          new Blob([bytes], { type: "image/avif" }),
        );

        if (!cancelled) setSpriteUrl(objectUrl);
      } catch (error) {
        console.error("Não foi possível carregar a sequência de alfaiataria.", error);
      }
    }

    loadMaster();

    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const root = rootRef.current;
    if (!canvas || !root || !spriteUrl) return undefined;

    const image = new Image();
    image.decoding = "async";
    image.src = spriteUrl;

    let raf = 0;
    let dead = false;
    let frames = [];

    function buildFrames() {
      const frameWidth = Math.round(image.naturalWidth / 5);
      const frameHeight = image.naturalHeight;
      frames = Array.from({ length: 5 }, (_, index) => {
        const frame = document.createElement("canvas");
        frame.width = frameWidth;
        frame.height = frameHeight;
        frame
          .getContext("2d")
          .drawImage(
            image,
            index * frameWidth,
            0,
            frameWidth,
            frameHeight,
            0,
            0,
            frameWidth,
            frameHeight,
          );
        return frame;
      });
    }

    function draw() {
      if (dead) return;
      if (!image.complete || !image.naturalWidth) {
        raf = requestAnimationFrame(draw);
        return;
      }
      if (!frames.length) buildFrames();

      const section = root.closest(".anatomy-scene");
      const progress = clamp(
        Number.parseFloat(
          getComputedStyle(section).getPropertyValue("--scene-progress") || "0",
        ),
      );

      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const pixelWidth = Math.max(1, Math.round(rect.width * dpr));
      const pixelHeight = Math.max(1, Math.round(rect.height * dpr));

      if (canvas.width !== pixelWidth || canvas.height !== pixelHeight) {
        canvas.width = pixelWidth;
        canvas.height = pixelHeight;
      }

      const ctx = canvas.getContext("2d", { alpha: true });
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, rect.width, rect.height);
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";

      const sourceWidth = frames[0].width;
      const sourceHeight = frames[0].height;
      const ratio = sourceWidth / sourceHeight;

      const maxWidth = rect.width * (window.innerWidth < 760 ? 0.9 : 0.88);
      const maxHeight = rect.height * (window.innerWidth < 760 ? 0.8 : 0.9);
      let width = maxWidth;
      let height = width / ratio;
      if (height > maxHeight) {
        height = maxHeight;
        width = height * ratio;
      }

      const x = (rect.width - width) / 2;
      const y = (rect.height - height) / 2;

      function paintState(index, alpha = 1) {
        ctx.save();
        ctx.globalAlpha = clamp(alpha);
        ctx.drawImage(frames[index], x, y, width, height);
        ctx.restore();
      }

      function reveal({
        base,
        next,
        amount,
        mode,
      }) {
        paintState(base);
        const t = smooth(amount);
        if (t <= 0) return;
        if (t >= 0.998) {
          paintState(next);
          return;
        }

        ctx.save();

        if (mode === "shirt") {
          const body = smooth(range(t, 0, 0.7));
          const left = smooth(range(t, 0.08, 0.78));
          const right = smooth(range(t, 0.14, 0.84));
          const collar = smooth(range(t, 0.58, 1));

          ctx.save();
          ctx.beginPath();
          ctx.rect(
            x + width * 0.25,
            y + height * 0.11,
            width * 0.5,
            height * 0.72 * body,
          );
          ctx.clip();
          ctx.drawImage(frames[next], x, y - (1 - body) * 24, width, height);
          ctx.restore();

          ctx.save();
          ctx.beginPath();
          ctx.rect(x, y + height * 0.1, width * 0.43, height * 0.82);
          ctx.clip();
          ctx.globalAlpha = left;
          ctx.drawImage(frames[next], x - (1 - left) * width * 0.28, y, width, height);
          ctx.restore();

          ctx.save();
          ctx.beginPath();
          ctx.rect(x + width * 0.57, y + height * 0.1, width * 0.43, height * 0.82);
          ctx.clip();
          ctx.globalAlpha = right;
          ctx.drawImage(frames[next], x + (1 - right) * width * 0.28, y, width, height);
          ctx.restore();

          ctx.save();
          ctx.beginPath();
          ctx.rect(x + width * 0.3, y, width * 0.4, height * 0.3);
          ctx.clip();
          ctx.globalAlpha = collar;
          ctx.drawImage(frames[next], x, y - (1 - collar) * 22, width, height);
          ctx.restore();
        }

        if (mode === "tie") {
          ctx.beginPath();
          ctx.rect(
            x + width * 0.38,
            y + height * 0.07,
            width * 0.24,
            height * 0.82 * t,
          );
          ctx.clip();
          ctx.globalAlpha = t;
          ctx.drawImage(frames[next], x, y - (1 - t) * height * 0.14, width, height);
        }

        if (mode === "vest") {
          const left = smooth(range(t, 0, 0.88));
          const right = smooth(range(t, 0.12, 1));

          ctx.save();
          ctx.beginPath();
          ctx.rect(x + width * 0.12, y + height * 0.08, width * 0.39, height * 0.78);
          ctx.clip();
          ctx.globalAlpha = left;
          ctx.drawImage(frames[next], x - (1 - left) * width * 0.22, y, width, height);
          ctx.restore();

          ctx.save();
          ctx.beginPath();
          ctx.rect(x + width * 0.49, y + height * 0.08, width * 0.39, height * 0.78);
          ctx.clip();
          ctx.globalAlpha = right;
          ctx.drawImage(frames[next], x + (1 - right) * width * 0.22, y, width, height);
          ctx.restore();
        }

        if (mode === "jacket") {
          const left = smooth(range(t, 0, 0.9));
          const right = smooth(range(t, 0.1, 1));

          ctx.save();
          ctx.beginPath();
          ctx.rect(x, y, width * 0.51, height);
          ctx.clip();
          ctx.globalAlpha = left;
          ctx.translate(x + width * 0.5, y + height * 0.42);
          ctx.scale(0.97 + left * 0.03, 0.97 + left * 0.03);
          ctx.translate(-(x + width * 0.5), -(y + height * 0.42));
          ctx.drawImage(frames[next], x - (1 - left) * width * 0.34, y, width, height);
          ctx.restore();

          ctx.save();
          ctx.beginPath();
          ctx.rect(x + width * 0.49, y, width * 0.51, height);
          ctx.clip();
          ctx.globalAlpha = right;
          ctx.translate(x + width * 0.5, y + height * 0.42);
          ctx.scale(0.97 + right * 0.03, 0.97 + right * 0.03);
          ctx.translate(-(x + width * 0.5), -(y + height * 0.42));
          ctx.drawImage(frames[next], x + (1 - right) * width * 0.34, y, width, height);
          ctx.restore();
        }

        ctx.restore();
      }

      if (progress < 0.12) {
        paintState(0);
      } else if (progress < 0.30) {
        reveal({ base: 0, next: 1, amount: range(progress, 0.12, 0.30), mode: "shirt" });
      } else if (progress < 0.36) {
        paintState(1);
      } else if (progress < 0.46) {
        reveal({ base: 1, next: 2, amount: range(progress, 0.36, 0.46), mode: "tie" });
      } else if (progress < 0.51) {
        paintState(2);
      } else if (progress < 0.65) {
        reveal({ base: 2, next: 3, amount: range(progress, 0.51, 0.65), mode: "vest" });
      } else if (progress < 0.70) {
        paintState(3);
      } else if (progress < 0.86) {
        reveal({ base: 3, next: 4, amount: range(progress, 0.70, 0.86), mode: "jacket" });
      } else {
        paintState(4);
      }

      raf = requestAnimationFrame(draw);
    }

    image.addEventListener("load", draw, { once: true });
    raf = requestAnimationFrame(draw);

    return () => {
      dead = true;
      cancelAnimationFrame(raf);
    };
  }, [spriteUrl]);

  return (
    <div ref={rootRef} className="tailoring-master">
      <canvas ref={canvasRef} className="tailoring-canvas" aria-hidden="true" />
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
