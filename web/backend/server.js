const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;


app.use(cors());
app.use(express.json());


let bancoDeDadosJogadores = {};


app.post('/novo-jogador', (req, res) => {
    const idJogador = "player_" + Math.random().toString(36).substr(2, 9);
    
    // Dados iniciais salvos no servidor
    bancoDeDadosJogadores[idJogador] = {
        id: idJogador,
        ouro: 0,
        nivelArma: 1,
        bonusArma: 0
    };

    console.log(`🎮 Novo jogador criado no banco: ${idJogador}`);
    res.json({ id: idJogador, mensagem: "Jogador criado com sucesso!" });
});

// ROTA 2: Salva o progresso atual do jogador (Ouro e Espada)
app.post('/salvar-progresso', (req, res) => {
    const { id, ouro, nivelArma, bonusArma } = req.body;

    if (!id || !bancoDeDadosJogadores[id]) {
        return res.status(404).json({ erro: "Jogador não encontrado!" });
    }

    
    bancoDeDadosJogadores[id].ouro = ouro;
    bancoDeDadosJogadores[id].nivelArma = nivelArma;
    bancoDeDadosJogadores[id].bonusArma = bonusArma;

    console.log(` Progresso salvo para o ID ${id}: Ouro=${ouro}, Arma Lvl=${nivelArma}`);
    res.json({ mensagem: "Progresso salvo com sucesso!" });
});

// Inicia o servidor backend na porta 3000
app.listen(PORT, () => {
    console.log(` Backend do RPG rodando na porta ${PORT}`);
});