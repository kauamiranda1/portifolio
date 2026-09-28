const LINKS = {
    email: "oliv.luis@gmail.com",
    linkedin: "https://www.linkedin.com/in/luis-alberto-oliveira-sm/"
};

document.querySelectorAll("[data-link]").forEach((elemento) => {
    const chave = elemento.dataset.link;
    const valor = (LINKS[chave] || "").trim();

    if (!valor) {
        elemento.hidden = true;
        return;
    }

    elemento.href = chave === "email" ? "mailto:" + valor : valor;
    elemento.hidden = false;
});


const saudacao = document.querySelector("#saudacao");

if (saudacao) {
    const hora = new Date().getHours();
    let cumprimento = "Boa noite";

    if (hora >= 5 && hora < 12) {
        cumprimento = "Bom dia"; 
    } else if (hora >= 12 && hora < 18) {
        cumprimento = "Boa tarde";
    }

    saudacao.textContent = cumprimento + "! Que bom ter você por aqui.";
}

const menuBotao = document.querySelector(".menu-botao");
const menu = document.querySelector("#menu");

function fecharMenu() {
    menu.classList.remove("aberto");
    menuBotao.setAttribute("aria-expanded", "false");
    menuBotao.textContent = "Menu";
}

menuBotao.addEventListener("click", () => {
    const aberto = menu.classList.toggle("aberto");
    menuBotao.setAttribute("aria-expanded", String(aberto));
    menuBotao.textContent = aberto ? "Fechar" : "Menu";
});

menu.querySelectorAll("a").forEach((link) => link.addEventListener("click", fecharMenu));

document.addEventListener("keydown", (evento) => {
    if (evento.key === "Escape") fecharMenu();
});

const secoes = document.querySelectorAll("main section[id]");
const linksDoMenu = document.querySelectorAll('.nav-links a[href^="#"]');

const observador = new IntersectionObserver((entradas) => {
    entradas.forEach((entrada) => {
        if (!entrada.isIntersecting) return;

        linksDoMenu.forEach((link) => link.removeAttribute("aria-current"));

        const ativo = document.querySelector('.nav-links a[href="#' + entrada.target.id + '"]');
        if (ativo) ativo.setAttribute("aria-current", "true");
    });
}, { rootMargin: "-40% 0px -55% 0px" });

secoes.forEach((secao) => observador.observe(secao));

const empresas = document.querySelectorAll(".exp");
const botaoExpandir = document.querySelector("#expandir-tudo");

function atualizarTextoDoBotao() {
    const todasAbertas = [...empresas].every((empresa) => empresa.open);
    botaoExpandir.textContent = todasAbertas ? "Recolher tudo" : "Expandir tudo";
}

if (botaoExpandir) {
    botaoExpandir.hidden = false;

    botaoExpandir.addEventListener("click", () => {
        const abrir = [...empresas].some((empresa) => !empresa.open);
        empresas.forEach((empresa) => { empresa.open = abrir; });
        atualizarTextoDoBotao();
    });

    empresas.forEach((empresa) => empresa.addEventListener("toggle", atualizarTextoDoBotao));
}

const fonte = document.querySelector("#caso-fonte");
const quadro = document.querySelector("#quadro");
const controles = document.querySelector("#caso-controles");

if (fonte && quadro && controles) {
    const nomesDasEtapas = ["Problema", "Resolução", "Benefício"];
    const listas = [...quadro.querySelectorAll(".coluna ul")];
    const contadores = [...quadro.querySelectorAll(".contador")];
    const status = document.querySelector("#caso-status");
    const cores = ["amarelo", "verde", "rosa", "celeste"];
    const giros = ["-1.6deg", "1.2deg", "-0.8deg", "1.8deg"];

    const notas = [...fonte.querySelectorAll("li")].map((item, indice) => {
        const textos = [...item.querySelectorAll("span")].map((s) => s.textContent.trim());

        const li = document.createElement("li");
        const botao = document.createElement("button");
        botao.type = "button";
        botao.className = "nota";
        botao.style.setProperty("--cor", "var(--" + cores[indice % cores.length] + ")");
        botao.style.setProperty("--giro", giros[indice % giros.length]);
        botao.innerHTML = '<span class="nota-texto"></span><span class="nota-dica"></span>';
        li.appendChild(botao);

        return { textos, etapa: 0, li, botao };
    });

    function desenharNota(nota) {
        const etapa = nota.etapa;
        const chegouAoFim = etapa === nomesDasEtapas.length - 1;

        nota.botao.dataset.etapa = etapa;
        nota.botao.querySelector(".nota-texto").textContent = nota.textos[etapa];
        nota.botao.querySelector(".nota-dica").textContent = chegouAoFim
            ? "Chegou ao benefício"
            : "Clique para avançar";
        nota.botao.setAttribute(
            "aria-label",
            nota.textos[etapa] + ". Etapa: " + nomesDasEtapas[etapa] + "." +
            (chegouAoFim ? "" : " Ative para avançar.")
        );

        listas[etapa].appendChild(nota.li);
    }

    function atualizarPlacar() {
        listas.forEach((lista, i) => { contadores[i].textContent = lista.children.length; });

        const prontas = notas.filter((n) => n.etapa === nomesDasEtapas.length - 1).length;
        status.textContent = prontas === notas.length
            ? "Todas as notas chegaram aos benefícios. Esse foi o caminho do case."
            : prontas + " de " + notas.length + " notas chegaram aos benefícios.";
    }

    notas.forEach((nota) => {
        nota.botao.addEventListener("click", () => {
            if (nota.etapa >= nomesDasEtapas.length - 1) return;

            nota.etapa += 1;
            desenharNota(nota);
            atualizarPlacar();

            nota.botao.focus();
            nota.botao.classList.add("pop");
            nota.botao.addEventListener("animationend", () => nota.botao.classList.remove("pop"), { once: true });
        });
    });

    document.querySelector("#caso-reiniciar").addEventListener("click", () => {
        notas.forEach((nota) => {
            nota.etapa = 0;
            desenharNota(nota);
        });
        atualizarPlacar();
    });

    notas.forEach(desenharNota);
    atualizarPlacar();
    quadro.hidden = false;
    controles.hidden = false;
    fonte.hidden = true;
}
