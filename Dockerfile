FROM python:3.10-slim

# Instalar dependências do sistema
RUN apt-get update && apt-get install -y \
    git \
    curl \
    wget \
    gnupg \
    lsb-release \
    sudo \
    && rm -rf /var/lib/apt/lists/*

# Definir diretório de trabalho
WORKDIR /workspace

# Copiar arquivo de requisitos
COPY requirements.txt .

# Instalar dependências Python
RUN pip install --no-cache-dir -r requirements.txt

# Criar um diretório para o histórico de chat do Cody
RUN mkdir -p /root/.config/sourcegraph/cody

# Definir variáveis de ambiente para persistir o histórico de chat do Cody
ENV CODY_HISTORY_DIR=/root/.config/sourcegraph/cody

# Criar um volume para o histórico de chat do Cody
VOLUME ["/root/.config/sourcegraph/cody"]

# Definir comando padrão
CMD ["bash"]
