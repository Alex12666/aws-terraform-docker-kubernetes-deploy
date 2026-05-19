// Atributos do Jogador
let jogador = {
    hp: 100, maxHp: 100,
    mana: 30, maxMana: 30,
    baseAtaque: 10,
    magia: 22,
    ouro: 0,
    nivelArma: 1,
    bonusArma: 0
};

// Atributos do Inimigo Atual
let inimigo = {
    nome: "", hp: 0, maxHp: 0, ataque: 0
};

// Lista de possíveis monstros na floresta
const monstrosDaFloresta = [
    { nome: "Slime Gosmento", hp: 40, ataque: 6 },
    { nome: "Lobo Selvagem", hp: 65, ataque: 10 },
    { nome: "Goblin Saqueador", hp: 80, ataque: 12 },
    { nome: "Orc Enfurecido", hp: 120, ataque: 16 }
];

let emCombate = false;
let custoUpgrade = 15;

// Atualizar dados na tela
function atualizarInterface() {
    // Jogador
    document.getElementById("player-gold").innerText = jogador.ouro;
    document.getElementById("weapon-level").innerText = jogador.nivelArma;
    document.getElementById("weapon-bonus").innerText = jogador.bonusArma;
    document.getElementById("player-hp").innerText = jogador.hp;
    document.getElementById("player-mana").innerText = jogador.mana;
    document.getElementById("player-hp-bar").style.width = (jogador.hp / jogador.maxHp * 100) + "%";

    // Inimigo
    document.getElementById("enemy-name").innerText = emCombate ? inimigo.nome : "Nenhum Monstro";
    document.getElementById("enemy-hp").innerText = emCombate ? inimigo.hp : 0;
    document.getElementById("enemy-max-hp").innerText = emCombate ? inimigo.maxHp : 0;
    document.getElementById("enemy-hp-bar").style.width = emCombate ? (inimigo.hp / inimigo.maxHp * 100) + "%" : "0%";
    document.getElementById("enemy-card").style.opacity = emCombate ? "1" : "0.3";

    // Ferreiro
    document.getElementById("upgrade-cost").innerText = custoUpgrade;

    // Alternar botões ativos/desativados baseado no estado do jogo
    document.getElementById("btn-explore").disabled = emCombate;
    document.getElementById("btn-blacksmith").disabled = emCombate || jogador.ouro < custoUpgrade;
    document.getElementById("btn-rest").disabled = emCombate;

    document.getElementById("btn-attack").disabled = !emCombate;
    document.getElementById("btn-magic").disabled = !emCombate;
    document.getElementById("btn-heal").disabled = !emCombate;
}

// MECÂNICA 1: IR PARA A FLORESTA / APARECER MONSTRO
function explorarFloresta() {
    if (jogador.hp <= 20) {
        document.getElementById("battle-log").innerText = "❌ Você está muito fraco para explorar! Descanse na Estalagem primeiro.";
        return;
    }

    emCombate = true;
    let r = Math.floor(Math.random() * monstrosDaFloresta.length);
    let modelo = monstrosDaFloresta[r];

    inimigo.nome = modelo.nome;
    inimigo.maxHp = modelo.hp;
    inimigo.hp = modelo.hp;
    inimigo.ataque = modelo.ataque;

    document.getElementById("battle-log").innerHTML = `🌲 Você andou pela floresta e encontrou um <strong>${inimigo.nome}</strong>! Prepare-se para lutar!`;
    atualizarInterface();
}

// MECÂNICA 2: MELHORAR DANO NO FERREIRO COM GOLD
function melhorarArma() {
    if (jogador.ouro >= custoUpgrade) {
        jogador.ouro -= custoUpgrade;
        jogador.nivelArma += 1;
        jogador.bonusArma += 5;
        
        custoUpgrade = Math.floor(custoUpgrade * 1.8);
        
        document.getElementById("battle-log").innerHTML = `🔨 O Ferreiro martelou sua espada! Ela subiu para o <strong>Nível ${jogador.nivelArma}</strong> (+5 de Dano).`;
        atualizarInterface();
        
        // GATILHO: Salva no backend após gastar ouro no upgrade
        salvarNoBackend();
    }
}

// Função para recuperar a vida na cidade
function descansar() {
    jogador.hp = jogador.maxHp;
    jogador.mana = jogador.maxMana;
    document.getElementById("battle-log").innerText = "💤 Você dormiu na estalagem. HP e Mana totalmente recuperados!";
    atualizarInterface();
}

// --- SISTEMA DE COMBATE ---

function atacar() {
    if (!emCombate) return;

    let danoTotal = Math.floor(Math.random() * jogador.baseAtaque) + 5 + jogador.bonusArma;
    inimigo.hp -= danoTotal;
    if (inimigo.hp < 0) inimigo.hp = 0;

    document.getElementById("battle-log").innerHTML = `⚔️ Você atacou o ${inimigo.nome} e causou <strong>${danoTotal}</strong> de dano.`;
    atualizarInterface();

    if (!checarFimDeCombate()) {
        setTimeout(turnoDoInimigo, 800);
    }
}

function lancarMagia() {
    if (!emCombate) return;
    if (jogador.mana >= 10) {
        jogador.mana -= 10;
        let danoMagico = Math.floor(Math.random() * 10) + jogador.magia;
        inimigo.hp -= danoMagico;
        if (inimigo.hp < 0) inimigo.hp = 0;

        document.getElementById("battle-log").innerHTML = `🔥 Bola de Fogo! Você causou <strong>${danoMagico}</strong> de dano mágico!`;
        atualizarInterface();

        if (!checarFimDeCombate()) {
            setTimeout(turnoDoInimigo, 800);
        }
    } else {
        document.getElementById("battle-log").innerText = "❌ Falta mana!";
    }
}

// Função de cura
function curar() {
    if (!emCombate) return;
    if (jogador.mana >= 5) {
        jogador.mana -= 5;
        jogador.hp = Math.min(jogador.maxHp, jogador.hp + 25);
        document.getElementById("battle-log").innerHTML = `💚 Você usou cura e recuperou 25 de HP.`;
        atualizarInterface();
        setTimeout(turnoDoInimigo, 800);
    } else {
        document.getElementById("battle-log").innerText = "❌ Falta mana!";
    }
}

function turnoDoInimigo() {
    if (inimigo.hp <= 0) return;

    let danoInimigo = Math.floor(Math.random() * inimigo.ataque) + 3;
    jogador.hp -= danoInimigo;
    if (jogador.hp < 0) jogador.hp = 0;

    document.getElementById("battle-log").innerHTML += `<br>💥 O ${inimigo.nome} te atacou e causou <strong>${danoInimigo}</strong> de dano!`;
    atualizarInterface();

    checarFimDeCombate();
}

// MECÂNICA DE TERMINAR COMBATE E SALVAR
function checarFimDeCombate() {
    if (inimigo.hp <= 0) {
        let ouroGanhado = Math.floor(Math.random() * 15) + 10;
        jogador.ouro += ouroGanhado;
        
        document.getElementById("battle-log").innerHTML = `🏆 <strong>Vitória!</strong> Você derrotou o ${inimigo.nome} e encontrou <strong>${ouroGanhado} 💰 moedas de ouro</strong> na floresta!`;
        
        emCombate = false;
        atualizarInterface();
        
        // GATILHO: Salva o ouro ganho no banco
        salvarNoBackend();
        return true;
    } else if (jogador.hp <= 0) {
        document.getElementById("battle-log").innerHTML = `💀 <strong>Você desmaiou!</strong> O monstro te venceu. Você foi arrastado de volta para a cidade e perdeu metade do seu ouro.`;
        
        jogador.ouro = Math.floor(jogador.ouro / 2);
        jogador.hp = 20;
        emCombate = false;
        atualizarInterface();
        
        // GATILHO: Salva a perda de ouro no banco
        salvarNoBackend();
        return true;
    }
    return false;
}

// --- INTEGRAÇÃO COM O BACKEND NODE.JS ---

let idJogadorSalvo = null;
const URL_BACKEND = "http://localhost:3000";

function iniciarSessaoNoBackend() {
    fetch(`${URL_BACKEND}/novo-jogador`, { method: 'POST' })
        .then(res => res.json())
        .then(data => {
            idJogadorSalvo = data.id;
            console.log("ID recebido do Backend:", idJogadorSalvo);
        })
        .catch(err => console.error("Erro ao conectar no backend:", err));
}

function salvarNoBackend() {
    if (!idJogadorSalvo) return;

    fetch(`${URL_BACKEND}/salvar-progresso`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            id: idJogadorSalvo,
            ouro: jogador.ouro,
            nivelArma: jogador.nivelArma,
            bonusArma: jogador.bonusArma
        })
    })
    .then(res => res.json())
    .then(data => console.log("Resposta do servidor:", data.mensagem))
    .catch(err => console.error("Erro ao salvar:", err));
}

// EXECUÇÃO INICIAL (Quando a página abre)
atualizarInterface();
iniciarSessaoNoBackend(); // Pede o ID único do jogador assim que o jogo inicia