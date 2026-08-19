# AI Pokedex

A small Flask app that generates Pokedex entries using the ChatGPT API. Built as a
teaching project on prompt patterns, message roles, and JSON responses.

You give it a Pokemon name (real or made up) and a persona, and it returns a full
Pokedex style entry: stats, description, height and weight, abilities, type,
weaknesses, and evolutions, rendered as a card in the browser.

## Project structure

```
pokedex-project/
├── app.py              # Flask backend, calls the ChatGPT API
├── requirements.txt     # Python dependencies
├── .env.example          # Template for your API key, copy this to .env
└── static/
    ├── index.html        # Frontend page
    ├── style.css          # Card styling
    └── script.js           # Fetches from the backend and renders the card
```

## Setup

These steps take you from a fresh clone to a running app.

1. **Clone the repo**

   ```
   git clone <your-repo-url>
   cd pokedex-project
   ```

2. **Create a virtual environment** (recommended, keeps dependencies isolated)

   ```
   python3 -m venv venv
   source venv/bin/activate      # on Windows: venv\Scripts\activate
   ```

3. **Install dependencies**

   ```
   pip install -r requirements.txt
   ```

4. **Set up your API key**

   Copy the example env file and fill in your own key.

   ```
   cp .env.example .env
   ```

   Then open `.env` and replace the placeholder with your real OpenAI API key:

   ```
   OPENAI_API_KEY=sk-your-real-key-here
   ```

   You can get a key from https://platform.openai.com/api-keys. Never commit your
   real `.env` file, it's already excluded in `.gitignore`.

5. **Run the app**

   ```
   python app.py
   ```

6. **Open it in your browser**

   Go to http://localhost:5000

## How it works

- The backend uses a **persona pattern**: the system prompt gives the Pokedex a
  personality, chosen from the dropdown on the frontend.
- It uses an **output format pattern**: the user prompt tells the model exactly what
  JSON shape to return, so the code can reliably read the response.
- If the model returns something that isn't valid JSON, the backend catches that and
  returns an error instead of crashing.

## Troubleshooting

- **"Could not reach the server"** in the browser: make sure `python app.py` is still
  running in your terminal.
- **401 or authentication errors**: double check your `.env` file has a real API key,
  not the placeholder text, and that you copied it into `.env`, not just
  `.env.example`.
- **"The AI didn't return valid JSON"**: this can happen occasionally since the model
  doesn't always follow formatting instructions perfectly. Just try generating again.