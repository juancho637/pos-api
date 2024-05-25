import { LoggerType } from './logger.type';

export interface ILoggerService {
  debug(loggerDebug: LoggerType): void;
  log(loggerLog: LoggerType): void;
  error(loggerError: LoggerType): void;
  warn(loggerWarn: LoggerType): void;
  verbose(loggerVerbose: LoggerType): void;
}
