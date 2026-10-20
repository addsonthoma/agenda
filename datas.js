/* Datas em pt-BR e leitura da digitação rápida ("amanhã 14h30 ligar pro Jean !urgente #pessoal"). */
'use strict';

const Datas = (() => {
  const DIAS = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'];
  const DIAS_CURTOS = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb'];
  const MESES = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto',
    'setembro', 'outubro', 'novembro', 'dezembro'];

  const pad = n => String(n).padStart(2, '0');
  const chave = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const parse = s => { const [a, m, d] = s.split('-').map(Number); return new Date(a, m - 1, d); };
  const hoje = () => chave(new Date());
  const somar = (s, dias) => { const d = parse(s); d.setDate(d.getDate() + dias); return chave(d); };
  const diff = (a, b) => Math.round((parse(a) - parse(b)) / 864e5);
  const cap = s => s.charAt(0).toUpperCase() + s.slice(1);
  const curta = s => { const d = parse(s); return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}`; };
  const diaSemana = s => DIAS[parse(s).getDay()] + (parse(s).getDay() > 0 && parse(s).getDay() < 6 ? '-feira' : '');
  const extenso = s => { const d = parse(s); return `${d.getDate()} de ${MESES[d.getMonth()]}`; };
  const extensoAno = s => { const d = parse(s); return `${d.getDate()} de ${MESES[d.getMonth()]} de ${d.getFullYear()}`; };
  const mesAno = (a, m) => `${cap(MESES[m])} ${a}`;

  /** "Hoje", "Amanhã", "Ontem", "Sexta, 23 out" */
  function relativo(s) {
    const n = diff(s, hoje());
    if (n === 0) return 'Hoje';
    if (n === 1) return 'Amanhã';
    if (n === -1) return 'Ontem';
    const d = parse(s);
    const base = `${cap(DIAS_CURTOS[d.getDay()])}, ${d.getDate()} ${MESES[d.getMonth()].slice(0, 3)}`;
    return d.getFullYear() === new Date().getFullYear() ? base : `${base} ${d.getFullYear()}`;
  }

  const semAcento = s => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

  /**
   * Lê a digitação rápida. Reconhece:
   *   datas: hoje, amanhã, depois de amanhã, segunda…domingo, 25/10, 25/10/2026, dia 25
   *   hora:  14h, 14h30, 14:30, às 9
   *   prioridade: !!! (a mais alta), !! (a segunda), !nome (ex.: !urgente)
   *   categoria: #nome (ex.: #pessoal)
   */
  const NUMEROS = { uma: 1, um: 1, duas: 2, dois: 2, 'três': 3, tres: 3, quatro: 4, cinco: 5, seis: 6, sete: 7, oito: 8,
    nove: 9, dez: 10, onze: 11, doze: 12 };

  function interpretar(texto, base, prioridades, categorias) {
    // frases ditadas: tira o "me lembra de…" e a pontuação que o ditado coloca
    let limpo = String(texto).trim()
      .replace(/^(?:(?:me )?lembr(?:a|ar|e)(?:-me)?(?: de| que)?|lembrete:?|anota(?:r)?(?: na agenda)?:?|agenda:?)\s+/i, '')
      .replace(/[,;?]+(?=\s|$)|\.(?=\s|$)/g, ' ');
    let t = ' ' + limpo + ' ';
    const r = { titulo: '', data: null, hora: null, prioridade: null, categoria: null };
    const tira = re => { const m = t.match(re); if (m) t = t.replace(m[0], ' '); return m; };

    // prioridade: !!!, !!, !nome, "prioridade alta/urgente…", ou as duas primeiras faladas por extenso
    let m = tira(/\s(!{2,3})(?=\s)/);
    if (m && prioridades.length) r.prioridade = prioridades[Math.min(3 - m[1].length, prioridades.length - 1)].id;
    m = t.match(/\s!([\p{L}\d-]+)(?=\s)/u);
    if (m) {
      const p = prioridades.find(p => semAcento(p.nome).startsWith(semAcento(m[1])));
      if (p) { r.prioridade = p.id; t = t.replace(m[0], ' '); }
    }
    if (!r.prioridade) {
      m = t.match(/\s(?:com |de )?prioridade ([\p{L}]+)(?=\s)/iu);
      if (m) {
        const p = prioridades.find(p => semAcento(p.nome) === semAcento(m[1]))
          || (/^(alta|maxima)$/i.test(semAcento(m[1])) ? prioridades[0] : null);
        if (p) { r.prioridade = p.id; t = t.replace(m[0], ' '); }
      }
    }
    if (!r.prioridade) {
      // só as duas primeiras (ex.: "urgente", "importante"); "baixa"/"normal" são palavras comuns demais
      for (const p of prioridades.slice(0, 2)) {
        const nome = p.nome.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        if (tira(new RegExp(`\\s(?:[ée] |muito )?${nome}(?=\\s)`, 'iu'))) { r.prioridade = p.id; break; }
      }
    }
    // categoria: #nome ou "categoria nome"
    m = t.match(/\s#([\p{L}\d-]+)(?=\s)/u) || t.match(/\s(?:na |da )?categoria ([\p{L}\d-]+)(?=\s)/iu);
    if (m) {
      const c = categorias.find(c => semAcento(c.nome).startsWith(semAcento(m[1])));
      if (c) { r.categoria = c.id; t = t.replace(m[0], ' '); }
    }
    // data
    const hojeS = hoje();
    if (tira(/\sdepois de amanh[ãa](?=\s)/i)) r.data = somar(hojeS, 2);
    else if (tira(/\samanh[ãa](?=\s)/i)) r.data = somar(hojeS, 1);
    else if (tira(/\shoje(?=\s)/i)) r.data = hojeS;
    else if (tira(/\s(?:na )?semana que vem(?=\s)/i)) r.data = somar(hojeS, 7);
    if (!r.data) {
      m = tira(/\sdaqui a (\d{1,2}|\p{L}+) dias?(?=\s)/iu);
      if (m) { const n = Number(m[1]) || NUMEROS[semAcento(m[1])] || 0; if (n) r.data = somar(hojeS, n); }
    }
    if (!r.data) {
      m = tira(/\s(?:(?:no )?dia )?(\d{1,2}) de (janeiro|fevereiro|mar[çc]o|abril|maio|junho|julho|agosto|setembro|outubro|novembro|dezembro)(?=\s)/i);
      if (m) {
        const mes = MESES.map(semAcento).indexOf(semAcento(m[2]));
        const atual = new Date();
        let d = new Date(atual.getFullYear(), mes, Number(m[1]));
        if (chave(d) < hojeS) d = new Date(atual.getFullYear() + 1, mes, Number(m[1]));
        if (d.getDate() === Number(m[1])) r.data = chave(d);
      }
    }
    if (!r.data) {
      m = tira(/\s(\d{1,2})\/(\d{1,2})(?:\/(\d{2,4}))?(?=\s)/);
      if (m) {
        const atual = new Date();
        let ano = m[3] ? Number(m[3].length === 2 ? '20' + m[3] : m[3]) : atual.getFullYear();
        let d = new Date(ano, Number(m[2]) - 1, Number(m[1]));
        if (!m[3] && chave(d) < hojeS) d = new Date(ano + 1, Number(m[2]) - 1, Number(m[1]));
        if (d.getDate() === Number(m[1])) r.data = chave(d);
      }
    }
    if (!r.data) {
      m = tira(/\s(?:na |no |n[ao]s? )?(?:pr[óo]xim[ao] )?(domingo|segunda|ter[çc]a|quarta|quinta|sexta|s[áa]bado)(?:-feira| feira)?(?: que vem)?(?=\s)/i);
      if (m) {
        const alvo = DIAS.map(semAcento).indexOf(semAcento(m[1]));
        const d = parse(hojeS);
        let n = (alvo - d.getDay() + 7) % 7; if (n === 0) n = 7;
        r.data = somar(hojeS, n);
      }
    }
    if (!r.data) {
      m = tira(/\sdia (\d{1,2})(?=\s)/i);
      if (m) {
        const atual = parse(hojeS);
        let d = new Date(atual.getFullYear(), atual.getMonth(), Number(m[1]));
        if (chave(d) < hojeS) d = new Date(atual.getFullYear(), atual.getMonth() + 1, Number(m[1]));
        if (d.getDate() === Number(m[1])) r.data = chave(d);
      }
    }
    // hora: 14h, 14h30, 14:30, às 9, às 2 e meia da tarde, às duas, 14 horas, meio-dia
    if (tira(/\s(?:ao |[àa]s? )?meio[- ]dia(?: e meia)?(?=\s)/i)) r.hora = /e meia/i.test(texto) ? '12:30' : '12:00';
    else if (tira(/\s(?:[àa] )?meia[- ]noite(?=\s)/i)) r.hora = '00:00';
    if (!r.hora) {
      const NUM = '(\\d{1,2}|uma|duas|tr[êe]s|quatro|cinco|seis|sete|oito|nove|dez|onze|doze)';
      m = tira(new RegExp(`\\s(?:[àa]s?\\s)?(\\d{1,2})(?:h(\\d{2})?|:(\\d{2}))(?:\\s?horas?)?(?:\\s(da manh[ãa]|da tarde|da noite))?(?=\\s)`, 'i'))
        || tira(new RegExp(`\\s(?:[àa]s?|por volta d[ae]s?)\\s${NUM}(?:\\s?horas?)?(?:\\se\\s(meia|\\d{1,2}))?(?:\\s(da manh[ãa]|da tarde|da noite))?(?=\\s)`, 'i'))
        || tira(new RegExp(`\\s(\\d{1,2})\\s?horas?(?:\\se\\s(meia|\\d{1,2}))?(?:\\s(da manh[ãa]|da tarde|da noite))?(?=\\s)`, 'i'));
      if (m) {
        let h = Number(m[1]); if (isNaN(h)) h = NUMEROS[semAcento(m[1])];
        let mi, periodo;
        const falada = m.length !== 5;
        if (!falada) { mi = Number(m[2] || m[3] || 0); periodo = m[4]; }          // forma 14h30 / 14:30
        else { mi = m[2] ? (/meia/i.test(m[2]) ? 30 : Number(m[2])) : 0; periodo = m[3]; }
        if (periodo && /tarde|noite/i.test(periodo) && h < 12) h += 12;
        else if (!periodo && falada && h >= 1 && h <= 6) h += 12;                  // "às 2" no dia a dia = 14h
        if (periodo && /manh/i.test(periodo) && h === 12) h = 0;
        if (h < 24 && mi < 60) r.hora = `${pad(h)}:${pad(mi)}`;
      }
    }
    r.titulo = t.replace(/\s+/g, ' ').trim();
    if (!r.data) r.data = base;
    return r;
  }

  /** Matriz de dias para o calendário (semanas começando no domingo). */
  function grade(ano, mes) {
    const primeiro = new Date(ano, mes, 1);
    const inicio = new Date(ano, mes, 1 - primeiro.getDay());
    const dias = [];
    for (let i = 0; i < 42; i++) {
      const d = new Date(inicio); d.setDate(inicio.getDate() + i);
      dias.push({ chave: chave(d), dia: d.getDate(), doMes: d.getMonth() === mes, semana: d.getDay() });
    }
    // remove a última semana se ela for toda do mês seguinte
    return dias.slice(35).every(x => !x.doMes) ? dias.slice(0, 35) : dias;
  }

  return { DIAS, DIAS_CURTOS, MESES, pad, chave, parse, hoje, somar, diff, cap, curta, diaSemana,
    extenso, extensoAno, mesAno, relativo, semAcento, interpretar, grade };
})();
