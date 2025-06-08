FROM php:8.2-fpm-alpine AS base

# Install dependencies
RUN apk add --no-cache \
    zip \
    libzip-dev \
    libpng-dev \
    libjpeg-turbo-dev \
    libwebp-dev \
    libxpm-dev \
    freetype-dev \
    libxml2-dev \
    curl-dev \
    openssl-dev \
    icu-dev \
    oniguruma-dev \
    zlib-dev \
    gmp-dev \
    nodejs \
    npm \
    && docker-php-ext-configure zip \
    && docker-php-ext-install zip pdo pdo_mysql \
    && docker-php-ext-configure gd --with-freetype=/usr/include/ --with-jpeg=/usr/include/ \
    && docker-php-ext-install -j$(nproc) gd \
    && docker-php-ext-enable gd

# Install Composer
COPY --from=composer:2.8.9 --chown=user:group /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

# Copy application files
COPY . .

# Set permissions
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 755 /var/www/html

# Install PHP dependencies
RUN composer install --no-dev --optimize-autoloader --prefer-dist \
    && composer clear-cache \
    && npm install \
    && npm run build 
    # && rm -rf node_modules

# Expose port 9000
EXPOSE 9000

# Start PHP-FPM
CMD ["sh", "-c", "php-fpm"]