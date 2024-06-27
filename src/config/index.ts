import * as fs from 'fs';
import * as yaml from 'js-yaml';
import { join } from 'path';
import type { AppConfig } from '../../types/config';

// 获取项目运行环境
export const getEnv = (): string => {
  return (process.env as Record<string, any>).RUNNING_ENV;
};
export const IS_DEV = getEnv() === 'dev';
// 读取项目配置
export function getConfig(): AppConfig {
  const environment = getEnv();
  const configFilePath = join(process.cwd(), environment ? `./application.${environment}.yaml` : './application.yaml');
  const file = fs.readFileSync(configFilePath, {
    encoding: 'utf-8'
  });
  const config: AppConfig = yaml.load(file);
  return config
}