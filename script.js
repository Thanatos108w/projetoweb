let ataqueEmExecucao = false;

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));//delay
}

//auxs
function atualizarStatus(texto, classe) {
    const status = document.getElementById("status-sistema");
    status.className = `status ${classe}`;
    status.textContent = `Status: ${texto}`;
}

function mostrarSucesso(senha, tentativas, inicio) {
    const tempo = ((Date.now() - inicio) / 1000).toFixed(2);
    document.getElementById("resultado").innerHTML = `
        Senha encontrada<br>
        Senha: <b>${senha}</b><br>
        Tentativas: ${tentativas}<br>
        Tempo: ${tempo}s`
        atualizarStatus("Ataque bem-sucedido", "status-finalizado");
}

function finalizarFalha(tentativas, inicio) {
    if (!ataqueEmExecucao) return;

    ataqueEmExecucao = false;
    const tempo = ((Date.now() - inicio) / 1000).toFixed(2);

    document.getElementById("resultado").innerHTML = `
        Senha não encontrada<br>
        Tentativas: ${tentativas}<br>
        Tempo: ${tempo}s`
        atualizarStatus("Ataque mal-sucedido", "status-finalizado");;
}

function atualizarTela(tipo, tentativa, tentativas) {
    document.getElementById("resultado").innerHTML = `
        ${tipo}<br>
        Tentando: <b>${tentativa}</b><br>
        Tentativas: ${tentativas}`;
}
async function gerarHash(texto) {
    const encoder = new TextEncoder();
    const data = encoder.encode(texto);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);

    return Array.from(new Uint8Array(hashBuffer))
        .map(b => b.toString(16).padStart(2, "0"))
        .join("");
}

const rainbowTable = [
         // Senhas "comuns"
        "123456","123456789","12345678","12345","123123","111111",
        "000000","senha","senha123","admin","admin123","admin2024",
        "qwerty","abc123","password","password123","welcome","letmein",
        "iloveyou","monkey","dragon","sunshine","princess","football",
        "baseball","shadow","master","killer","superman","batman",
        "trustno1","login","root","toor","access","default",

        // Combinação de padrão + número
        "user123","user2024","teste","teste123","teste2024","dev123",
        "dev2024","login123","login2024","senha2024","senha2023",
        "admin2023","admin01","admin99","root123","root2024",

        // Padrão Corinthians
        "coringao","coringao123","maiordesp","itaquerao","palmeiraslixo",
        "corinthians123","gigantezl","2mundiais","maiordetds1","sccp123",
        "chelseakkk","cassiooooo","","campeaocdb","melhordadecada10","vtncflamengo",
        "vaicorinthians","bandodeloucos123","fiel123","gavioesdafiel","vasco",
];

//



function iniciarAtaque() {
    const senha = document.getElementById("senhaAlvo").value;
    const tipo = document.getElementById("tipoAtaque").value;
    const resultado = document.getElementById("resultado");

    if (!senha) {
        alert("Informe uma senha para a simulação.");
        return;
    }

    ataqueEmExecucao = false;

    setTimeout(() => {
        ataqueEmExecucao = true;
        atualizarStatus("Executando ataque", "status-executando");
        resultado.innerHTML = "Iniciando ataque...";

        switch (tipo) {
            case "bruteforce":
                bruteForceAttack(senha);
                break;
            case "dicionario":
                dictionaryAttack(senha);
                break;
            case "mascara":
                maskAttack(senha);
                break;
            case "hibrido":
                hybridAttack(senha);
                break;
            case "rainbow":
                rainbowTableAttack(senha);
                break;
            default:
                resultado.innerHTML = "Tipo de ataque inválido.";
        }
    }, 50);
}

async function bruteForceAttack(senhaAlvo) { // BTFC
    const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
    let tentativas = 0;
    const inicio = Date.now();
    const resultado = document.getElementById("resultado");

    async function gerar(prefixo, tamanhoMax) {
        if (!ataqueEmExecucao) return;

        if (prefixo.length > 0) {
            tentativas++;

            resultado.innerHTML = `
                Brute Force<br>
                Tentando: <b>${prefixo}</b><br>
                Tentativas: ${tentativas}
            `;

            if (prefixo === senhaAlvo) {
                ataqueEmExecucao = false;
                mostrarSucesso(prefixo, tentativas, inicio);
                return;
            }

            await sleep(10); //delay pequeno para demorar menos, mas ainda ser visível
        }

        if (prefixo.length === tamanhoMax) return;

        for (let c of chars) {
            if (!ataqueEmExecucao) return;
            await gerar(prefixo + c, tamanhoMax);
        }
    }

    for (let tamanho = 1; tamanho <= 4 && ataqueEmExecucao; tamanho++) {
        await gerar("", tamanho);
    }

    if (ataqueEmExecucao) {
        finalizarFalha(tentativas, inicio);
    }
}
    finalizarFalha(tentativas, inicio);


async function dictionaryAttack(senhaAlvo) {
    const wordlist = [
        // Senhas "comuns"
        "123456","123456789","12345678","12345","123123","111111",
        "000000","senha","senha123","admin","admin123","admin2024",
        "qwerty","abc123","password","password123","welcome","letmein",
        "iloveyou","monkey","dragon","sunshine","princess","football",
        "baseball","shadow","master","killer","superman","batman",
        "trustno1","login","root","toor","access","default",

        // Combinação de padrão + número
        "user123","user2024","teste","teste123","teste2024","dev123",
        "dev2024","login123","login2024","senha2024","senha2023",
        "admin2023","admin01","admin99","root123","root2024",

        // Padrão Corinthians
        "coringao","coringao123","maiordesp","itaquerao","palmeiraslixo",
        "corinthians123","gigantezl","2mundiais","maiordetds1","sccp123",
        "chelseakkk","cassiooooo","","campeaocdb","melhordadecada10","vtncflamengo",
        "vaicorinthians","bandodeloucos123","fiel123","gavioesdafiel","vasco",
    ];

    let tentativas = 0;
    const inicio = Date.now();
    const resultado = document.getElementById("resultado");

    for (let palavra of wordlist) {
        if (!ataqueEmExecucao) return;

        tentativas++;

        resultado.innerHTML = `
            Ataque de Dicionário<br>
            Testando: <b>${palavra}</b><br>
            Tentativas: ${tentativas}
        `;

        if (palavra === senhaAlvo) {
            ataqueEmExecucao = false;
            mostrarSucesso(palavra, tentativas, inicio);
            return;
        }

        await sleep(200); //delay maior para ficar mais visível
    }

    finalizarFalha(tentativas, inicio);
}

async function maskAttack(senhaAlvo) { //mask
    const letras = "abcdefghijklmnopqrstuvwxyz";
    const numeros = "0123456789";
    let tentativas = 0;
    const inicio = Date.now();
    const resultado = document.getElementById("resultado");

    for (let a of letras) {
        for (let b of letras) {
            for (let c of letras) {
                for (let n1 of numeros) {
                    for(let n2 of numeros){

                    if (!ataqueEmExecucao) return;

                    const tentativa = `${a}${b}${c}${n1}${n2}2024`;
                    tentativas++;

                    resultado.innerHTML = `
                        Ataque por Máscara<br>
                        Tentando: <b>${tentativa}</b><br>
                        Tentativas: ${tentativas}
                    `;

                    if (tentativa === senhaAlvo) {
                        ataqueEmExecucao = false;
                        mostrarSucesso(tentativa, tentativas, inicio);
                        return;
                    }

                    await sleep(20);
                }
            }
        }
    }
}

    finalizarFalha(tentativas, inicio);
}

async function hybridAttack(senhaAlvo) {
    const palavrasBase = [
        "admin","user","senha","login","root","dev","teste",
        "acesso","system","network","server","database",
        "brasil","city","coringao","fiel","corinthians",
    ];

    const numeros = [
        "1","12","123","01","99","2023","2024"
    ];

    const simbolos = [
        "!","@","#","$"
    ];

    let tentativas = 0;
    const inicio = Date.now();
    const resultado = document.getElementById("resultado");

    for (let base of palavrasBase) {

        // palavra base variada
        const variacoesBase = [
            base,
            base.charAt(0).toUpperCase() + base.slice(1),
            base.toUpperCase()
        ];

        for (let palavra of variacoesBase) {

            // tentativa simples
            if (!ataqueEmExecucao) return;
            tentativas++;
            atualizarTela("Ataque Híbrido", palavra, tentativas);

            if (palavra === senhaAlvo) {
                ataqueEmExecucao = false;
                mostrarSucesso(palavra, tentativas, inicio);
                return;
            }
            await sleep(120);

            // palavra + número
            for (let num of numeros) {
                const tentativaNum = palavra + num;
                tentativas++;

                atualizarTela("Ataque Híbrido", tentativaNum, tentativas);

                if (tentativaNum === senhaAlvo) {
                    ataqueEmExecucao = false;
                    mostrarSucesso(tentativaNum, tentativas, inicio);
                    return;
                }
                await sleep(60);
            }

            // palavra + símbolo
            for (let simb of simbolos) {
                const tentativaSimb = palavra + simb;
                tentativas++;

                atualizarTela("Ataque Híbrido", tentativaSimb, tentativas);

                if (tentativaSimb === senhaAlvo) {
                    ataqueEmExecucao = false;
                    mostrarSucesso(tentativaSimb, tentativas, inicio);
                    return;
                }
                await sleep(60);
            }

            // símbolo + palavra
            for (let simb of simbolos) {
                const tentativaInv = simb + palavra;
                tentativas++;

                atualizarTela("Ataque Híbrido", tentativaInv, tentativas);

                if (tentativaInv === senhaAlvo) {
                    ataqueEmExecucao = false;
                    mostrarSucesso(tentativaInv, tentativas, inicio);
                    return;
                }
                await sleep(60);
            }

            // palavra + número + símbolo   
            for (let num of numeros) {
                for (let simb of simbolos) {
                    const tentativaCombo = palavra + num + simb;
                    tentativas++;

                    atualizarTela("Ataque Híbrido", tentativaCombo, tentativas);

                    if (tentativaCombo === senhaAlvo) {
                        ataqueEmExecucao = false;
                        mostrarSucesso(tentativaCombo, tentativas, inicio);
                        return;
                    }
                    await sleep(60);
                }
            }
        }
    }

    finalizarFalha(tentativas, inicio);
}

async function rainbowTableAttack(senhaAlvo) {
    const resultado = document.getElementById("resultado");
    let tentativas = 0;
    const inicio = Date.now();

    resultado.innerHTML = "Gerando hash da senha alvo...";

    const hashAlvo = await gerarHash(senhaAlvo);

    await sleep(20);

    for (let senha of rainbowTable) {
        if (!ataqueEmExecucao) return;

        tentativas++;

        const hashTabela = await gerarHash(senha);

        resultado.innerHTML = `
            Rainbow Table Attack<br>
            Comparando hash:<br>
            ${hashTabela}<br>
            Tentativas: ${tentativas}
        `;

        if (hashTabela === hashAlvo) {
            ataqueEmExecucao = false;
            mostrarSucesso(senha, tentativas, inicio);
            return;
        }

        await sleep(200);
    }

    finalizarFalha(tentativas, inicio);
}