/* Ponte com o "motor" da agenda.
 *  - No programa do Windows: fala com o Python (window.pywebview.api).
 *  - No iPhone (site com config-nuvem.js): motor local no aparelho + sincronização com o Supabase.
 *  - Em qualquer outro lugar: motor local de demonstração.
 * O motor JS espelha armazenamento.py e nuvem.py (mesmas regras: a edição mais nova vence). */
'use strict';

const Ponte = (() => {
  const METODOS = ['carregar', 'salvar_tarefa', 'alternar_feita', 'excluir', 'restaurar', 'reordenar', 'adiar',
    'salvar_anotacao', 'salvar_config', 'salvar_lista', 'testar_notificacao', 'abrir_pasta_dados',
    'backup_agora', 'exportar', 'importar', 'nuvem_situacao', 'nuvem_entrar', 'nuvem_sair', 'nuvem_sincronizar',
    'nuvem_nova_chave_voz', 'pegar_voz', 'copiar'];

  function esperarPywebview(ms) {
    return new Promise(res => {
      if (window.pywebview && window.pywebview.api) return res(true);
      const t = setTimeout(() => res(false), ms);
      window.addEventListener('pywebviewready', () => { clearTimeout(t); res(true); }, { once: true });
    });
  }

  const ler = (k, padrao) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : padrao; } catch { return padrao; } };
  const gravar = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* sem armazenamento */ } };
  const copia = o => JSON.parse(JSON.stringify(o));
  const novoId = () => [...crypto.getRandomValues(new Uint8Array(6))].map(b => b.toString(16).padStart(2, '0')).join('');
  const carimbo = () => new Date().toISOString();                       // UTC com milissegundos
  const agoraLocal = () => { const d = new Date(); return `${Datas.chave(d)}T${Datas.pad(d.getHours())}:${Datas.pad(d.getMinutes())}:${Datas.pad(d.getSeconds())}`; };
  const instante = s => { if (!s) return 0; const t = Date.parse(/[zZ]|[+-]\d\d:?\d\d$/.test(s) ? s : s); return isNaN(t) ? 0 : t; };
  const CAMPOS = ['titulo', 'nota', 'data', 'hora', 'categoria', 'prioridade', 'lembrete', 'ordem', 'feita', 'feita_em',
    'criada_em', 'atualizada_em', 'passou_por'];

  /* ============================================================ motor local */
  function criarMotor(chave, { demo = false } = {}) {
    const padrao = () => ({
      versao: 2, tarefas: [], anotacoes: {}, anotacoes_ts: {},
      categorias: [{ id: 'rodrigues', nome: 'Rodrigues', cor: '#E5484D' }, { id: 'pessoal', nome: 'Pessoal', cor: '#3B82F6' },
        { id: 'outro', nome: 'Outro', cor: '#8E8E93' }],
      prioridades: [{ id: 'urgente', nome: 'Urgente', cor: '#E5484D' }, { id: 'importante', nome: 'Importante', cor: '#F59E0B' },
        { id: 'normal', nome: 'Normal', cor: '#8E8E93' }, { id: 'baixa', nome: 'Baixa', cor: '#3B82F6' }],
      config: { tema: 'sistema', ordenacao: 'prioridade', sempre_por_cima: false, iniciar_com_windows: false,
        notificacoes: true, lembrete_padrao: 15, resumo_manha: true, resumo_manha_hora: '08:00', aviso_fim_dia: true,
        aviso_fim_dia_hora: '17:30', hora_base_sem_horario: '09:00' },
      controle: { ultimo_dia: Datas.hoje(), sujo: { tarefas: {}, anotacoes: [], ajustes: false }, excluidas: {}, ajustes_ts: '' },
    });
    let e = ler(chave, null);
    if (!e) e = demo ? exemplo(padrao()) : padrao();
    const base = padrao();
    for (const k in base) if (!(k in e)) e[k] = base[k];
    for (const k in base.controle) if (!(k in e.controle)) e.controle[k] = base.controle[k];
    for (const k in base.config) if (!(k in e.config)) e.config[k] = base.config[k];

    let aoMudar = () => {};
    const salvar = () => gravar(chave, e);
    const mudou = () => { salvar(); aoMudar(); };
    const achar = tid => e.tarefas.find(t => t.id === tid);
    const tocar = t => { t.atualizada_em = carimbo(); e.controle.sujo.tarefas[t.id] = t.atualizada_em; };
    const tocarAnot = d => { e.anotacoes_ts[d] = carimbo(); if (!e.controle.sujo.anotacoes.includes(d)) e.controle.sujo.anotacoes.push(d); };
    const tocarAjustes = () => { e.controle.ajustes_ts = carimbo(); e.controle.sujo.ajustes = true; };

    function normalizar(t) {
      let mudouCampo = false;
      const cats = e.categorias.map(c => c.id), prios = e.prioridades.map(p => p.id);
      t.id = t.id || novoId();
      t.titulo = String(t.titulo || '').trim().slice(0, 300);
      t.nota = String(t.nota || '').slice(0, 5000);
      t.data = t.data || Datas.hoje();
      t.hora = t.hora || '';
      if (!cats.includes(t.categoria)) { mudouCampo = 'categoria' in t; t.categoria = cats[0]; }
      if (!prios.includes(t.prioridade)) { mudouCampo = mudouCampo || 'prioridade' in t; t.prioridade = prios.includes('normal') ? 'normal' : prios.at(-1); }
      if (t.lembrete === undefined) t.lembrete = null;
      t.feita = !!t.feita;
      if (t.feita_em === undefined) t.feita_em = null;
      t.criada_em = t.criada_em || agoraLocal();
      t.atualizada_em = t.atualizada_em || carimbo();
      t.passou_por = t.passou_por || [];
      t.ordem = t.ordem ?? 0;
      return mudouCampo;
    }
    e.tarefas.forEach(normalizar);

    function adiante() {
      const d = Datas.hoje();
      let n = 0;
      for (const t of e.tarefas) if (!t.feita && t.data < d) {
        if (!t.passou_por.includes(t.data)) t.passou_por.push(t.data);
        t.data = d; tocar(t); n++;
      }
      e.controle.ultimo_dia = d;
      if (n) mudou(); else salvar();
      return n;
    }
    function aplicarListas(cats, prios) {
      if (cats && cats.length) e.categorias = cats;
      if (prios && prios.length) e.prioridades = prios;
      for (const t of e.tarefas) if (normalizar(t)) tocar(t);
    }

    const motor = {
      local: true,
      carregar: async () => { if (e.controle.ultimo_dia !== Datas.hoje() || e.tarefas.some(t => !t.feita && t.data < Datas.hoje())) adiante(); return copia(e); },
      salvar_tarefa: async d => {
        let t = d.id && achar(d.id);
        const campos = ['titulo', 'nota', 'data', 'hora', 'categoria', 'prioridade', 'lembrete', 'ordem'];
        if (!t) {
          t = {};
          for (const k of campos) if (k in d) t[k] = d[k];
          if (d.id) t.id = d.id;
          if (!('lembrete' in d) && d.hora) t.lembrete = e.config.lembrete_padrao;
          if (!('ordem' in d)) t.ordem = Math.max(-1, ...e.tarefas.filter(x => x.data === d.data).map(x => x.ordem)) + 1;
          normalizar(t); e.tarefas.push(t);
        } else {
          if ('data' in d && d.data !== t.data) t.passou_por = [];
          for (const k of campos) if (k in d) t[k] = d[k];
          normalizar(t);
        }
        tocar(t); mudou(); return copia(t);
      },
      alternar_feita: async (tid, f = null) => {
        const t = achar(tid); if (!t) return null;
        t.feita = f === null ? !t.feita : !!f; t.feita_em = t.feita ? agoraLocal() : null;
        tocar(t); mudou(); return copia(t);
      },
      excluir: async tid => {
        const t = achar(tid); if (!t) return null;
        e.tarefas = e.tarefas.filter(x => x !== t);
        delete e.controle.sujo.tarefas[tid];
        e.controle.excluidas[tid] = carimbo();
        mudou(); return copia(t);
      },
      restaurar: async t => {
        if (!achar(t.id)) { t = copia(t); normalizar(t); e.tarefas.push(t); delete e.controle.excluidas[t.id]; tocar(t); mudou(); }
        return t;
      },
      reordenar: async ids => { ids.forEach((tid, i) => { const t = achar(tid); if (t && t.ordem !== i) { t.ordem = i; tocar(t); } }); mudou(); return true; },
      adiar: async (tid, minutos = 0, dias = 0) => {
        const t = achar(tid); if (!t) return null;
        let b = new Date(`${t.data}T${t.hora || '00:00'}`);
        if (minutos && !t.hora) b = new Date();
        b = new Date(b.getTime() + minutos * 6e4 + dias * 864e5);
        t.data = Datas.chave(b); if (minutos) t.hora = `${Datas.pad(b.getHours())}:${Datas.pad(b.getMinutes())}`;
        tocar(t); mudou(); return copia(t);
      },
      salvar_anotacao: async (dia, txt) => { if (txt.trim()) e.anotacoes[dia] = txt; else delete e.anotacoes[dia]; tocarAnot(dia); mudou(); return true; },
      salvar_config: async c => { Object.assign(e.config, c); salvar(); return copia(e.config); },
      salvar_lista: async (qual, itens) => {
        const l = itens.filter(i => (i.nome || '').trim()).map(i => ({ id: i.id || novoId(), nome: i.nome.trim().slice(0, 40), cor: i.cor || '#8E8E93' }));
        if (l.length) { aplicarListas(qual === 'categorias' ? l : null, qual === 'prioridades' ? l : null); tocarAjustes(); mudou(); }
        return copia(e[qual]);
      },
      testar_notificacao: async () => {
        if (!('Notification' in window)) return false;
        if (Notification.permission !== 'granted' && await Notification.requestPermission() !== 'granted') return false;
        new Notification('A notificação está funcionando', { body: 'É assim que os lembretes vão aparecer.' }); return true;
      },
      abrir_pasta_dados: async () => false,
      backup_agora: async () => '',
      exportar: async () => {
        const a = document.createElement('a');
        a.href = URL.createObjectURL(new Blob([JSON.stringify(e, null, 1)], { type: 'application/json' }));
        a.download = 'agenda-backup.json'; a.click(); return 'agenda-backup.json';
      },
      importar: async () => false,
      copiar: async txt => { try { await navigator.clipboard.writeText(txt); return true; } catch { return false; } },
      nuvem_situacao: async () => ({ conectado: false }),
      pegar_voz: async () => [],

      /* ---- usados pela sincronização */
      _definirAoMudar(fn) { aoMudar = fn; },
      _pendencias() {
        const s = e.controle.sujo, tarefas = [];
        for (const [tid] of Object.entries(s.tarefas)) {
          const t = achar(tid);
          if (t) { const dados = {}; for (const k of CAMPOS) dados[k] = t[k]; tarefas.push({ id: tid, dados, atualizada_em: t.atualizada_em, excluida: false }); }
        }
        for (const [tid, q] of Object.entries(e.controle.excluidas)) tarefas.push({ id: tid, dados: {}, atualizada_em: q, excluida: true });
        const anotacoes = s.anotacoes.map(d => ({ dia: d, texto: e.anotacoes[d] || '', atualizada_em: e.anotacoes_ts[d] || carimbo() }));
        const ajustes = s.ajustes ? { dados: { categorias: e.categorias, prioridades: e.prioridades }, atualizada_em: e.controle.ajustes_ts || carimbo() } : null;
        return copia({ tarefas, anotacoes, ajustes });
      },
      _confirmar(env) {
        const c = e.controle;
        for (const r of env.tarefas) {
          if (r.excluida) { if (c.excluidas[r.id] === r.atualizada_em) delete c.excluidas[r.id]; }
          else if (c.sujo.tarefas[r.id] === r.atualizada_em) delete c.sujo.tarefas[r.id];
        }
        for (const a of env.anotacoes) if (e.anotacoes_ts[a.dia] === a.atualizada_em) c.sujo.anotacoes = c.sujo.anotacoes.filter(d => d !== a.dia);
        if (env.ajustes && c.ajustes_ts === env.ajustes.atualizada_em) c.sujo.ajustes = false;
        salvar();
      },
      _aplicarRemoto(tarefas, anotacoes, ajustes) {
        let m = false;
        const c = e.controle;
        if (ajustes && instante(ajustes.atualizada_em) > instante(c.ajustes_ts)) {
          aplicarListas(ajustes.dados?.categorias, ajustes.dados?.prioridades);
          c.ajustes_ts = ajustes.atualizada_em; c.sujo.ajustes = false; m = true;
        }
        for (const r of tarefas) {
          const q = instante(r.atualizada_em), local = achar(r.id);
          if (r.excluida) {
            if (local && instante(local.atualizada_em) <= q) { e.tarefas = e.tarefas.filter(x => x !== local); delete c.sujo.tarefas[r.id]; m = true; }
            continue;
          }
          if (c.excluidas[r.id] && instante(c.excluidas[r.id]) >= q) continue;
          if (!local || q > instante(local.atualizada_em)) {
            const novo = Object.assign({}, r.dados, { id: r.id, atualizada_em: r.atualizada_em });
            normalizar(novo);
            if (local) Object.keys(local).forEach(k => delete local[k]), Object.assign(local, novo); else e.tarefas.push(novo);
            delete c.sujo.tarefas[r.id]; delete c.excluidas[r.id]; m = true;
          }
        }
        for (const a of anotacoes) {
          if (instante(a.atualizada_em) > instante(e.anotacoes_ts[a.dia])) {
            if (a.texto.trim()) e.anotacoes[a.dia] = a.texto; else delete e.anotacoes[a.dia];
            e.anotacoes_ts[a.dia] = a.atualizada_em;
            c.sujo.anotacoes = c.sujo.anotacoes.filter(d => d !== a.dia); m = true;
          }
        }
        if (m) { salvar(); if (e.tarefas.some(t => !t.feita && t.data < Datas.hoje())) adiante(); }
        return m;
      },
      _zerarParaConta() { e = padrao(); salvar(); },
    };
    return motor;
  }

  /* ============================================================ sincronização (iPhone) */
  function criarNuvem(motor, config) {
    const CHAVE = 'agenda-sessao';
    let s = ler(CHAVE, {});
    let acesso = '', expira = 0, rodando = false, ultimo = '', erro = '', fila = ler('agenda-fila-voz', []);
    let timer = null, aoRemoto = () => {}, aoVoz = () => {};
    const url = config.url.replace(/\/$/, ''), anon = config.chave_anon;
    const salvarS = () => gravar(CHAVE, s);
    const conectado = () => !!s.refresh_token;

    async function http(metodo, caminho, corpo, extra = {}, auth = true) {
      const h = { apikey: anon, 'Content-Type': 'application/json', ...extra };
      if (auth) h.Authorization = 'Bearer ' + await token();
      let r;
      try { r = await fetch(url + caminho, { method: metodo, headers: h, body: corpo === undefined ? undefined : JSON.stringify(corpo) }); }
      catch { const e = new Error('sem conexão com a internet'); e.status = 0; throw e; }
      const txt = await r.text();
      let j = null; try { j = txt ? JSON.parse(txt) : null; } catch { /* texto */ }
      if (!r.ok) { const e = new Error(j?.msg || j?.message || j?.error_description || j?.error || r.statusText); e.status = r.status; throw e; }
      return j;
    }
    function guardar(r) {
      acesso = r.access_token; expira = Date.now() + (r.expires_in || 3600) * 1000 - 60000;
      s.refresh_token = r.refresh_token;
      if (r.user) { s.usuario = r.user.id; s.email = r.user.email; }
      salvarS();
    }
    async function token() {
      if (acesso && Date.now() < expira) return acesso;
      try { guardar(await http('POST', '/auth/v1/token?grant_type=refresh_token', { refresh_token: s.refresh_token }, {}, false)); }
      catch (e) {
        if ([400, 401, 403].includes(e.status)) { delete s.refresh_token; salvarS(); throw Object.assign(new Error('a sessão expirou: entre de novo'), { status: 401 }); }
        throw e;
      }
      return acesso;
    }
    async function buscar(tabela, campos, k) {
      let cursor = s[k] || '1970-01-01T00:00:00Z', maior = cursor, linhas = [];
      for (;;) {
        const lote = await http('GET', `/rest/v1/${tabela}?select=${campos},sinc_em&sinc_em=gt.${encodeURIComponent(cursor)}&order=sinc_em.asc&limit=1000`);
        linhas = linhas.concat(lote);
        if (lote.length) maior = lote.at(-1).sinc_em;
        if (lote.length < 1000) break;
        cursor = maior;
      }
      if (maior !== (s[k] || '1970-01-01T00:00:00Z')) { s[k] = new Date(instante(maior) - 10000).toISOString(); salvarS(); }
      return linhas;
    }
    async function sincronizar() {
      if (!conectado() || rodando || !navigator.onLine && navigator.onLine !== undefined) return false;
      rodando = true;
      try {
        const p = motor._pendencias(), dono = s.usuario, up = { Prefer: 'resolution=merge-duplicates,return=minimal' };
        for (let i = 0; i < p.tarefas.length; i += 400)
          await http('POST', '/rest/v1/tarefas?on_conflict=id', p.tarefas.slice(i, i + 400).map(r => ({ ...r, dono })), up);
        if (p.anotacoes.length) await http('POST', '/rest/v1/anotacoes?on_conflict=dono,dia', p.anotacoes.map(a => ({ ...a, dono })), up);
        if (p.ajustes) await http('POST', '/rest/v1/ajustes?on_conflict=dono', { ...p.ajustes, dono }, up);
        if (p.tarefas.length || p.anotacoes.length || p.ajustes) motor._confirmar(p);
        const t = await buscar('tarefas', 'id,dados,atualizada_em,excluida', 'cursor_tarefas');
        const a = await buscar('anotacoes', 'dia,texto,atualizada_em', 'cursor_anotacoes');
        const aj = await buscar('ajustes', 'dados,atualizada_em', 'cursor_ajustes');
        const mudou = (t.length || a.length || aj.length) && motor._aplicarRemoto(t, a, aj.at(-1) || null);
        const recados = await http('POST', '/rest/v1/rpc/pegar_entradas_voz', {});
        if (recados && recados.length) { fila = fila.concat(recados.map(r => r.texto)); gravar('agenda-fila-voz', fila); aoVoz(); }
        ultimo = new Date().toTimeString().slice(0, 8); erro = '';
        if (mudou) aoRemoto();
        return true;
      } catch (e) {
        erro = e.message; return false;
      } finally { rodando = false; }
    }
    const agendar = () => { clearTimeout(timer); timer = setTimeout(sincronizar, 1200); };
    motor._definirAoMudar(agendar);
    setInterval(sincronizar, 20000);
    document.addEventListener('visibilitychange', () => { if (!document.hidden) sincronizar(); });
    window.addEventListener('online', sincronizar);

    const situacao = () => ({ conectado: conectado(), url, chave_anon: anon, email: s.email || '', chave_voz: s.chave_voz || '',
      ultimo, erro, fixo: true });
    return {
      precisaLogin: () => !conectado(),
      definirAvisos(remoto, voz) { aoRemoto = remoto; aoVoz = voz; },
      sincronizar,
      metodos: {
        nuvem_situacao: async () => situacao(),
        nuvem_sincronizar: async () => { await sincronizar(); return situacao(); },
        nuvem_entrar: async (_u, _c, email, senha) => {
          try {
            const r = await http('POST', '/auth/v1/token?grant_type=password', { email: email.trim(), password: senha }, {}, false);
            if (s.usuario && s.usuario !== r.user.id) motor._zerarParaConta();
            s = {}; guardar(r);
            const ch = await http('GET', '/rest/v1/chaves_voz?select=chave');
            if (ch && ch.length) { s.chave_voz = ch[0].chave; salvarS(); }
            await sincronizar();
            return { ok: true, ...situacao() };
          } catch (e) {
            return { ok: false, erro: e.status === 400 ? 'e-mail ou senha incorretos' : e.message };
          }
        },
        nuvem_sair: async () => { s = {}; salvarS(); acesso = ''; return situacao(); },
        nuvem_nova_chave_voz: async () => {
          try {
            const chave = btoa(String.fromCharCode(...crypto.getRandomValues(new Uint8Array(24)))).replace(/[+/=]/g, c => ({ '+': '-', '/': '_', '=': '' }[c]));
            await http('POST', '/rest/v1/chaves_voz?on_conflict=dono', { dono: s.usuario, chave }, { Prefer: 'resolution=merge-duplicates,return=minimal' });
            s.chave_voz = chave; salvarS(); return { ok: true, ...situacao() };
          } catch (e) { return { ok: false, erro: e.message }; }
        },
        pegar_voz: async () => { const f = fila; fila = []; gravar('agenda-fila-voz', fila); return f; },
      },
    };
  }

  /** Dados de demonstração (só no modo navegador sem nuvem). */
  function exemplo(e) {
    const h = Datas.hoje(), d = n => Datas.somar(h, n);
    const t = (titulo, o) => Object.assign({ id: novoId(), titulo, nota: '', data: h, hora: '', categoria: 'rodrigues',
      prioridade: 'normal', lembrete: null, feita: false, feita_em: null, passou_por: [], ordem: 0 }, o);
    e.tarefas = [
      t('Responder exigência do CBMSC – AF 1234', { prioridade: 'urgente', passou_por: [d(-1)], nota: 'Falta memorial de cálculo do hidrante.' }),
      t('Pagar IPVA', { categoria: 'pessoal', prioridade: 'importante', passou_por: [d(-3), d(-2), d(-1)] }),
      t('Protocolar AF – Galpão Têxtil', { hora: '08:30', feita: true, ordem: 1 }),
      t('Orçamento hidrantes + alarme – Condomínio Vale', { prioridade: 'importante', hora: '16:00', lembrete: 15, ordem: 2 }),
      t('Academia', { categoria: 'pessoal', hora: '19:00', prioridade: 'baixa', ordem: 3 }),
      t('Vistoria in loco – Galpão Itajaí', { data: d(1), hora: '09:00', prioridade: 'importante', lembrete: 60 }),
      t('Vence prazo da exigência – Mercado Central', { data: d(3), prioridade: 'urgente', lembrete: 1440 }),
      t('Aniversário da mãe', { data: d(4), categoria: 'pessoal' }),
      t('Laudo SPDA – Ed. Aurora', { data: d(-3), feita: true }),
      t('Protocolar RE – Galpão Itajaí', { data: d(-1), feita: true, prioridade: 'importante' }),
    ];
    e.anotacoes[h] = 'Ligar pro Jean sobre o SPDA.\nConferir boleto da taxa do e-SCI.';
    return e;
  }

  let motor = null, nuvem = null;
  async function iniciar() {
    if (await esperarPywebview(window.AGENDA_NUVEM ? 300 : 1500)) {
      const api = window.pywebview.api;
      motor = { local: false, plataforma: 'windows' };
      for (const m of METODOS) motor[m] = (...a) => api[m](...a);
      return motor;
    }
    if (window.AGENDA_NUVEM && window.AGENDA_NUVEM.url) {
      motor = criarMotor('agenda-estado');
      nuvem = criarNuvem(motor, window.AGENDA_NUVEM);
      Object.assign(motor, nuvem.metodos, { plataforma: 'celular' });
      const carregar = motor.carregar;
      motor.carregar = async () => Object.assign(await carregar(), {
        sistema: { pasta_dados: 'Neste aparelho + nuvem', versao_app: '1.1', plataforma: 'celular' },
        nuvem: await motor.nuvem_situacao(),
      });
      return motor;
    }
    motor = criarMotor('agenda-demo', { demo: true });
    motor.plataforma = 'demo';
    const carregar = motor.carregar;
    motor.carregar = async () => Object.assign(await carregar(), { sistema: { pasta_dados: 'Navegador (demonstração)', versao_app: '1.1', plataforma: 'demo' } });
    return motor;
  }

  return { iniciar, get motor() { return motor; }, get nuvem() { return nuvem; } };
})();
