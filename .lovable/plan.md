# Reconstrução cinematográfica — Renan Durso

## Objetivo
Refazer integralmente a experiência visual como uma narrativa editorial de luxo, preservando conteúdo jurídico, contatos, SEO, foto real, imagens de atuação e funcionamento do formulário.

## O que será construído
- **Abertura imersiva:** foto real em grande escala, nome “RENAN DURSO” atravessando a composição em camadas, navegação mínima e movimentos sutis ligados ao scroll e ao ponteiro.
- **Construção da defesa:** cena longa e fixa usando os assets de `/public/anatomia`, com base, camisa, gravata, colete e paletó acumulando no mesmo canvas, seguida por uma passagem contínua ao retrato real.
- **Atuação em quatro capítulos:** Home Care, Medicamentos, Oncologia e Cirurgias/Terapias dentro de uma única cena fixa, com número, texto e fotografia mudando progressivamente.
- **Perfil editorial:** retrato amplo e texto institucional existente em composição de revista, sem inventar credenciais ou dados.
- **Manifesto:** pausa tipográfica escura com uma frase já presente no posicionamento atual.
- **Contato final:** chamada ampla, formulário preservado com fallback por e-mail, contatos atuais e rodapé mínimo.

## Direção visual
- Carvão e azul-noite quase preto, branco quente e champagne usado apenas como acento.
- Tipografia serifada editorial de alto contraste nos títulos e sans limpa nos detalhes.
- Muito espaço negativo, linhas finas, números grandes e microtipografia discreta.
- Fotografias tratadas com recorte, contraste e luz de campanha; sem cartões SaaS, ícones decorativos ou ornamentos genéricos.
- Uma composição contínua entre cenas, sem blocos isolados ou cortes visuais duros.

## Movimento e adaptação
- Scroll sincronizado com `requestAnimationFrame`, propriedades CSS e cenas sticky, sem nova dependência pesada.
- Movimento de escala, máscara, profundidade e parallax moderado; conteúdo e ações permanecem legíveis e clicáveis.
- Versão mobile própria entre 360–430 px, mantendo a montagem acumulativa e o ritmo cinematográfico.
- Estado estático completo para `prefers-reduced-motion`, sem esconder informações.

## Implementação técnica
- Reestruturar `src/App.jsx` em pequenas cenas e controles reutilizáveis, preservando os dados e o envio atual para `/api/contact`.
- Substituir `src/styles.css` por um sistema coeso de tokens e estilos, removendo os milhares de overrides acumulados.
- Usar os cinco arquivos de alfaiataria no mesmo sistema de coordenadas e corrigir escala/alinhamento pela dimensão real dos assets.
- Manter as imagens existentes das áreas de atuação e a foto real já usada pelo projeto.
- Ajustar apenas os metadados faltantes exigidos para compartilhamento, sem alterar o posicionamento jurídico.

## Validação
- Conferir a experiência em 1440 px, 1920 px, notebook e mobile de 360/390/430 px.
- Percorrer os principais pontos de scroll para validar montagem, capítulos, transições, navegação e ausência de telas vazias.
- Testar abertura/fechamento do menu, CTAs, campos e fallback do formulário sem enviar uma mensagem real.
- Revisar overflow, cortes de texto, estabilidade visual, console e resultado da compilação.
- Não publicar; deixar somente a preview pronta para avaliação.
