import { nowISO } from '../utils/date'

let logs = JSON.parse(localStorage.getItem('mock:logs') || 'null')
if (!logs) {
  logs = [
    { id: 'L-1', ts: nowISO(), actor: 'system', action: 'boot', message: 'Initialized logs storage' },
    { id: 'L-2', ts: nowISO(), actor: 'ADM-01', action: 'login', message: 'المشرف قام بتسجيل الدخول' },
    { id: 'L-3', ts: nowISO(), actor: 'UTIL-01', action: 'complaint:update', message: 'تحديث حالة الشكوى C-1001 إلى In Processing', relatedId: 'C-1001' },
  ]
  localStorage.setItem('mock:logs', JSON.stringify(logs))
}

export function list({ search = '', actor = '', action = '' } = {}) {
  return logs.filter(l =>
    (!actor || l.actor === actor) &&
    (!action || l.action === action) &&
    (!search ||
      (l.message && l.message.toLowerCase().includes(search.toLowerCase())) ||
      (l.actor && l.actor.toLowerCase().includes(search.toLowerCase())) ||
      (l.action && l.action.toLowerCase().includes(search.toLowerCase()))
    )
  ).sort((a,b) => new Date(b.ts) - new Date(a.ts))
}

export function add({ actor, action, message, relatedId }) {
  const entry = { id: `L-${Math.random().toString(36).slice(2,8)}`, ts: nowISO(), actor, action, message, relatedId }
  logs.unshift(entry)
  persist()
  return entry
}

export function clear() {
  logs = []
  persist()
}

function persist() {
  localStorage.setItem('mock:logs', JSON.stringify(logs))
}