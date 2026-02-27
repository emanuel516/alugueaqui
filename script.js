let imoveis = JSON.parse(localStorage.getItem("imoveis")) || [];

function salvarLocal() {
  localStorage.setItem("imoveis", JSON.stringify(imoveis));
}

function mostrarFormulario() {
  const form = document.getElementById("formulario");
  form.style.display = form.style.display === "flex" ? "none" : "flex";
}

function adicionarImovel() {
  const titulo = document.getElementById("titulo").value;
  const bairro = document.getElementById("bairro").value;
  const preco = document.getElementById("preco").value;
  const descricao = document.getElementById("descricao").value;
  const imagemInput = document.getElementById("imagem");

  if (!titulo || !bairro || !preco) {
    alert("Preencha os campos obrigatórios!");
    return;
  }

  const reader = new FileReader();
  reader.onload = function(e) {
    const novoImovel = {
      id: Date.now(),
      titulo,
      bairro,
      preco: parseFloat(preco),
      descricao,
      imagem: e.target.result
    };

    imoveis.push(novoImovel);
    salvarLocal();
    listarImoveis();
    document.getElementById("formulario").reset();
  };

  if (imagemInput.files[0]) {
    reader.readAsDataURL(imagemInput.files[0]);
  }
}

function listarImoveis(lista = imoveis) {
  const container = document.getElementById("lista-imoveis");
  container.innerHTML = "";

  lista.forEach(imovel => {
    const mensagem = `Olá, vi o imóvel ${imovel.titulo} no bairro ${imovel.bairro} no site Alugue Aqui e quero mais informações.`;
    const linkWhats = `https://wa.me/5527997469111?text=${encodeURIComponent(mensagem)}`;

    container.innerHTML += `
      <div class="card">
        <img src="${imovel.imagem}">
        <div class="card-content">
          <h3>${imovel.titulo}</h3>
          <p><strong>Bairro:</strong> ${imovel.bairro}</p>
          <p class="preco">R$ ${imovel.preco.toLocaleString('pt-BR')} / mês</p>
          <p>${imovel.descricao}</p>
          <button class="whatsapp" onclick="window.open('${linkWhats}')">
            Falar no WhatsApp
          </button>
          <button class="excluir" onclick="excluirImovel(${imovel.id})">
            Excluir
          </button>
        </div>
      </div>
    `;
  });
}

function excluirImovel(id) {
  if (confirm("Tem certeza que deseja excluir?")) {
    imoveis = imoveis.filter(i => i.id !== id);
    salvarLocal();
    listarImoveis();
  }
}

function aplicarFiltros() {
  const busca = document.getElementById("busca").value.toLowerCase();
  const bairro = document.getElementById("filtroBairro").value.toLowerCase();
  const min = document.getElementById("valorMin").value;
  const max = document.getElementById("valorMax").value;
  const ordenar = document.getElementById("ordenar").value;

  let filtrados = imoveis.filter(i =>
    i.titulo.toLowerCase().includes(busca) &&
    i.bairro.toLowerCase().includes(bairro) &&
    (!min || i.preco >= min) &&
    (!max || i.preco <= max)
  );

  if (ordenar === "menor") {
    filtrados.sort((a,b) => a.preco - b.preco);
  } else if (ordenar === "maior") {
    filtrados.sort((a,b) => b.preco - a.preco);
  }

  listarImoveis(filtrados);
}

listarImoveis();