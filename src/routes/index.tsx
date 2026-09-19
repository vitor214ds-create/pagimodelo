import { createFileRoute } from "@tanstack/react-router";
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
  Stethoscope,
  X,
} from "lucide-react";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type RefObject,
} from "react";

export const Route = createFileRoute("/")({
  component: Index,
});

const portraitUrl =
  "https://renandurso.lovable.app/__l5e/assets-v1/627158e5-171e-4d04-a900-3ab4beb348d8/adv-1.png";

const practiceAreas = [
  {
    number: "01",
    title: "Home Care",
    short: "Continuidade do cuidado em casa.",
    description:
      "Atuação em negativas de internação domiciliar, equipe, insumos e continuidade do tratamento prescrito.",
    icon: HeartPulse,
  },
  {
    number: "02",
    title: "Medicamentos",
    short: "Acesso ao tratamento prescrito.",
    description:
      "Medidas relacionadas a medicamentos de alto custo, uso contínuo, importados e negativas de cobertura.",
    icon: Stethoscope,
  },
  {
    number: "03",
    title: "Oncologia",
    short: "Tempo importa quando o tratamento é urgente.",
    description:
      "Atuação em negativas envolvendo quimioterapia, imunoterapia, radioterapia e tratamentos indispensáveis.",
    icon: Activity,
  },
  {
    number: "04",
    title: "Cirurgias e terapias",
    short: "Proteção jurídica diante da negativa.",
    description:
      "Análise de negativas de cirurgias, exames, próteses, terapias multidisciplinares e outros procedimentos.",
    icon: ShieldCheck,
  },
];

const storySteps = [
  {
    key: "cross",
    index: "01",
    eyebrow: "Direito da Saúde",
    title: "Saúde",
    accent: "não pode esperar.",
    copy: "A primeira leitura é clínica: entender a prescrição, a urgência e o que está sendo negado.",
  },
  {
    key: "scales",
    index: "02",
    eyebrow: "Estratégia jurídica",
    title: "Técnica",
    accent: "para equilibrar forças.",
    copy: "Documentos, contrato, cobertura e contexto são organizados para definir a medida juridicamente adequada.",
  },
  {
    key: "pulse",
    index: "03",
    eyebrow: "Urgência",
    title: "Tempo",
    accent: "também é parte do caso.",
    copy: "Quando o tratamento não pode esperar, a estratégia precisa acompanhar a urgência real do paciente.",
  },
  {
    key: "shield",
    index: "04",
    eyebrow: "Proteção",
    title: "Direito",
    accent: "aplicado à vida real.",
    copy: "O objetivo é tornar o caminho compreensível, técnico e focado na proteção do paciente.",
  },
];

type Point = [number, number];
type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  phase: number;
  glow: number;
  alpha: number;
};

function clamp(value: number, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value));
}

function smoothstep(value: number) {
  const t = clamp(value);
  return t * t * (3 - 2 * t);
}

function sampleOpaquePoints(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  desiredCount: number,
) {
  const image = ctx.getImageData(0, 0, width, height).data;
  const points: Point[] = [];

  for (let y = 0; y < height; y += 2) {
    for (let x = 0; x < width; x += 2) {
      const index = (y * width + x) * 4;
      if (image[index + 3] > 26) {
        points.push([(x / width) * 2 - 1, (y / height) * 2 - 1]);
      }
    }
  }

  if (!points.length) {
    return Array.from({ length: desiredCount }, () => [0, 0] as Point);
  }

  const result: Point[] = [];
  const step = points.length / desiredCount;

  for (let i = 0; i < desiredCount; i++) {
    result.push(points[Math.floor(i * step) % points.length]);
  }

  return result;
}

function buildSymbolPoints(
  symbol: "cross" | "scales" | "pulse" | "shield",
  count: number,
) {
  const offscreen = document.createElement("canvas");
  offscreen.width = 420;
  offscreen.height = 420;
  const ctx = offscreen.getContext("2d");

  if (!ctx) {
    return Array.from({ length: count }, () => [0, 0] as Point);
  }

  ctx.clearRect(0, 0, offscreen.width, offscreen.height);
  ctx.fillStyle = "#fff";
  ctx.strokeStyle = "#fff";
  ctx.lineWidth = 22;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  if (symbol === "cross") {
    ctx.fillRect(167, 46, 86, 328);
    ctx.fillRect(46, 167, 328, 86);
  }

  if (symbol === "scales") {
    ctx.beginPath();
    ctx.moveTo(210, 34);
    ctx.lineTo(210, 338);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(92, 108);
    ctx.lineTo(328, 108);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(210, 332);
    ctx.lineTo(139, 370);
    ctx.lineTo(281, 370);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(120, 108);
    ctx.lineTo(76, 201);
    ctx.moveTo(300, 108);
    ctx.lineTo(344, 201);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(76, 217, 46, 0, Math.PI);
    ctx.moveTo(298, 217);
    ctx.arc(344, 217, 46, Math.PI, 0, true);
    ctx.stroke();
  }

  if (symbol === "pulse") {
    ctx.beginPath();
    ctx.moveTo(34, 225);
    ctx.lineTo(104, 225);
    ctx.lineTo(139, 184);
    ctx.lineTo(175, 275);
    ctx.lineTo(218, 108);
    ctx.lineTo(260, 252);
    ctx.lineTo(300, 225);
    ctx.lineTo(386, 225);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(210, 154);
    ctx.bezierCurveTo(150, 78, 80, 136, 210, 315);
    ctx.bezierCurveTo(340, 136, 270, 78, 210, 154);
    ctx.stroke();
  }

  if (symbol === "shield") {
    ctx.beginPath();
    ctx.moveTo(210, 40);
    ctx.lineTo(320, 86);
    ctx.lineTo(301, 230);
    ctx.lineTo(210, 365);
    ctx.lineTo(119, 230);
    ctx.lineTo(100, 86);
    ctx.closePath();
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(145, 210);
    ctx.lineTo(192, 258);
    ctx.lineTo(277, 160);
    ctx.stroke();
  }

  return sampleOpaquePoints(
    ctx,
    offscreen.width,
    offscreen.height,
    count,
  );
}

function ScrollParticles({
  storyRef,
}: {
  storyRef: RefObject<HTMLElement | null>;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const story = storyRef.current;
    if (!canvas || !story) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let width = 0;
    let height = 0;
    let dpr = 1;
    let particleCount = 360;
    let particles: Particle[] = [];
    let targets: Point[][] = [];
    let storyProgress = 0;
    let pointerX = 0;
    let pointerY = 0;
    let pointerActive = false;

    const seeded = (index: number) => {
      const value = Math.sin(index * 918.37 + 17.31) * 43758.5453;
      return value - Math.floor(value);
    };

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      particleCount = width < 720 ? 210 : 360;

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      targets = [
        buildSymbolPoints("cross", particleCount),
        buildSymbolPoints("scales", particleCount),
        buildSymbolPoints("pulse", particleCount),
        buildSymbolPoints("shield", particleCount),
      ];

      particles = Array.from({ length: particleCount }, (_, i) => ({
        x: width * (0.56 + seeded(i + 10) * 0.28),
        y: height * (0.22 + seeded(i + 40) * 0.56),
        vx: 0,
        vy: 0,
        size: 0.75 + seeded(i + 90) * 1.65,
        phase: seeded(i + 150) * Math.PI * 2,
        glow: seeded(i + 320),
        alpha: 0.34 + seeded(i + 510) * 0.5,
      }));
    };

    const updateStoryProgress = () => {
      const rect = story.getBoundingClientRect();
      const travel = Math.max(story.offsetHeight - window.innerHeight, 1);
      storyProgress = clamp(-rect.top / travel);
    };

    const pointerMove = (event: PointerEvent) => {
      pointerX = event.clientX;
      pointerY = event.clientY;
      pointerActive = true;
    };

    const pointerLeave = () => {
      pointerActive = false;
    };

    const render = (time: number) => {
      ctx.clearRect(0, 0, width, height);

      let stage = 0;
      let nextStage = 0;
      let eased = 0;

      if (storyProgress < 0.18) {
        stage = 0;
        nextStage = 0;
      } else if (storyProgress < 0.25) {
        stage = 0;
        nextStage = 1;
        eased = smoothstep((storyProgress - 0.18) / 0.07);
      } else if (storyProgress < 0.43) {
        stage = 1;
        nextStage = 1;
      } else if (storyProgress < 0.5) {
        stage = 1;
        nextStage = 2;
        eased = smoothstep((storyProgress - 0.43) / 0.07);
      } else if (storyProgress < 0.68) {
        stage = 2;
        nextStage = 2;
      } else if (storyProgress < 0.75) {
        stage = 2;
        nextStage = 3;
        eased = smoothstep((storyProgress - 0.68) / 0.07);
      } else {
        stage = 3;
        nextStage = 3;
      }

      const from = targets[stage];
      const to = targets[nextStage];
      const mobile = width < 760;
      const centerX = mobile ? width * 0.5 : width * 0.73;
      const centerY = mobile ? height * 0.64 : height * 0.5;
      const scale = Math.min(width, height) * (mobile ? 0.27 : 0.32);

      for (let i = 0; i < particles.length; i++) {
        const particle = particles[i];
        const a = from[i % from.length];
        const b = to[i % to.length];

        const nx = a[0] + (b[0] - a[0]) * eased;
        const ny = a[1] + (b[1] - a[1]) * eased;

        const idleX =
          Math.sin(time * 0.001 + particle.phase) *
          (0.75 + particle.glow * 1.5);
        const idleY =
          Math.cos(time * 0.0012 + particle.phase) *
          (0.75 + particle.glow * 1.25);

        let targetX = centerX + nx * scale + idleX;
        let targetY = centerY + ny * scale + idleY;

        if (pointerActive && !mobile) {
          const dx = particle.x - pointerX;
          const dy = particle.y - pointerY;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 105 && distance > 0) {
            const force = (1 - distance / 105) * 15;
            targetX += (dx / distance) * force;
            targetY += (dy / distance) * force;
          }
        }

        particle.vx += (targetX - particle.x) * 0.026;
        particle.vy += (targetY - particle.y) * 0.026;
        particle.vx *= 0.82;
        particle.vy *= 0.82;
        particle.x += particle.vx;
        particle.y += particle.vy;

        const pulse =
          0.85 + Math.sin(time * 0.0022 + particle.phase) * 0.15;
        const white = i % 8 === 0;

        ctx.beginPath();
        ctx.fillStyle = white
          ? `rgba(255,255,255,${particle.alpha})`
          : `rgba(220,189,128,${particle.alpha})`;
        ctx.shadowBlur = 7 + particle.glow * 10;
        ctx.shadowColor = white
          ? "rgba(255,255,255,.36)"
          : "rgba(220,189,128,.55)";
        ctx.arc(
          particle.x,
          particle.y,
          particle.size * pulse,
          0,
          Math.PI * 2,
        );
        ctx.fill();
      }

      ctx.shadowBlur = 0;
      raf = requestAnimationFrame(render);
    };

    resize();
    updateStoryProgress();

    window.addEventListener("resize", resize);
    window.addEventListener("scroll", updateStoryProgress, { passive: true });
    window.addEventListener("pointermove", pointerMove, { passive: true });
    document.documentElement.addEventListener("mouseleave", pointerLeave);

    raf = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", updateStoryProgress);
      window.removeEventListener("pointermove", pointerMove);
      document.documentElement.removeEventListener("mouseleave", pointerLeave);
    };
  }, [storyRef]);

  return (
    <canvas
      ref={canvasRef}
      className="story-particles perfect-particles-canvas"
      aria-hidden="true"
    />
  );
}

function Index() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [storyStep, setStoryStep] = useState(0);
  const storyRef = useRef<HTMLElement | null>(null);

  const dust = useMemo(
    () => Array.from({ length: 52 }, (_, index) => index),
    [],
  );

  useEffect(() => {
    let raf = 0;

    const update = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const height = Math.max(
          document.documentElement.scrollHeight - window.innerHeight,
          1,
        );
        const pageProgress = window.scrollY / height;
        document.documentElement.style.setProperty(
          "--page-progress",
          String(pageProgress),
        );
        document.documentElement.style.setProperty(
          "--scroll-y",
          `${window.scrollY}px`,
        );

        const story = storyRef.current;
        if (story) {
          const rect = story.getBoundingClientRect();
          const travel = Math.max(story.offsetHeight - window.innerHeight, 1);
          const progress = clamp(-rect.top / travel);
          document.documentElement.style.setProperty(
            "--story-progress",
            String(progress),
          );
          const nextStep =
            progress < 0.25 ? 0 : progress < 0.5 ? 1 : progress < 0.75 ? 2 : 3;
          setStoryStep(nextStep);
        }

        document.querySelectorAll<HTMLElement>("[data-scroll-scene]").forEach(
          (element) => {
            const rect = element.getBoundingClientRect();
            const travel = Math.max(element.offsetHeight - window.innerHeight, 1);
            const progress = clamp(-rect.top / travel);
            element.style.setProperty("--scene-progress", String(progress));
            element.style.setProperty("--scene-shift", `${progress * 352}%`);

            if (element.id === "sobre") {
              const intro = clamp(progress / 0.1);
              const shirt = clamp((progress - 0.08) / 0.12);
              const tie = clamp((progress - 0.2) / 0.1);
              const suit = clamp((progress - 0.28) / 0.2);
              const finalPortrait = clamp((progress - 0.5) / 0.18);
              const open = clamp((progress - 0.7) / 0.18);
              const copy = clamp((progress - 0.84) / 0.14);
              const shellWidth = 100 - copy * 52;

              element.style.setProperty("--advocate-intro", String(intro));
              element.style.setProperty("--advocate-shirt", String(shirt));
              element.style.setProperty("--advocate-tie", String(tie));
              element.style.setProperty("--advocate-suit", String(suit));
              element.style.setProperty("--advocate-final", String(finalPortrait));
              element.style.setProperty("--advocate-open", String(open));
              element.style.setProperty("--advocate-copy", String(copy));

              element.style.setProperty("--portrait-intro", String(intro));
              element.style.setProperty("--portrait-assemble", String(suit));
              element.style.setProperty("--portrait-complete", String(finalPortrait));
              element.style.setProperty("--portrait-open", String(open));
              element.style.setProperty("--portrait-copy", String(copy));
              element.style.setProperty(
                "--portrait-shell-width",
                `${shellWidth}%`,
              );
              element.style.setProperty(
                "--portrait-copy-shift",
                `${(1 - copy) * 46}px`,
              );
            }
          },
        );
      });
    };

    const pointer = (event: PointerEvent) => {
      document.documentElement.style.setProperty(
        "--pointer-x",
        `${event.clientX}px`,
      );
      document.documentElement.style.setProperty(
        "--pointer-y",
        `${event.clientY}px`,
      );
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

  const goTo = (id: string) => {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <main className="experience">
      <div className="page-progress" aria-hidden="true" />
      <div className="cursor-light" aria-hidden="true" />

      <div className="ambient-dust" aria-hidden="true">
        {dust.map((item) => (
          <i
            key={item}
            style={{ "--dust": item } as CSSProperties}
          />
        ))}
      </div>

      <header className="topbar">
        <button
          className="identity"
          onClick={() => goTo("inicio")}
          aria-label="Voltar ao início"
        >
          <span className="identity-seal">RD</span>
          <span>
            <strong>Renan Durso</strong>
            <small>Advocacia • Direito da Saúde</small>
          </span>
        </button>

        <nav className="desktop-menu" aria-label="Navegação principal">
          <button onClick={() => goTo("experiencia")}>Experiência</button>
          <button onClick={() => goTo("atuacao")}>Atuação</button>
          <button onClick={() => goTo("sobre")}>Sobre</button>
          <button className="menu-contact" onClick={() => goTo("contato")}>
            Falar com o escritório <ArrowUpRight size={14} />
          </button>
        </nav>

        <button
          className="mobile-trigger"
          onClick={() => setMenuOpen((value) => !value)}
          aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
        >
          {menuOpen ? <X /> : <Menu />}
        </button>

        <div className={`mobile-panel ${menuOpen ? "open" : ""}`}>
          <button onClick={() => goTo("experiencia")}>Experiência</button>
          <button onClick={() => goTo("atuacao")}>Atuação</button>
          <button onClick={() => goTo("sobre")}>Sobre</button>
          <button onClick={() => goTo("contato")}>Contato</button>
        </div>
      </header>

      <section
        id="inicio"
        className="hero-scroll-scene"
        data-scroll-scene
      >
        <div className="scene-sticky hero-stage">
          <div className="hero-grid" aria-hidden="true" />
          <div className="hero-halo" aria-hidden="true" />
          <div className="hero-beam hero-beam-a" aria-hidden="true" />
          <div className="hero-beam hero-beam-b" aria-hidden="true" />
          <div className="hero-medical-line" aria-hidden="true">
            <span />
            <span />
            <span />
            <span />
            <span />
          </div>
          <div className="hero-backword" aria-hidden="true">HEALTH / LAW</div>
          <div className="hero-index">01 — INÍCIO</div>

          <div className="hero-copy">
            <p className="micro-kicker">
              <span />
              Direito médico e da saúde
            </p>

            <h1 className="display-title">
              <span className="title-mask">
                <b>A saúde</b>
              </span>
              <span className="title-mask title-serif">
                <b>não pode esperar.</b>
              </span>
            </h1>

            <div className="hero-premium-meta" aria-hidden="true">
              <span>Direito da Saúde</span>
              <span>Urgência</span>
              <span>Proteção</span>
            </div>

            <div className="hero-summary">
              <p>
                Atuação jurídica dedicada à proteção do paciente diante de
                negativas de tratamento, medicamentos, cirurgias, home care e
                terapias essenciais.
              </p>
              <button onClick={() => goTo("experiencia")}>
                Descobrir a atuação <ArrowDown size={16} />
              </button>
            </div>
          </div>

          <div className="portrait-hero" aria-hidden="true">
            <div className="portrait-orbit orbit-a" />
            <div className="portrait-orbit orbit-b" />
            <div className="portrait-light" />
            <div className="portrait-crop">
              <img
                className="portrait-main"
                src={portraitUrl}
                alt=""
              />
              <img
                className="portrait-torso"
                src={portraitUrl}
                alt=""
              />
              <div className="tie-flare" />
            </div>
            <span className="portrait-label">
              RENAN DURSO / ADVOCACIA
            </span>
          </div>

          <div className="hero-bottomline">
            <span>Atendimento nacional</span>
            <span>São Paulo — SP</span>
            <span>Role para explorar</span>
          </div>
        </div>
      </section>

      <section
        id="experiencia"
        ref={storyRef}
        className="particle-story"
      >
        <ScrollParticles storyRef={storyRef} />

        <div className="scene-sticky story-stage">
          <div className="story-grid" aria-hidden="true" />
          <div className="story-radial" aria-hidden="true" />

          <div className="story-counter">
            <span>0{storyStep + 1}</span>
            <small>/ 04</small>
          </div>

          <div className="story-symbol-name" aria-hidden="true">
            {storyStep === 0 && "SAÚDE"}
            {storyStep === 1 && "JUSTIÇA"}
            {storyStep === 2 && "VIDA"}
            {storyStep === 3 && "PROTEÇÃO"}
          </div>

          <div className="story-copy-stack">
            {storySteps.map((step, index) => (
              <article
                key={step.key}
                className={`story-copy ${storyStep === index ? "active" : ""}`}
              >
                <p>{step.eyebrow}</p>
                <h2>
                  {step.title}
                  <em>{step.accent}</em>
                </h2>
                <div className="story-rule" />
                <span>{step.copy}</span>
              </article>
            ))}
          </div>

          <div className="story-axis" aria-hidden="true">
            <i />
            <i />
            <i />
            <i />
          </div>

          <div className="story-caption">
            partículas → símbolo → significado
          </div>
        </div>
      </section>

      <section
        id="sobre"
        className="portrait-scroll-scene"
        data-scroll-scene
      >
        <div className="scene-sticky portrait-stage">
          <div className="portrait-backtype" aria-hidden="true">
            SAÚDE
          </div>

          <div className="portrait-scene-shell">
            <div className="portrait-anatomy-stage advocate-cinematic-stage">
              <div className="portrait-anatomy-grid advocate-grid" aria-hidden="true" />
              <div className="advocate-ambient-glow" aria-hidden="true" />
              <div className="advocate-light-column" aria-hidden="true" />

              <div className="portrait-anatomy-title advocate-copy-intro" aria-hidden="true">
                <small>A ANATOMIA DA ADVOCACIA</small>
                <span>Presença.</span>
                <em>Estratégia.</em>
              </div>

              <div className="portrait-ghost advocate-silhouette" aria-hidden="true">
                <img src={portraitUrl} alt="" />
              </div>

              <div className="advocate-piece advocate-shirt" aria-hidden="true">
                <img src={portraitUrl} alt="" />
              </div>

              <div className="advocate-piece advocate-tie" aria-hidden="true">
                <img src={portraitUrl} alt="" />
              </div>

              <div className="advocate-piece advocate-left-lapel" aria-hidden="true">
                <img src={portraitUrl} alt="" />
              </div>

              <div className="advocate-piece advocate-right-lapel" aria-hidden="true">
                <img src={portraitUrl} alt="" />
              </div>

              <div className="advocate-piece advocate-sleeve-left" aria-hidden="true">
                <img src={portraitUrl} alt="" />
              </div>

              <div className="advocate-piece advocate-sleeve-right" aria-hidden="true">
                <img src={portraitUrl} alt="" />
              </div>

              <div className="advocate-final-portrait">
                <img src={portraitUrl} alt="Renan Durso" />
                <div className="advocate-final-shine" aria-hidden="true" />
                <div className="advocate-rim-light" aria-hidden="true" />
              </div>

              <div className="portrait-triptych advocate-triptych">
                <div
                  className="portrait-angle-panel portrait-angle-left advocate-panel advocate-panel-left"
                  aria-hidden="true"
                >
                  <img src={portraitUrl} alt="" />
                </div>

                <div className="portrait-angle-panel portrait-angle-center advocate-panel advocate-panel-center">
                  <img src={portraitUrl} alt="Renan Durso" />
                </div>

                <div
                  className="portrait-angle-panel portrait-angle-right advocate-panel advocate-panel-right"
                  aria-hidden="true"
                >
                  <img src={portraitUrl} alt="" />
                </div>

                <div className="portrait-depth-glow" aria-hidden="true" />
                <div className="portrait-scan" aria-hidden="true" />
                <div className="portrait-floor-shadow" aria-hidden="true" />
                <div className="portrait-tech-ring portrait-tech-ring-a" aria-hidden="true" />
                <div className="portrait-tech-ring portrait-tech-ring-b" aria-hidden="true" />
              </div>

              <div className="advocate-stitch-line advocate-stitch-left" aria-hidden="true" />
              <div className="advocate-stitch-line advocate-stitch-right" aria-hidden="true" />
              <div className="advocate-scan-beam" aria-hidden="true" />

              <div className="portrait-phase-indicator advocate-phase-indicator" aria-hidden="true">
                <span>01 ESTRUTURA</span>
                <span>02 TRAJE</span>
                <span>03 PRESENÇA</span>
              </div>
            </div>

            <div className="portrait-card">
              <span>Direito da Saúde</span>
              <strong>
                Técnica jurídica
                <em>com leitura humana.</em>
              </strong>
            </div>
          </div>

          <div className="about-copy">
            <p className="micro-kicker dark">
              <span />
              Sobre a atuação
            </p>
            <h2>
              Antes da ação,
              <em>compreender o caso.</em>
            </h2>
            <p className="about-lead">
              A estratégia parte da documentação médica, da urgência, da
              negativa e do contexto de cada paciente. O objetivo é organizar
              as informações e transformar uma situação complexa em próximos
              passos claros.
            </p>

            <div className="about-facts">
              <div>
                <small>01</small>
                <span>Análise individualizada</span>
              </div>
              <div>
                <small>02</small>
                <span>Foco em Direito da Saúde</span>
              </div>
              <div>
                <small>03</small>
                <span>Comunicação objetiva</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="atuacao"
        className="practice-scroll-scene"
        data-scroll-scene
      >
        <div className="scene-sticky practice-stage">
          <div className="practice-head">
            <p className="micro-kicker">
              <span />
              Áreas de atuação
            </p>
            <h2>
              Casos em que
              <em>o tempo importa.</em>
            </h2>
          </div>

          <div className="practice-stack">
            {practiceAreas.map((area, index) => {
              const Icon = area.icon;
              return (
                <article
                  key={area.title}
                  className="practice-slide"
                  style={{
                    "--card-index": index,
                    "--card-base": `${index * 110}%`,
                  } as CSSProperties}
                >
                  <div className="practice-slide-top">
                    <span>{area.number}</span>
                    <Icon size={22} />
                  </div>
                  <h3>{area.title}</h3>
                  <strong>{area.short}</strong>
                  <p>{area.description}</p>
                  <div className="practice-slide-line" />
                </article>
              );
            })}
          </div>

          <div className="practice-background-word" aria-hidden="true">
            PROTEÇÃO
          </div>
        </div>
      </section>

      <section className="statement-break">
        <div className="statement-track" aria-hidden="true">
          <span>SAÚDE</span>
          <i>•</i>
          <span>DIREITO</span>
          <i>•</i>
          <span>URGÊNCIA</span>
          <i>•</i>
          <span>PROTEÇÃO</span>
          <i>•</i>
          <span>SAÚDE</span>
        </div>

        <blockquote>
          “Uma boa orientação jurídica não entrega apenas respostas.
          <em> Organiza possibilidades.</em>”
        </blockquote>
      </section>

      <section id="contato" className="contact-scene">
        <div className="contact-orbit contact-orbit-a" aria-hidden="true" />
        <div className="contact-orbit contact-orbit-b" aria-hidden="true" />
        <div className="contact-glow" aria-hidden="true" />

        <div className="contact-heading">
          <p className="micro-kicker">
            <span />
            Contato
          </p>
          <h2>
            Sua questão
            <em>merece clareza.</em>
          </h2>
        </div>

        <a
          className="contact-cta"
          href="mailto:renandurso@aasp.org.br"
        >
          <span>Iniciar uma conversa</span>
          <ArrowUpRight />
        </a>

        <div className="contact-info">
          <div>
            <Mail size={17} />
            <a href="mailto:renandurso@aasp.org.br">
              renandurso@aasp.org.br
            </a>
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

        <footer className="footer">
          <div className="identity footer-identity">
            <span className="identity-seal">RD</span>
            <span>
              <strong>Renan Durso</strong>
              <small>Advocacia • Direito da Saúde</small>
            </span>
          </div>
          <p>Conteúdo institucional de caráter informativo.</p>
          <button onClick={() => goTo("inicio")}>
            Voltar ao topo <ArrowRight size={14} />
          </button>
        </footer>
      </section>
    </main>
  );
}
