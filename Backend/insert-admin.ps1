$env:PGPASSWORD="123456"

$hash = '$2b$10$wEOn3k4H8lW80Hk4q.t5fefK73.dQQQhFODGB/KOGE.m/d7oODLHi'

$sql = @"
INSERT INTO users (nom, prenom, email, password, role, `"isEmailVerified`")
VALUES ('Skillvia', 'Admin', 'skillvia.recrutement@gmail.com', '$hash', 'Admin', true)
ON CONFLICT (email)
DO UPDATE SET
  password = EXCLUDED.password,
  role = 'Admin',
  `"isEmailVerified`" = true;
"@

psql -h 127.0.0.1 -U postgres -d skillvia_db_2 -c $sql

Write-Host "Done!"
