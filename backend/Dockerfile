# 1. Build Stage
FROM rust:1.75-slim-bookworm as builder

WORKDIR /usr/src/app
COPY . .

# Install dependencies (jika ada library C yang dibutuhkan, misal pkg-config, ssl)
RUN apt-get update && apt-get install -y pkg-config libssl-dev

# Build release binary
RUN cargo build --release

# 2. Runtime Stage (Image lebih kecil)
FROM debian:bookworm-slim

# Install Runtime Dependencies (SSL certificates sangat penting untuk HTTPS Supabase)
RUN apt-get update && apt-get install -y ca-certificates libssl-dev && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy binary dari stage builder
COPY --from=builder /usr/src/app/target/release/backend ./server

# Expose port (Harus sesuai dengan yang dipakai di main.rs, biasanya 8080)
EXPOSE 8080

# Jalankan server
CMD ["./server"]
