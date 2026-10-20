/* Agenda — interface. Estado único (S), render por funções, eventos por delegação. */
'use strict';

/* ================================================================ ícones */
const ICONES = {
  plus: '<path d="M12 5v14M5 12h14"/>',
  check: '<path d="M5 12l5 5L20 7"/>',
  esq: '<path d="M15 6l-6 6 6 6"/>',
  dir: '<path d="M9 6l6 6-6 6"/>',
  baixo: '<path d="M6 9l6 6 6-6"/>',
  cima: '<path d="M6 15l6-6 6 6"/>',
  sol: '<circle cx="12" cy="12" r="4"/><path d="M12 3v1M12 20v1M3 12h1M20 12h1M5.6 5.6l.7.7M17.7 17.7l.7.7M5.6 18.4l.7-.7M17.7 6.3l.7-.7"/>',
  cal: '<rect x="4" y="5" width="16" height="16" rx="2"/><path d="M16 3v4M8 3v4M4 11h16"/>',
  hist: '<path d="M12 8v4l2 2"/><path d="M3.05 11a9 9 0 1 1 .5 4M3 20v-5h5"/>',
  ajustes: '<path d="M4 6h8M16 6h4M4 12h2M10 12h10M4 18h11M19 18h1"/><circle cx="14" cy="6" r="2"/><circle cx="8" cy="12" r="2"/><circle cx="17" cy="18" r="2"/>',
  pin: '<path d="M15 4.5l-4 4-4 1.5-1.5 1.5 7 7 1.5-1.5 1.5-4 4-4M9 15l-4.5 4.5M14.5 4L20 9.5"/>',
  busca: '<circle cx="10" cy="10" r="7"/><path d="M21 21l-6-6"/>',
  lixo: '<path d="M4 7h16M10 11v6M14 11v6M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2l1-12M9 7V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3"/>',
  adiar: '<path d="M15 14l5-5-5-5"/><path d="M20 9H9.5a5.5 5.5 0 0 0 0 11H13"/>',
  sino: '<path d="M10 5a2 2 0 1 1 4 0 7 7 0 0 1 4 6v3a4 4 0 0 0 2 3H4a4 4 0 0 0 2-3v-3a7 7 0 0 1 4-6M9 17v1a3 3 0 0 0 6 0v-1"/>',
  nota: '<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 7h6M9 11h6M9 15h4"/>',
  bandeira: '<path d="M5 5a5 5 0 0 1 7 0 5 5 0 0 0 7 0v9a5 5 0 0 1-7 0 5 5 0 0 0-7 0V5zM5 21v-7"/>',
  x: '<path d="M18 6L6 18M6 6l12 12"/>',
  lapis: '<path d="M4 20h4L18.5 9.5a2.8 2.8 0 0 0-4-4L4 16v4M13.5 6.5l4 4"/>',
  relogio: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/>',
  lista: '<path d="M9 6h11M9 12h11M9 18h11M5 6v.01M5 12v.01M5 18v.01"/>',
  celular: '<rect x="6" y="3" width="12" height="18" rx="2"/><path d="M11 4h2M12 17v.01"/>',
  pasta: '<path d="M5 4h4l3 3h7a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2"/>',
  reabrir: '<path d="M9 14L4 9l5-5"/><path d="M4 9h10.5a5.5 5.5 0 0 1 0 11H11"/>',
  folha: '<path d="M14 3v4a1 1 0 0 0 1 1h4"/><path d="M17 21H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7l5 5v11a2 2 0 0 1-2 2zM9 13h6M9 17h4"/>',
  nuvem: '<path d="M7 18a4.6 4.4 0 0 1 0-9 5 4.5 0 0 1 9.6 1.5h.9a3.5 3.5 0 0 1 0 7.5H7"/><path d="M9.5 13.5l2 2 3.5-3.5"/>',
  nuvemoff: '<path d="M7 18a4.6 4.4 0 0 1 0-9 5 4.5 0 0 1 9.6 1.5h.9a3.5 3.5 0 0 1 0 7.5H7"/><path d="M12 11v3M12 16.5v.01"/>',
  mic: '<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3M8 21h8"/>',
};
const ic = (n, cls = '') => `<svg class="i ${cls}" viewBox="0 0 24 24" aria-hidden="true">${ICONES[n] || ''}</svg>`;
const bandeiraCheia = cor => `<svg class="i" viewBox="0 0 24 24" aria-hidden="true" style="stroke:${cor};fill:${cor}">${ICONES.bandeira}</svg>`;

/* ================================================================ utilidades */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const plural = (n, s, p = s + 's') => `${n} ${n === 1 ? s : p}`;
const lerLocal = (k, padrao) => { try { const v = localStorage.getItem(k); return v === null ? padrao : JSON.parse(v); } catch { return padrao; } };
const gravarLocal = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* ignorar */ } };
const LEMBRETES = [[null, 'Sem lembrete'], [0, 'Na hora'], [5, '5 min antes'], [15, '15 min antes'], [30, '30 min antes'],
  [60, '1 hora antes'], [120, '2 horas antes'], [1440, '1 dia antes']];
const nomeLembrete = v => (LEMBRETES.find(l => l[0] === v) || [, `${v} min antes`])[1];

/* ================================================================ estado */
const S = {
  e: null,                 // estado vindo do motor
  motor: null,
  hoje: Datas.hoje(),
  vista: 'dia',            // dia | proximos | historico | config | mes
  dia: Datas.hoje(),
  mes: null,               // [ano, mes] exibido no calendário
  filtro: { cat: null, prio: null },
  busca: '',
  rapida: '',
  fechados: lerLocal('agenda.fechados', {}),
  histAbertos: new Set(),
  histLimite: 45,
  edit: null,
  arrastando: null,
};

const cat = id => S.e.categorias.find(c => c.id === id) || { id, nome: '—', cor: '#8E8E93' };
const prio = id => S.e.prioridades.find(p => p.id === id) || { id, nome: '—', cor: '#8E8E93' };
const prioIdx = id => { const i = S.e.prioridades.findIndex(p => p.id === id); return i < 0 ? 99 : i; };
const prioPadrao = () => (S.e.prioridades.find(p => p.id === 'normal') || S.e.prioridades.at(-1)).id;
const passaFiltro = t => (!S.filtro.cat || t.categoria === S.filtro.cat) && (!S.filtro.prio || t.prioridade === S.filtro.prio);

function ordenar(lista) {
  const modo = S.e.config.ordenacao;
  const hora = t => t.hora || '99:99';
  return lista.slice().sort((a, b) => {
    if (modo === 'manual') return a.ordem - b.ordem;
    if (modo === 'horario') return hora(a).localeCompare(hora(b)) || prioIdx(a.prioridade) - prioIdx(b.prioridade) || a.ordem - b.ordem;
    return prioIdx(a.prioridade) - prioIdx(b.prioridade) || hora(a).localeCompare(hora(b)) || a.ordem - b.ordem;
  });
}
const doDia = d => S.e.tarefas.filter(t => t.data === d);
const abertasDoDia = d => ordenar(doDia(d).filter(t => !t.feita && passaFiltro(t)));
const feitasDoDia = d => doDia(d).filter(t => t.feita && passaFiltro(t))
  .sort((a, b) => String(b.feita_em).localeCompare(String(a.feita_em)));
const passaramNoDia = d => S.e.tarefas.filter(t => t.passou_por.includes(d) && passaFiltro(t));

function modo() {
  if (matchMedia('(max-width: 599px)').matches) return 'compacto';
  if (matchMedia('(max-width: 979px)').matches) return 'medio';
  return 'amplo';
}

/* ================================================================ dados */
async function recarregar() {
  S.e = await S.motor.carregar();
  if (Datas.hoje() !== S.hoje) virouODia();
  aplicarTema();
  render();
}

function virouODia() {
  const antigo = S.hoje;
  S.hoje = Datas.hoje();
  if (S.dia === antigo) S.dia = S.hoje;
}

async function acao(promessa, msg) {
  try {
    const r = await promessa;
    await recarregar();
    if (msg) aviso(msg);
    return r;
  } catch (err) {
    console.error(err);
    aviso('Não deu para salvar. Tente de novo.');
    return null;
  }
}

/* ================================================================ render geral */
function render() {
  // preserva o foco/cursor (para não atrapalhar quem está digitando quando algo externo atualiza)
  const ativo = document.activeElement;
  const foco = ativo && ativo.id ? { id: ativo.id, a: ativo.selectionStart, b: ativo.selectionEnd } : null;
  const rolagem = $('#pagina').scrollTop;

  const m = modo();
  const login = !!(Ponte.nuvem && Ponte.nuvem.precisaLogin());
  $('#app').classList.toggle('so-pagina', login);
  $('#lateral').innerHTML = m === 'amplo' && !login ? htmlLateral() : '';
  $('#colcal').innerHTML = m !== 'compacto' && !login ? htmlColcal() : '';
  $('#pagina').innerHTML = `<div class="pagina-int">${login ? htmlLogin() : htmlPagina(m)}</div>`;
  $('#pagina').scrollTop = rolagem;
  ajustarAlturas();

  if (foco) {
    const el = document.getElementById(foco.id);
    if (el) { el.focus(); try { el.setSelectionRange(foco.a, foco.b); } catch { /* campo sem seleção */ } }
  }
}

function ajustarAlturas() {
  $$('textarea[data-auto]').forEach(autoAltura);
}
function autoAltura(el) { el.style.height = 'auto'; el.style.height = el.scrollHeight + 'px'; }

/* ================================================================ lateral */
function htmlLateral() {
  const abertasHoje = doDia(S.hoje).filter(t => !t.feita).length;
  const futuras = S.e.tarefas.filter(t => t.data > S.hoje && !t.feita).length;
  const abertas = S.e.tarefas.filter(t => !t.feita);
  const navItem = (vista, icone, nome, cont) =>
    `<button class="nav-item ${S.vista === vista && !(vista === 'dia' && S.dia !== S.hoje) ? 'on' : ''}" data-ir="${vista}">
      ${ic(icone)}<span>${nome}</span>${cont !== undefined ? `<span class="cont">${cont || ''}</span>` : ''}</button>`;
  return `
    <div class="marca"><img src="icone.png" alt=""><div><b>Agenda</b><small>Addson</small></div></div>
    <div class="busca">${ic('busca')}<input id="busca-lateral" class="campo" type="search" placeholder="Buscar" value="${esc(S.busca)}" autocomplete="off"></div>
    <div class="lateral-rolo">
      ${navItem('dia', 'sol', 'Hoje', abertasHoje)}
      ${navItem('proximos', 'cal', 'Próximos', futuras)}
      ${navItem('historico', 'hist', 'Histórico')}
      <div class="nav-grupo">Prioridades</div>
      ${S.e.prioridades.map(p => `<button class="nav-item ${S.filtro.prio === p.id ? 'on' : ''}" data-filtro-prio="${p.id}">
        <span class="bandeira">${bandeiraCheia(p.cor)}</span><span>${esc(p.nome)}</span>
        <span class="cont">${abertas.filter(t => t.prioridade === p.id).length || ''}</span></button>`).join('')}
      <div class="nav-grupo">Categorias</div>
      ${S.e.categorias.map(c => `<button class="nav-item ${S.filtro.cat === c.id ? 'on' : ''}" data-filtro-cat="${c.id}">
        <span class="bolinha" style="background:${c.cor}"></span><span>${esc(c.nome)}</span>
        <span class="cont">${abertas.filter(t => t.categoria === c.id).length || ''}</span></button>`).join('')}
    </div>
    <div class="lateral-pe">
      ${S.motor.plataforma === 'windows' ? botaoPin() : ''}
      ${htmlIndicadorNuvem()}
      <button class="bt-icone ${S.vista === 'config' ? 'ligado' : ''}" data-ir="config" title="Ajustes (,)" aria-label="Ajustes">${ic('ajustes')}</button>
    </div>`;
}

function botaoPin() {
  const on = S.e.config.sempre_por_cima;
  return `<button class="bt-icone ${on ? 'ligado' : ''}" data-acao="pin" aria-pressed="${on}"
    title="${on ? 'Fixada por cima das outras janelas (clique para soltar)' : 'Fixar por cima das outras janelas'}"
    aria-label="Fixar por cima">${ic('pin')}</button>`;
}

/* ================================================================ calendário */
function htmlCalendario(grande = false) {
  const [ano, mes] = S.mes;
  const dias = Datas.grade(ano, mes);
  return `<div class="cal ${grande ? 'grande' : ''}">
    <div class="cal-topo">
      <h2>${Datas.mesAno(ano, mes)}</h2>
      ${S.dia !== S.hoje || ano !== new Date().getFullYear() || mes !== new Date().getMonth()
        ? '<button class="bt texto" data-acao="hoje" style="height:26px">Hoje</button>' : ''}
      <button class="bt-icone" data-acao="mes-ant" aria-label="Mês anterior">${ic('esq')}</button>
      <button class="bt-icone" data-acao="mes-prox" aria-label="Próximo mês">${ic('dir')}</button>
    </div>
    <div class="cal-sem">${['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map(l => `<div>${l}</div>`).join('')}</div>
    <div class="cal-grade">${dias.map(d => {
      const passado = d.chave < S.hoje;
      let pontos;
      if (passado) {
        const n = doDia(d.chave).filter(t => t.feita).length;
        pontos = Array.from({ length: Math.min(n, 3) }, () => '<i class="apagado" style="background:var(--texto-3)"></i>').join('');
      } else {
        const ts = ordenar(doDia(d.chave).filter(t => !t.feita));
        pontos = ts.slice(0, 3).map(t => `<i style="background:${prio(t.prioridade).cor}"></i>`).join('')
          || (doDia(d.chave).length ? '<i class="apagado" style="background:var(--ok)"></i>' : '');
      }
      const cls = [!d.doMes && 'fora', d.semana % 6 === 0 && 'fds', d.chave === S.hoje && 'hoje', d.chave === S.dia && S.vista === 'dia' && 'sel'].filter(Boolean).join(' ');
      return `<button class="cal-dia ${cls}" data-dia="${d.chave}" aria-label="${Datas.extensoAno(d.chave)}"><span class="n">${d.dia}</span><span class="cal-pontos">${pontos}</span></button>`;
    }).join('')}</div>
  </div>`;
}

function htmlColcal(grande = false) {
  const prox = [];
  for (let i = 1; i <= 7; i++) {
    const d = Datas.somar(S.hoje, i);
    for (const t of abertasDoDia(d)) prox.push(t);
  }
  return `${htmlCalendario(grande)}
    <div class="prox">
      <h3>${ic('cal', 'peq')} Próximos 7 dias</h3>
      ${prox.length ? prox.slice(0, 12).map(t => `
        <div class="prox-item" data-abrir-dia="${t.data}" data-foco="${t.id}">
          <span class="barra" style="background:${prio(t.prioridade).cor}"></span>
          <div style="min-width:0"><div class="t">${esc(t.titulo)}</div>
          <div class="s">${Datas.relativo(t.data)}${t.hora ? ' · ' + t.hora : ''} · ${esc(cat(t.categoria).nome)}</div></div>
        </div>`).join('') + (prox.length > 12 ? `<button class="bt texto" data-ir="proximos" style="margin:4px">Ver todos (${prox.length})</button>` : '')
        : '<div class="vazio-mini">Nada agendado na próxima semana.</div>'}
    </div>`;
}

/* ================================================================ página */
function barraTopo(m) {
  let seg = '';
  if (m !== 'amplo') {
    const itens = m === 'compacto'
      ? [['dia', 'Dia'], ['mes', 'Mês'], ['proximos', 'Próx.'], ['historico', 'Hist.']]
      : [['dia', 'Dia'], ['proximos', 'Próximos'], ['historico', 'Histórico']];
    seg = `<div class="segmento" role="tablist">${itens.map(([v, n]) =>
      `<button role="tab" class="${S.vista === v ? 'on' : ''}" aria-selected="${S.vista === v}" data-ir="${v}">${n}</button>`).join('')}</div>`;
  }
  return `<div class="barra-topo">${seg}<span class="espaco"></span>
    ${m !== 'amplo' ? htmlIndicadorNuvem() + (S.motor.plataforma === 'windows' ? botaoPin() : '') + `<button class="bt-icone ${S.vista === 'config' ? 'ligado' : ''}" data-ir="config" aria-label="Ajustes">${ic('ajustes')}</button>` : ''}
  </div>`;
}

function chipFiltro() {
  const partes = [];
  if (S.filtro.prio) partes.push(prio(S.filtro.prio).nome);
  if (S.filtro.cat) partes.push(cat(S.filtro.cat).nome);
  if (!partes.length) return '';
  return `<div class="filtro-ativo">Mostrando só: ${esc(partes.join(' + '))}
    <button data-acao="limpar-filtro" aria-label="Limpar filtro">${ic('x', 'peq')}</button></div>`;
}

function htmlPagina(m) {
  const topo = (m !== 'amplo' || S.vista === 'config') ? barraTopo(m) : '';
  switch (S.vista) {
    case 'proximos': return topo + htmlProximos();
    case 'historico': return topo + htmlHistorico();
    case 'config': return topo + htmlConfig();
    case 'mes': return topo + htmlColcal(true);
    default: return topo + htmlDia();
  }
}

/* ---------------------------------------------------------------- dia */
function htmlDia() {
  const d = S.dia, passado = d < S.hoje;
  const todas = doDia(d).filter(passaFiltro);
  const feitasN = todas.filter(t => t.feita).length;
  const total = passado ? feitasN + passaramNoDia(d).length : todas.length;
  const n = Datas.diff(d, S.hoje);
  const rel = n === 0 ? 'Hoje' : n === 1 ? 'Amanhã' : n === -1 ? 'Ontem' : n > 0 ? `Em ${n} dias` : `Há ${-n} dias`;
  const circ = 2 * Math.PI * 21, frac = total ? feitasN / total : 0;

  let corpo;
  if (passado) {
    const feitas = feitasDoDia(d), foram = passaramNoDia(d);
    corpo = `<div class="encerrado">${ic('hist')} Dia encerrado. Aqui fica o registro do que foi feito e do que passou adiante.</div>
      ${feitas.length ? grupo('feitas-' + d, 'Feitas neste dia', feitas, true) : ''}
      ${foram.length ? grupo('foram-' + d, 'Passaram para o dia seguinte', foram, true, true) : ''}
      ${!feitas.length && !foram.length ? vazio('folha', 'Nada registrado', 'Nenhuma pendência neste dia.') : ''}`;
  } else {
    const abertas = abertasDoDia(d), feitas = feitasDoDia(d);
    corpo = htmlRapida() + chipFiltro()
      + (abertas.length ? grupo('abertas', 'A fazer', abertas) : '')
      + (!abertas.length && !feitas.length
        ? vazio('sol', d === S.hoje ? 'Dia livre' : 'Nada agendado', 'Escreva acima para lançar uma pendência.')
        : !abertas.length ? vazio('check', 'Tudo feito', 'Nenhuma pendência em aberto. Bom trabalho.') : '')
      + (feitas.length ? grupo('concluidas', 'Concluídas', feitas) : '');
  }

  return `
    <div class="cab-dia">
      <div class="tit">
        <h1>${Datas.cap(Datas.diaSemana(d))}</h1>
        <div class="sub">${Datas.extensoAno(d)} · <b>${rel}</b>
          ${d !== S.hoje ? ' · <button class="bt texto" data-acao="hoje" style="height:22px;font-size:13px;padding:0 6px">Voltar para hoje</button>' : ''}</div>
      </div>
      ${total ? `<div class="anel" title="${feitasN} de ${total} feitas"><svg viewBox="0 0 52 52"><circle class="f" cx="26" cy="26" r="21"/>
        <circle class="p" cx="26" cy="26" r="21" stroke-dasharray="${circ}" stroke-dashoffset="${circ * (1 - frac)}"/></svg>
        <span>${feitasN}/${total}</span></div>` : ''}
      <div style="display:flex">
        <button class="bt-icone" data-acao="dia-ant" title="Dia anterior (←)" aria-label="Dia anterior">${ic('esq')}</button>
        <button class="bt-icone" data-acao="dia-prox" title="Próximo dia (→)" aria-label="Próximo dia">${ic('dir')}</button>
      </div>
    </div>
    ${corpo}
    <div class="notas">
      <div class="grupo-cab">${ic('nota', 'peq')} Anotações do dia<span class="estado" id="notas-estado"></span></div>
      <textarea id="notas-dia" data-auto placeholder="Escreva livremente: telefonemas, ideias, recados..." spellcheck="true">${esc(S.e.anotacoes[d] || '')}</textarea>
    </div>`;
}

function htmlRapida() {
  return `<div class="rapida">
    <label class="rapida-caixa">${ic('plus')}
      <input id="rapida" value="${esc(S.rapida)}" placeholder="Nova pendência" autocomplete="off" aria-label="Nova pendência" enterkeyhint="done">
      ${Reconhecimento ? `<button type="button" class="bt-icone mic" id="bt-mic" data-acao="mic" title="Ditar" aria-label="Ditar pendência">${ic('mic')}</button>` : ''}
      <kbd>Enter</kbd></label>
    <div class="previa" id="previa">${htmlPrevia()}</div>
  </div>`;
}

function htmlPrevia() {
  if (!S.rapida.trim()) return '';
  const r = Datas.interpretar(S.rapida, S.dia, S.e.prioridades, S.e.categorias);
  const p = [];
  if (r.data !== S.dia) p.push(`<span class="pilula">${ic('cal', 'peq')}${Datas.relativo(r.data)}</span>`);
  if (r.hora) p.push(`<span class="pilula">${ic('relogio', 'peq')}${r.hora}</span>`);
  if (r.prioridade) p.push(`<span class="pilula"><i style="background:${prio(r.prioridade).cor}"></i>${esc(prio(r.prioridade).nome)}</span>`);
  if (r.categoria) p.push(`<span class="pilula"><i style="background:${cat(r.categoria).cor}"></i>${esc(cat(r.categoria).nome)}</span>`);
  return p.length ? p.join('') : '<span class="dica">Dica: <code>amanhã 14h30</code> <code>!urgente</code> <code>#pessoal</code> <code>sexta</code> <code>25/10</code></span>';
}

function grupo(chave, titulo, lista, leitura = false, passou = false) {
  const fechado = S.fechados[chave];
  return `<div class="grupo ${fechado ? 'fechado' : ''}" data-grupo="${chave}">
    <div class="grupo-cab"><span>${titulo}</span><span class="cont">${lista.length}</span>
      <button class="bt-icone" data-acao="grupo" data-chave="${chave}" aria-label="Recolher ou expandir">${ic('baixo', 'seta')}</button></div>
    <div class="lista" ${!leitura && chave === 'abertas' ? 'data-lista-abertas' : ''}>${lista.map(t => linha(t, leitura, passou)).join('')}</div>
  </div>`;
}

function linha(t, leitura = false, passou = false) {
  const c = cat(t.categoria), p = prio(t.prioridade);
  const meta = [`<span><i class="bol" style="background:${c.cor}"></i>${esc(c.nome)}</span>`];
  if (t.prioridade !== prioPadrao()) meta.push(`<span class="prio" style="color:${p.cor}">${bandeiraCheia(p.cor)}${esc(p.nome)}</span>`);
  if (t.passou_por.length && !leitura) {
    const n = t.passou_por.length;
    meta.push(`<span class="veio ${n >= 3 ? 'muito' : ''}" title="Passou por: ${t.passou_por.map(Datas.curta).join(', ')}">${ic('adiar')}veio de ${Datas.curta(t.passou_por[0])} · adiada ${n}x</span>`);
  }
  if (passou) meta.push(`<span class="veio">${ic('adiar')}${t.feita ? 'feita em ' + Datas.curta(t.data) : 'ainda em aberto'}</span>`);
  if (t.lembrete !== null && !t.feita && !leitura) meta.push(`<span title="Lembrete">${ic('sino')}${nomeLembrete(t.lembrete)}</span>`);
  const arrastavel = !leitura && !t.feita && S.vista === 'dia';
  return `<div class="tarefa ${t.feita ? 'feita' : ''}" data-id="${t.id}" ${arrastavel ? 'draggable="true"' : ''} ${leitura ? 'data-leitura' : ''}>
    ${leitura
      ? `<span class="marcar" style="--cor:${passou ? 'var(--aviso)' : p.cor};${t.feita && !passou ? '' : 'border-style:dashed'}">${passou ? '' : ic('check')}</span>`
      : `<button class="marcar" style="--cor:${p.cor}" data-acao="marcar" role="checkbox" aria-checked="${t.feita}" aria-label="${t.feita ? 'Reabrir' : 'Concluir'}: ${esc(t.titulo)}">${ic('check')}</button>`}
    <div class="corpo" ${leitura ? '' : 'data-acao="editar"'}>
      <div class="titulo">${t.hora ? `<span class="hora">${t.hora}</span>` : ''}${esc(t.titulo)}</div>
      ${t.nota ? `<div class="nota-prev">${esc(t.nota.split('\n')[0])}</div>` : ''}
      <div class="meta">${meta.join('')}</div>
    </div>
    ${leitura ? '' : `<div class="acoes">
      ${!t.feita ? `<button class="bt-icone" data-acao="amanha" title="Passar para amanhã" aria-label="Passar para amanhã">${ic('adiar')}</button>` : ''}
      <button class="bt-icone" data-acao="editar" title="Editar" aria-label="Editar">${ic('lapis')}</button>
      <button class="bt-icone apagar" data-acao="apagar" title="Apagar" aria-label="Apagar">${ic('lixo')}</button>
    </div>`}
  </div>`;
}

function vazio(icone, titulo, texto) {
  return `<div class="vazio"><div class="ic">${ic(icone)}</div><b>${titulo}</b><p>${texto}</p></div>`;
}

/* ---------------------------------------------------------------- próximos */
function htmlProximos() {
  const futuras = S.e.tarefas.filter(t => t.data > S.hoje && !t.feita && passaFiltro(t));
  const dias = [...new Set(futuras.map(t => t.data))].sort();
  return `<div class="cab-dia"><div class="tit"><h1>Próximos</h1>
      <div class="sub">${plural(futuras.length, 'pendência agendada', 'pendências agendadas')}</div></div></div>
    ${chipFiltro()}
    ${dias.length ? dias.map(d => `<div class="dia-bloco">
        <h3 data-abrir-dia="${d}">${Datas.relativo(d)} <small>${Datas.cap(Datas.diaSemana(d))}, ${Datas.extenso(d)}</small></h3>
        <div class="lista">${ordenar(futuras.filter(t => t.data === d)).map(t => linha(t)).join('')}</div></div>`).join('')
      : vazio('cal', 'Nada pela frente', 'Use o calendário para agendar pendências em outros dias.')}`;
}

/* ---------------------------------------------------------------- histórico e busca */
function destacar(txt, q) {
  const e = esc(txt);
  if (!q) return e;
  const base = Datas.semAcento(txt), alvo = Datas.semAcento(q);
  const i = base.indexOf(alvo);
  if (i < 0) return e;
  return esc(txt.slice(0, i)) + '<mark>' + esc(txt.slice(i, i + q.length)) + '</mark>' + esc(txt.slice(i + q.length));
}

function htmlHistorico() {
  const q = S.busca.trim();
  const campo = `<div class="busca" style="margin:0 0 6px">${ic('busca')}
    <input id="busca-hist" class="campo" type="search" placeholder="Buscar em todas as pendências (ex.: IPVA, AF 1234, Aurora)" value="${esc(S.busca)}" autocomplete="off"></div>`;

  if (q) {
    const alvo = Datas.semAcento(q);
    const achadas = S.e.tarefas.filter(t => Datas.semAcento(t.titulo + ' ' + t.nota).includes(alvo))
      .sort((a, b) => b.data.localeCompare(a.data));
    return `<div class="cab-dia"><div class="tit"><h1>Busca</h1><div class="sub">${plural(achadas.length, 'resultado')} para “${esc(q)}”</div></div></div>
      ${campo}
      ${achadas.length ? `<div class="lista" style="margin-top:10px">${achadas.map(t => {
        const st = t.feita ? ['check', 'var(--ok)', 'feita'] : t.data > S.hoje ? ['cal', 'var(--texto-2)', 'agendada'] : ['relogio', 'var(--aviso)', 'em aberto'];
        return `<div class="hist-item" data-abrir-dia="${t.data}" data-foco="${t.id}" style="cursor:pointer;padding:8px 4px;border-bottom:1px solid var(--linha)">
          <span style="color:${st[1]}">${ic(st[0], 'peq')}</span>
          <span style="flex:1;min-width:0">${destacar(t.titulo, q)}${t.nota && Datas.semAcento(t.nota).includes(alvo) ? `<div class="nota-prev">${destacar(t.nota.split('\n').find(l => Datas.semAcento(l).includes(alvo)) || '', q)}</div>` : ''}</span>
          <span class="r">${st[2]} · ${Datas.relativo(t.data)}</span></div>`;
      }).join('')}</div>` : vazio('busca', 'Nada encontrado', 'Tente outra palavra.')}`;
  }

  const dias = new Set();
  for (const t of S.e.tarefas) {
    if (t.data < S.hoje && t.feita) dias.add(t.data);
    for (const d of t.passou_por) if (d < S.hoje) dias.add(d);
  }
  const lista = [...dias].sort().reverse();
  const limite7 = Datas.somar(S.hoje, -7);
  const feitas7 = S.e.tarefas.filter(t => t.feita && t.feita_em && t.feita_em.slice(0, 10) >= limite7).length;
  const adiadas7 = S.e.tarefas.reduce((s, t) => s + t.passou_por.filter(d => d >= limite7).length, 0);
  const abertas = S.e.tarefas.filter(t => !t.feita && t.data <= S.hoje).length;

  return `<div class="cab-dia"><div class="tit"><h1>Histórico</h1><div class="sub">O que foi feito e o que passou adiante, dia a dia</div></div></div>
    ${campo}
    <div class="stats">
      <div class="stat"><small>Feitas em 7 dias</small><b style="color:var(--ok)">${feitas7}</b></div>
      <div class="stat"><small>Adiamentos em 7 dias</small><b style="color:var(--aviso)">${adiadas7}</b></div>
      <div class="stat"><small>Em aberto hoje</small><b>${abertas}</b></div>
    </div>
    ${lista.length ? lista.slice(0, S.histLimite).map(d => {
      const feitas = feitasDoDia(d), foram = passaramNoDia(d), ab = S.histAbertos.has(d);
      return `<div class="hist-dia ${ab ? 'aberto' : ''}">
        <div class="hist-cab" data-hist="${d}">${ic('dir', 'seta peq')}
          <span class="d">${Datas.relativo(d)}<small>${Datas.extensoAno(d)}</small></span>
          ${feitas.length ? `<span class="n" style="color:var(--ok)">${feitas.length} feita${feitas.length > 1 ? 's' : ''}</span>` : ''}
          ${foram.length ? `<span class="n" style="color:var(--aviso)">${foram.length} adiada${foram.length > 1 ? 's' : ''}</span>` : ''}
          <button class="bt-icone" data-abrir-dia="${d}" title="Abrir a página deste dia" aria-label="Abrir dia">${ic('folha', 'peq')}</button>
        </div>
        <div class="hist-itens">
          ${feitas.map(t => `<div class="hist-item"><span style="color:var(--ok)">${ic('check', 'peq')}</span>${esc(t.titulo)}<span class="r">${esc(cat(t.categoria).nome)}</span></div>`).join('')}
          ${foram.map(t => `<div class="hist-item"><span style="color:var(--aviso)">${ic('adiar', 'peq')}</span>${esc(t.titulo)}<span class="r">passou para o dia seguinte</span></div>`).join('')}
        </div></div>`;
    }).join('') + (lista.length > S.histLimite ? `<button class="bt" data-acao="hist-mais" style="margin:14px auto;display:flex">Mostrar dias mais antigos</button>` : '')
      : vazio('hist', 'O histórico começa hoje', 'Cada dia que passa fica registrado aqui, com o que foi feito e o que foi adiado.')}`;
}

/* ---------------------------------------------------------------- ajustes */
function htmlConfig() {
  const c = S.e.config;
  const chave = (k, v) => `<label class="chave"><input type="checkbox" data-cfg="${k}" ${v ? 'checked' : ''}><span></span></label>`;
  const seg = (k, opcoes) => `<div class="segmento">${opcoes.map(([v, n]) => `<button class="${c[k] === v ? 'on' : ''}" data-cfg-seg="${k}" data-v="${v}">${n}</button>`).join('')}</div>`;
  const listaEdit = (qual, titulo, nota) => `<div class="cfg-sec"><h2>${titulo}</h2><div class="cfg-cartao lista-edit">
      ${S.e[qual].map((it, i, arr) => `<div class="cfg-linha" data-lista="${qual}" data-i="${i}">
        <input type="color" class="cor" value="${it.cor}" data-campo="cor" aria-label="Cor">
        <input class="campo" id="lst-${qual}-${i}" value="${esc(it.nome)}" data-campo="nome" maxlength="40" aria-label="Nome">
        <button class="bt-icone" data-mover="-1" ${i === 0 ? 'disabled style="opacity:.3"' : ''} aria-label="Subir" title="Subir">${ic('cima', 'peq')}</button>
        <button class="bt-icone" data-mover="1" ${i === arr.length - 1 ? 'disabled style="opacity:.3"' : ''} aria-label="Descer" title="Descer">${ic('baixo', 'peq')}</button>
        <button class="bt-icone apagar" data-remover ${arr.length < 2 ? 'disabled style="opacity:.3"' : ''} aria-label="Remover">${ic('lixo', 'peq')}</button>
      </div>`).join('')}
      <div class="cfg-linha"><button class="bt texto" data-adicionar="${qual}">${ic('plus', 'peq')} Adicionar</button></div>
    </div><p class="cfg-nota">${nota}</p></div>`;

  const pc = S.motor.plataforma === 'windows';
  return `<div class="cab-dia"><div class="tit"><h1>Ajustes</h1><div class="sub">Do seu jeito</div></div></div>

  <div class="cfg-sec"><h2>Aparência${pc ? ' e janela' : ''}</h2><div class="cfg-cartao">
    <div class="cfg-linha"><div class="txt"><b>Tema</b></div>${seg('tema', [['sistema', 'Automático'], ['claro', 'Claro'], ['escuro', 'Escuro']])}</div>
    ${pc ? `<div class="cfg-linha"><div class="txt"><b>Sempre por cima</b><small>A janela fica na frente das outras (bom para o 3º monitor)</small></div>${chave('sempre_por_cima', c.sempre_por_cima)}</div>
    <div class="cfg-linha"><div class="txt"><b>Abrir junto com o Windows</b><small>A agenda já aparece quando o computador liga</small></div>${chave('iniciar_com_windows', c.iniciar_com_windows)}</div>` : ''}
  </div></div>
  ${!pc ? htmlConfigNuvem() : ''}

  <div class="cfg-sec"><h2>Ordem das pendências</h2><div class="cfg-cartao">
    <div class="cfg-linha"><div class="txt"><b>Ordenar por</b><small>Arrastar uma pendência na lista ativa a ordem manual</small></div>
      ${seg('ordenacao', [['prioridade', 'Prioridade'], ['horario', 'Horário'], ['manual', 'Manual']])}</div>
  </div></div>

  ${pc ? `<div class="cfg-sec"><h2>Notificações no computador</h2><div class="cfg-cartao">
    <div class="cfg-linha"><div class="txt"><b>Notificações</b><small>Avisos do Windows com botões para concluir ou lembrar depois</small></div>${chave('notificacoes', c.notificacoes)}</div>
    <div class="cfg-linha"><div class="txt"><b>Lembrete padrão</b><small>Usado quando você lança uma pendência com horário</small></div>
      <select class="campo" data-cfg-sel="lembrete_padrao">${LEMBRETES.map(([v, n]) => `<option value="${v}" ${c.lembrete_padrao === v ? 'selected' : ''}>${n}</option>`).join('')}</select></div>
    <div class="cfg-linha"><div class="txt"><b>Resumo da manhã</b><small>O que tem para hoje, quantas são urgentes e o que veio de ontem</small></div>
      <input type="time" class="campo" data-cfg-hora="resumo_manha_hora" value="${c.resumo_manha_hora}">${chave('resumo_manha', c.resumo_manha)}</div>
    <div class="cfg-linha"><div class="txt"><b>Aviso de fim do dia</b><small>Mostra o que ainda falta antes de encerrar</small></div>
      <input type="time" class="campo" data-cfg-hora="aviso_fim_dia_hora" value="${c.aviso_fim_dia_hora}">${chave('aviso_fim_dia', c.aviso_fim_dia)}</div>
    <div class="cfg-linha"><div class="txt"><b>Lembretes sem horário</b><small>Pendências sem hora, mas com lembrete, avisam neste horário</small></div>
      <input type="time" class="campo" data-cfg-hora="hora_base_sem_horario" value="${c.hora_base_sem_horario}"></div>
    <div class="cfg-linha"><div class="txt"><b>Testar</b><small>Mostra uma notificação de exemplo agora</small></div><button class="bt" data-acao="testar">${ic('sino', 'peq')} Testar</button></div>
  </div></div>` : ''}

  ${listaEdit('prioridades', 'Prioridades (da mais urgente para a menos)', 'A primeira da lista é a mais urgente: aparece no topo e notifica com destaque. Atalho ao digitar: !nome, ou !!! para a primeira e !! para a segunda.')}
  ${listaEdit('categorias', 'Categorias', 'Atalho ao digitar: #nome (ex.: #pessoal). Lançamentos sem # vão para a primeira categoria.')}

  ${pc ? `<div class="cfg-sec"><h2>Dados e segurança</h2><div class="cfg-cartao">
    <div class="cfg-linha"><div class="txt"><b>Pasta dos dados</b><div class="caminho">${esc(S.e.sistema?.pasta_dados || '')}</div></div>
      <button class="bt" data-acao="pasta">${ic('pasta', 'peq')} Abrir</button></div>
    <div class="cfg-linha"><div class="txt"><b>Cópia de segurança</b><small>Feita sozinha todo dia; as últimas 60 ficam guardadas</small></div><button class="bt" data-acao="backup">Fazer agora</button></div>
    <div class="cfg-linha"><div class="txt"><b>Exportar ou importar</b><small>Leve a agenda para outro computador</small></div>
      <button class="bt" data-acao="exportar">Exportar</button><button class="bt" data-acao="importar">Importar</button></div>
  </div></div>` : ''}

  ${pc ? htmlConfigNuvem() : ''}

  <div class="cfg-sec" ${pc ? '' : 'hidden'}><h2>Atalhos de teclado</h2><div class="cfg-cartao">
    ${[['N', 'Nova pendência'], ['← →', 'Dia anterior / próximo'], ['T', 'Voltar para hoje'], ['Ctrl+F', 'Buscar'], ['Ctrl+Enter', 'Salvar no editor'], ['Esc', 'Fechar / cancelar'], ['Botão direito', 'Menu rápido da pendência']]
      .map(([k, d]) => `<div class="cfg-linha" style="min-height:38px"><div class="txt">${d}</div><span class="pilula">${k}</span></div>`).join('')}
  </div><p class="cfg-nota" style="text-align:center;margin-top:18px">Agenda ${esc(S.e.sistema?.versao_app || '')} · feita para o Addson</p></div>`;
}

/* ---------------------------------------------------------------- nuvem (sincronização e Siri) */
const SITE_IPHONE = window.AGENDA_SITE || '';

function htmlConfigNuvem() {
  const n = S.e.nuvem || {};
  const copiavel = (rotulo, valor, sigilo = false) => `<div class="cfg-linha"><div class="txt"><b>${rotulo}</b>
      <div class="caminho">${sigilo ? esc(valor.slice(0, 6)) + '••••••••' : esc(valor)}</div></div>
      <button class="bt" data-copiar="${esc(valor)}">Copiar</button></div>`;
  if (!n.conectado) {
    return `<div class="cfg-sec"><h2>Sincronização com o iPhone</h2><div class="cfg-cartao" style="padding:14px">
      <p class="cfg-nota" style="margin:0 0 12px">Entre com a conta do projeto da agenda no Supabase. A senha só é usada agora, para entrar; ela não fica gravada.</p>
      ${n.fixo ? '' : `<div class="rotulo">Endereço do projeto (Project URL)</div><input class="campo" id="nv-url" placeholder="https://xxxx.supabase.co" value="${esc(n.url || '')}" autocomplete="off">
      <div class="rotulo" style="margin-top:10px">Chave pública (anon)</div><input class="campo" id="nv-chave" placeholder="eyJ…" value="${esc(n.chave_anon || '')}" autocomplete="off">`}
      <div class="rotulo" style="margin-top:10px">E-mail</div><input class="campo" id="nv-email" type="email" value="${esc(n.email || '')}" autocomplete="username">
      <div class="rotulo" style="margin-top:10px">Senha</div><input class="campo" id="nv-senha" type="password" autocomplete="current-password">
      <div class="ed-erro" id="nv-erro">${esc(n.erro || '')}</div>
      <button class="bt prim" data-acao="nuvem-entrar" style="margin-top:4px">Entrar e sincronizar</button>
    </div></div>`;
  }
  const estado = n.erro ? `<span style="color:var(--perigo)">${esc(n.erro)}</span>`
    : n.ultimo ? `Sincronizado às ${esc(n.ultimo)}` : 'Sincronizando…';
  const siri = n.chave_voz ? `<div class="cfg-sec"><h2>Recados por voz (Siri)</h2><div class="cfg-cartao">
      <div class="cfg-linha"><div class="txt"><b>Como funciona</b><small>Você diz “E aí Siri, anotar na agenda”, dita o recado
        (ex.: “amanhã às 2 da tarde ligar pro Jean, urgente”) e ele vira pendência no PC e no iPhone.
        Os valores abaixo são usados para montar o Atalho no iPhone; o passo a passo está no arquivo “Atalho da Siri” da pasta da agenda.</small></div></div>
      ${copiavel('Endereço (URL)', n.url + '/rest/v1/rpc/adicionar_por_voz')}
      ${copiavel('Cabeçalho apikey', n.chave_anon, true)}
      ${copiavel('Sua chave do atalho (p_chave)', n.chave_voz, true)}
      <div class="cfg-linha"><div class="txt"><b>Trocar a chave</b><small>Use se a chave vazar; depois atualize o Atalho no iPhone</small></div>
        <button class="bt" data-acao="nuvem-chave">Gerar nova</button></div>
    </div></div>` : '';
  const instalar = S.motor.plataforma === 'windows' ? `<div class="cfg-linha"><div class="txt"><b>Instalar no iPhone</b>
      <small>${SITE_IPHONE ? `No iPhone, abra <b>${esc(SITE_IPHONE)}</b> no Safari, toque em Compartilhar › Adicionar à Tela de Início e entre com o mesmo e-mail.`
        : 'O endereço do app do iPhone aparece aqui assim que o site for publicado.'}</small></div>
      ${SITE_IPHONE ? `<button class="bt" data-copiar="${esc(SITE_IPHONE)}">Copiar</button>` : ''}</div>` : '';
  return `<div class="cfg-sec"><h2>Sincronização${S.motor.plataforma === 'windows' ? ' com o iPhone' : ''}</h2><div class="cfg-cartao">
      <div class="cfg-linha"><div class="txt"><b>Conectado</b><small>${esc(n.email || '')}</small></div>
        <span class="pilula" style="color:var(--ok)">${ic('check', 'peq')} ativa</span></div>
      <div class="cfg-linha"><div class="txt"><b>Situação</b><small>${estado}</small></div>
        <button class="bt" data-acao="nuvem-sinc">Sincronizar agora</button></div>
      ${instalar}
      <div class="cfg-linha"><div class="txt"><b>Desconectar</b><small>As pendências continuam neste aparelho</small></div>
        <button class="bt perigo" data-acao="nuvem-sair">Sair</button></div>
    </div></div>${siri}`;
}

function htmlLogin() {
  const n = S.e.nuvem || {};
  return `<div style="max-width:360px;margin:0 auto;padding:12vh 20px 40px;text-align:center">
    <img src="icone.png" alt="" style="width:76px;height:76px">
    <h1 style="font:700 28px var(--fonte-titulo);margin:12px 0 4px">Agenda</h1>
    <p style="color:var(--texto-2);margin:0 0 26px">Entre para ver a mesma agenda do computador.</p>
    <div style="text-align:left">
      <div class="rotulo">E-mail</div><input class="campo" id="nv-email" type="email" value="${esc(n.email || '')}" autocomplete="username" style="height:44px;font-size:16px">
      <div class="rotulo" style="margin-top:12px">Senha</div><input class="campo" id="nv-senha" type="password" autocomplete="current-password" style="height:44px;font-size:16px">
      <div class="ed-erro" id="nv-erro"></div>
      <button class="bt prim" data-acao="nuvem-entrar" style="width:100%;height:46px;justify-content:center;font-size:15px;margin-top:6px">Entrar</button>
    </div></div>`;
}

async function entrarNuvem(botao) {
  const n = S.e.nuvem || {};
  const v = id => ($('#' + id)?.value || '').trim();
  const url = n.fixo ? n.url : v('nv-url'), chave = n.fixo ? n.chave_anon : v('nv-chave');
  const email = v('nv-email'), senha = $('#nv-senha')?.value || '';
  const erro = $('#nv-erro');
  if (!url || !chave || !email || !senha) { erro.textContent = 'Preencha todos os campos.'; return; }
  botao.disabled = true; botao.textContent = 'Entrando…';
  const r = await S.motor.nuvem_entrar(url, chave, email, senha);
  if (!r.ok) { erro.textContent = r.erro; botao.disabled = false; botao.textContent = 'Entrar'; return; }
  await recarregar();
  aviso('Conectado. A agenda está sincronizando.');
}

function htmlIndicadorNuvem() {
  const n = S.e.nuvem;
  if (!n || !n.conectado) return '';
  const ruim = !!n.erro;
  return `<button class="bt-icone ${ruim ? '' : ''}" data-acao="nuvem-sinc" id="indicador-nuvem"
    title="${ruim ? 'Sem sincronizar: ' + esc(n.erro) : n.ultimo ? 'Sincronizado às ' + esc(n.ultimo) : 'Sincronizando'}"
    aria-label="Sincronização" style="${ruim ? 'color:var(--perigo)' : ''}">${ic(ruim ? 'nuvemoff' : 'nuvem')}</button>`;
}

async function atualizarNuvem() {
  if (!S.e?.nuvem?.conectado) return;
  const n = await S.motor.nuvem_situacao();
  const mudou = JSON.stringify(n) !== JSON.stringify(S.e.nuvem);
  S.e.nuvem = n;
  if (mudou) $$('#indicador-nuvem').forEach(el => { el.outerHTML = htmlIndicadorNuvem(); });
}

/** Recados ditados pela Siri: chegam como texto e viram pendências. */
let processandoVoz = false;
async function processarVoz() {
  if (processandoVoz) return;
  processandoVoz = true;
  try {
    const textos = await S.motor.pegar_voz();
    for (const txt of textos || []) {
      const r = Datas.interpretar(txt, S.hoje, S.e.prioridades, S.e.categorias);
      if (!r.titulo) continue;
      await S.motor.salvar_tarefa({ titulo: r.titulo.charAt(0).toUpperCase() + r.titulo.slice(1), data: r.data,
        hora: r.hora || '', prioridade: r.prioridade || prioPadrao(), categoria: r.categoria || S.e.categorias[0].id,
        nota: 'Recado ditado à Siri: “' + txt + '”' });
      aviso(`Recado da Siri: ${r.titulo} · ${Datas.relativo(r.data).toLowerCase()}${r.hora ? ' ' + r.hora : ''}`, null, 6000);
    }
    if (textos && textos.length) await recarregar();
  } finally { processandoVoz = false; }
}

/* ---------------------------------------------------------------- microfone (ditado na própria agenda) */
const Reconhecimento = window.SpeechRecognition || window.webkitSpeechRecognition;
let ouvindo = null;
function microfone() {
  if (!Reconhecimento) return;
  if (ouvindo) { ouvindo.stop(); return; }
  const rec = new Reconhecimento();
  rec.lang = 'pt-BR'; rec.interimResults = true; rec.continuous = false; rec.maxAlternatives = 1;
  const input = $('#rapida'), bt = $('#bt-mic');
  let final = '';
  rec.onstart = () => { ouvindo = rec; bt?.classList.add('ouvindo'); if (input) input.placeholder = 'Pode falar…'; };
  rec.onresult = ev => {
    let parcial = '';
    for (const r of ev.results) { if (r.isFinal) final = r[0].transcript; else parcial += r[0].transcript; }
    S.rapida = (final || parcial).trim();
    if (input) { input.value = S.rapida; $('#previa').innerHTML = htmlPrevia(); }
  };
  rec.onerror = ev => { if (ev.error === 'not-allowed') aviso('Permita o uso do microfone para ditar.'); else if (ev.error !== 'no-speech' && ev.error !== 'aborted') aviso('Não deu para ouvir. Tente de novo.'); };
  rec.onend = () => {
    ouvindo = null; bt?.classList.remove('ouvindo');
    const i = $('#rapida'); if (i) i.placeholder = 'Nova pendência';
    if (final.trim()) { S.rapida = final.trim(); adicionarRapida(); }
  };
  rec.start();
}

/* ---------------------------------------------------------------- toque longo = menu (celular) */
function ligarToqueLongo() {
  let timer = null, inicio = null;
  document.addEventListener('touchstart', ev => {
    const tr = ev.target.closest('.tarefa:not([data-leitura])');
    if (!tr || ev.touches.length > 1) return;
    inicio = { x: ev.touches[0].clientX, y: ev.touches[0].clientY };
    timer = setTimeout(() => {
      timer = null;
      const t = S.e.tarefas.find(x => x.id === tr.dataset.id);
      if (!t) return;
      navigator.vibrate?.(10);
      ligarToqueLongo.engolirClique = true;
      abrirMenu(t, inicio.x, inicio.y);
    }, 520);
  }, { passive: true });
  const cancelar = ev => {
    if (!timer) return;
    if (ev.type === 'touchmove') {
      const p = ev.touches[0];
      if (Math.hypot(p.clientX - inicio.x, p.clientY - inicio.y) < 10) return;
    }
    clearTimeout(timer); timer = null;
  };
  document.addEventListener('touchmove', cancelar, { passive: true });
  document.addEventListener('touchend', cancelar);
  document.addEventListener('touchcancel', cancelar);
  document.addEventListener('click', ev => {
    if (ligarToqueLongo.engolirClique && !ev.target.closest('#menu')) { ev.stopPropagation(); ev.preventDefault(); ligarToqueLongo.engolirClique = false; }
  }, true);
}

/* ================================================================ editor */
function abrirEditor(t) {
  S.edit = t ? JSON.parse(JSON.stringify(t)) : {
    titulo: '', nota: '', data: S.dia < S.hoje ? S.hoje : S.dia, hora: '', categoria: S.filtro.cat || S.e.categorias[0].id,
    prioridade: S.filtro.prio || prioPadrao(), lembrete: null, passou_por: [], feita: false,
  };
  S.edit._original = t ? t.data : null;
  renderEditor();
  $('#veu').hidden = false;
  $('#editor').hidden = false;
  $$('#editor textarea[data-auto]').forEach(autoAltura);
  const tit = $('#ed-titulo');
  tit.focus();
  tit.setSelectionRange(tit.value.length, tit.value.length);
}

function renderEditor() {
  const t = S.edit, novo = !t.id;
  const proxSeg = Datas.somar(S.hoje, ((8 - Datas.parse(S.hoje).getDay()) % 7) || 7);
  $('#editor').innerHTML = `
    <div class="ed-topo"><span class="t">${novo ? 'Nova pendência' : t.feita ? 'Pendência concluída' : 'Editar pendência'}</span>
      ${!novo ? `<button class="bt ${t.feita ? '' : 'prim'}" data-ed="marcar" style="height:28px">${t.feita ? ic('reabrir', 'peq') + ' Reabrir' : ic('check', 'peq') + ' Concluir'}</button>` : ''}
      <button class="bt-icone" data-ed="fechar" aria-label="Fechar">${ic('x')}</button></div>
    <div class="ed-corpo">
      <textarea id="ed-titulo" class="ed-titulo" rows="1" data-auto placeholder="O que precisa ser feito?" maxlength="300">${esc(t.titulo)}</textarea>
      <textarea id="ed-nota" class="ed-nota" rows="2" data-auto placeholder="Observações (opcional)">${esc(t.nota)}</textarea>
      <div class="ed-erro" id="ed-erro"></div>

      <div class="ed-campo"><div class="rotulo">Quando</div>
        <div class="ed-linha"><input type="date" class="campo" id="ed-data" value="${t.data}" min="${t.feita ? '' : S.hoje}">
          <input type="time" class="campo" id="ed-hora" value="${t.hora}" style="max-width:120px"></div>
        <div class="atalhos-data">
          <button data-ed-data="${S.hoje}">Hoje</button><button data-ed-data="${Datas.somar(S.hoje, 1)}">Amanhã</button>
          <button data-ed-data="${proxSeg}">Próx. segunda</button><button data-ed-data="${Datas.somar(t.data < S.hoje ? S.hoje : t.data, 7)}">+1 semana</button>
          ${t.hora ? '<button data-ed="sem-hora">Tirar horário</button>' : ''}
        </div></div>

      <div class="ed-campo"><div class="rotulo">Prioridade</div><div class="opcoes">
        ${S.e.prioridades.map(p => `<button class="opcao ${t.prioridade === p.id ? 'on' : ''}" style="--c:${p.cor}" data-ed-prio="${p.id}"><i style="background:${p.cor}"></i>${esc(p.nome)}</button>`).join('')}
      </div></div>

      <div class="ed-campo"><div class="rotulo">Categoria</div><div class="opcoes">
        ${S.e.categorias.map(c => `<button class="opcao ${t.categoria === c.id ? 'on' : ''}" style="--c:${c.cor}" data-ed-cat="${c.id}"><i style="background:${c.cor}"></i>${esc(c.nome)}</button>`).join('')}
      </div></div>

      <div class="ed-campo"><div class="rotulo">Lembrete no computador</div>
        <select class="campo" id="ed-lembrete">${LEMBRETES.map(([v, n]) => `<option value="${v}" ${t.lembrete === v ? 'selected' : ''}>${n}</option>`).join('')}</select>
        ${!t.hora && t.lembrete !== null ? `<div class="dica">Sem horário: o aviso usa ${S.e.config.hora_base_sem_horario} como referência.</div>` : ''}
      </div>

      ${t.passou_por && t.passou_por.length ? `<div class="trilha"><b>Adiada ${t.passou_por.length}x.</b> Passou por ${t.passou_por.map(Datas.curta).join(', ')} sem ser concluída.</div>` : ''}
    </div>
    <div class="ed-pe">
      ${!novo ? `<button class="bt perigo" data-ed="apagar">${ic('lixo', 'peq')} Apagar</button>` : ''}
      <span class="espaco"></span>
      <button class="bt" data-ed="fechar">Cancelar</button>
      <button class="bt prim" data-ed="salvar" title="Ctrl+Enter">${novo ? 'Adicionar' : 'Salvar'}</button>
    </div>`;
  $$('#editor textarea[data-auto]').forEach(autoAltura);
}

function lerEditor() {
  const t = S.edit;
  t.titulo = $('#ed-titulo').value;
  t.nota = $('#ed-nota').value;
  t.data = $('#ed-data').value;
  t.hora = $('#ed-hora').value;
  const l = $('#ed-lembrete').value;
  t.lembrete = l === 'null' ? null : Number(l);
}

function fecharEditor() {
  S.edit = null;
  $('#editor').hidden = true;
  $('#veu').hidden = true;
}

async function salvarEditor() {
  lerEditor();
  const t = S.edit, erro = $('#ed-erro');
  if (!t.titulo.trim()) { erro.textContent = 'Escreva o que precisa ser feito.'; $('#ed-titulo').focus(); return; }
  if (!t.data) { erro.textContent = 'Escolha uma data.'; return; }
  if (!t.feita && t.data < S.hoje && t.data !== t._original) { erro.textContent = 'Para pendências em aberto, escolha hoje ou uma data futura.'; return; }
  const dados = { titulo: t.titulo.trim(), nota: t.nota.trim(), data: t.data, hora: t.hora, categoria: t.categoria, prioridade: t.prioridade, lembrete: t.lembrete };
  if (t.id) dados.id = t.id;
  const mudouDia = t._original !== null && t._original !== t.data;
  fecharEditor();
  await acao(S.motor.salvar_tarefa(dados), !t.id ? (t.data === S.dia ? 'Adicionada' : `Agendada para ${Datas.relativo(t.data).toLowerCase()}`)
    : mudouDia ? `Movida para ${Datas.relativo(t.data).toLowerCase()}` : 'Alterações salvas');
}

/* ================================================================ ações */
async function marcar(id, el) {
  const t = S.e.tarefas.find(x => x.id === id);
  if (!t) return;
  if (el) { el.closest('.tarefa').classList.toggle('feita'); await new Promise(r => setTimeout(r, 320)); }
  await acao(S.motor.alternar_feita(id, !t.feita));
  if (!t.feita) {
    const restam = doDia(S.dia).filter(x => !x.feita).length;
    aviso(restam ? 'Concluída' : 'Tudo feito por hoje', { rotulo: 'Desfazer', fn: () => acao(S.motor.alternar_feita(id, false)) });
  }
}

async function apagar(id) {
  const t = await acao(S.motor.excluir(id));
  if (t) aviso(`“${t.titulo.slice(0, 40)}” apagada`, { rotulo: 'Desfazer', fn: () => acao(S.motor.restaurar(t), 'Restaurada') }, 6000);
}

async function moverPara(id, data) {
  const t = S.e.tarefas.find(x => x.id === id);
  if (!t || t.data === data) return;
  await acao(S.motor.salvar_tarefa({ id, data }), `Passou para ${Datas.relativo(data).toLowerCase()}`);
}

async function adicionarRapida() {
  const txt = S.rapida.trim();
  if (!txt) return;
  const r = Datas.interpretar(txt, S.dia, S.e.prioridades, S.e.categorias);
  if (!r.titulo) { aviso('Escreva o que precisa ser feito, além da data e hora.'); return; }
  const dados = { titulo: r.titulo.charAt(0).toUpperCase() + r.titulo.slice(1), data: r.data, hora: r.hora || '', prioridade: r.prioridade || S.filtro.prio || prioPadrao(),
    categoria: r.categoria || S.filtro.cat || S.e.categorias[0].id };
  S.rapida = '';
  await acao(S.motor.salvar_tarefa(dados));
  if (r.data !== S.dia) aviso(`Agendada para ${Datas.relativo(r.data).toLowerCase()}`, { rotulo: 'Ver', fn: () => irDia(r.data) });
  $('#rapida')?.focus();
}

function irDia(d, focoId) {
  S.dia = d; S.vista = 'dia';
  const p = Datas.parse(d); S.mes = [p.getFullYear(), p.getMonth()];
  render();
  if (focoId) focar(focoId);
}

function focar(id) {
  const el = $(`.tarefa[data-id="${id}"]`);
  if (!el) return;
  el.scrollIntoView({ block: 'center' });
  el.classList.add('foco');
  setTimeout(() => el.classList.remove('foco'), 1800);
}

let salvarNotaT = null;
function notaDigitada(el) {
  autoAltura(el);
  const est = $('#notas-estado');
  if (est) est.textContent = 'Salvando…';
  clearTimeout(salvarNotaT);
  const dia = S.dia, txt = el.value;
  salvarNotaT = setTimeout(async () => {
    await S.motor.salvar_anotacao(dia, txt);
    if (txt.trim()) S.e.anotacoes[dia] = txt; else delete S.e.anotacoes[dia];
    const e2 = $('#notas-estado'); if (e2) e2.textContent = 'Salvo';
  }, 600);
}

async function salvarConfig(c, msg) {
  Object.assign(S.e.config, c);
  aplicarTema();
  await acao(S.motor.salvar_config(c), msg);
}

function aplicarTema() {
  const t = S.e?.config.tema;
  if (t === 'claro' || t === 'escuro') document.documentElement.dataset.tema = t;
  else delete document.documentElement.dataset.tema;
}

/* ---------------------------------------------------------------- listas editáveis (ajustes) */
let salvarListaT = null;
function editarLista(qual, mudar) {
  const itens = S.e[qual].map(x => ({ ...x }));
  mudar(itens);
  S.e[qual] = itens;
  clearTimeout(salvarListaT);
  salvarListaT = setTimeout(() => acao(S.motor.salvar_lista(qual, itens)), 500);
}

/* ================================================================ menu de contexto */
function abrirMenu(t, x, y) {
  const m = $('#menu');
  const proxSeg = Datas.somar(S.hoje, ((8 - Datas.parse(S.hoje).getDay()) % 7) || 7);
  m.innerHTML = `
    <button data-m="marcar">${ic(t.feita ? 'reabrir' : 'check', 'peq')}${t.feita ? 'Reabrir' : 'Concluir'}</button>
    <button data-m="editar">${ic('lapis', 'peq')}Editar…</button>
    ${!t.feita ? `<hr><div class="rot">Adiar</div>
      <button data-m="hora">${ic('relogio', 'peq')}Daqui a 1 hora</button>
      <button data-m="data" data-v="${Datas.somar(S.hoje, 1)}">${ic('adiar', 'peq')}Amanhã</button>
      <button data-m="data" data-v="${proxSeg}">${ic('cal', 'peq')}Próxima segunda</button>` : ''}
    <hr><div class="rot">Prioridade</div>
    <div class="cores">${S.e.prioridades.map(p => `<button class="${t.prioridade === p.id ? 'on' : ''}" style="background:${p.cor}" data-m="prio" data-v="${p.id}" title="${esc(p.nome)}" aria-label="${esc(p.nome)}"></button>`).join('')}</div>
    <div class="rot">Categoria</div>
    <div class="cores">${S.e.categorias.map(c => `<button class="${t.categoria === c.id ? 'on' : ''}" style="background:${c.cor}" data-m="cat" data-v="${c.id}" title="${esc(c.nome)}" aria-label="${esc(c.nome)}"></button>`).join('')}</div>
    <hr><button class="perigo" data-m="apagar">${ic('lixo', 'peq')}Apagar</button>`;
  m.dataset.id = t.id;
  m.hidden = false;
  const r = m.getBoundingClientRect();
  m.style.left = Math.min(x, innerWidth - r.width - 8) + 'px';
  m.style.top = Math.min(y, innerHeight - r.height - 8) + 'px';
  m.querySelector('button').focus();
}
const fecharMenu = () => { $('#menu').hidden = true; };

/* ================================================================ aviso (snackbar) */
let avisoT = null;
function aviso(msg, acaoAviso = null, ms = 3500) {
  const el = $('#aviso');
  el.innerHTML = `<span>${esc(msg)}</span>${acaoAviso ? `<button>${esc(acaoAviso.rotulo)}</button>` : ''}`;
  if (acaoAviso) el.querySelector('button').onclick = () => { el.classList.remove('on'); acaoAviso.fn(); };
  el.classList.add('on');
  clearTimeout(avisoT);
  avisoT = setTimeout(() => el.classList.remove('on'), ms);
}

/* ================================================================ eventos */
function ligarEventos() {
  document.addEventListener('click', async ev => {
    const alvo = ev.target.closest('[data-acao],[data-ir],[data-dia],[data-abrir-dia],[data-filtro-cat],[data-filtro-prio],[data-hist],[data-cfg-seg],[data-adicionar],[data-mover],[data-remover],[data-copiar]');
    if (!$('#menu').hidden && !ev.target.closest('#menu')) fecharMenu();
    if (!alvo || alvo.closest('#editor') || alvo.closest('#menu')) return;
    const tarefa = alvo.closest('.tarefa');
    const id = tarefa?.dataset.id;
    const d = alvo.dataset;

    if (d.copiar !== undefined) { const ok = await S.motor.copiar(d.copiar); aviso(ok ? 'Copiado' : 'Não deu para copiar'); return; }

    if (d.ir) { if (d.ir === 'dia' && (S.vista === 'dia' || modo() === 'amplo')) { S.dia = S.hoje; S.mes = null; ajustarMes(); } S.vista = d.ir; if (d.ir !== 'historico') S.busca = ''; render(); $('#pagina').scrollTop = 0; return; }
    if (d.dia) { irDia(d.dia); return; }
    if (d.abrirDia) { ev.stopPropagation(); S.busca = ''; irDia(d.abrirDia, d.foco); return; }
    if (d.filtroCat) { S.filtro.cat = S.filtro.cat === d.filtroCat ? null : d.filtroCat; if (S.vista !== 'proximos') S.vista = 'dia'; render(); return; }
    if (d.filtroPrio) { S.filtro.prio = S.filtro.prio === d.filtroPrio ? null : d.filtroPrio; if (S.vista !== 'proximos') S.vista = 'dia'; render(); return; }
    if (d.hist) { S.histAbertos.has(d.hist) ? S.histAbertos.delete(d.hist) : S.histAbertos.add(d.hist); alvo.parentElement.classList.toggle('aberto'); return; }
    if (d.cfgSeg) { const v = d.v; await salvarConfig({ [d.cfgSeg]: v }); return; }
    if (d.adicionar) { editarLista(d.adicionar, l => l.push({ id: '', nome: d.adicionar === 'prioridades' ? 'Nova prioridade' : 'Nova categoria', cor: '#8E8E93' })); render(); return; }
    if (d.mover !== undefined && alvo.dataset.mover) {
      const linhaEl = alvo.closest('[data-lista]'), qual = linhaEl.dataset.lista, i = Number(linhaEl.dataset.i), j = i + Number(d.mover);
      editarLista(qual, l => { [l[i], l[j]] = [l[j], l[i]]; }); render(); return;
    }
    if (alvo.hasAttribute('data-remover')) {
      const linhaEl = alvo.closest('[data-lista]'), qual = linhaEl.dataset.lista, i = Number(linhaEl.dataset.i);
      const nome = S.e[qual][i].nome;
      editarLista(qual, l => l.splice(i, 1)); render();
      aviso(`“${nome}” removida. Pendências dela foram para ${qual === 'prioridades' ? 'Normal' : 'a primeira categoria'}.`);
      return;
    }

    switch (d.acao) {
      case 'marcar': return marcar(id, alvo);
      case 'editar': return abrirEditor(S.e.tarefas.find(x => x.id === id));
      case 'apagar': return apagar(id);
      case 'amanha': return moverPara(id, Datas.somar(S.hoje, 1));
      case 'hoje': S.vista = 'dia'; S.dia = S.hoje; S.mes = null; ajustarMes(); return render();
      case 'dia-ant': return irDia(Datas.somar(S.dia, -1));
      case 'dia-prox': return irDia(Datas.somar(S.dia, 1));
      case 'mes-ant': S.mes = S.mes[1] ? [S.mes[0], S.mes[1] - 1] : [S.mes[0] - 1, 11]; return render();
      case 'mes-prox': S.mes = S.mes[1] < 11 ? [S.mes[0], S.mes[1] + 1] : [S.mes[0] + 1, 0]; return render();
      case 'grupo': S.fechados[d.chave] = !S.fechados[d.chave]; gravarLocal('agenda.fechados', S.fechados); alvo.closest('.grupo').classList.toggle('fechado'); return;
      case 'limpar-filtro': S.filtro = { cat: null, prio: null }; return render();
      case 'pin': return salvarConfig({ sempre_por_cima: !S.e.config.sempre_por_cima },
        !S.e.config.sempre_por_cima ? 'Fixada por cima das outras janelas' : 'Janela solta');
      case 'hist-mais': S.histLimite += 45; return render();
      case 'mic': ev.preventDefault(); return microfone();
      case 'nuvem-entrar': return entrarNuvem(alvo);
      case 'nuvem-sair': await S.motor.nuvem_sair(); await recarregar(); return aviso('Desconectado da nuvem');
      case 'nuvem-sinc': {
        alvo.classList.add('girando');
        const n = await S.motor.nuvem_sincronizar();
        S.e.nuvem = n; await recarregar();
        return aviso(n.erro ? 'Não sincronizou: ' + n.erro : 'Sincronizado');
      }
      case 'nuvem-chave': {
        const r = await S.motor.nuvem_nova_chave_voz();
        if (!r.ok) return aviso('Não deu: ' + r.erro);
        await recarregar(); return aviso('Chave nova gerada. Atualize o Atalho no iPhone.');
      }
      case 'testar': { const ok = await S.motor.testar_notificacao(); if (!ok) aviso('Não foi possível mostrar a notificação.'); return; }
      case 'pasta': if (!(await S.motor.abrir_pasta_dados())) aviso('Disponível no programa do Windows.'); return;
      case 'backup': { const p = await S.motor.backup_agora(); aviso(p ? 'Cópia de segurança feita' : 'Disponível no programa do Windows.'); return; }
      case 'exportar': { const p = await S.motor.exportar(); if (p) aviso('Agenda exportada'); return; }
      case 'importar': { if (await S.motor.importar()) { await recarregar(); aviso('Agenda importada (a anterior ficou guardada no backup)'); } return; }
    }
  });

  // editor
  $('#editor').addEventListener('click', ev => {
    const b = ev.target.closest('[data-ed],[data-ed-data],[data-ed-prio],[data-ed-cat]');
    if (!b) return;
    lerEditor();
    const d = b.dataset;
    if (d.edData) { S.edit.data = d.edData; renderEditor(); return; }
    if (d.edPrio) { S.edit.prioridade = d.edPrio; renderEditor(); return; }
    if (d.edCat) { S.edit.categoria = d.edCat; renderEditor(); return; }
    switch (d.ed) {
      case 'fechar': return fecharEditor();
      case 'salvar': return salvarEditor();
      case 'sem-hora': S.edit.hora = ''; return renderEditor();
      case 'apagar': { const id = S.edit.id; fecharEditor(); return apagar(id); }
      case 'marcar': { const id = S.edit.id; fecharEditor(); return marcar(id); }
    }
  });
  $('#editor').addEventListener('input', ev => {
    if (ev.target.matches('textarea[data-auto]')) autoAltura(ev.target);
    $('#ed-erro').textContent = '';
  });
  $('#editor').addEventListener('change', ev => {
    if (ev.target.id === 'ed-hora' || ev.target.id === 'ed-lembrete') {
      lerEditor();
      if (ev.target.id === 'ed-hora' && S.edit.hora && S.edit.lembrete === null && !S.edit.id) S.edit.lembrete = S.e.config.lembrete_padrao;
      renderEditor();
    }
  });
  $('#veu').addEventListener('click', fecharEditor);

  // menu de contexto
  document.addEventListener('contextmenu', ev => {
    const tr = ev.target.closest('.tarefa:not([data-leitura])');
    if (!tr || ev.target.closest('input,textarea')) return;
    ev.preventDefault();
    abrirMenu(S.e.tarefas.find(x => x.id === tr.dataset.id), ev.clientX, ev.clientY);
  });
  $('#menu').addEventListener('click', async ev => {
    const b = ev.target.closest('[data-m]');
    if (!b) return;
    const id = $('#menu').dataset.id, t = S.e.tarefas.find(x => x.id === id), v = b.dataset.v;
    fecharMenu();
    switch (b.dataset.m) {
      case 'marcar': return marcar(id);
      case 'editar': return abrirEditor(t);
      case 'hora': return acao(S.motor.adiar(id, 60, 0), 'Adiada em 1 hora');
      case 'data': return moverPara(id, v);
      case 'prio': return acao(S.motor.salvar_tarefa({ id, prioridade: v }));
      case 'cat': return acao(S.motor.salvar_tarefa({ id, categoria: v }));
      case 'apagar': return apagar(id);
    }
  });
  window.addEventListener('blur', fecharMenu);

  // digitação
  document.addEventListener('input', ev => {
    const el = ev.target;
    if (el.id === 'rapida') { S.rapida = el.value; $('#previa').innerHTML = htmlPrevia(); return; }
    if (el.id === 'notas-dia') return notaDigitada(el);
    if (el.id === 'busca-lateral' || el.id === 'busca-hist') {
      S.busca = el.value; S.vista = 'historico';
      clearTimeout(ligarEventos.t); ligarEventos.t = setTimeout(render, 120); return;
    }
    const linhaEl = el.closest('[data-lista]');
    if (linhaEl && el.dataset.campo === 'nome') {
      const qual = linhaEl.dataset.lista, i = Number(linhaEl.dataset.i);
      editarLista(qual, l => { l[i].nome = el.value; });
    }
  });
  document.addEventListener('change', async ev => {
    const el = ev.target;
    if (el.dataset.cfg) {
      const k = el.dataset.cfg, v = el.checked;
      const msgs = { sempre_por_cima: v ? 'Fixada por cima das outras janelas' : 'Janela solta',
        iniciar_com_windows: v ? 'Vai abrir junto com o Windows' : 'Não abre mais com o Windows' };
      return salvarConfig({ [k]: v }, msgs[k]);
    }
    if (el.dataset.cfgSel) return salvarConfig({ [el.dataset.cfgSel]: el.value === 'null' ? null : Number(el.value) });
    if (el.dataset.cfgHora && el.value) return salvarConfig({ [el.dataset.cfgHora]: el.value });
    const linhaEl = el.closest('[data-lista]');
    if (linhaEl && el.dataset.campo === 'cor') {
      const qual = linhaEl.dataset.lista, i = Number(linhaEl.dataset.i);
      editarLista(qual, l => { l[i].cor = el.value; });
    }
  });
  document.addEventListener('keydown', ev => {
    if (ev.target.id === 'rapida' && ev.key === 'Enter' && !ev.isComposing) { ev.preventDefault(); adicionarRapida(); return; }
    if ((ev.target.id === 'nv-senha' || ev.target.id === 'nv-email') && ev.key === 'Enter') {
      ev.preventDefault(); const b = $('[data-acao="nuvem-entrar"]'); if (b) entrarNuvem(b); return;
    }
    if (ev.target.id === 'rapida' && ev.key === 'Escape') { S.rapida = ''; ev.target.value = ''; $('#previa').innerHTML = ''; ev.target.blur(); return; }
    if (S.edit) {
      if (ev.key === 'Escape') { ev.preventDefault(); fecharEditor(); }
      else if (ev.key === 'Enter' && (ev.ctrlKey || (ev.target.id === 'ed-titulo' && !ev.shiftKey))) { ev.preventDefault(); salvarEditor(); }
      return;
    }
    if (!$('#menu').hidden && ev.key === 'Escape') { fecharMenu(); return; }
    if ((ev.ctrlKey || ev.metaKey) && ev.key.toLowerCase() === 'f') {
      ev.preventDefault(); S.vista = 'historico'; render(); ($('#busca-lateral') || $('#busca-hist'))?.focus(); return;
    }
    if ((ev.ctrlKey || ev.metaKey) && ev.key.toLowerCase() === 'n') { ev.preventDefault(); novaPendencia(); return; }
    const digitando = ev.target.closest('input,textarea,select,[contenteditable]');
    if (digitando) { if (ev.key === 'Escape') ev.target.blur(); return; }
    if (ev.ctrlKey || ev.altKey || ev.metaKey) return;
    switch (ev.key) {
      case 'n': case 'N': ev.preventDefault(); return novaPendencia();
      case 'ArrowLeft': if (S.vista === 'dia') irDia(Datas.somar(S.dia, -1)); return;
      case 'ArrowRight': if (S.vista === 'dia') irDia(Datas.somar(S.dia, 1)); return;
      case 't': case 'T': return irDia(S.hoje);
      case ',': S.vista = 'config'; return render();
    }
  });

  // arrastar e soltar
  document.addEventListener('dragstart', ev => {
    const tr = ev.target.closest?.('.tarefa[draggable]');
    if (!tr) return;
    S.arrastando = tr.dataset.id;
    ev.dataTransfer.effectAllowed = 'move';
    ev.dataTransfer.setData('text/plain', tr.dataset.id);
    requestAnimationFrame(() => tr.classList.add('arrastando'));
  });
  document.addEventListener('dragend', () => {
    S.arrastando = null;
    $$('.arrastando,.sobre-cima,.sobre-baixo,.alvo').forEach(e => e.classList.remove('arrastando', 'sobre-cima', 'sobre-baixo', 'alvo'));
  });
  document.addEventListener('dragover', ev => {
    if (!S.arrastando) return;
    const dia = ev.target.closest('.cal-dia');
    const tr = ev.target.closest('[data-lista-abertas] .tarefa');
    $$('.sobre-cima,.sobre-baixo,.alvo').forEach(e => e.classList.remove('sobre-cima', 'sobre-baixo', 'alvo'));
    if (dia && dia.dataset.dia >= S.hoje) { ev.preventDefault(); dia.classList.add('alvo'); return; }
    if (tr && tr.dataset.id !== S.arrastando) {
      ev.preventDefault();
      const r = tr.getBoundingClientRect();
      tr.classList.add(ev.clientY < r.top + r.height / 2 ? 'sobre-cima' : 'sobre-baixo');
    }
  });
  document.addEventListener('drop', async ev => {
    if (!S.arrastando) return;
    ev.preventDefault();
    const id = S.arrastando;
    const dia = ev.target.closest('.cal-dia');
    if (dia) { S.arrastando = null; return moverPara(id, dia.dataset.dia); }
    const tr = ev.target.closest('[data-lista-abertas] .tarefa');
    if (!tr) return;
    const antes = tr.classList.contains('sobre-cima');
    const ids = $$('[data-lista-abertas] .tarefa').map(e => e.dataset.id).filter(x => x !== id);
    ids.splice(ids.indexOf(tr.dataset.id) + (antes ? 0 : 1), 0, id);
    // mantém, no fim, a ordem das que estão escondidas pelo filtro
    const resto = ordenar(doDia(S.dia).filter(t => !t.feita && !ids.includes(t.id))).map(t => t.id);
    await S.motor.reordenar([...ids, ...resto]);
    if (S.e.config.ordenacao !== 'manual') await salvarConfig({ ordenacao: 'manual' }, 'Ordem manual ativada (pode mudar em Ajustes)');
    else await recarregar();
  });

  // tamanho da janela muda o layout
  let modoAtual = modo();
  window.addEventListener('resize', () => {
    const m = modo();
    if (m !== modoAtual) { modoAtual = m; if (m !== 'compacto' && S.vista === 'mes') S.vista = 'dia'; render(); }
  });

  // virada do dia (no programa do Windows o Python também avisa)
  setInterval(() => { if (Datas.hoje() !== S.hoje) recarregar(); }, 30000);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) recarregar(); });
}

function novaPendencia() {
  if (S.vista !== 'dia' || S.dia < S.hoje) { S.vista = 'dia'; if (S.dia < S.hoje) S.dia = S.hoje; render(); }
  $('#rapida')?.focus();
}

function ajustarMes() {
  if (!S.mes) { const p = Datas.parse(S.dia); S.mes = [p.getFullYear(), p.getMonth()]; }
}

/* ================================================================ eventos vindos do Python */
const app = {
  async externo(evento, info) {
    if (evento === 'virada') {
      await recarregar();
      if (info) aviso(`${plural(info, 'pendência passou', 'pendências passaram')} de ontem para hoje`);
    } else if (evento === 'voz') {
      await processarVoz();
    } else if (evento === 'focar') {
      const t = S.e.tarefas.find(x => x.id === info);
      if (t) irDia(t.data, t.id);
    } else {
      await recarregar();
    }
  },
};
window.app = app;

/* ================================================================ início */
(async function iniciar() {
  S.motor = await Ponte.iniciar();
  S.e = await S.motor.carregar();
  S.hoje = Datas.hoje();
  S.dia = S.hoje;
  ajustarMes();
  aplicarTema();
  ligarEventos();
  ligarToqueLongo();
  render();
  requestAnimationFrame(() => $('#app').classList.remove('carregando'));
  if (Ponte.nuvem) Ponte.nuvem.definirAvisos(() => recarregar(), () => processarVoz());
  processarVoz();
  setInterval(atualizarNuvem, 5000);
  if ('serviceWorker' in navigator && location.protocol === 'https:') navigator.serviceWorker.register('sw.js').catch(() => {});
})();
