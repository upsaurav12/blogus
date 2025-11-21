# ===========================
#  Project Makefile
# ===========================

SHELL := /bin/sh

# Colors
GREEN := \033[0;32m]
YELLOW := \033[1;33m]
BLUE := \033[0;34m]
RESET := \033[0m]

# Ports used by the project
FRONT_PORT = 5173
BACK_PORT = 3000

.PHONY: frontend backend install install-frontend install-backend build-frontend kill-ports dev help

# ===========================
#        HELP MENU
# ===========================
help:
	@echo ""
	@echo "$(BLUE)Available Commands:$(RESET)"
	@echo "  make frontend          - Run frontend (Vite)"
	@echo "  make backend           - Run backend (Node/Express)"
	@echo "  make install           - Install all dependencies"
	@echo "  make install-frontend  - Install frontend deps"
	@echo "  make install-backend   - Install backend deps"
	@echo "  make build-frontend    - Build Vite app"
	@echo "  make kill-ports        - Kill dev ports"
	@echo "  make dev               - Start frontend & backend"
	@echo ""

# ===========================
#        RUN SCRIPTS
# ===========================
frontend:
	@echo "$(GREEN)▶ Starting Frontend...$(RESET)"
	@cd aura-write && npm run dev

backend:
	@echo "$(GREEN)▶ Starting Backend...$(RESET)"
	@cd backend && npm start

# ===========================
#        INSTALLATION
# ===========================
install-frontend:
	@echo "$(YELLOW)Installing frontend dependencies...$(RESET)"
	@cd aura-write && npm install

install-backend:
	@echo "$(YELLOW)Installing backend dependencies...$(RESET)"
	@cd backend && npm install

install:
	@echo "$(YELLOW)Installing ALL dependencies...$(RESET)"
	@cd frontend && npm install
	@cd backend && npm install

# ===========================
#        BUILD
# ===========================
build-frontend:
	@echo "$(BLUE)Building frontend...$(RESET)"
	@cd aura-write && npm run build

# ===========================
#        UTILITIES
# ===========================
kill-ports:
	@echo "$(YELLOW)Killing ports $(FRONT_PORT) and $(BACK_PORT)...$(RESET)"
	-@kill -9 $$(lsof -t -i:$(FRONT_PORT)) 2>/dev/null || true
	-@kill -9 $$(lsof -t -i:$(BACK_PORT)) 2>/dev/null || true

# ===========================
#        RUN BOTH
# ===========================
dev:
	@echo "$(GREEN)▶ Starting frontend & backend...$(RESET)"
	@make -j2 frontend backend
