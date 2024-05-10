# language: pt
Funcionalidade: Ingredientes
  Lidando com ingredientes na API

  Cenário: Buscar ingredientes
    Quando realizo uma requisição GET para "/ingredientes"
    Então o código da resposta deve ser "200"
    E a resposta deve conter mais de um item