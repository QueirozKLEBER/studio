# Como enviar seu código para o GitHub

Siga estes passos no terminal da sua máquina local para subir o projeto:

1. **Inicie o repositório Git:**
   ```bash
   git init
   ```

2. **Adicione os arquivos:**
   ```bash
   git add .
   ```

3. **Crie seu primeiro commit:**
   ```bash
   git commit -m "feat: setup treinusfit personal elite"
   ```

4. **Crie um repositório no GitHub:**
   - Vá em [github.com/new](https://github.com/new)
   - Dê um nome ao projeto (ex: `treinusfit-personal`)
   - Não inicialize com README ou .gitignore (nós já criamos)
   - Clique em "Create repository"

5. **Vincule e envie o código:**
   *(Substitua a URL abaixo pela URL que o GitHub te fornecer)*
   ```bash
   git remote add origin https://github.com/SEU_USUARIO/SEU_REPOSITORIO.git
   git branch -M main
   git push -u origin main
   ```

---
**Dica:** Sempre que fizer novas alterações aqui no Firebase Studio, você pode baixar o código atualizado e repetir os passos `git add .`, `git commit` e `git push` para manter seu GitHub em dia.