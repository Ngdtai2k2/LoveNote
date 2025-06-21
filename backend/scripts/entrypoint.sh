#!/bin/sh

until nc -z db ${DB_PORT}; do
  echo "⏳ Waiting for database on port ${DB_PORT}..."
  sleep 2
done

echo "🔍 Checking if SequelizeMeta table exists..."

if mysql -h db -P ${DB_PORT} -u${DB_USER} -p${DB_PASSWORD} -D${DB_NAME} \
  -e "SELECT table_name FROM information_schema.tables WHERE table_schema='${DB_NAME}' AND table_name='SequelizeMeta';" \
  | grep -q SequelizeMeta; then

  echo "✅ SequelizeMeta exists. Skipping migrations and seeders."
else
  echo "🚀 First time detected. Running migrations and seeders..."
  npx sequelize-cli db:migrate && npx sequelize-cli db:seed:all
fi

# Run main command
exec "$@"
