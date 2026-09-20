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
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

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
  const rootRef = useRef(null);
  const bodyRef = useRef(null);
  const shirtBodyRef = useRef(null);
  const shirtLeftRef = useRef(null);
  const shirtRightRef = useRef(null);
  const collarRef = useRef(null);
  const tieRef = useRef(null);
  const vestLeftRef = useRef(null);
  const vestRightRef = useRef(null);
  const jacketLeftRef = useRef(null);
  const jacketRightRef = useRef(null);
  const completeRef = useRef(null);
  const renanRef = useRef(null);

  useEffect(() => {
    if (!rootRef.current) return undefined;

    gsap.registerPlugin(ScrollTrigger);

    const section = rootRef.current.closest(".anatomy-scene");
    if (!section) return undefined;

    const ctx = gsap.context(() => {
      gsap.set(bodyRef.current, {
        opacity: 1,
        scale: 1,
        transformOrigin: "50% 50%",
      });

      gsap.set(
        [
          shirtBodyRef.current,
          shirtLeftRef.current,
          shirtRightRef.current,
          collarRef.current,
          tieRef.current,
          vestLeftRef.current,
          vestRightRef.current,
          jacketLeftRef.current,
          jacketRightRef.current,
          completeRef.current,
        ],
        { opacity: 0 },
      );

      gsap.set(shirtBodyRef.current, { y: -72, scaleY: 0.9 });
      gsap.set(shirtLeftRef.current, { x: -150, y: -24, rotation: -12 });
      gsap.set(shirtRightRef.current, { x: 150, y: -24, rotation: 12 });
      gsap.set(collarRef.current, { y: -44, scale: 0.84 });
      gsap.set(tieRef.current, { y: -110, scaleY: 0.72 });
      gsap.set(vestLeftRef.current, { x: -120, rotationY: 26 });
      gsap.set(vestRightRef.current, { x: 120, rotationY: -26 });
      gsap.set(jacketLeftRef.current, { x: -190, rotationY: 38, rotationZ: -4 });
      gsap.set(jacketRightRef.current, { x: 190, rotationY: -38, rotationZ: 4 });
      gsap.set(renanRef.current, { opacity: 0, scale: 0.97, y: 18 });

      const tl = gsap.timeline({
        defaults: { ease: "power2.inOut" },
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.65,
        },
      });

      tl
        .to({}, { duration: 0.7 })

        .to(shirtBodyRef.current, {
          opacity: 1,
          y: 0,
          scaleY: 1,
          duration: 1.05,
        })
        .to(
          shirtLeftRef.current,
          {
            opacity: 1,
            x: 0,
            y: 0,
            rotation: 0,
            duration: 1.05,
          },
          "<0.08",
        )
        .to(
          shirtRightRef.current,
          {
            opacity: 1,
            x: 0,
            y: 0,
            rotation: 0,
            duration: 1.05,
          },
          "<0.12",
        )
        .to(
          collarRef.current,
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.58,
          },
          "-=0.34",
        )

        .to({}, { duration: 0.46 })

        .to(tieRef.current, {
          opacity: 1,
          y: 0,
          scaleY: 1,
          duration: 0.92,
          ease: "power3.out",
        })

        .to({}, { duration: 0.4 })

        .to(vestLeftRef.current, {
          opacity: 1,
          x: 0,
          rotationY: 0,
          duration: 1,
        })
        .to(
          vestRightRef.current,
          {
            opacity: 1,
            x: 0,
            rotationY: 0,
            duration: 1,
          },
          "<0.08",
        )

        .to({}, { duration: 0.42 })

        .to(jacketLeftRef.current, {
          opacity: 1,
          x: 0,
          rotationY: 0,
          rotationZ: 0,
          duration: 1.25,
          ease: "power3.inOut",
        })
        .to(
          jacketRightRef.current,
          {
            opacity: 1,
            x: 0,
            rotationY: 0,
            rotationZ: 0,
            duration: 1.25,
            ease: "power3.inOut",
          },
          "<0.08",
        )
        .to(
          completeRef.current,
          {
            opacity: 1,
            duration: 0.52,
          },
          "-=0.3",
        )

        .to({}, { duration: 0.72 })

        .to(
          rootRef.current.querySelector(".tailoring-vector-stage"),
          {
            opacity: 0,
            scale: 0.985,
            filter: "blur(6px)",
            duration: 0.9,
          },
        )
        .to(
          renanRef.current,
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 1,
            ease: "power2.out",
          },
          "<0.2",
        )
        .to({}, { duration: 0.7 });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={rootRef} className="tailoring-vector">
      <div className="tailoring-vector-stage">
        <svg
          className="tailoring-svg"
          viewBox="0 0 520 760"
          role="img"
          aria-label="Construção visual de um advogado vestindo o traje peça por peça"
        >
          <defs>
            <linearGradient id="bodyFill" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#151b22" />
              <stop offset="100%" stopColor="#090d12" />
            </linearGradient>
            <linearGradient id="shirtFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#faf9f5" />
              <stop offset="100%" stopColor="#d8d7d2" />
            </linearGradient>
            <linearGradient id="vestFill" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#1b2026" />
              <stop offset="100%" stopColor="#090c10" />
            </linearGradient>
            <linearGradient id="jacketFill" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#171c22" />
              <stop offset="58%" stopColor="#0c1015" />
              <stop offset="100%" stopColor="#05080b" />
            </linearGradient>
            <linearGradient id="goldStroke" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#f1d7a0" />
              <stop offset="100%" stopColor="#a97c43" />
            </linearGradient>
            <filter id="softGlow" x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur stdDeviation="5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <g ref={bodyRef} className="vector-body">
            <ellipse cx="260" cy="104" rx="55" ry="69" fill="url(#bodyFill)" stroke="url(#goldStroke)" strokeWidth="1.3" />
            <path d="M219 153 C190 168 171 196 165 230 L145 395 C141 433 155 474 183 497 L205 515 L205 706 L315 706 L315 515 L337 497 C365 474 379 433 375 395 L355 230 C349 196 330 168 301 153 Z" fill="url(#bodyFill)" stroke="url(#goldStroke)" strokeWidth="1.3" />
            <path d="M180 205 C151 219 136 254 130 291 L108 448 C104 476 112 495 132 503 C151 511 166 493 170 467 L191 308 C196 269 198 236 180 205 Z" fill="url(#bodyFill)" stroke="url(#goldStroke)" strokeWidth="1.1" />
            <path d="M340 205 C369 219 384 254 390 291 L412 448 C416 476 408 495 388 503 C369 511 354 493 350 467 L329 308 C324 269 322 236 340 205 Z" fill="url(#bodyFill)" stroke="url(#goldStroke)" strokeWidth="1.1" />
            <path d="M205 505 L187 724 L242 724 L260 529 L278 724 L333 724 L315 505 Z" fill="url(#bodyFill)" stroke="url(#goldStroke)" strokeWidth="1.1" />
            <g opacity=".42" stroke="#d7b77e" strokeWidth=".8">
              <path d="M260 175 V504" />
              <path d="M188 260 H332" />
              <path d="M181 324 H339" />
              <path d="M178 395 H342" />
              <path d="M207 189 C224 221 238 242 260 257 C282 242 296 221 313 189" fill="none" />
              <path d="M208 452 C231 465 243 470 260 471 C277 470 289 465 312 452" fill="none" />
            </g>
          </g>

          <g ref={shirtBodyRef} className="vector-shirt">
            <path d="M205 173 L232 157 L260 178 L288 157 L315 173 L330 230 L322 496 L198 496 L190 230 Z" fill="url(#shirtFill)" />
            <path d="M260 179 V494" stroke="#bfc0bc" strokeWidth="1.2" />
            {[230, 277, 324, 371, 418, 465].map((y) => (
              <circle key={y} cx="260" cy={y} r="2.4" fill="#a3a49f" />
            ))}
          </g>

          <g ref={shirtLeftRef} className="vector-shirt">
            <path d="M196 188 C166 198 149 222 143 255 L118 445 C115 468 124 480 139 482 C153 484 162 473 165 454 L188 276 C192 246 202 213 216 194 Z" fill="url(#shirtFill)" />
            <path d="M119 442 L166 449 L163 475 L118 468 Z" fill="#ecebe7" />
          </g>

          <g ref={shirtRightRef} className="vector-shirt">
            <path d="M324 188 C354 198 371 222 377 255 L402 445 C405 468 396 480 381 482 C367 484 358 473 355 454 L332 276 C328 246 318 213 304 194 Z" fill="url(#shirtFill)" />
            <path d="M401 442 L354 449 L357 475 L402 468 Z" fill="#ecebe7" />
          </g>

          <g ref={collarRef} className="vector-shirt">
            <path d="M220 161 L260 180 L238 222 L205 185 Z" fill="#f8f7f3" stroke="#c5c4bf" strokeWidth="1" />
            <path d="M300 161 L260 180 L282 222 L315 185 Z" fill="#f8f7f3" stroke="#c5c4bf" strokeWidth="1" />
          </g>

          <g ref={tieRef}>
            <path d="M245 185 L260 176 L275 185 L268 205 L252 205 Z" fill="#050608" />
            <path d="M252 205 L268 205 L276 383 L260 423 L244 383 Z" fill="#08090b" />
            <path d="M257 207 V382" stroke="rgba(255,255,255,.12)" strokeWidth="1" />
          </g>

          <g ref={vestLeftRef}>
            <path d="M201 213 L242 235 L256 270 L256 481 L211 503 L188 451 L193 246 Z" fill="url(#vestFill)" stroke="#31363c" strokeWidth="1" />
            <path d="M206 213 L251 247 L256 270 L229 304 Z" fill="#101419" />
          </g>

          <g ref={vestRightRef}>
            <path d="M319 213 L278 235 L264 270 L264 481 L309 503 L332 451 L327 246 Z" fill="url(#vestFill)" stroke="#31363c" strokeWidth="1" />
            <path d="M314 213 L269 247 L264 270 L291 304 Z" fill="#101419" />
            {[314, 352, 390, 428].map((y) => (
              <circle key={y} cx="260" cy={y} r="3" fill="#383d43" stroke="#080a0d" strokeWidth="1" />
            ))}
          </g>

          <g ref={jacketLeftRef} style={{ transformBox: "fill-box", transformOrigin: "right center" }}>
            <path d="M195 180 C162 192 143 215 135 252 L111 446 C108 470 119 489 138 495 C153 499 166 488 170 464 L190 300 L192 511 L228 532 L256 480 L256 263 L231 219 Z" fill="url(#jacketFill)" />
            <path d="M194 183 L232 219 L256 263 L225 316 L194 260 Z" fill="#20262c" stroke="#343a40" strokeWidth="1" />
            <path d="M204 344 L247 361" stroke="#3b4147" strokeWidth="1.2" />
            <path d="M129 439 L169 447 L166 472 L125 465 Z" fill="#12171c" />
          </g>

          <g ref={jacketRightRef} style={{ transformBox: "fill-box", transformOrigin: "left center" }}>
            <path d="M325 180 C358 192 377 215 385 252 L409 446 C412 470 401 489 382 495 C367 499 354 488 350 464 L330 300 L328 511 L292 532 L264 480 L264 263 L289 219 Z" fill="url(#jacketFill)" />
            <path d="M326 183 L288 219 L264 263 L295 316 L326 260 Z" fill="#20262c" stroke="#343a40" strokeWidth="1" />
            <path d="M316 344 L273 361" stroke="#3b4147" strokeWidth="1.2" />
            <path d="M391 439 L351 447 L354 472 L395 465 Z" fill="#12171c" />
            <path d="M306 235 L336 235 L330 249 L307 249 Z" fill="#ded8ca" />
          </g>

          <g ref={completeRef} opacity="0">
            <ellipse cx="260" cy="108" rx="91" ry="101" fill="none" stroke="rgba(215,183,126,.28)" strokeWidth="1" />
            <path d="M172 525 Q260 548 348 525" fill="none" stroke="rgba(215,183,126,.22)" strokeWidth="1" />
            <circle cx="260" cy="360" r="145" fill="none" stroke="rgba(215,183,126,.08)" strokeWidth="1" />
          </g>
        </svg>
      </div>

      <div ref={renanRef} className="tailoring-renan-vector">
        <div className="renan-vector-halo" aria-hidden="true" />
        <PortraitImage alt="Renan Durso" />
        <div className="renan-vector-rim" aria-hidden="true" />
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
