#!/bin/sh
until nc -z db ${DB_PORT}; do
  echo "⏳ Waiting for database on port ${DB_PORT}..."
  sleep 2
done

echo "🔍 Checking if SequelizeMeta table exists..."
if ! mysql -h db -P ${DB_PORT} -u${DB_USER} -p${DB_PASSWORD} -D${DB_NAME} -e "SELECT 1 FROM SequelizeMeta LIMIT 1;" >/dev/null 2>&1; then
  echo "🚀 First time detected. Running migrations and seeders..."
  npx sequelize-cli db:migrate && npx sequelize-cli db:seed:all
else
  echo "✅ SequelizeMeta exists. Skipping migrations and seeders."
fi

exec "$@"
