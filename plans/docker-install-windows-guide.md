# Guia: Instalação do Docker Desktop no Windows

## Pré-requisitos do Sistema
- Windows 11 (seu caso) ou Windows 10 (64-bit)
- Processador com suporte a virtualização (VT-x/AMD-V) ativado na BIOS
- Mínimo 4GB de RAM (recomendado 8GB+)
- WSL 2 (Windows Subsystem for Linux) — instalado automaticamente pelo Docker

## Passo a Passo

### 1. Baixar o Instalador
- Link oficial: [Docker Desktop for Windows](https://www.docker.com/products/docker-desktop/)
- Clique em **"Download for Windows"**

### 2. Executar o Instalador
- Execute o arquivo `Docker Desktop Installer.exe` baixado
- Marque a opção **"Use WSL 2 instead of Hyper-V"** (recomendado)
- Clique em **OK** e aguarde a instalação (pode levar alguns minutos)

### 3. Reiniciar o Windows
- Após a instalação, clique em **"Close and restart"**
- O Windows será reiniciado

### 4. Abrir Docker Desktop
- Após reiniciar, abra o Docker Desktop (ícone na Área de Trabalho ou Menu Iniciar)
- Aceite os termos de serviço (primeira execução)
- Pode pedir login/criação de conta — clique **"Continue without signing in"** (opcional)
- Aguarde até ver **"Engine running"** no canto inferior esquerdo

### 5. Validar a Instalação
Abra o terminal (cmd) e execute:

```cmd
docker --version
```

Saída esperada: `Docker version 28.x.x, build xxxxx`

```cmd
docker info
```

Saída esperada: diversas informações do engine, sem erros.

### 6. Rodar Supabase no Projeto SagB
```cmd
cd /d Z:\00_sagb
```

```cmd
npx supabase start
```

Aguarde baixar as imagens e inicializar os containers (primeira vez demora mais).

```cmd
npx supabase status
```

Saída esperada: serviços rodando localmente (+ URLs de acesso).

## Resolução de Problemas Comuns

### "WSL 2 installation is incomplete"
- Abra PowerShell como Administrador
- Execute: `wsl --install`
- Reinicie o Windows
- Tente abrir Docker Desktop novamente

### "Hardware assisted virtualization and data execution protection must be enabled in the BIOS"
- Reinicie o PC e entre na BIOS (tecla varia: F2, F10, DEL)
- Ative: **Intel VT-x** ou **AMD-V**
- Ative: **SVM Mode** (AMD)
- Salve e reinicie

### Docker Desktop abre mas fica travado em "Starting"
- Abra PowerShell como Administrador
- Execute: `wsl --update`
- Execute: `wsl --set-default-version 2`
- Reinicie o Docker Desktop
