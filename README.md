# 🗣️ Говорю свободно — Учи английские слова

Приложение для изучения английского по методу карточек + тестов.

## Возможности

- 🃏 **Карточки** — смотришь слово, ассоциацию, переворачиваешь для перевода
- ✅ **Тесты** — 5 вариантов ответа, выбери правильный перевод
- 🔄 **Повторение** — spaced repetition для слов которые ещё не выучил
- 🔥 **Стрик** — огонёк за ежедневные визиты
- 📊 **Прогресс** — XP, точность, уровни, полоска прогресса
- 🔒 **Уровни** — разблокируй следующий пройдя предыдущий
- 💾 **Сохранение** — прогресс в localStorage

## Запуск

```bash
npm install
npm run dev
```

## Деплой

```bash
npm run build
# Папку dist/ загрузи на хостинг (Vercel, Netlify, GitHub Pages)
```

### GitHub Pages

1. `npm run build`
2. Загрузи содержимое `dist/` в ветку `gh-pages`
3. Или используй `gh-pages` пакет:
   ```bash
   npm install -D gh-pages
   # Добавь в package.json scripts: "deploy": "gh-pages -d dist"
   npm run deploy
   ```

## Структура

```
src/
  data/words.js      ← все слова (сейчас 100, будет 2000)
  hooks/useStorage.js ← localStorage persistence
  components/
    Auth.jsx          ← регистрация
    Home.jsx          ← главный экран
    Levels.jsx        ← выбор уровня
    Cards.jsx         ← режим карточек
    Quiz.jsx          ← режим тестов
    Review.jsx        ← повторение
```

## Как добавить слова

Отредактируй `src/data/words.js` — добавь объекты `{ en, ru, hint }` в массив `words`.
Уровни создаются автоматически по `WORDS_PER_LEVEL` штук.
