// Temporary development config that points to local API
import config, { AppConfig } from '../config';

const devConfig: AppConfig = {
  ...config,
  api: {
    ...config.api,
    baseUrl: 'http://localhost:8000/api/v1',
  },
};

export default devConfig;
