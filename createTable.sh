echo "Enter the psql user name : "
read user
psql -d $user -c "CREATE TABLE todo (
  id SERIAL PRIMARY KEY,
  title VARCHAR(45) NOT NULL,
  description VARCHAR,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  state BOOLEAN NOT NULL DEFAULT FALSE,
  priority INTEGER NOT NULL );"
  