'use client';

const SESSION_KEY = 'imb_sessao_id';

/** Gera (ou reaproveita) um id anônimo de sessão, só para agrupar o funil — sem dado pessoal. */
function getSessaoId(): string {
  if (typeof window === 'undefined') return '';
  try {
    let id = sessionStorage.getItem(SESSION_KEY);
    if (!id) {
      id = crypto.randomUUID();
      sessionStorage.setItem(SESSION_KEY, id);
    }
    return id;
  } catch {
    return '';
  }
}

/**
 * Registra um evento de comportamento anônimo (clique, avanço de etapa, envio).
 * Nunca lança erro nem atrasa a interface — se falhar, simplesmente não conta.
 */
export function trackEvent(
  tipo: 'click' | 'form_step' | 'form_submit' | 'form_open',
  rotulo: string,
) {
  if (typeof window === 'undefined') return;
  try {
    const body = JSON.stringify({
      tipo,
      rotulo,
      sessaoId: getSessaoId(),
      pagina: window.location.pathname,
    });
    fetch('/api/evento', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
      keepalive: true,
    }).catch(() => {});
  } catch {
    // silencioso — analytics nunca deve quebrar a experiência do usuário
  }
}
