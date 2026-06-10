
# ⚔️ RPG: Explorador e Ferreiro — Infraestrutura Automatizada na AWS

Este repositório contém o código da aplicação e, principalmente, toda a arquitetura de infraestrutura como código (IaC) e a esteira de CI/CD para fazer o deploy automatizado de um jogo RPG estilo Web (Frontend em HTML/JS e Backend em Flask).

O projeto foi desenhado para ser totalmente isolado, seguro e escalável, utilizando as melhores práticas do ecossistema DevOps.

---

## 🎮 Demonstração do Jogo

As imagens abaixo mostram o jogo a rodar oficialmente de forma limpa e isolada dentro da instância EC2 na AWS:

| Tela Inicial (Cidade Segura) | Sistema de Combate (Na Floresta) |
| :---: | :---: |
| <img src="./jogo.png" width="450px" alt="Tela Inicial do RPG"> | <img src="./jkjkj.png" width="450px" alt="Combate com Orc no RPG"> |

---

## 🛠️ Tecnologias e Ferramentas Utilizadas

* **Provedor Cloud:** AWS (Amazon Web Services) — Instância EC2, Grupos de Segurança (VPC) e ECR (Elastic Container Registry).
* **Infraestrutura como Código (IaC):** Terraform — Para provisionar a máquina, chaves SSH e regras de rede automaticamente.
* **Contentorização:** Docker — Para isolar o Frontend (porta `80`) e o Backend (porta `5000`).
* **Automação CI/CD:** GitHub Actions — Pipeline automatizado que faz o build das imagens, envia para o ECR e faz o deploy via SSH na máquina final a cada `git push`.

---

## 🏗️ Como a Arquitetura Funciona

1. **Código e Segurança:** O código é protegido localmente por um arquivo `.gitignore` que impede a subida de chaves privadas `.pem` ou estados do Terraform para o GitHub.
2. **Provisionamento:** O Terraform cria uma instância Ubuntu na AWS e associa a chave de segurança criptografada (`nova-chave.pem`).
3. **Pipeline (CI/CD):** Ao fazer um push para a branch `main`:
   * O GitHub Actions faz o login seguro na AWS usando Secrets.
   * Compila os `Dockerfiles` do Frontend e Backend no ambiente do runner.
   * Envia as imagens para o repositório privado do Amazon ECR.
   * Conecta-se via SSH na EC2 usando a `nova-chave.pem` (armazenada nos Secrets do GitHub).
   * Descarrega as novas imagens do ECR para dentro da EC2 e reinicia os contentores automaticamente.

---

## 🚀 Comandos Úteis do Projeto

### 🎛️ Gestão da Infraestrutura (Terraform)
```bash
# Iniciar o diretório do Terraform e descarregar os plugins
terraform init

# Validar e aplicar as mudanças para criar a máquina na AWS
terraform apply -auto-approve

# Destruir toda a infraestrutura com segurança quando terminar o laboratório
terraform destroy -auto-approve
