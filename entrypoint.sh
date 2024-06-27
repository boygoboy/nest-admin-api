#!/bin/sh
# 等待MySQL和Redis完全启动
echo "Waiting for MySQL to start..."
while ! mysqladmin ping -h "mysql-container" --silent; do
    sleep 1
done

echo "Waiting for Redis to start..."
while ! redis-cli -h redis-container ping; do
    sleep 1
done

# 运行数据库迁移
npm run migration:run:prod

# 启动应用
exec pm2-runtime /app/src/main.js
