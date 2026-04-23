import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@shared/common/logger/logger.service';
import { TypeLogSql } from '@shared/common/logger/typeorm-sql-log-type.enum';
import * as winston from 'winston';

describe('LoggerService', () => {
  let module: TestingModule;
  let logger: Logger;
  let mockWinstonLogger: jest.Mocked<winston.Logger>;

  beforeAll(async (): Promise<void> => {
    module = await Test.createTestingModule({
      providers: [
        Logger,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              const config: Record<string, string> = {
                'app.name': 'test-app',
                'app.version': '2.0.1',
                'app.environment': 'test',
              };
              return config[key];
            }),
          },
        },
      ],
    }).compile();

    logger = module.get<Logger>(Logger);

    const realWinstonLogger: winston.Logger = (logger as unknown as { logger: winston.Logger }).logger;

    mockWinstonLogger = {
      debug: jest.spyOn(realWinstonLogger, 'debug'),
      error: jest.spyOn(realWinstonLogger, 'error'),
      info: jest.spyOn(realWinstonLogger, 'info'),
      verbose: jest.spyOn(realWinstonLogger, 'verbose'),
      warn: jest.spyOn(realWinstonLogger, 'warn'),
      silly: jest.spyOn(realWinstonLogger, 'silly'),
    } as unknown as jest.Mocked<winston.Logger>;
  });

  beforeEach((): void => {
    jest.clearAllMocks();
  });

  afterAll(async (): Promise<void> => {
    await module.close();
  });

  describe('Service Initialization', () => {
    it('should be defined', () => {
      expect(logger).toBeDefined();
    });

    it('should be an instance of Logger', () => {
      expect(logger).toBeInstanceOf(Logger);
    });
  });

  describe('Basic Logging Methods', () => {
    describe('log', () => {
      it('should call winston info with message', () => {
        const message: string = 'Test log message';
        logger.log(message);
        expect(mockWinstonLogger.info).toHaveBeenCalledWith(message);
      });

      it('should call winston info with message and optional parameters', () => {
        const message: string = 'Test log message';
        const optionalParams: string[] = ['param1', 'param2'];
        logger.log(message, ...optionalParams);
        expect(mockWinstonLogger.info).toHaveBeenCalledWith(message, ...optionalParams);
      });
    });

    describe('error', () => {
      it('should call winston error with message', () => {
        const message: string = 'Test error message';
        logger.error(message);
        expect(mockWinstonLogger.error).toHaveBeenCalledWith(message);
      });

      it('should transform Error object to error metadata', () => {
        const message: string = 'Test error message';
        const error: Error = new Error('Test error');
        logger.error(message, error);

        expect(mockWinstonLogger.error).toHaveBeenCalledWith(message, { error });
      });

      it('should not transform non-Error objects', () => {
        const message: string = 'Test error message';
        const metadata: { some: string; notAnError: boolean } = { some: 'data', notAnError: true };
        logger.error(message, metadata);

        expect(mockWinstonLogger.error).toHaveBeenCalledWith(message, metadata);
      });

      it('should handle multiple parameters correctly', () => {
        const message: string = 'Test error message';
        const error: Error = new Error('Test error');
        const additionalData: { context: string } = { context: 'test' };

        logger.error(message, error, additionalData);

        expect(mockWinstonLogger.error).toHaveBeenCalledWith(message, { error }, additionalData);
      });
    });

    describe('warn', () => {
      it('should call winston warn with message', () => {
        const message: string = 'Test warning message';
        logger.warn(message);
        expect(mockWinstonLogger.warn).toHaveBeenCalledWith(message);
      });
    });

    describe('debug', () => {
      it('should call winston debug with message', () => {
        const message: string = 'Test debug message';
        logger.debug(message);
        expect(mockWinstonLogger.debug).toHaveBeenCalledWith(message);
      });
    });

    describe('verbose', () => {
      it('should call winston verbose with message', () => {
        const message: string = 'Test verbose message';
        logger.verbose(message);
        expect(mockWinstonLogger.verbose).toHaveBeenCalledWith(message);
      });
    });

    describe('silly', () => {
      it('should call winston silly with message', () => {
        const message: string = 'Test silly message';
        logger.silly(message);
        expect(mockWinstonLogger.silly).toHaveBeenCalledWith(message);
      });
    });

    describe('alert', () => {
      it('should forward to winston warn with ALERT prefix', () => {
        const message: string = 'Disk full';
        logger.alert(message);
        expect(mockWinstonLogger.warn).toHaveBeenCalledWith(`[ALERT] ${message}`);
      });
    });
  });

  describe('TypeORM Query Logging', () => {
    describe('logQuery', () => {
      it('should log query when TypeLogSql.QUERY is enabled', () => {
        const query: string = 'SELECT * FROM products';
        const parameters: string[] = ['param1', 'param2'];

        (logger as unknown as { enabledQueryLogTypes: TypeLogSql[] }).enabledQueryLogTypes = [
          TypeLogSql.QUERY,
        ];

        logger.logQuery(query, parameters);
        expect(mockWinstonLogger.debug).toHaveBeenCalledWith(
          `Request : ${query} -- parameters: ${JSON.stringify(parameters)}`
        );
      });

      it('should log query without parameters when none provided', () => {
        const query: string = 'SELECT * FROM products';

        (logger as unknown as { enabledQueryLogTypes: TypeLogSql[] }).enabledQueryLogTypes = [
          TypeLogSql.QUERY,
        ];

        logger.logQuery(query);
        expect(mockWinstonLogger.debug).toHaveBeenCalledWith(`Request : ${query}`);
      });

      it('should not log query when TypeLogSql.QUERY is disabled', () => {
        const query: string = 'SELECT * FROM products';

        (logger as unknown as { enabledQueryLogTypes: TypeLogSql[] }).enabledQueryLogTypes = [];

        logger.logQuery(query);
        expect(mockWinstonLogger.debug).not.toHaveBeenCalled();
      });

      it('should handle complex parameter types', () => {
        const query: string = 'SELECT * FROM products WHERE id = ? AND name = ?';
        const parameters: (object | string | number | boolean | null)[] = [
          { id: 1, name: 'test' },
          'string',
          123,
          true,
          null,
        ];

        (logger as unknown as { enabledQueryLogTypes: TypeLogSql[] }).enabledQueryLogTypes = [
          TypeLogSql.QUERY,
        ];

        logger.logQuery(query, parameters);
        expect(mockWinstonLogger.debug).toHaveBeenCalledWith(
          `Request : ${query} -- parameters: [{"id":1,"name":"test"},"string",123,true,null]`
        );
      });
    });

    describe('logQueryError', () => {
      it('should log query error when TypeLogSql.ERROR is enabled', () => {
        const error: string = 'Connection failed';
        const query: string = 'SELECT * FROM products';
        const parameters: string[] = ['param1'];

        (logger as unknown as { enabledQueryLogTypes: TypeLogSql[] }).enabledQueryLogTypes = [
          TypeLogSql.ERROR,
        ];

        logger.logQueryError(error, query, parameters);
        expect(mockWinstonLogger.error).toHaveBeenCalledWith(
          `This request failed: ${query} -- parameters: ${JSON.stringify(parameters)}${error}`
        );
      });

      it('should not log query error when TypeLogSql.ERROR is disabled', () => {
        const error: string = 'Connection failed';
        const query: string = 'SELECT * FROM products';

        (logger as unknown as { enabledQueryLogTypes: TypeLogSql[] }).enabledQueryLogTypes = [];

        logger.logQueryError(error, query);
        expect(mockWinstonLogger.error).not.toHaveBeenCalled();
      });
    });

    describe('logQuerySlow', () => {
      it('should log slow query when TypeLogSql.SLOW is enabled', () => {
        const time: number = 5000;
        const query: string = 'SELECT * FROM products';
        const parameters: string[] = ['param1'];

        (logger as unknown as { enabledQueryLogTypes: TypeLogSql[] }).enabledQueryLogTypes = [
          TypeLogSql.SLOW,
        ];

        logger.logQuerySlow(time, query, parameters);
        expect(mockWinstonLogger.warn).toHaveBeenCalledWith(
          `This request : ${query} -- parameters: ${JSON.stringify(parameters)} was detected as slow, execution time : ${time}`
        );
      });

      it('should not log slow query when TypeLogSql.SLOW is disabled', () => {
        const time: number = 5000;
        const query: string = 'SELECT * FROM products';

        (logger as unknown as { enabledQueryLogTypes: TypeLogSql[] }).enabledQueryLogTypes = [];

        logger.logQuerySlow(time, query);
        expect(mockWinstonLogger.warn).not.toHaveBeenCalled();
      });
    });

    describe('logSchemaBuild', () => {
      it('should log schema build message', () => {
        const message: string = 'Creating table products';
        logger.logSchemaBuild(message);
        expect(mockWinstonLogger.debug).toHaveBeenCalledWith(`[TypeORM] Build schema: ${message}`);
      });
    });

    describe('logMigration', () => {
      it('should log migration message', () => {
        const message: string = 'Migration complete';
        logger.logMigration(message);
        expect(mockWinstonLogger.info).toHaveBeenCalledWith(`[TypeORM] Migration: ${message}`);
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle stringifyParameters error gracefully', () => {
      const circularObject: Record<string, unknown> = {};
      circularObject.self = circularObject;

      expect(() => {
        (logger as unknown as { stringifyParameters: (p: unknown[]) => string }).stringifyParameters([
          circularObject,
        ]);
      }).not.toThrow();
    });

    it('should handle circular reference in query parameters', () => {
      const circularObject: Record<string, unknown> = {};
      circularObject.self = circularObject;

      (logger as unknown as { enabledQueryLogTypes: TypeLogSql[] }).enabledQueryLogTypes = [
        TypeLogSql.QUERY,
      ];

      logger.logQuery('SELECT * FROM products', [circularObject]);

      expect(mockWinstonLogger.error).toHaveBeenCalledWith(
        'Error stringify params',
        expect.objectContaining({ error: expect.any(Error) })
      );
    });

    it('should stringify normal parameters correctly', () => {
      const normalParams: (object | string | number)[] = [{ id: 1 }, 'string', 123];

      (logger as unknown as { enabledQueryLogTypes: TypeLogSql[] }).enabledQueryLogTypes = [
        TypeLogSql.QUERY,
      ];

      logger.logQuery('SELECT * FROM products', normalParams);

      expect(mockWinstonLogger.debug).toHaveBeenCalledWith(
        'Request : SELECT * FROM products -- parameters: [{"id":1},"string",123]'
      );
    });
  });
});
