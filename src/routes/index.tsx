import { createFileRoute } from "@tanstack/react-router";
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Building2,
  ChevronDown,
  Landmark,
  Mail,
  MapPin,
  Menu,
  Scale,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

export const Route = createFileRoute("/")({
  component: Index,
});

const practiceAreas = [
  {
    number: "01",
    title: "Direito Civil",
    description:
      "Atuação consultiva e contenciosa em relações privadas, obrigações, responsabilidade civil e proteção de direitos.",
    icon: Scale,
  },
  {
    number: "02",
    title: "Direito Empresarial",
    description:
      "Assessoria jurídica para empresas, contratos, relações societárias, prevenção de riscos e decisões estratégicas.",
    icon: Building2,
  },
  {
    number: "03",
    title: "Direito do Consumidor",
    description:
      "Orientação e representação em conflitos de consumo, práticas abusivas, contratos e responsabilidade de fornecedores.",
    icon: ShieldCheck,
  },
  {
    number: "04",
    title: "Direito Bancário",
    description:
      "Análise de relações bancárias, contratos, cobranças, operações financeiras e medidas de proteção patrimonial.",
    icon: Landmark,
  },
];

const capabilities = [
  "Consultoria jurídica",
  "Contencioso estratégico",
  "Análise contratual",
  "Negociação",
  "Pareceres",
  "Prevenção de riscos",
];

function Index() {
  const [menuOpen, setMenuOpen] = useState(false);
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

    updateScroll();
    window.addEventListener("scroll", updateScroll, { passive: true });

    return () => {
      observerRef.current?.disconnect();
      window.removeEventListener("scroll", updateScroll);
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
        <div className="hero-orbit hero-orbit-one" />
        <div className="hero-orbit hero-orbit-two" />
        <div className="hero-legal-word" aria-hidden="true">
          DIREITO
        </div>

        <div className="hero-content">
          <div className="hero-kicker hero-load">
            <span className="kicker-line" />
            Advocacia estratégica em Birigui — SP
          </div>

          <h1 className="hero-title">
            <span className="hero-title-line hero-load hero-delay-1">
              Clareza para
            </span>
            <span className="hero-title-line hero-title-serif hero-load hero-delay-2">
              decisões complexas.
            </span>
          </h1>

          <div className="hero-bottom hero-load hero-delay-3">
            <p>
              Atuação jurídica pautada em análise, estratégia e comunicação
              direta para pessoas e empresas que precisam transformar questões
              jurídicas em decisões seguras.
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
          OAB/SP 436.388
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
              A advocacia começa antes do processo.
            </p>
            <h2 data-reveal>
              Estratégia jurídica é entender o cenário inteiro antes de definir
              o próximo <em>movimento.</em>
            </h2>
            <div className="manifesto-columns" data-reveal>
              <p>
                Renan Durso atua na advocacia e consultoria jurídica em Birigui,
                com abordagem voltada à compreensão individual de cada demanda,
                seus riscos e seus possíveis caminhos.
              </p>
              <p>
                O trabalho combina análise técnica, comunicação objetiva e
                construção de estratégias adequadas às particularidades de cada
                caso, tanto na prevenção quanto na condução de conflitos.
              </p>
            </div>
          </div>
        </div>
      </section>

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
        <div className="practice-heading">
          <div className="section-index light" data-reveal>
            <span>02</span>
            <p>Áreas de atuação</p>
          </div>
          <div>
            <p className="eyebrow light" data-reveal>
              Atuação consultiva e contenciosa
            </p>
            <h2 data-reveal>
              Direito pensado para
              <br />
              <em>situações reais.</em>
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
          <div className="method-image method-image-main" data-reveal>
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
            Técnica, proximidade e direção
          </p>
          <h2 data-reveal>
            Cada caso exige uma estratégia que faça sentido para quem está
            <em> vivendo o problema.</em>
          </h2>
          <p className="method-body" data-reveal>
            A atuação parte de uma leitura cuidadosa do contexto, segue pela
            definição de prioridades e chega à construção de uma estratégia
            jurídica compreensível. O cliente acompanha o raciocínio, conhece
            os próximos passos e participa das decisões importantes.
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
            <small>Birigui — São Paulo</small>
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
            <span>Birigui, São Paulo</span>
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
