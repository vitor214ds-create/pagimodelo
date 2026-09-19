import { createFileRoute } from "@tanstack/react-router";
import {
  Activity,
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  ChevronDown,
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
import { useEffect, useRef, useState } from "react";

export const Route = createFileRoute("/")({
  component: Index,
});

const practiceAreas = [
  {
    number: "01",
    title: "Home Care",
    description:
      "Atuação em negativas de internação domiciliar, fornecimento de equipe, insumos e continuidade do tratamento prescrito.",
    icon: HeartPulse,
  },
  {
    number: "02",
    title: "Medicamentos de Alto Custo",
    description:
      "Medidas para obtenção de medicamentos de uso contínuo, importados ou de alto custo quando há negativa de cobertura.",
    icon: Stethoscope,
  },
  {
    number: "03",
    title: "Tratamentos Oncológicos",
    description:
      "Atuação em negativas envolvendo quimioterapia, imunoterapia, radioterapia e demais tratamentos indispensáveis.",
    icon: Activity,
  },
  {
    number: "04",
    title: "Cirurgias e Terapias",
    description:
      "Análise de negativas de cirurgias, exames, próteses, terapias multidisciplinares e outros procedimentos prescritos.",
    icon: ShieldCheck,
  },
];

const capabilities = [
  "Análise de casos urgentes",
  "Direito Médico e da Saúde",
  "Planos de saúde",
  "Tutelas de urgência",
  "Atendimento nacional",
  "Comunicação direta",
];

function Index() {
  const [menuOpen, setMenuOpen] = useState(false);
  const particles = Array.from({ length: 38 }, (_, index) => index);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const revealElements = Array.from(
      document.querySelectorAll<HTMLElement>("[data-reveal]"),
    );

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observerRef.current?.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.16, rootMargin: "0px 0px -8% 0px" },
    );

    revealElements.forEach((element) => observerRef.current?.observe(element));

    let frame = 0;
    const updateScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const y = window.scrollY;
        document.documentElement.style.setProperty("--scroll-y", `${y}px`);
        const max = Math.max(
          document.documentElement.scrollHeight - window.innerHeight,
          1,
        );
        document.documentElement.style.setProperty(
          "--scroll-progress",
          String(y / max),
        );
      });
    };

    const updatePointer = (event: PointerEvent) => {
      document.documentElement.style.setProperty("--pointer-x", `${event.clientX}px`);
      document.documentElement.style.setProperty("--pointer-y", `${event.clientY}px`);
      document.documentElement.style.setProperty(
        "--pointer-rx",
        String((event.clientY / window.innerHeight - 0.5) * -8),
      );
      document.documentElement.style.setProperty(
        "--pointer-ry",
        String((event.clientX / window.innerWidth - 0.5) * 8),
      );
    };

    updateScroll();
    window.addEventListener("scroll", updateScroll, { passive: true });
    window.addEventListener("pointermove", updatePointer, { passive: true });

    return () => {
      observerRef.current?.disconnect();
      window.removeEventListener("scroll", updateScroll);
      window.removeEventListener("pointermove", updatePointer);
      cancelAnimationFrame(frame);
    };
  }, []);

  const scrollTo = (id: string) => {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <main className="site-shell">
      <div className="scroll-progress" aria-hidden="true" />
      <div className="cursor-glow" aria-hidden="true" />
      <div className="global-particles" aria-hidden="true">
        {particles.map((particle) => (
          <i key={particle} style={{ "--p": particle } as React.CSSProperties} />
        ))}
      </div>
      <div className="ambient-lines" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
      <header className="site-header">
        <button
          type="button"
          className="brand-mark"
          onClick={() => scrollTo("inicio")}
          aria-label="Ir para o início"
        >
          <span className="brand-monogram">RD</span>
          <span className="brand-copy">
            <strong>Renan Durso</strong>
            <small>Advocacia & Consultoria</small>
          </span>
        </button>

        <nav className="desktop-nav" aria-label="Navegação principal">
          <button type="button" onClick={() => scrollTo("sobre")}>
            Sobre
          </button>
          <button type="button" onClick={() => scrollTo("atuacao")}>
            Atuação
          </button>
          <button type="button" onClick={() => scrollTo("metodo")}>
            Método
          </button>
          <button
            type="button"
            className="nav-cta"
            onClick={() => scrollTo("contato")}
          >
            Fale conosco <ArrowUpRight size={15} />
          </button>
        </nav>

        <button
          className="menu-button"
          type="button"
          aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
          onClick={() => setMenuOpen((value) => !value)}
        >
          {menuOpen ? <X /> : <Menu />}
        </button>

        <div className={`mobile-menu ${menuOpen ? "is-open" : ""}`}>
          <button type="button" onClick={() => scrollTo("sobre")}>
            01. Sobre
          </button>
          <button type="button" onClick={() => scrollTo("atuacao")}>
            02. Atuação
          </button>
          <button type="button" onClick={() => scrollTo("metodo")}>
            03. Método
          </button>
          <button type="button" onClick={() => scrollTo("contato")}>
            04. Contato
          </button>
        </div>
      </header>

      <section id="inicio" className="hero-section">
        <div className="hero-noise" />
        <div className="hero-light-sweep" aria-hidden="true" />
        <div className="hero-particle-cloud" aria-hidden="true">
          <span /><span /><span /><span /><span /><span /><span /><span />
        </div>
        <div className="hero-orbit hero-orbit-one" />
        <div className="hero-orbit hero-orbit-two" />
        <div className="hero-legal-word" aria-hidden="true">
          DIREITO
        </div>
        <div className="hero-crosshair" aria-hidden="true">
          <span />
          <span />
        </div>

        <div className="hero-content">
          <div className="hero-kicker hero-load">
            <span className="kicker-line" />
            Advocacia especializada em Direito da Saúde
          </div>

          <h1 className="hero-title">
            <span className="hero-title-line hero-load hero-delay-1">
              A saúde é
            </span>
            <span className="hero-title-line hero-title-serif hero-load hero-delay-2">
              um direito.
            </span>
          </h1>

          <div className="hero-bottom hero-load hero-delay-3">
            <p>
              Atuação dedicada à proteção do paciente diante de negativas de tratamentos,
              medicamentos, cirurgias, home care, terapias e tecnologias essenciais
              à preservação da vida e da dignidade.
            </p>

            <button
              type="button"
              className="magnetic-button"
              onClick={() => scrollTo("contato")}
            >
              <span>Solicitar atendimento</span>
              <span className="magnetic-icon">
                <ArrowDownRight />
              </span>
            </button>
          </div>
        </div>

        <div className="hero-side-note" aria-hidden="true">
          Direito Médico & Saúde
        </div>

        <button
          type="button"
          className="hero-scroll"
          onClick={() => scrollTo("sobre")}
        >
          <span>Explore</span>
          <ChevronDown size={17} />
        </button>
      </section>

      <section id="sobre" className="manifesto-section">
        <div className="section-index" data-reveal>
          <span>01</span>
          <p>Essência</p>
        </div>

        <div className="manifesto-grid">
          <div className="manifesto-sticky" data-reveal>
            <div className="rd-seal">
              <span>RD</span>
              <svg viewBox="0 0 150 150" aria-hidden="true">
                <defs>
                  <path
                    id="sealPath"
                    d="M 75,75 m -55,0 a 55,55 0 1,1 110,0 a 55,55 0 1,1 -110,0"
                  />
                </defs>
                <text>
                  <textPath href="#sealPath" startOffset="0%">
                    RENAN DURSO • ADVOCACIA • CONSULTORIA •
                  </textPath>
                </text>
              </svg>
            </div>
          </div>

          <div className="manifesto-copy">
            <p className="eyebrow" data-reveal>
              Cada processo representa uma vida.
            </p>
            <h2 data-reveal>
              Atuação técnica para transformar uma negativa em um caminho jurídico
              <em> possível.</em>
            </h2>
            <div className="manifesto-columns" data-reveal>
              <p>
                Renan Durso atua com foco em Direito da Saúde e Direito Médico, analisando
                cada situação a partir da documentação clínica, da urgência e da
                cobertura contratual ou pública envolvida.
              </p>
              <p>
                A formação complementar em gestão hospitalar e auditoria em documentos da
                saúde amplia a compreensão sobre a dinâmica de planos e instituições
                de saúde, permitindo uma estratégia jurídica mais precisa.
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="section-transition" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
      <section className="statement-section">
        <div className="statement-marquee" aria-hidden="true">
          <div>
            <span>ESTRATÉGIA</span>
            <Sparkles />
            <span>PRECISÃO</span>
            <Sparkles />
            <span>CLAREZA</span>
            <Sparkles />
            <span>ESTRATÉGIA</span>
            <Sparkles />
          </div>
        </div>
        <div className="statement-inner">
          <p data-reveal>
            O direito não deve tornar uma decisão mais difícil.
          </p>
          <h2 data-reveal>
            Deve tornar o caminho
            <span> mais claro.</span>
          </h2>
        </div>
      </section>

      <section id="atuacao" className="practice-section">
        <div className="practice-stars" aria-hidden="true">
          <span /><span /><span /><span /><span /><span />
        </div>
        <div className="practice-heading">
          <div className="section-index light" data-reveal>
            <span>02</span>
            <p>Áreas de atuação</p>
          </div>
          <div>
            <p className="eyebrow light" data-reveal>
              Direito da Saúde na prática
            </p>
            <h2 data-reveal>
              Atuação focada em
              <br />
              <em>situações urgentes.</em>
            </h2>
          </div>
        </div>

        <div className="practice-list">
          {practiceAreas.map((area) => {
            const Icon = area.icon;
            return (
              <article className="practice-card" key={area.title} data-reveal>
                <div className="practice-number">{area.number}</div>
                <div className="practice-icon">
                  <Icon />
                </div>
                <h3>{area.title}</h3>
                <p>{area.description}</p>
                <div className="practice-arrow">
                  <ArrowUpRight />
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section id="metodo" className="method-section">
        <div className="method-visual">
          <div className="method-image method-image-main portrait-stage" data-reveal>
            <div className="portrait-aura" />
            <div className="portrait-frame">
              <img
                className="portrait-base"
                src="https://renandurso.lovable.app/__l5e/assets-v1/627158e5-171e-4d04-a900-3ab4beb348d8/adv-1.png"
                alt="Renan Durso, advogado especialista em Direito da Saúde"
              />
              <img
                className="portrait-chest"
                aria-hidden="true"
                src="https://renandurso.lovable.app/__l5e/assets-v1/627158e5-171e-4d04-a900-3ab4beb348d8/adv-1.png"
                alt=""
              />
              <div className="tie-glint" aria-hidden="true" />
            </div>
            <div className="portrait-caption" aria-hidden="true">
              <span>ESPECIALISTA</span>
              <span>DIREITO DA SAÚDE</span>
            </div>
            <div className="method-image-overlay" />
            <div className="method-image-copy">
              <span>RENAN DURSO</span>
              <small>ADVOCACIA & CONSULTORIA</small>
            </div>
          </div>
          <div className="method-floating-card" data-reveal>
            <span>Princípio 01</span>
            <strong>
              Compreender
              <br />
              antes de agir.
            </strong>
          </div>
        </div>

        <div className="method-copy">
          <div className="section-index" data-reveal>
            <span>03</span>
            <p>Método</p>
          </div>
          <p className="eyebrow" data-reveal>
            Técnica, urgência e acolhimento
          </p>
          <h2 data-reveal>
            Cada caso de saúde exige resposta jurídica compatível com a urgência de quem está
            <em> vivendo o problema.</em>
          </h2>
          <p className="method-body" data-reveal>
            A atuação começa pela análise dos relatórios médicos, da negativa e dos documentos
            essenciais. A partir daí, são avaliadas as medidas cabíveis, inclusive pedidos
            de urgência quando o tempo é determinante para o tratamento.
          </p>

          <div className="capability-list" data-reveal>
            {capabilities.map((capability, index) => (
              <div key={capability}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <p>{capability}</p>
                <ArrowRight />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="quote-section">
        <div className="quote-symbol" aria-hidden="true">
          “
        </div>
        <blockquote data-reveal>
          Uma boa orientação jurídica não entrega apenas respostas.
          <em> Organiza possibilidades.</em>
        </blockquote>
        <div className="quote-meta" data-reveal>
          <span>RD</span>
          <p>
            Advocacia e Consultoria
            <small>Itaim Bibi — São Paulo</small>
          </p>
        </div>
      </section>

      <section id="contato" className="contact-section">
        <div className="contact-glow" />
        <div className="contact-top">
          <div className="section-index light" data-reveal>
            <span>04</span>
            <p>Contato</p>
          </div>
          <p className="contact-kicker" data-reveal>
            Precisa conversar sobre uma questão jurídica?
          </p>
        </div>

        <div className="contact-main">
          <h2 data-reveal>
            Vamos transformar a sua questão em um próximo passo
            <em> claro.</em>
          </h2>

          <a
            className="contact-action"
            href="mailto:renandurso@aasp.org.br"
            data-reveal
          >
            <span>Iniciar uma conversa</span>
            <ArrowUpRight />
          </a>
        </div>

        <div className="contact-footer" data-reveal>
          <div>
            <Mail />
            <a href="mailto:renandurso@aasp.org.br">
              renandurso@aasp.org.br
            </a>
          </div>
          <div>
            <MapPin />
            <span>Itaim Bibi, São Paulo</span>
          </div>
          <div>
            <Scale />
            <span>OAB/SP 436.388</span>
          </div>
        </div>

        <footer className="site-footer">
          <div className="footer-brand">
            <span>RD</span>
            <p>
              Renan Durso
              <small>Advocacia & Consultoria</small>
            </p>
          </div>
          <p className="footer-legal">
            Conteúdo institucional de caráter informativo.
          </p>
          <button type="button" onClick={() => scrollTo("inicio")}>
            Voltar ao topo <ArrowUpRight size={14} />
          </button>
        </footer>
      </section>
    </main>
  );
}
