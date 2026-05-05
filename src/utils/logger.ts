import log from 'electron-log';

log.transports.file.level = 'info';
log.transports.console.format = '[{h}:{i}:{s}.{ms}] [{level}] {text}';

export const logger = {
  info: (msg: string, meta?: any) => log.info(msg, meta || ''),
  warn: (msg: string, meta?: any) => log.warn(msg, meta || ''),
  error: (msg: string, meta?: any) => log.error(msg, meta || ''),
};
