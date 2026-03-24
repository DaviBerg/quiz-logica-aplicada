# 🐾 Animal Explorer

Interface web para pesquisa taxonômica de animais usando **React + Tailwind CSS** no frontend e **Express + Tau-Prolog** no backend.

---

## Estrutura do projeto

```
animal-explorer/
├── backend/
│   ├── server.js          # Servidor Express
│   ├── rules.pl           # Regras Prolog (search_animals, match, distinct_values)
│   ├── animal_facts.pl    # Base de fatos com 1787 animais
│   └── package.json
└── frontend/
    ├── src/
    │   ├── App.jsx
    │   ├── api.js                    # Camada de comunicação com o backend
    │   ├── main.jsx
    │   ├── index.css
    │   ├── components/
    │   │   ├── Header.jsx
    │   │   ├── SearchForm.jsx
    │   │   ├── AnimalCard.jsx
    │   │   └── ResultsSection.jsx
    │   └── hooks/
    │       └── useSearch.js
    ├── index.html
    ├── vite.config.js
    ├── tailwind.config.js
    ├── postcss.config.js
    └── package.json
```

---

## Como rodar

### Pré-requisitos

- Node.js >= 18

---

### 1. Backend

```bash
cd backend
npm install
npm start
# Servidor rodando em http://localhost:3001
```

Para desenvolvimento com hot-reload:
```bash
npm run dev
```

---

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
# Interface em http://localhost:5173
```

O Vite está configurado com proxy: requisições para `/api` são redirecionadas automaticamente para `http://localhost:3001`.

---

## API Endpoints

### `POST /api/search`
Pesquisa animais com filtros taxonômicos.

**Body (JSON):** todos os campos são opcionais. Campo vazio = curinga (`any`).
```json
{
  "kingdom": "",
  "phylum": "",
  "class": "Mammalia",
  "order": "",
  "family": "Felidae",
  "genus": "",
  "species": "",
  "name": ""
}
```

**Resposta:**
```json
{
  "success": true,
  "count": 8,
  "results": [
    {
      "name": "Lion",
      "kingdom": "Animalia",
      "phylum": "Chordata",
      "class": "Mammalia",
      "order": "Carnivora",
      "family": "Felidae",
      "genus": "Panthera",
      "species": "Panthera leo",
      "lifespan": "12-25 years",
      "behavior": "Nocturnal, Crepuscular, Diurnal, Scavenger, Hypercarnivore",
      "diet": "Scavenger, Hypercarnivore"
    }
  ]
}
```

---

### `GET /api/distinct/:rank`
Retorna todos os valores únicos para um nível taxonômico.

**Parâmetros:** `rank` = `kingdom` | `phylum` | `class` | `order` | `family` | `genus` | `species`

```bash
GET /api/distinct/family
```

**Resposta:**
```json
{
  "success": true,
  "values": ["Accipitridae", "Ailuridae", "Anatidae", ...]
}
```

---

### `GET /api/stats`
Retorna contagem total de animais na base.

```json
{
  "success": true,
  "totalAnimals": 1787
}
```

---

## Como a integração Prolog funciona

1. O backend carrega `animal_facts.pl` + `rules.pl` em uma sessão Tau-Prolog na inicialização.
2. Cada requisição de busca monta uma query Prolog dinamicamente:
   ```prolog
   search_animals(any, any, 'Mammalia', any, 'Felidae', any, any, any,
                  Name, Kingdom, Phylum, Class, Order, Family, Genus, Species,
                  Lifespan, Behavior, Diet)
   ```
3. O motor Tau-Prolog resolve a query via backtracking e retorna todos os resultados.
4. O servidor serializa as respostas em JSON e envia ao frontend.

---

## Build para produção

```bash
# Frontend
cd frontend
npm run build
# Gera /frontend/dist

# Sirva o dist com o Express (ou qualquer servidor estático)
```
