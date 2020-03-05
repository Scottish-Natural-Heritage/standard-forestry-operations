import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: {service: 'standard-forestry-operations'},
  transports: [new winston.transports.Console({colorize: true})]
});

logger.stream = {
  write: (msg) => {
    logger.info(msg);
  }
};

export {logger as default};
