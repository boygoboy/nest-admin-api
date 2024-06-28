# 基础镜像：构建阶段
FROM node:18.20.3-alpine3.19 as build-stage

# 设置工作目录
WORKDIR /app

# 复制package.json和package-lock.json
COPY package*.json ./

RUN npm config set registry https://registry.npmjs.org/


# 安装依赖
RUN npm install

# 复制项目文件到容器中
COPY . .

# 构建应用
RUN npm run build

# 生产阶段
FROM node:18.20.3-alpine3.19 as production-stage

# 从构建阶段复制构建好的文件到生产阶段
COPY --from=build-stage /app/dist /app
COPY --from=build-stage /app/package*.json /app/

# 这里添加复制配置文件的步骤
COPY --from=build-stage /app/application.prod.yaml /app/


# 设置工作目录
WORKDIR /app


RUN npm config set registry https://registry.npmjs.org/


# 仅安装生产依赖
RUN npm install --production

# 全局安装pm2
RUN npm install -g pm2

RUN npm install -g cross-env

RUN apk add --no-cache netcat-openbsd





# 设置容器对外暴露的端口
EXPOSE 3001

# 设置入口点和命令
CMD sh -c 'while ! nc -z mysql-container 3306; do echo "Waiting for MySQL..."; sleep 1; done; npm run migration:run:prod && cross-env RUNNING_ENV=prod pm2-runtime /app/src/main.js'



