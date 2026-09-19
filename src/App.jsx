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

const tailoringSpriteChunks = Array.from(
  { length: 11 },
  (_, index) => `/anatomia/fit-${String(index).padStart(2, "0")}.txt`,
);

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
  const canvasRef = useRef(null);
  const wrapperRef = useRef(null);
  const [spriteUrl, setSpriteUrl] = useState("");

  useEffect(() => {
    let cancelled = false;
    let objectUrl = "";

    const loadSprite = async () => {
      try {
        const parts = await Promise.all(
          tailoringSpriteChunks.map(async (url) => {
            const response = await fetch(url, { cache: "force-cache" });
            if (!response.ok) {
              throw new Error(`Falha ao carregar ${url}: ${response.status}`);
            }
            return response.text();
          }),
        );

        const base64 = parts.join("");
        if (base64.length !== 63328) {
          throw new Error(
            `Sprite incompleto: ${base64.length} de 63328 caracteres`,
          );
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
        console.error("Erro ao reconstruir a animação de alfaiataria:", error);
      }
    };

    loadSprite();

    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrapper = wrapperRef.current;
    if (!canvas || !wrapper || !spriteUrl) return undefined;

    const image = new Image();
    image.decoding = "async";
    image.src = spriteUrl;

    let raf = 0;
    let stopped = false;
    let lastFrame = -1;
    let states = [];
    let deltas = [];

    const ease = (value) => {
      const t = clamp(value);
      return t * t * (3 - 2 * t);
    };

    const buildStateCanvases = () => {
      const frameWidth = Math.round(image.naturalWidth / 5);
      const frameHeight = image.naturalHeight;

      states = Array.from({ length: 5 }, (_, stateIndex) => {
        const offscreen = document.createElement("canvas");
        offscreen.width = frameWidth;
        offscreen.height = frameHeight;
        const ctx = offscreen.getContext("2d", { willReadFrequently: true });
        ctx.clearRect(0, 0, frameWidth, frameHeight);
        ctx.drawImage(
          image,
          stateIndex * frameWidth,
          0,
          frameWidth,
          frameHeight,
          0,
          0,
          frameWidth,
          frameHeight,
        );
        return offscreen;
      });

      deltas = states.slice(1).map((currentCanvas, index) => {
        const previousCanvas = states[index];
        const previous = previousCanvas
          .getContext("2d", { willReadFrequently: true })
          .getImageData(0, 0, frameWidth, frameHeight);
        const current = currentCanvas
          .getContext("2d", { willReadFrequently: true })
          .getImageData(0, 0, frameWidth, frameHeight);

        const output = document.createElement("canvas");
        output.width = frameWidth;
        output.height = frameHeight;
        const outputContext = output.getContext("2d");
        const diff = outputContext.createImageData(frameWidth, frameHeight);

        for (let pixel = 0; pixel < current.data.length; pixel += 4) {
          const alpha = current.data[pixel + 3];
          if (alpha < 6) continue;

          const delta =
            Math.abs(current.data[pixel] - previous.data[pixel]) +
            Math.abs(current.data[pixel + 1] - previous.data[pixel + 1]) +
            Math.abs(current.data[pixel + 2] - previous.data[pixel + 2]) +
            Math.abs(alpha - previous.data[pixel + 3]);

          if (delta < 34) continue;

          diff.data[pixel] = current.data[pixel];
          diff.data[pixel + 1] = current.data[pixel + 1];
          diff.data[pixel + 2] = current.data[pixel + 2];
          diff.data[pixel + 3] = alpha;
        }

        outputContext.putImageData(diff, 0, 0);
        return output;
      });
    };

    const draw = () => {
      if (stopped) return;

      if (!image.complete || !image.naturalWidth) {
        raf = requestAnimationFrame(draw);
        return;
      }

      if (!states.length) buildStateCanvases();

      const section = wrapper.closest(".anatomy-scroll");
      const style = section ? getComputedStyle(section) : null;
      const progress = clamp(
        Number.parseFloat(style?.getPropertyValue("--anatomy-progress") || "0"),
      );

      const totalFrames = 96;
      const frameIndex = Math.round(progress * (totalFrames - 1));
      if (frameIndex === lastFrame) {
        raf = requestAnimationFrame(draw);
        return;
      }
      lastFrame = frameIndex;

      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const pixelWidth = Math.max(1, Math.round(rect.width * dpr));
      const pixelHeight = Math.max(1, Math.round(rect.height * dpr));

      if (canvas.width !== pixelWidth || canvas.height !== pixelHeight) {
        canvas.width = pixelWidth;
        canvas.height = pixelHeight;
      }

      const context = canvas.getContext("2d", { alpha: true });
      if (!context) return;

      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      context.clearRect(0, 0, rect.width, rect.height);
      context.imageSmoothingEnabled = true;
      context.imageSmoothingQuality = "high";

      const sourceWidth = states[0].width;
      const sourceHeight = states[0].height;
      const ratio = sourceWidth / sourceHeight;

      const maxWidth = rect.width * (window.innerWidth <= 760 ? 0.94 : 0.86);
      const maxHeight = rect.height * (window.innerWidth <= 760 ? 0.88 : 0.90);
      let drawWidth = maxWidth;
      let drawHeight = drawWidth / ratio;

      if (drawHeight > maxHeight) {
        drawHeight = maxHeight;
        drawWidth = drawHeight * ratio;
      }

      const x = (rect.width - drawWidth) / 2;
      const y = (rect.height - drawHeight) / 2;

      const drawState = (stateIndex, alpha = 1) => {
        context.save();
        context.globalAlpha = clamp(alpha);
        context.drawImage(states[stateIndex], x, y, drawWidth, drawHeight);
        context.restore();
      };

      const drawDelta = ({
        deltaIndex,
        x0 = 0,
        y0 = 0,
        x1 = 1,
        y1 = 1,
        dx = 0,
        dy = 0,
        alpha = 1,
        scaleX = 1,
        scaleY = 1,
      }) => {
        if (alpha <= 0.001) return;

        const source = deltas[deltaIndex];
        const sx = x0 * sourceWidth;
        const sy = y0 * sourceHeight;
        const sw = (x1 - x0) * sourceWidth;
        const sh = (y1 - y0) * sourceHeight;

        const dw = (x1 - x0) * drawWidth * scaleX;
        const dh = (y1 - y0) * drawHeight * scaleY;
        const centerX = x + ((x0 + x1) / 2) * drawWidth + dx;
        const centerY = y + ((y0 + y1) / 2) * drawHeight + dy;

        context.save();
        context.globalAlpha = clamp(alpha);
        context.drawImage(
          source,
          sx,
          sy,
          sw,
          sh,
          centerX - dw / 2,
          centerY - dh / 2,
          dw,
          dh,
        );
        context.restore();
      };

      if (frameIndex <= 11) {
        drawState(0);
      } else if (frameIndex <= 31) {
        drawState(0);

        const left = ease(range(frameIndex, 12, 27));
        const right = ease(range(frameIndex, 14, 29));
        const body = ease(range(frameIndex, 12, 28));
        const collar = ease(range(frameIndex, 22, 31));

        drawDelta({
          deltaIndex: 0,
          x0: 0.00,
          x1: 0.43,
          y0: 0.12,
          y1: 0.92,
          dx: -90 * (1 - left),
          dy: -10 * (1 - left),
          alpha: left,
        });
        drawDelta({
          deltaIndex: 0,
          x0: 0.57,
          x1: 1.00,
          y0: 0.12,
          y1: 0.92,
          dx: 90 * (1 - right),
          dy: -10 * (1 - right),
          alpha: right,
        });
        drawDelta({
          deltaIndex: 0,
          x0: 0.25,
          x1: 0.75,
          y0: 0.14,
          y1: 0.88,
          dy: -42 * (1 - body),
          scaleY: 0.94 + body * 0.06,
          alpha: body,
        });
        drawDelta({
          deltaIndex: 0,
          x0: 0.31,
          x1: 0.69,
          y0: 0.04,
          y1: 0.31,
          dy: -28 * (1 - collar),
          alpha: collar,
        });

        if (frameIndex >= 30) drawState(1, ease(range(frameIndex, 30, 31)));
      } else if (frameIndex <= 43) {
        drawState(1);
        const tie = ease(range(frameIndex, 32, 43));
        drawDelta({
          deltaIndex: 1,
          x0: 0.38,
          x1: 0.62,
          y0: 0.10,
          y1: 0.89,
          dy: -105 * (1 - tie),
          scaleY: 0.78 + tie * 0.22,
          alpha: tie,
        });
        if (frameIndex >= 42) drawState(2, ease(range(frameIndex, 42, 43)));
      } else if (frameIndex <= 59) {
        drawState(2);
        const left = ease(range(frameIndex, 44, 57));
        const right = ease(range(frameIndex, 46, 59));
        drawDelta({
          deltaIndex: 2,
          x0: 0.14,
          x1: 0.51,
          y0: 0.10,
          y1: 0.90,
          dx: -105 * (1 - left),
          alpha: left,
        });
        drawDelta({
          deltaIndex: 2,
          x0: 0.49,
          x1: 0.86,
          y0: 0.10,
          y1: 0.90,
          dx: 105 * (1 - right),
          alpha: right,
        });
        if (frameIndex >= 58) drawState(3, ease(range(frameIndex, 58, 59)));
      } else if (frameIndex <= 79) {
        drawState(3);
        const left = ease(range(frameIndex, 60, 77));
        const right = ease(range(frameIndex, 62, 79));
        drawDelta({
          deltaIndex: 3,
          x0: 0.00,
          x1: 0.505,
          y0: 0.04,
          y1: 0.97,
          dx: -145 * (1 - left),
          scaleX: 0.96 + left * 0.04,
          alpha: left,
        });
        drawDelta({
          deltaIndex: 3,
          x0: 0.495,
          x1: 1.00,
          y0: 0.04,
          y1: 0.97,
          dx: 145 * (1 - right),
          scaleX: 0.96 + right * 0.04,
          alpha: right,
        });
        if (frameIndex >= 78) drawState(4, ease(range(frameIndex, 78, 79)));
      } else {
        drawState(4);
      }

      raf = requestAnimationFrame(draw);
    };

    image.addEventListener("load", draw, { once: true });
    raf = requestAnimationFrame(draw);

    return () => {
      stopped = true;
      cancelAnimationFrame(raf);
    };
  }, [spriteUrl]);

  return (
    <div
      ref={wrapperRef}
      className="tailoring-assembly tailoring-canvas-sequence"
      aria-label="Animação de um advogado vestindo o traje peça por peça"
    >
      <div className="assembly-grid" aria-hidden="true" />
      <div className="assembly-aura" aria-hidden="true" />
      <div className="assembly-floor" aria-hidden="true" />
      <div className="assembly-axis" aria-hidden="true" />

      <div className="assembly-stage">
        <canvas ref={canvasRef} className="tailoring-frame-canvas" />

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
          <i key={label} className={index <= step ? "active" : ""} />
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

          anatomyRef.current.style.setProperty("--anatomy", "1");
          anatomyRef.current.style.setProperty("--anatomy-progress", String(p));

          const shirtLeft = range(p, 0.14, 0.235);
          const shirtRight = range(p, 0.155, 0.25);
          const shirtBody = range(p, 0.175, 0.265);
          const shirtCollar = range(p, 0.215, 0.28);
          const shirt = range(p, 0.14, 0.28);

          const tieKnot = range(p, 0.28, 0.335);
          const tie = range(p, 0.305, 0.40);

          const vestLeft = range(p, 0.40, 0.525);
          const vestRight = range(p, 0.415, 0.54);
          const vest = range(p, 0.40, 0.54);

          const jacketLeft = range(p, 0.54, 0.695);
          const jacketRight = range(p, 0.555, 0.71);
          const jacket = range(p, 0.54, 0.71);

          anatomyRef.current.style.setProperty("--shirt-left", String(shirtLeft));
          anatomyRef.current.style.setProperty("--shirt-right", String(shirtRight));
          anatomyRef.current.style.setProperty("--shirt-body", String(shirtBody));
          anatomyRef.current.style.setProperty("--shirt-collar", String(shirtCollar));
          anatomyRef.current.style.setProperty("--shirt", String(shirt));

          anatomyRef.current.style.setProperty("--tie-knot", String(tieKnot));
          anatomyRef.current.style.setProperty("--tie", String(tie));

          anatomyRef.current.style.setProperty("--vest-left", String(vestLeft));
          anatomyRef.current.style.setProperty("--vest-right", String(vestRight));
          anatomyRef.current.style.setProperty("--vest", String(vest));

          anatomyRef.current.style.setProperty("--jacket-left", String(jacketLeft));
          anatomyRef.current.style.setProperty("--jacket-right", String(jacketRight));
          anatomyRef.current.style.setProperty("--jacket", String(jacket));

          anatomyRef.current.style.setProperty("--complete", String(range(p, 0.71, 0.79)));
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
