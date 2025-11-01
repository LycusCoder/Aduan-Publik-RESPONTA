# 🔧 Setup Verification Script - Documentation

## Overview

The `scripts/verify-setup.sh` script automatically verifies your RESPONTA development environment setup by reading configuration from your `.env` file.

**Key Features:**
- ✅ Automatically reads database credentials from `.env`
- ✅ Works on any device with different configurations
- ✅ Secure password masking in output
- ✅ Comprehensive environment checks
- ✅ Clear error messages and suggestions

---

## Usage

### Basic Usage

```bash
# From project root
bash scripts/verify-setup.sh
```

### What It Checks

1. **PHP Installation** - Version 8.2+
2. **Composer Installation** - Version 2.x
3. **MySQL/MariaDB Service** - Running status
4. **.env File** - Existence and APP_KEY
5. **Database Configuration** - Reads from .env
6. **Database Connection** - Tests connection with .env credentials
7. **Database Existence** - Checks if database exists
8. **Tables** - Counts tables (expected: 13)
9. **Key Tables** - Verifies users, kategori_aduan, aduan, foto_aduan
10. **Dependencies** - Checks vendor directory
11. **Models** - Verifies all 4 models exist
12. **Migrations** - Checks migration count (expected: 8)
13. **Documentation** - Verifies key docs exist

---

## Configuration

The script automatically reads database credentials from your `.env` file:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=responta
DB_USERNAME=root
DB_PASSWORD=
```

**Supported Configurations:**

### Development (Local)
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=responta
DB_USERNAME=root
DB_PASSWORD=
```

### Production
```env
DB_CONNECTION=mysql
DB_HOST=10.0.1.100
DB_PORT=3306
DB_DATABASE=responta_production
DB_USERNAME=laravel_user
DB_PASSWORD=super_secret_password
```

### Docker/Container
```env
DB_CONNECTION=mysql
DB_HOST=mysql
DB_PORT=3306
DB_DATABASE=responta
DB_USERNAME=laravel
DB_PASSWORD=docker_password
```

---

## Output Examples

### ✅ Successful Verification

```
========================================
  RESPONTA Setup Verification
========================================

Checking PHP... ✓ PHP 8.2.29
Checking Composer... ✓ Composer 2.8.12
Checking MySQL/MariaDB... ✓ MySQL 15.1
  ✓ Service is running
Checking .env file... ✓ Found
  ✓ APP_KEY is set

📊 Database Configuration (from .env):
  Connection: mysql
  Host: 127.0.0.1:3306
  Database: responta
  Username: root
  Password: (empty)

Checking database connection... ✓ Connected successfully
Checking database 'responta'... ✓ Exists
  ✓ 13 tables found
  Checking key tables... ✓ All key tables exist
Checking dependencies... ✓ Vendor directory exists
Checking models... ✓ All 4 models exist
Checking migrations... ✓ 8 migrations found
Checking documentation... ✓ All key docs exist

========================================
  Verification Complete!
========================================
```

### ⚠️ Missing Database

```
Checking database connection... ✓ Connected successfully
Checking database 'responta'... ! Not found
  Create with: mysql -u root -p -e "CREATE DATABASE responta;"
```

### ❌ Connection Failed

```
Checking database connection... ✗ Connection failed
  Check your database credentials in .env
  Make sure MySQL/MariaDB service is running
  User: laravel_user | Host: 127.0.0.1:3306
```

---

## Security Features

### Password Masking

Passwords are automatically masked in output:

| Password | Display |
|----------|---------|
| `secret123` | `se****` |
| `ab` | `**` |
| `` (empty) | `(empty)` |

### Safe Credential Handling

- Credentials are read from `.env` only
- No credentials are logged or stored
- Password never shown in full
- Secure connection testing

---

## Troubleshooting

### Problem: "Connection failed"

**Possible Causes:**
1. MySQL/MariaDB service not running
2. Wrong credentials in `.env`
3. Firewall blocking connection
4. Wrong host/port

**Solutions:**
```bash
# Start MySQL service
service mariadb start

# Check service status
service mariadb status

# Test connection manually
mysql -u YOUR_USERNAME -p -e "SELECT 1;"

# Verify .env credentials
cat .env | grep DB_
```

### Problem: "Database not found"

**Solution:**
```bash
# Create database (replace credentials)
mysql -u root -p -e "CREATE DATABASE responta;"

# Grant permissions if needed
mysql -u root -p -e "GRANT ALL ON responta.* TO 'laravel_user'@'localhost' IDENTIFIED BY 'password';"
```

### Problem: "No tables found"

**Solution:**
```bash
# Run migrations
php artisan migrate --force

# Or fresh start with seeders
php artisan migrate:fresh --seed
```

### Problem: "Missing key tables"

**Solution:**
```bash
# Run specific migration
php artisan migrate --path=database/migrations/2025_01_31_000003_create_aduan_table.php

# Or rollback and re-migrate
php artisan migrate:rollback
php artisan migrate
```

---

## Advanced Usage

### Environment-Specific Checks

For different environments, simply update your `.env` file:

**Staging:**
```bash
cp .env.staging .env
bash scripts/verify-setup.sh
```

**Production:**
```bash
cp .env.production .env
bash scripts/verify-setup.sh
```

### CI/CD Integration

Add to your CI/CD pipeline:

```yaml
# .github/workflows/verify.yml
- name: Verify Setup
  run: |
    cp .env.testing .env
    bash scripts/verify-setup.sh
```

### Docker Integration

```dockerfile
# In Dockerfile
RUN bash scripts/verify-setup.sh
```

---

## Exit Codes

| Code | Meaning |
|------|---------|
| `0` | All checks passed |
| `1` | Critical error (missing .env, connection failed) |

**Usage in scripts:**
```bash
if bash scripts/verify-setup.sh; then
    echo "Setup verified, proceeding..."
    php artisan serve
else
    echo "Setup verification failed, check logs"
    exit 1
fi
```

---

## Comparison: Before vs After Update

### Before (Hardcoded)
```bash
# Only worked with root user, no password
mysql -u root -e "USE responta"
```
❌ Tidak portable  
❌ Tidak aman di production  
❌ Tidak flexible

### After (Environment-based)
```bash
# Reads from .env automatically
# Works with any credentials
MYSQL_CMD="mysql -u $DB_USERNAME -p$DB_PASSWORD"
```
✅ Portable ke device manapun  
✅ Aman (password dari .env)  
✅ Flexible untuk semua environment

---

## Related Documentation

- [golden-rules.md](golden-rules.md) - Full setup guide
- [SETUP_GUIDE.md](SETUP_GUIDE.md) - Detailed installation
- [.env.example](../.env.example) - Configuration template

---

**Version:** 2.0.0  
**Last Updated:** 2025-01-31  
**Maintained By:** RESPONTA Team
