// Simple logger compatible with edge runtime
class SimpleLogger {
  private service: string;

  constructor(service: string = 'api-gateway-bff') {
    this.service = service;
  }

  private formatMessage(level: string, message: string, meta?: any): string {
    const timestamp = new Date().toISOString();
    const metaStr = meta ? ` ${JSON.stringify(meta)}` : '';
    return `[${timestamp}] ${level.toUpperCase()} [${this.service}]: ${message}${metaStr}`;
  }

  info(message: string, meta?: any): void {
    console.log(this.formatMessage('info', message, meta));
  }

  error(message: string, meta?: any): void {
    console.error(this.formatMessage('error', message, meta));
  }

  warn(message: string, meta?: any): void {
    console.warn(this.formatMessage('warn', message, meta));
  }

  debug(message: string, meta?: any): void {
    if (process.env.NODE_ENV === 'development') {
      console.debug(this.formatMessage('debug', message, meta));
    }
  }
}

const logger = new SimpleLogger();

export default logger;