# Roadmap de conversão — próximas 10 melhorias (26/11/2026)

As melhorias estão ordenadas por impacto e risco face ao esforço. Cada uma tem um critério de "feito" verificável. A base está na [auditoria](AUDITORIA-conversao.md) e no [benchmark](BENCHMARK-conversao.md); as letras entre parênteses retos são as fontes do benchmark.

| # | Melhoria | Porquê | Esforço | Feito quando |
|---|---|---|---|---|
| 1 | **Validação clínica dos sinais de alerta e das sugestões** por um médico ou fisioterapeuta em Portugal. Registar o nome, a data e a versão revista. | Hoje as listas são adaptações do NHS que nenhum clínico reviu. É o maior risco e o argumento mais forte para parceiros. A Curable e a Ada citam estudos e revisão clínica [C1][A6]. | M (depende de parceiro) | Ficheiro `docs/validacao-clinica.md` assinado e a FAQ atualizada |
| 2 | **Medição sem dados pessoais:** contagem anónima de 5 eventos (mapa usado, sinais confirmados, resultado visto, passo concluído, resumo copiado ou descarregado), com uma ferramenta sem cookies (por exemplo, a instância Umami própria). | Sem números não se sabe onde as pessoas desistem. A promessa de privacidade tem de continuar verdadeira: nada de texto escrito nem de identificadores. | S | Dashboard com o funil; a FAQ de privacidade descreve exatamente o que é contado |
| 3 | **Resumo em PDF ou para impressão**, com uma folha de estilo de impressão e uma página A4 pronta para o médico. | O Manage My Pain e a Ada vendem o relatório para o médico como valor principal [M1][A4]. Hoje há só texto e `.txt`. | S | O botão "Imprimir" gera 1 página A4 legível; teste e2e |
| 4 | **Indicador de progresso no fluxo** (1 Zona → 2 Contexto → 3 Sinais → 4 Resultado → 5 Passo) e uma pergunta guiada quando o texto não traz contexto. | Reduz a incerteza sobre "quanto falta" [C4][S1]. Hoje, sem contexto, as perguntas são genéricas. | M | O resultado mostra pelo menos 1 pergunta personalizada em 80 % das sessões (medido com o item 2) |
| 5 | **Página ou secção para clínicos e investidores:** problema, abordagem, segurança, roadmap e um resumo de exemplo descarregável. | Hoje o pitch é só um bloco. O Manage My Pain usa "Download Sample Report" para convencer clínicos [M1]. | S | URL próprio com OG próprio; CTA mailto com assunto pré-preenchido |
| 6 | **Prova social honesta:** história de origem, a equipa e, depois do piloto, 3 testemunhos reais com a zona do corpo. Nunca métricas sem metodologia. | Todos os concorrentes têm prova social [B1][M1][C1]. Inventar números destrói a confiança. | S, depois de haver piloto | Secção com fontes; zero números sem fonte |
| 7 | **Lembrete opcional para repetir o passo** (ficheiro `.ics` gerado localmente para daqui a 2–3 dias) e comparação com o registo anterior. | O resumo diz "repete noutro dia"; sem lembrete, isso não acontece. Com `.ics` não é preciso conta. A Bearable e o Manage My Pain retêm com lembretes [B2][M2]. | S | Botão "Lembrar-me" que gera o `.ics`; o registo mostra a variação face à última vez |
| 8 | **Versão EN e ES** (rotas `/en/` e `/es/` com `hreflang`), mantendo os números de emergência por país. | Alarga o público dos parceiros e o SEO. Os contactos de emergência têm de mudar por país (112 UE; NHS 111 no Reino Unido). | M | 3 idiomas com `hreflang` válido; testes de alerta por idioma |
| 9 | **Performance:** pré-renderizar a landing (HTML estático com o hero) e carregar o React por cima. | Hoje o HTML chega vazio até o JS (81 kB gzip) correr. Isto atrasa o LCP em redes móveis e esconde o conteúdo de crawlers simples. | M | LCP < 2,5 s em 4G simulado (Lighthouse mobile); o HTML inicial contém o H1 |
| 10 | **Testes de linguagem mais largos para os alertas:** corpus de 100 frases reais (anonimizadas) com o resultado esperado, incluindo negações e erros ortográficos. | A deteção por regras falha de formas previsíveis. Hoje há cerca de 10 casos testados. | S | Corpus em `src/test/fixtures`; ≥ 95 % de acerto, com os falsos negativos de crise a 0 |

## Decisões que só o Nuno pode tomar

- **Item 1:** quem valida clinicamente, e se há custo.
- **Item 2:** se pode ligar-se a analítica, mesmo anónima. Muda a promessa "nada sai do navegador" (o texto continua a não sair).
- **Item 5:** se a demo passa a ter domínio próprio (hoje está em GitHub Pages).
- **Itens 6 e 8:** a ordem face aos outros projetos (o SomaSignal não está na tabela de objetivos de `OPERACAO.md`).
