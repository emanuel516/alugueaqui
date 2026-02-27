// Supabase
const supabaseUrl = "https://wiesqachdwrdvuqmbudh.supabase.co";
const supabaseKey = "sb_publishable_PVRWMM9b6IGK8EMPSLmVJQ_EOZG5DZb";
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

const container = document.getElementById("imoveis-container");
const form = document.getElementById("form-imovel");
const btnAdd = document.getElementById("add-imovel-btn");

const SENHA_ADMIN = "326190";

// Mostrar formulário somente se senha correta
btnAdd.addEventListener("click", () => {
  form.style.display = "block";
});

// Envio do formulário
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const senha = document.getElementById("senha").value;
  if(senha !== SENHA_ADMIN){
    alert("Senha incorreta!");
    return;
  }

  const titulo = document.getElementById("titulo").value;
  const preco = document.getElementById("preco").value;
  const descricao = document.getElementById("descricao").value;
  const imagem = document.getElementById("imagem").value;
  const whatsapp = document.getElementById("whatsapp").value;

  const { data, error } = await supabase
    .from("imoveis")
    .insert([{ titulo, preco, descricao, imagem, whatsapp }]);

  if(error){
    alert("Erro ao adicionar imóvel");
    console.error(error);
    return;
  }

  alert("Imóvel adicionado com sucesso!");
  form.reset();
  form.style.display = "none";
  carregarImoveis();
});

// Carregar imóveis
async function carregarImoveis() {
  container.innerHTML = "Carregando imóveis...";

  const { data, error } = await supabase
    .from("imoveis")
    .select("*")
    .order("created_at", { ascending: false });

  if(error){
    container.innerHTML = "Erro ao carregar imóveis";
    console.error(error);
    return;
  }

  if(!data || data.length===0){
    container.innerHTML = "Nenhum imóvel cadastrado ainda";
    return;
  }

  container.innerHTML = "";
  data.forEach(imovel=>{
    const div = document.createElement("div");
    div.classList.add("imovel");
    div.innerHTML = `
      <img src="${imovel.imagem}" alt="${imovel.titulo}" />
      <h3>${imovel.titulo}</h3>
      <p>${imovel.descricao}</p>
      <p><strong>Preço:</strong> ${imovel.preco}</p>
      <a href="https://wa.me/${imovel.whatsapp}" target="_blank">📱 Contato WhatsApp</a>
    `;
    container.appendChild(div);
  });
}

window.addEventListener("DOMContentLoaded", carregarImoveis);
