// ══════════════════════════════════════════════════════════════════
// ЯЗЫКОВЫЕ ОСТРОВА — система изучения английского через фразы
// Структура: Острова → Уровни сложности → Фразовые блоки + Словарь
// ══════════════════════════════════════════════════════════════════
//
// type: "phrase"  — фразовый блок (основной контент)
// type: "word"    — отдельное слово-существительное (словарь)
// type: "glue"    — связующее слово / филлер для естественной речи
//
// difficulty: 1 = Beginner, 2 = Elementary, 3 = Intermediate, 4 = Upper-Intermediate
// ══════════════════════════════════════════════════════════════════

export const GRAMMAR_ISLANDS = [
  {
    id: "present_simple",
    title: "Здесь и сейчас",
    subtitle: "Present Simple",
    label: "Настоящее время",
    icon: "🟢",
    lessons: [
      {
        id: "affirmative",
        title: "Утверждение",
        explanation: "Когда говоришь о том, что делаешь обычно, регулярно — используй Present Simple.",
        whatAndWhy: {
          what: "Как строить базовые утверждения в настоящем времени.",
          why: "Это база. Без этого невозможно рассказать о себе, своих привычках, фактах и распорядке дня."
        },
        formulas: ["I / you / we / they + глагол", "he / she / it + глагол+s"],
        exercises: [
          { ru: "Я хожу в спортзал", en: ["I", "go", "to", "the", "gym"], category: "present_affirmative" },
          { ru: "Она работает из дома", en: ["She", "works", "from", "home"], category: "present_affirmative_3rd" },
          { ru: "Мы любим пиццу", en: ["We", "love", "pizza"], category: "present_affirmative" },
          { ru: "Он играет в футбол", en: ["He", "plays", "football"], category: "present_affirmative_3rd" },
          { ru: "Они живут в Москве", en: ["They", "live", "in", "Moscow"], category: "present_affirmative" },
          { ru: "Я читаю книги", en: ["I", "read", "books"], category: "present_affirmative" },
          { ru: "Она готовит ужин", en: ["She", "cooks", "dinner"], category: "present_affirmative_3rd" },
          { ru: "Мы смотрим фильмы", en: ["We", "watch", "movies"], category: "present_affirmative" },
          { ru: "Он пьет чай", en: ["He", "drinks", "tea"], category: "present_affirmative_3rd" },
          { ru: "Они учат английский", en: ["They", "learn", "English"], category: "present_affirmative" }
        ]
      },
      {
        id: "negative",
        title: "Отрицание",
        explanation: "Чтобы сказать 'не делаю' — добавь don't / doesn't перед глаголом.",
        whatAndWhy: {
          what: "Как говорить о том, чего мы НЕ делаем или что не является правдой.",
          why: "Чтобы уметь выражать отказ, отсутствие привычки или опровергать неверные факты."
        },
        formulas: ["I / you / we / they + don't + глагол", "he / she / it + doesn't + глагол (БЕЗ s!)"],
        exercises: [
          { ru: "Я не пью кофе", en: ["I", "don't", "drink", "coffee"], category: "present_negative" },
          { ru: "Она не работает по субботам", en: ["She", "doesn't", "work", "on", "Saturdays"], category: "present_negative_3rd" },
          { ru: "Мы не смотрим телевизор", en: ["We", "don't", "watch", "TV"], category: "present_negative" },
          { ru: "Он не говорит по-русски", en: ["He", "doesn't", "speak", "Russian"], category: "present_negative_3rd" },
          { ru: "Я не ем мясо", en: ["I", "don't", "eat", "meat"], category: "present_negative" },
          { ru: "Она не любит зиму", en: ["She", "doesn't", "like", "winter"], category: "present_negative_3rd" },
          { ru: "Мы не играем на гитаре", en: ["We", "don't", "play", "the", "guitar"], category: "present_negative" },
          { ru: "Он не курит", en: ["He", "doesn't", "smoke"], category: "present_negative_3rd" },
          { ru: "Они не ходят в школу", en: ["They", "don't", "go", "to", "school"], category: "present_negative" },
          { ru: "Я не понимаю", en: ["I", "don't", "understand"], category: "present_negative" }
        ]
      },
      {
        id: "question",
        title: "Вопрос",
        explanation: "Чтобы задать вопрос — поставь Do / Does в начало.",
        whatAndWhy: {
          what: "Как расспрашивать собеседника о его жизни, интересах и распорядке.",
          why: "Основа любого диалога — умение задавать вопросы. Без этого невозможно познакомиться и узнать что-то новое."
        },
        formulas: ["Do + I / you / we / they + глагол?", "Does + he / she / it + глагол (БЕЗ s!)?"],
        exercises: [
          { ru: "Ты любишь музыку?", en: ["Do", "you", "like", "music?"], category: "present_question" },
          { ru: "Она говорит по-английски?", en: ["Does", "she", "speak", "English?"], category: "present_question_3rd" },
          { ru: "Они работают вместе?", en: ["Do", "they", "work", "together?"], category: "present_question" },
          { ru: "Ты пьешь чай?", en: ["Do", "you", "drink", "tea?"], category: "present_question" },
          { ru: "Он живет здесь?", en: ["Does", "he", "live", "here?"], category: "present_question_3rd" },
          { ru: "Она готовит завтрак?", en: ["Does", "she", "cook", "breakfast?"], category: "present_question_3rd" },
          { ru: "Мы знаем его?", en: ["Do", "we", "know", "him?"], category: "present_question" },
          { ru: "Ты понимаешь меня?", en: ["Do", "you", "understand", "me?"], category: "present_question" },
          { ru: "Она читает новости?", en: ["Does", "she", "read", "the", "news?"], category: "present_question_3rd" },
          { ru: "Они играют в теннис?", en: ["Do", "they", "play", "tennis?"], category: "present_question" }
        ]
      },
      {
        id: "mix",
        title: "Микс",
        isMix: true,
        count: 15
      },
      {
        id: "exam",
        title: "Экзамен",
        isExam: true,
        count: 20,
        threshold: 0.85
      }
    ]
  },
  {
    id: "past_simple",
    title: "Машина времени",
    subtitle: "Past Simple",
    label: "Прошедшее время",
    icon: "🔵",
    lessons: [
      {
        id: "affirmative",
        title: "Утверждение",
        explanation: "Когда говоришь о том, что уже произошло — используй Past Simple.",
        whatAndWhy: {
          what: "Как рассказывать о событиях, которые уже завершились в прошлом.",
          why: "Чтобы делиться историями из жизни, своим опытом, воспоминаниями и тем, как прошел вчерашний день."
        },
        formulas: ["I / you / we / they / he / she / it + глагол в прошедшем"],
        table: "go→went, eat→ate, work→worked, see→saw, buy→bought, make→made, take→took, come→came, have→had, get→got",
        exercises: [
          { ru: "Я ходил в кино вчера", en: ["I", "went", "to", "the", "cinema", "yesterday"], category: "past_affirmative" },
          { ru: "Она купила новый телефон", en: ["She", "bought", "a", "new", "phone"], category: "past_affirmative" },
          { ru: "Мы ели пиццу", en: ["We", "ate", "pizza"], category: "past_affirmative" },
          { ru: "Он сделал ошибку", en: ["He", "made", "a", "mistake"], category: "past_affirmative" },
          { ru: "Они видели фильм", en: ["They", "saw", "the", "movie"], category: "past_affirmative" },
          { ru: "Я работал вчера", en: ["I", "worked", "yesterday"], category: "past_affirmative" },
          { ru: "Она пришла домой", en: ["She", "came", "home"], category: "past_affirmative" },
          { ru: "Мы купили продукты", en: ["We", "bought", "groceries"], category: "past_affirmative" },
          { ru: "Он забыл ключи", en: ["He", "forgot", "the", "keys"], category: "past_affirmative" },
          { ru: "Они взяли такси", en: ["They", "took", "a", "taxi"], category: "past_affirmative" }
        ]
      },
      {
        id: "negative",
        title: "Отрицание",
        explanation: "Для 'не делал' — didn't + глагол в начальной форме (НЕ в прошедшей!).",
        whatAndWhy: {
          what: "Как говорить о том, что НЕ случалось в прошлом.",
          why: "Чтобы уточнять детали событий, опровергать обвинения или рассказывать о несбывшихся планах."
        },
        formulas: ["I / you / we / they / he / she / it + didn't + глагол"],
        exercises: [
          { ru: "Я не видел его", en: ["I", "didn't", "see", "him"], category: "past_negative" },
          { ru: "Она не пришла на вечеринку", en: ["She", "didn't", "come", "to", "the", "party"], category: "past_negative" },
          { ru: "Мы не ели здесь", en: ["We", "didn't", "eat", "here"], category: "past_negative" },
          { ru: "Он не купил машину", en: ["He", "didn't", "buy", "a", "car"], category: "past_negative" },
          { ru: "Они не знали об этом", en: ["They", "didn't", "know", "about", "it"], category: "past_negative" },
          { ru: "Я не звонил ей", en: ["I", "didn't", "call", "her"], category: "past_negative" },
          { ru: "Она не сделала это", en: ["She", "didn't", "do", "it"], category: "past_negative" },
          { ru: "Мы не нашли отель", en: ["We", "didn't", "find", "the", "hotel"], category: "past_negative" },
          { ru: "Он не работал в воскресенье", en: ["He", "didn't", "work", "on", "Sunday"], category: "past_negative" },
          { ru: "Они не ушли", en: ["They", "didn't", "leave"], category: "past_negative" }
        ]
      },
      {
        id: "question",
        title: "Вопрос",
        explanation: "Для вопроса — Did в начало + глагол в начальной форме.",
        whatAndWhy: {
          what: "Как узнавать у других о том, что они делали в прошлом.",
          why: "Чтобы расспросить собеседника о его приключениях, вчерашнем вечере или проверить факты."
        },
        formulas: ["Did + I / you / we / they / he / she / it + глагол?"],
        exercises: [
          { ru: "Ты видел это?", en: ["Did", "you", "see", "this?"], category: "past_question" },
          { ru: "Она позвонила тебе?", en: ["Did", "she", "call", "you?"], category: "past_question" },
          { ru: "Они купили еду?", en: ["Did", "they", "buy", "food?"], category: "past_question" },
          { ru: "Ты работал вчера?", en: ["Did", "you", "work", "yesterday?"], category: "past_question" },
          { ru: "Он пришел?", en: ["Did", "he", "come?"], category: "past_question" },
          { ru: "Мы опоздали?", en: ["Did", "we", "arrive", "late?"], category: "past_question" },
          { ru: "Ты понял вопрос?", en: ["Did", "you", "understand", "the", "question?"], category: "past_question" },
          { ru: "Они играли в футбол?", en: ["Did", "they", "play", "football?"], category: "past_question" },
          { ru: "Она видела тебя?", en: ["Did", "she", "see", "you?"], category: "past_question" },
          { ru: "Ты пил кофе?", en: ["Did", "you", "drink", "coffee?"], category: "past_question" }
        ]
      },
      {
        id: "mix",
        title: "Микс",
        isMix: true,
        count: 15
      },
      {
        id: "exam",
        title: "Экзамен",
        isExam: true,
        count: 20,
        threshold: 0.85
      }
    ]
  },
  {
    id: "future_simple",
    title: "Назад в будущее",
    subtitle: "Future Simple",
    label: "Будущее время",
    icon: "🟡",
    lessons: [
      {
        id: "affirmative",
        title: "Утверждение",
        explanation: "Когда говоришь о планах и будущем — will + глагол.",
        whatAndWhy: {
          what: "Как строить планы, давать обещания и предсказывать будущее.",
          why: "Чтобы договариваться о встречах, рассказывать о своих мечтах и намерениях на будущее."
        },
        formulas: ["I / you / we / they / he / she / it + will + глагол"],
        exercises: [
          { ru: "Я позвоню тебе завтра", en: ["I", "will", "call", "you", "tomorrow"], category: "future_affirmative" },
          { ru: "Она приедет в понедельник", en: ["She", "will", "come", "on", "Monday"], category: "future_affirmative" },
          { ru: "Мы пойдем домой", en: ["We", "will", "go", "home"], category: "future_affirmative" },
          { ru: "Он поможет нам", en: ["He", "will", "help", "us"], category: "future_affirmative" },
          { ru: "Они купят новую квартиру", en: ["They", "will", "buy", "a", "new", "apartment"], category: "future_affirmative" },
          { ru: "Я сделаю это позже", en: ["I", "will", "do", "it", "later"], category: "future_affirmative" },
          { ru: "Она напишет письмо", en: ["She", "will", "write", "a", "letter"], category: "future_affirmative" },
          { ru: "Мы увидимся в субботу", en: ["We", "will", "see", "each", "other", "on", "Saturday"], category: "future_affirmative" },
          { ru: "Он вернется скоро", en: ["He", "will", "be", "back", "soon"], category: "future_affirmative" },
          { ru: "Они закончат работу", en: ["They", "will", "finish", "the", "work"], category: "future_affirmative" }
        ]
      },
      {
        id: "negative",
        title: "Отрицание",
        explanation: "Для 'не буду' — won't + глагол.",
        whatAndWhy: {
          what: "Как отказываться от планов или говорить о том, что чего-то не произойдет.",
          why: "Чтобы четко обозначать свои границы, планы и намерения на будущее."
        },
        formulas: ["I / you / we / they / he / she / it + won't + глагол"],
        exercises: [
          { ru: "Я не забуду", en: ["I", "won't", "forget"], category: "future_negative" },
          { ru: "Он не придёт", en: ["He", "won't", "come"], category: "future_negative" },
          { ru: "Она не поверит", en: ["She", "won't", "believe", "it"], category: "future_negative" },
          { ru: "Мы не пойдем туда", en: ["We", "won't", "go", "there"], category: "future_negative" },
          { ru: "Они не сделают этого", en: ["They", "won't", "do", "it"], category: "future_negative" },
          { ru: "Я не скажу никому", en: ["I", "won't", "tell", "anyone"], category: "future_negative" },
          { ru: "Она не позвонит ему", en: ["She", "won't", "call", "him"], category: "future_negative" },
          { ru: "Мы не опоздаем", en: ["We", "won't", "be", "late"], category: "future_negative" },
          { ru: "Он не будет работать", en: ["He", "won't", "work"], category: "future_negative" },
          { ru: "Они не купят это", en: ["They", "won't", "buy", "this"], category: "future_negative" }
        ]
      },
      {
        id: "question",
        title: "Вопрос",
        explanation: "Для вопроса — Will в начало.",
        whatAndWhy: {
          what: "Как спрашивать других людей об их планах и намерениях на будущее.",
          why: "Чтобы планировать совместные дела, договариваться о встречах и узнавать чужие мечты."
        },
        formulas: ["Will + I / you / we / they / he / she / it + глагол?"],
        exercises: [
          { ru: "Ты придёшь завтра?", en: ["Will", "you", "come", "tomorrow?"], category: "future_question" },
          { ru: "Она поможет нам?", en: ["Will", "she", "help", "us?"], category: "future_question" },
          { ru: "Они будут там?", en: ["Will", "they", "be", "there?"], category: "future_question" },
          { ru: "Ты позвонишь мне?", en: ["Will", "you", "call", "me?"], category: "future_question" },
          { ru: "Он сделает это?", en: ["Will", "he", "do", "it?"], category: "future_question" },
          { ru: "Мы встретимся позже?", en: ["Will", "we", "meet", "later?"], category: "future_question" },
          { ru: "Они купят билеты?", en: ["Will", "they", "buy", "tickets?"], category: "future_question" },
          { ru: "Ты поедешь с нами?", en: ["Will", "you", "go", "with", "us?"], category: "future_question" },
          { ru: "Она споет песню?", en: ["Will", "she", "sing", "a", "song?"], category: "future_question" },
          { ru: "Он пойдет в кино?", en: ["Will", "he", "go", "to", "the", "cinema?"], category: "future_question" }
        ]
      },
      {
        id: "mix",
        title: "Микс",
        isMix: true,
        count: 15
      },
      {
        id: "exam",
        title: "Экзамен",
        isExam: true,
        count: 20,
        threshold: 0.85
      }
    ]
  },
  {
    id: "final_battle",
    title: "Генеральное сражение",
    subtitle: "Hard Test",
    label: "Все времена",
    icon: "⚔️",
    lessons: [
      {
        id: "hard_test",
        title: "Жесткий тест",
        explanation: "Финальное испытание по всем изученным темам. 50 предложений, 90% точности.",
        whatAndWhy: {
          what: "Все времена и формы вперемешку.",
          why: "Чтобы убедиться, что ты действительно освоил базу и не путаешься в конструкциях."
        },
        isExam: true,
        count: 40,
        threshold: 0.9,
        isSuper: true // Flag for special handling
      }
    ]
  }
];

const islands = [


  // ╔══════════════════════════════════════════════════════════════╗
  // ║  ОСТРОВ 1: ЗНАКОМСТВО И SMALL TALK                         ║
  // ║  Цель: представиться, поддержать лёгкий разговор           ║
  // ╚══════════════════════════════════════════════════════════════╝
  {
    island: "Знакомство и Small Talk",
    icon: "👋",
    items: [
      // === Уровень 1: Базовые приветствия ===
      { type: "phrase", en: "Hi, I'm...", ru: "Привет, я...", hint: "Хай, Айм...", difficulty: 1, context: "Представиться", example: "Hi, I'm Alex. Nice to meet you! (Привет, я Алекс. Приятно познакомиться!)" },
      { type: "phrase", en: "Nice to meet you", ru: "Приятно познакомиться", hint: "Найс ту мит ю", difficulty: 1, context: "Представиться", example: "It's a pleasure to be here. Nice to meet you all! (Рад быть здесь. Приятно познакомиться со всеми вами!)" },
      { type: "phrase", en: "How are you?", ru: "Как дела?", hint: "Хау ар ю?", difficulty: 1, context: "Начать разговор", example: "Hey man, how are you? - I'm doing great! (Эй, чувак, как дела? - У меня все отлично!)" },
      { type: "phrase", en: "I'm fine, thanks", ru: "Хорошо, спасибо", hint: "Айм файн, сэнкс", difficulty: 1, context: "Ответить на 'как дела'", example: "How is your day? - I'm fine, thanks. (Как твой день? - Хорошо, спасибо.)" },
      { type: "phrase", en: "Not bad", ru: "Неплохо", hint: "Нот бэд", difficulty: 1, context: "Ответить на 'как дела'", example: "How was the movie? - Not bad, actually. (Как был фильм? - На самом деле, неплохо.)" },
      { type: "phrase", en: "See you later", ru: "Увидимся позже", hint: "Си ю лэйтер", difficulty: 1, context: "Попрощаться", example: "I have to go now. See you later! (Мне пора идти. Увидимся позже!)" },
      { type: "phrase", en: "Have a nice day", ru: "Хорошего дня", hint: "Хэв э найс дэй", difficulty: 1, context: "Попрощаться", example: "Thanks for the help. Have a nice day! (Спасибо за помощь. Хорошего дня!)" },
      { type: "phrase", en: "Take care", ru: "Береги себя", hint: "Тэйк кэр", difficulty: 1, context: "Попрощаться", example: "Goodbye, and take care of yourself. (До свидания, и береги себя.)" },
      { type: "phrase", en: "Where are you from?", ru: "Откуда ты?", hint: "Вэр ар ю фром?", difficulty: 1, context: "Узнать о человеке", example: "Your accent is interesting. Where are you from? (Твой акцент интересен. Откуда ты?)" },
      { type: "phrase", en: "I'm from Russia", ru: "Я из России", hint: "Айм фром Раша", difficulty: 1, context: "Рассказать о себе", example: "I'm from Russia, but I live in London now. (Я из России, но сейчас живу в Лондоне.)" },

      // === Уровень 2: Расширенное знакомство ===
      { type: "phrase", en: "What do you do?", ru: "Чем занимаешься?", hint: "Вот ду ю ду?", difficulty: 2, context: "Узнать о работе" },
      { type: "phrase", en: "I run my own business", ru: "У меня свой бизнес", hint: "Ай ран май оун бизнес", difficulty: 2, context: "Рассказать о работе" },
      { type: "phrase", en: "How long have you been here?", ru: "Как давно ты здесь?", hint: "Хау лонг хэв ю бин хир?", difficulty: 2, context: "Поддержать разговор" },
      { type: "phrase", en: "Is this your first time here?", ru: "Ты здесь первый раз?", hint: "Из зис ёр фёрст тайм хир?", difficulty: 2, context: "Поддержать разговор" },
      { type: "phrase", en: "What brings you here?", ru: "Что тебя сюда привело?", hint: "Вот брингз ю хир?", difficulty: 2, context: "Поддержать разговор" },
      { type: "phrase", en: "I'm here on vacation", ru: "Я здесь в отпуске", hint: "Айм хир он вэкэйшн", difficulty: 2, context: "Рассказать о себе" },
      { type: "phrase", en: "I'm married", ru: "Я женат / замужем", hint: "Айм мэрид", difficulty: 2, context: "Рассказать о себе" },
      { type: "phrase", en: "Do you have any hobbies?", ru: "У тебя есть хобби?", hint: "Ду ю хэв эни хобиз?", difficulty: 2, context: "Узнать о человеке" },
      { type: "phrase", en: "I'm into sports", ru: "Я увлекаюсь спортом", hint: "Айм инту спортс", difficulty: 2, context: "Рассказать о хобби" },
      { type: "phrase", en: "Pleasure to meet you", ru: "Рад знакомству", hint: "Плэжер ту мит ю", difficulty: 2, context: "Представиться" },

      // === Уровень 3: Поддержание разговора ===
      { type: "phrase", en: "So, what's your story?", ru: "Ну, расскажи о себе", hint: "Соу, вотс ёр стори?", difficulty: 3, context: "Начать разговор" },
      { type: "phrase", en: "I've been living here for...", ru: "Я живу здесь уже...", hint: "Айв бин ливинг хир фор...", difficulty: 3, context: "Рассказать о себе" },
      { type: "phrase", en: "That sounds interesting", ru: "Звучит интересно", hint: "Зэт саундз интрестинг", difficulty: 3, context: "Поддержать разговор" },
      { type: "phrase", en: "What do you think about...?", ru: "Что думаешь о...?", hint: "Вот ду ю синк эбаут...?", difficulty: 3, context: "Узнать мнение" },
      { type: "phrase", en: "I used to live in...", ru: "Раньше я жил в...", hint: "Ай юзд ту лив ин...", difficulty: 3, context: "Рассказать о прошлом" },
      { type: "phrase", en: "It was great talking to you", ru: "Было здорово поговорить", hint: "Ит воз грэйт токинг ту ю", difficulty: 3, context: "Попрощаться" },
      { type: "phrase", en: "Let's keep in touch", ru: "Давай оставаться на связи", hint: "Лэтс кип ин тач", difficulty: 3, context: "Попрощаться" },
      { type: "phrase", en: "I couldn't help but notice...", ru: "Не мог не заметить...", hint: "Ай куднт хэлп бат ноутис...", difficulty: 3, context: "Начать разговор" },

      // Словарь к острову
      { type: "word", en: "name", ru: "имя", hint: "Нэйм — имя", difficulty: 1 },
      { type: "word", en: "surname", ru: "фамилия", hint: "Сёрнэйм — фамилия", difficulty: 1 },
      { type: "word", en: "age", ru: "возраст", hint: "Эйдж — возраст", difficulty: 1 },
      { type: "word", en: "birthday", ru: "день рождения", hint: "Бёрздэй — день рождения", difficulty: 1 },
      { type: "word", en: "country", ru: "страна", hint: "Кантри — страна", difficulty: 1 },
      { type: "word", en: "hometown", ru: "родной город", hint: "Хоумтаун — родной город", difficulty: 1 },
      { type: "word", en: "friend", ru: "друг", hint: "Фрэнд — друг", difficulty: 1 },
      { type: "word", en: "colleague", ru: "коллега", hint: "Колиг — коллега", difficulty: 2 },
      { type: "word", en: "neighbor", ru: "сосед", hint: "Нэйбер — сосед", difficulty: 2 },
      { type: "word", en: "acquaintance", ru: "знакомый", hint: "Эквэйнтэнс — знакомый", difficulty: 3 },
      { type: "word", en: "stranger", ru: "незнакомец", hint: "Стрэйнджер — незнакомец", difficulty: 2 },
      { type: "word", en: "hobby", ru: "хобби", hint: "Хоби — хобби", difficulty: 1 },
      { type: "word", en: "occupation", ru: "профессия", hint: "Окьюпэйшн — профессия", difficulty: 2 },
    ]
  },

  // ╔══════════════════════════════════════════════════════════════╗
  // ║  ОСТРОВ 2: ВЕЖЛИВОСТЬ И ЕЖЕДНЕВНЫЕ ФРАЗЫ                   ║
  // ║  Цель: просить, благодарить, извиняться, реагировать        ║
  // ╚══════════════════════════════════════════════════════════════╝
  {
    island: "Вежливость и реакции",
    icon: "🤝",
    items: [
      // === Уровень 1 ===
      { type: "phrase", en: "Thank you so much", ru: "Большое спасибо", hint: "Сэнк ю соу мач", difficulty: 1, context: "Поблагодарить" },
      { type: "phrase", en: "You're welcome", ru: "Не за что", hint: "Ёр уэлкам", difficulty: 1, context: "Ответить на спасибо" },
      { type: "phrase", en: "I'm sorry", ru: "Извините", hint: "Айм сори", difficulty: 1, context: "Извиниться" },
      { type: "phrase", en: "Excuse me", ru: "Простите / Разрешите", hint: "Экскьюз ми", difficulty: 1, context: "Привлечь внимание" },
      { type: "phrase", en: "No problem", ru: "Без проблем", hint: "Ноу проблэм", difficulty: 1, context: "Ответить на извинения" },
      { type: "phrase", en: "Of course", ru: "Конечно", hint: "Ов корс", difficulty: 1, context: "Согласиться" },
      { type: "phrase", en: "Sure, go ahead", ru: "Конечно, давай", hint: "Шур, гоу эхэд", difficulty: 1, context: "Дать разрешение" },
      { type: "phrase", en: "Don't worry about it", ru: "Не переживай", hint: "Доунт уори эбаут ит", difficulty: 1, context: "Успокоить" },

      // === Уровень 2 ===
      { type: "phrase", en: "Could you help me with...?", ru: "Мог бы ты помочь мне с...?", hint: "Куд ю хэлп ми уиз...?", difficulty: 2, context: "Попросить о помощи" },
      { type: "phrase", en: "Would you mind...?", ru: "Ты не против...?", hint: "Вуд ю майнд...?", difficulty: 2, context: "Вежливая просьба" },
      { type: "phrase", en: "I really appreciate it", ru: "Я очень это ценю", hint: "Ай риэли эпришиэйт ит", difficulty: 2, context: "Поблагодарить" },
      { type: "phrase", en: "That's very kind of you", ru: "Очень мило с вашей стороны", hint: "Зэтс вэри кайнд ов ю", difficulty: 2, context: "Поблагодарить" },
      { type: "phrase", en: "I didn't mean to...", ru: "Я не хотел...", hint: "Ай диднт мин ту...", difficulty: 2, context: "Извиниться" },
      { type: "phrase", en: "It's totally fine", ru: "Всё абсолютно нормально", hint: "Итс тоутэли файн", difficulty: 2, context: "Принять извинения" },
      { type: "phrase", en: "Good luck with that", ru: "Удачи с этим", hint: "Гуд лак уиз зэт", difficulty: 2, context: "Пожелать удачи" },
      { type: "phrase", en: "Congratulations!", ru: "Поздравляю!", hint: "Конгрэчулэйшнз!", difficulty: 2, context: "Поздравить" },

      // === Уровень 3 ===
      { type: "phrase", en: "I owe you one", ru: "Я тебе должен", hint: "Ай оу ю уан", difficulty: 3, context: "Поблагодарить" },
      { type: "phrase", en: "I shouldn't have done that", ru: "Мне не стоило этого делать", hint: "Ай шуднт хэв дан зэт", difficulty: 3, context: "Извиниться" },
      { type: "phrase", en: "No offense, but...", ru: "Без обид, но...", hint: "Ноу офэнс, бат...", difficulty: 3, context: "Сказать неприятное вежливо" },
      { type: "phrase", en: "I hope I'm not bothering you", ru: "Надеюсь, я не мешаю", hint: "Ай хоуп айм нот бозеринг ю", difficulty: 3, context: "Быть вежливым" },
      { type: "phrase", en: "It's no big deal", ru: "Ничего страшного", hint: "Итс ноу биг дил", difficulty: 3, context: "Принять извинения" },

      // Связующие слова (glue)
      { type: "glue", en: "please", ru: "пожалуйста (просьба)", hint: "Плиз", difficulty: 1 },
      { type: "glue", en: "maybe", ru: "может быть", hint: "Мэйби", difficulty: 1 },
      { type: "glue", en: "probably", ru: "вероятно", hint: "Пробабли", difficulty: 1 },
      { type: "glue", en: "definitely", ru: "определённо", hint: "Дэфинитли", difficulty: 2 },
      { type: "glue", en: "absolutely", ru: "абсолютно", hint: "Эбсолютли", difficulty: 2 },
      { type: "glue", en: "unfortunately", ru: "к сожалению", hint: "Анфорчунэтли", difficulty: 2 },
      { type: "glue", en: "luckily", ru: "к счастью", hint: "Лакили", difficulty: 2 },
    ]
  },

  // ╔══════════════════════════════════════════════════════════════╗
  // ║  ОСТРОВ 3: ЭМОЦИИ И ЧУВСТВА                                ║
  // ║  Цель: выражать настроение и реагировать на чужие эмоции    ║
  // ╚══════════════════════════════════════════════════════════════╝
  {
    island: "Эмоции и чувства",
    icon: "😊",
    items: [
      // === Уровень 1 ===
      { type: "phrase", en: "I'm happy", ru: "Я счастлив", hint: "Айм хэпи", difficulty: 1, context: "Выразить радость" },
      { type: "phrase", en: "I'm tired", ru: "Я устал", hint: "Айм тайэрд", difficulty: 1, context: "Выразить усталость" },
      { type: "phrase", en: "I feel great", ru: "Я чувствую себя отлично", hint: "Ай фил грэйт", difficulty: 1, context: "Выразить хорошее настроение" },
      { type: "phrase", en: "I'm worried about...", ru: "Я беспокоюсь о...", hint: "Айм уорид эбаут...", difficulty: 1, context: "Выразить беспокойство" },
      { type: "phrase", en: "I'm bored", ru: "Мне скучно", hint: "Айм борд", difficulty: 1, context: "Выразить скуку" },
      { type: "phrase", en: "I'm excited", ru: "Я в восторге / не могу дождаться", hint: "Айм иксайтед", difficulty: 1, context: "Выразить предвкушение" },

      // === Уровень 2 ===
      { type: "phrase", en: "I'm so frustrated", ru: "Я так раздражён", hint: "Айм соу фрастрэйтед", difficulty: 2, context: "Выразить раздражение" },
      { type: "phrase", en: "That really upset me", ru: "Это меня расстроило", hint: "Зэт рили апсэт ми", difficulty: 2, context: "Рассказать о чувствах" },
      { type: "phrase", en: "I'm so relieved", ru: "Я так облегчён", hint: "Айм соу рилийвд", difficulty: 2, context: "Выразить облегчение" },
      { type: "phrase", en: "I can't believe it", ru: "Не могу поверить", hint: "Ай кэнт билив ит", difficulty: 2, context: "Выразить удивление" },
      { type: "phrase", en: "I'm a bit nervous", ru: "Я немного нервничаю", hint: "Айм э бит нёрвас", difficulty: 2, context: "Выразить волнение" },
      { type: "phrase", en: "I'm really proud of...", ru: "Я очень горжусь...", hint: "Айм рили прауд ов...", difficulty: 2, context: "Выразить гордость" },
      { type: "phrase", en: "I feel like...", ru: "Мне кажется / я чувствую что...", hint: "Ай фил лайк...", difficulty: 2, context: "Описать ощущение" },
      { type: "phrase", en: "Are you okay?", ru: "Ты в порядке?", hint: "Ар ю оукэй?", difficulty: 2, context: "Проявить заботу" },

      // === Уровень 3 ===
      { type: "phrase", en: "I'm overwhelmed", ru: "Я перегружен", hint: "Айм оувэрвэлмд", difficulty: 3, context: "Выразить перегрузку" },
      { type: "phrase", en: "I didn't see that coming", ru: "Не ожидал этого", hint: "Ай диднт си зэт каминг", difficulty: 3, context: "Выразить удивление" },
      { type: "phrase", en: "That really means a lot to me", ru: "Это очень много для меня значит", hint: "Зэт рили минз э лот ту ми", difficulty: 3, context: "Выразить благодарность" },
      { type: "phrase", en: "I'm kind of mixed about it", ru: "У меня смешанные чувства", hint: "Айм кайнд ов микст эбаут ит", difficulty: 3, context: "Выразить неоднозначность" },
      { type: "phrase", en: "It's been weighing on me", ru: "Это меня тяготит", hint: "Итс бин уэйинг он ми", difficulty: 3, context: "Рассказать о переживаниях" },

      // === Уровень 4 ===
      { type: "phrase", en: "I'm at my wit's end", ru: "Я в полном отчаянии", hint: "Айм эт май уитс энд", difficulty: 4, context: "Выразить отчаяние" },
      { type: "phrase", en: "I'm on cloud nine", ru: "Я на седьмом небе", hint: "Айм он клауд найн", difficulty: 4, context: "Выразить счастье" },

      // Словарь эмоций
      { type: "word", en: "happy", ru: "счастливый", hint: "Хэпи", difficulty: 1 },
      { type: "word", en: "sad", ru: "грустный", hint: "Сэд", difficulty: 1 },
      { type: "word", en: "angry", ru: "злой", hint: "Энгри", difficulty: 1 },
      { type: "word", en: "scared", ru: "напуганный", hint: "Скэрд", difficulty: 1 },
      { type: "word", en: "surprised", ru: "удивлённый", hint: "Серпрайзд", difficulty: 1 },
      { type: "word", en: "confused", ru: "растерянный", hint: "Конфьюзд", difficulty: 2 },
      { type: "word", en: "disappointed", ru: "разочарованный", hint: "Дисэпойнтед", difficulty: 2 },
      { type: "word", en: "jealous", ru: "ревнивый / завистливый", hint: "Джэлэс", difficulty: 2 },
      { type: "word", en: "grateful", ru: "благодарный", hint: "Грэйтфул", difficulty: 2 },
      { type: "word", en: "anxious", ru: "тревожный", hint: "Энкшэс", difficulty: 3 },
      { type: "word", en: "nostalgic", ru: "ностальгирующий", hint: "Ностэлджик", difficulty: 3 },
      { type: "word", en: "furious", ru: "в ярости", hint: "Фьюриэс", difficulty: 3 },
      { type: "word", en: "exhausted", ru: "измождённый", hint: "Игзостед", difficulty: 2 },
      { type: "word", en: "calm", ru: "спокойный", hint: "Кам", difficulty: 1 },
      { type: "word", en: "confident", ru: "уверенный", hint: "Конфидэнт", difficulty: 2 },
    ]
  },

  // ╔══════════════════════════════════════════════════════════════╗
  // ║  ОСТРОВ 4: ЕДА, РЕСТОРАН И КАФЕ                            ║
  // ║  Цель: заказать еду, обсудить вкусы, попросить счёт         ║
  // ╚══════════════════════════════════════════════════════════════╝
  {
    island: "Еда и ресторан",
    icon: "🍽️",
    items: [
      // === Уровень 1 ===
      { type: "phrase", en: "Can I have...?", ru: "Можно мне...?", hint: "Кэн ай хэв...?", difficulty: 1, context: "Заказать" },
      { type: "phrase", en: "I'd like to order...", ru: "Я бы хотел заказать...", hint: "Айд лайк ту ордер...", difficulty: 1, context: "Заказать" },
      { type: "phrase", en: "The check, please", ru: "Счёт, пожалуйста", hint: "Зэ чек, плиз", difficulty: 1, context: "Попросить счёт" },
      { type: "phrase", en: "It's delicious", ru: "Это вкусно", hint: "Итс делишэс", difficulty: 1, context: "Похвалить еду" },
      { type: "phrase", en: "I'm hungry", ru: "Я голоден", hint: "Айм хангри", difficulty: 1, context: "Сказать о голоде" },
      { type: "phrase", en: "I'm full", ru: "Я наелся", hint: "Айм фул", difficulty: 1, context: "Сказать о сытости" },
      { type: "phrase", en: "A table for two, please", ru: "Столик на двоих, пожалуйста", hint: "Э тэйбл фор ту, плиз", difficulty: 1, context: "В ресторане" },

      // === Уровень 2 ===
      { type: "phrase", en: "What do you recommend?", ru: "Что порекомендуете?", hint: "Вот ду ю рэкомэнд?", difficulty: 2, context: "Спросить совет" },
      { type: "phrase", en: "I'm allergic to...", ru: "У меня аллергия на...", hint: "Айм элёрджик ту...", difficulty: 2, context: "Предупредить об аллергии" },
      { type: "phrase", en: "Could we have the menu?", ru: "Можно нам меню?", hint: "Куд уи хэв зэ мэнью?", difficulty: 2, context: "В ресторане" },
      { type: "phrase", en: "Is this dish spicy?", ru: "Это блюдо острое?", hint: "Из зис диш спайси?", difficulty: 2, context: "Уточнить о блюде" },
      { type: "phrase", en: "Can I get this to go?", ru: "Можно это с собой?", hint: "Кэн ай гэт зис ту гоу?", difficulty: 2, context: "Попросить на вынос" },
      { type: "phrase", en: "Let's split the bill", ru: "Давай разделим счёт", hint: "Лэтс сплит зэ бил", difficulty: 2, context: "Попросить счёт" },
      { type: "phrase", en: "I'd like it well done", ru: "Я хочу хорошо прожаренное", hint: "Айд лайк ит уэл дан", difficulty: 2, context: "Уточнить заказ" },
      { type: "phrase", en: "Do you have anything vegetarian?", ru: "У вас есть что-то вегетарианское?", hint: "Ду ю хэв энисинг вэджитэриан?", difficulty: 2, context: "Уточнить меню" },

      // === Уровень 3 ===
      { type: "phrase", en: "I'll have what she's having", ru: "Мне то же, что и ей", hint: "Айл хэв вот шиз хэвинг", difficulty: 3, context: "Заказать" },
      { type: "phrase", en: "This isn't what I ordered", ru: "Это не то, что я заказывал", hint: "Зис изнт вот ай ордерд", difficulty: 3, context: "Пожаловаться" },
      { type: "phrase", en: "Could you make it less spicy?", ru: "Можно сделать менее острым?", hint: "Куд ю мэйк ит лэс спайси?", difficulty: 3, context: "Уточнить заказ" },
      { type: "phrase", en: "We'd like a quiet table, if possible", ru: "Хотели бы тихий столик, если возможно", hint: "Уид лайк э куайэт тэйбл, иф посибл", difficulty: 3, context: "В ресторане" },

      // === Готовка дома ===
      { type: "phrase", en: "I'll cook tonight", ru: "Я приготовлю сегодня", hint: "Айл кук тунайт", difficulty: 2, context: "О готовке" },
      { type: "phrase", en: "What should we have for dinner?", ru: "Что будем на ужин?", hint: "Вот шуд уи хэв фор динер?", difficulty: 2, context: "О готовке" },
      { type: "phrase", en: "I found a great recipe", ru: "Я нашёл отличный рецепт", hint: "Ай фаунд э грэйт рэсипи", difficulty: 2, context: "О готовке" },

      // Словарь к острову
      { type: "word", en: "breakfast", ru: "завтрак", hint: "Брэкфэст", difficulty: 1 },
      { type: "word", en: "lunch", ru: "обед", hint: "Ланч", difficulty: 1 },
      { type: "word", en: "dinner", ru: "ужин", hint: "Динер", difficulty: 1 },
      { type: "word", en: "snack", ru: "перекус", hint: "Снэк", difficulty: 1 },
      { type: "word", en: "dessert", ru: "десерт", hint: "Дизёрт", difficulty: 1 },
      { type: "word", en: "appetizer", ru: "закуска", hint: "Эпэтайзер", difficulty: 2 },
      { type: "word", en: "dish", ru: "блюдо", hint: "Диш", difficulty: 1 },
      { type: "word", en: "recipe", ru: "рецепт", hint: "Рэсипи", difficulty: 2 },
      { type: "word", en: "ingredient", ru: "ингредиент", hint: "Ингридиэнт", difficulty: 2 },
      { type: "word", en: "menu", ru: "меню", hint: "Мэнью", difficulty: 1 },
      { type: "word", en: "tip", ru: "чаевые", hint: "Тип", difficulty: 2 },
      { type: "word", en: "waiter", ru: "официант", hint: "Уэйтер", difficulty: 1 },
      { type: "word", en: "reservation", ru: "бронирование", hint: "Рэзервэйшн", difficulty: 2 },
      // Вкусы
      { type: "word", en: "spicy", ru: "острый", hint: "Спайси", difficulty: 1 },
      { type: "word", en: "sweet", ru: "сладкий", hint: "Суит", difficulty: 1 },
      { type: "word", en: "salty", ru: "солёный", hint: "Солти", difficulty: 1 },
      { type: "word", en: "sour", ru: "кислый", hint: "Сауэр", difficulty: 2 },
      { type: "word", en: "bitter", ru: "горький", hint: "Битер", difficulty: 2 },
      { type: "word", en: "fresh", ru: "свежий", hint: "Фрэш", difficulty: 1 },
      // Продукты
      { type: "word", en: "meat", ru: "мясо", hint: "Мит", difficulty: 1 },
      { type: "word", en: "chicken", ru: "курица", hint: "Чикен", difficulty: 1 },
      { type: "word", en: "fish", ru: "рыба", hint: "Фиш", difficulty: 1 },
      { type: "word", en: "rice", ru: "рис", hint: "Райс", difficulty: 1 },
      { type: "word", en: "bread", ru: "хлеб", hint: "Брэд", difficulty: 1 },
      { type: "word", en: "cheese", ru: "сыр", hint: "Чиз", difficulty: 1 },
      { type: "word", en: "egg", ru: "яйцо", hint: "Эг", difficulty: 1 },
      { type: "word", en: "vegetable", ru: "овощ", hint: "Вэджитэбл", difficulty: 1 },
      { type: "word", en: "fruit", ru: "фрукт", hint: "Фрут", difficulty: 1 },
      // Способы готовки
      { type: "word", en: "fry", ru: "жарить", hint: "Фрай", difficulty: 2 },
      { type: "word", en: "boil", ru: "варить", hint: "Бойл", difficulty: 2 },
      { type: "word", en: "bake", ru: "печь", hint: "Бэйк", difficulty: 2 },
      { type: "word", en: "grill", ru: "жарить на гриле", hint: "Грил", difficulty: 2 },
    ]
  },

  // ╔══════════════════════════════════════════════════════════════╗
  // ║  ОСТРОВ 5: ПУТЕШЕСТВИЯ И АЭРОПОРТ                          ║
  // ║  Цель: забронировать, ориентироваться, решить проблемы      ║
  // ╚══════════════════════════════════════════════════════════════╝
  {
    island: "Путешествия и аэропорт",
    icon: "✈️",
    items: [
      // === Уровень 1 ===
      { type: "phrase", en: "Where is the...?", ru: "Где находится...?", hint: "Вэр из зэ...?", difficulty: 1, context: "Спросить дорогу" },
      { type: "phrase", en: "How do I get to...?", ru: "Как добраться до...?", hint: "Хау ду ай гэт ту...?", difficulty: 1, context: "Спросить дорогу" },
      { type: "phrase", en: "I'd like to book a room", ru: "Я хотел бы забронировать номер", hint: "Айд лайк ту бук э рум", difficulty: 1, context: "В отеле" },
      { type: "phrase", en: "What time is check-in?", ru: "Во сколько заселение?", hint: "Вот тайм из чек-ин?", difficulty: 1, context: "В отеле" },
      { type: "phrase", en: "I have a reservation", ru: "У меня бронирование", hint: "Ай хэв э рэзервэйшн", difficulty: 1, context: "В отеле" },

      // === Уровень 2 ===
      { type: "phrase", en: "My flight was cancelled", ru: "Мой рейс отменили", hint: "Май флайт воз кэнселд", difficulty: 2, context: "Проблемы в аэропорту" },
      { type: "phrase", en: "Is there a connecting flight?", ru: "Есть стыковочный рейс?", hint: "Из зэр э конэктинг флайт?", difficulty: 2, context: "В аэропорту" },
      { type: "phrase", en: "Where is the boarding gate?", ru: "Где выход на посадку?", hint: "Вэр из зэ бординг гэйт?", difficulty: 2, context: "В аэропорту" },
      { type: "phrase", en: "Can I get an upgrade?", ru: "Можно повысить класс?", hint: "Кэн ай гэт эн апгрэйд?", difficulty: 2, context: "В аэропорту" },
      { type: "phrase", en: "I need a visa on arrival", ru: "Мне нужна виза по прилёту", hint: "Ай нид э виза он эрайвл", difficulty: 2, context: "Паспортный контроль" },
      { type: "phrase", en: "How long is the layover?", ru: "Сколько длится пересадка?", hint: "Хау лонг из зэ лэйоувер?", difficulty: 2, context: "Транзит" },
      { type: "phrase", en: "I'm here on vacation", ru: "Я здесь в отпуске", hint: "Айм хир он вэкэйшн", difficulty: 2, context: "Паспортный контроль" },
      { type: "phrase", en: "Could you call a taxi for me?", ru: "Вы не вызовете мне такси?", hint: "Куд ю кол э тэкси фор ми?", difficulty: 2, context: "Попросить о помощи" },

      // === Уровень 3 ===
      { type: "phrase", en: "I'd like to rebook for tomorrow", ru: "Хотел бы перебронировать на завтра", hint: "Айд лайк ту рибук фор тумороу", difficulty: 3, context: "Проблемы с рейсом" },
      { type: "phrase", en: "Is there a direct route?", ru: "Есть прямой маршрут?", hint: "Из зэр э дирэкт рут?", difficulty: 3, context: "Уточнить маршрут" },
      { type: "phrase", en: "My luggage didn't arrive", ru: "Мой багаж не прибыл", hint: "Май лагидж диднт эрайв", difficulty: 3, context: "Проблемы с багажом" },
      { type: "phrase", en: "What's the best way to get around?", ru: "Как лучше всего перемещаться?", hint: "Вотс зэ бэст уэй ту гэт эраунд?", difficulty: 3, context: "Уточнить транспорт" },
      { type: "phrase", en: "I'm looking for something off the beaten path", ru: "Ищу что-то нетуристическое", hint: "Айм лукинг фор самсинг оф зэ битен пас", difficulty: 3, context: "Попросить совет" },

      // Словарь
      { type: "word", en: "airport", ru: "аэропорт", hint: "Эрпорт", difficulty: 1 },
      { type: "word", en: "flight", ru: "рейс", hint: "Флайт", difficulty: 1 },
      { type: "word", en: "ticket", ru: "билет", hint: "Тикет", difficulty: 1 },
      { type: "word", en: "passport", ru: "паспорт", hint: "Паспорт", difficulty: 1 },
      { type: "word", en: "luggage", ru: "багаж", hint: "Лагидж", difficulty: 1 },
      { type: "word", en: "suitcase", ru: "чемодан", hint: "Сьюткейс", difficulty: 1 },
      { type: "word", en: "boarding pass", ru: "посадочный талон", hint: "Бординг пас", difficulty: 2 },
      { type: "word", en: "customs", ru: "таможня", hint: "Кастэмз", difficulty: 2 },
      { type: "word", en: "departure", ru: "вылет", hint: "Дэпарчер", difficulty: 2 },
      { type: "word", en: "arrival", ru: "прибытие", hint: "Эрайвл", difficulty: 2 },
      { type: "word", en: "delay", ru: "задержка", hint: "Дилэй", difficulty: 2 },
      { type: "word", en: "gate", ru: "выход (на посадку)", hint: "Гэйт", difficulty: 1 },
      { type: "word", en: "hotel", ru: "отель", hint: "Хоутэл", difficulty: 1 },
      { type: "word", en: "taxi", ru: "такси", hint: "Тэкси", difficulty: 1 },
      { type: "word", en: "map", ru: "карта", hint: "Мэп", difficulty: 1 },
      { type: "word", en: "tourist", ru: "турист", hint: "Тьюрист", difficulty: 1 },
      { type: "word", en: "guide", ru: "гид", hint: "Гайд", difficulty: 2 },
      { type: "word", en: "currency", ru: "валюта", hint: "Каренси", difficulty: 2 },
      { type: "word", en: "exchange rate", ru: "курс обмена", hint: "Иксчэйндж рэйт", difficulty: 2 },
    ]
  },

  // ╔══════════════════════════════════════════════════════════════╗
  // ║  ОСТРОВ 6: РАБОТА И БИЗНЕС                                  ║
  // ║  Цель: рассказать о работе, обсудить дела, деловой разговор ║
  // ╚══════════════════════════════════════════════════════════════╝
  {
    island: "Работа и бизнес",
    icon: "💼",
    items: [
      // === Уровень 1 ===
      { type: "phrase", en: "I work in...", ru: "Я работаю в...", hint: "Ай уорк ин...", difficulty: 1, context: "О работе" },
      { type: "phrase", en: "I'm looking for a job", ru: "Я ищу работу", hint: "Айм лукинг фор э джоб", difficulty: 1, context: "О работе" },
      { type: "phrase", en: "I'm self-employed", ru: "Я работаю на себя", hint: "Айм сэлф-имплойд", difficulty: 1, context: "О работе" },
      { type: "phrase", en: "I have a meeting at...", ru: "У меня встреча в...", hint: "Ай хэв э митинг эт...", difficulty: 1, context: "О расписании" },
      { type: "phrase", en: "I work from home", ru: "Я работаю из дома", hint: "Ай уорк фром хоум", difficulty: 1, context: "О работе" },

      // === Уровень 2 ===
      { type: "phrase", en: "I'm in charge of...", ru: "Я отвечаю за...", hint: "Айм ин чардж ов...", difficulty: 2, context: "Рассказать о роли" },
      { type: "phrase", en: "We need to meet the deadline", ru: "Нам нужно уложиться в срок", hint: "Уи нид ту мит зэ дэдлайн", difficulty: 2, context: "Деловое общение" },
      { type: "phrase", en: "Let's schedule a call", ru: "Давай назначим звонок", hint: "Лэтс скэджул э кол", difficulty: 2, context: "Деловое общение" },
      { type: "phrase", en: "I'll send you the report", ru: "Я пришлю тебе отчёт", hint: "Айл сэнд ю зэ рэпорт", difficulty: 2, context: "Деловое общение" },
      { type: "phrase", en: "Can we push back the meeting?", ru: "Можно перенести встречу?", hint: "Кэн уи пуш бэк зэ митинг?", difficulty: 2, context: "Перенести встречу" },
      { type: "phrase", en: "I got a promotion", ru: "Меня повысили", hint: "Ай гот э промоушн", difficulty: 2, context: "О карьере" },
      { type: "phrase", en: "I quit my job", ru: "Я уволился", hint: "Ай куит май джоб", difficulty: 2, context: "О карьере" },

      // === Уровень 3 ===
      { type: "phrase", en: "We need to scale the business", ru: "Нам нужно масштабировать бизнес", hint: "Уи нид ту скэйл зэ бизнес", difficulty: 3, context: "Деловое общение" },
      { type: "phrase", en: "Let's go through the numbers", ru: "Давай пройдёмся по цифрам", hint: "Лэтс гоу сру зэ намберз", difficulty: 3, context: "Деловое общение" },
      { type: "phrase", en: "The bottom line is...", ru: "Суть в том, что...", hint: "Зэ ботом лайн из...", difficulty: 3, context: "Подвести итог" },
      { type: "phrase", en: "We're on the same page", ru: "Мы мыслим одинаково", hint: "Уир он зэ сэйм пэйдж", difficulty: 3, context: "Подтвердить понимание" },
      { type: "phrase", en: "That's a win-win situation", ru: "Это выгодно обеим сторонам", hint: "Зэтс э уин-уин ситуэйшн", difficulty: 3, context: "Переговоры" },

      // === Уровень 4: Переговоры ===
      { type: "phrase", en: "Let's find a middle ground", ru: "Давайте найдём компромисс", hint: "Лэтс файнд э мидл граунд", difficulty: 4, context: "Переговоры" },
      { type: "phrase", en: "I'd like to propose a partnership", ru: "Хочу предложить партнёрство", hint: "Айд лайк ту пропоуз э партнершип", difficulty: 4, context: "Переговоры" },
      { type: "phrase", en: "What's the ROI on this?", ru: "Какая окупаемость?", hint: "Вотс зэ ар-оу-ай он зис?", difficulty: 4, context: "Деловое общение" },

      // Словарь
      { type: "word", en: "job", ru: "работа", hint: "Джоб", difficulty: 1 },
      { type: "word", en: "boss", ru: "начальник", hint: "Бос", difficulty: 1 },
      { type: "word", en: "salary", ru: "зарплата", hint: "Сэлэри", difficulty: 2 },
      { type: "word", en: "deadline", ru: "крайний срок", hint: "Дэдлайн", difficulty: 2 },
      { type: "word", en: "meeting", ru: "встреча", hint: "Митинг", difficulty: 1 },
      { type: "word", en: "project", ru: "проект", hint: "Проджект", difficulty: 1 },
      { type: "word", en: "client", ru: "клиент", hint: "Клайент", difficulty: 2 },
      { type: "word", en: "profit", ru: "прибыль", hint: "Профит", difficulty: 2 },
      { type: "word", en: "revenue", ru: "выручка", hint: "Рэвенью", difficulty: 3 },
      { type: "word", en: "startup", ru: "стартап", hint: "Стартап", difficulty: 2 },
      { type: "word", en: "entrepreneur", ru: "предприниматель", hint: "Антрэпрэнёр", difficulty: 3 },
      { type: "word", en: "contract", ru: "контракт", hint: "Контрэкт", difficulty: 2 },
      { type: "word", en: "invoice", ru: "счёт", hint: "Инвойс", difficulty: 3 },
      { type: "word", en: "competitor", ru: "конкурент", hint: "Компэтитор", difficulty: 3 },
    ]
  },

  // ╔══════════════════════════════════════════════════════════════╗
  // ║  ОСТРОВ 7: ДЕНЬГИ И ПОКУПКИ                                 ║
  // ║  Цель: обсудить цены, сделать покупки, разобраться с деньгами║
  // ╚══════════════════════════════════════════════════════════════╝
  {
    island: "Деньги и покупки",
    icon: "💰",
    items: [
      // === Уровень 1 ===
      { type: "phrase", en: "How much does it cost?", ru: "Сколько это стоит?", hint: "Хау мач даз ит кост?", difficulty: 1, context: "Узнать цену" },
      { type: "phrase", en: "That's too expensive", ru: "Это слишком дорого", hint: "Зэтс ту экспэнсив", difficulty: 1, context: "О цене" },
      { type: "phrase", en: "Can I pay by card?", ru: "Можно картой?", hint: "Кэн ай пэй бай кард?", difficulty: 1, context: "Оплата" },
      { type: "phrase", en: "Do you have a discount?", ru: "У вас есть скидка?", hint: "Ду ю хэв э дискаунт?", difficulty: 1, context: "О цене" },
      { type: "phrase", en: "I need to save money", ru: "Мне нужно экономить", hint: "Ай нид ту сэйв мани", difficulty: 1, context: "О деньгах" },

      // === Уровень 2 ===
      { type: "phrase", en: "Can I try this on?", ru: "Можно это примерить?", hint: "Кэн ай трай зис он?", difficulty: 2, context: "В магазине" },
      { type: "phrase", en: "Do you have this in a different size?", ru: "У вас есть другой размер?", hint: "Ду ю хэв зис ин э дифрэнт сайз?", difficulty: 2, context: "В магазине" },
      { type: "phrase", en: "I'd like to return this", ru: "Я хотел бы вернуть это", hint: "Айд лайк ту ритёрн зис", difficulty: 2, context: "Вернуть товар" },
      { type: "phrase", en: "Can I get a refund?", ru: "Можно получить возврат?", hint: "Кэн ай гэт э рифанд?", difficulty: 2, context: "Вернуть деньги" },
      { type: "phrase", en: "I'm on a tight budget", ru: "У меня ограниченный бюджет", hint: "Айм он э тайт баджет", difficulty: 2, context: "О деньгах" },
      { type: "phrase", en: "It's a good deal", ru: "Хорошая цена / выгодно", hint: "Итс э гуд дил", difficulty: 2, context: "Оценить покупку" },
      { type: "phrase", en: "I can't afford it", ru: "Я не могу себе это позволить", hint: "Ай кэнт эфорд ит", difficulty: 2, context: "О деньгах" },

      // === Уровень 3 ===
      { type: "phrase", en: "Is there a warranty on this?", ru: "На это есть гарантия?", hint: "Из зэр э уоронти он зис?", difficulty: 3, context: "В магазине" },
      { type: "phrase", en: "I'm looking for a good bargain", ru: "Ищу что-то по хорошей цене", hint: "Айм лукинг фор э гуд баргэн", difficulty: 3, context: "Покупки" },
      { type: "phrase", en: "You get what you pay for", ru: "Скупой платит дважды", hint: "Ю гэт вот ю пэй фор", difficulty: 3, context: "О качестве" },

      // Словарь
      { type: "word", en: "money", ru: "деньги", hint: "Мани", difficulty: 1 },
      { type: "word", en: "cash", ru: "наличные", hint: "Кэш", difficulty: 1 },
      { type: "word", en: "price", ru: "цена", hint: "Прайс", difficulty: 1 },
      { type: "word", en: "cheap", ru: "дешёвый", hint: "Чип", difficulty: 1 },
      { type: "word", en: "expensive", ru: "дорогой", hint: "Экспэнсив", difficulty: 1 },
      { type: "word", en: "discount", ru: "скидка", hint: "Дискаунт", difficulty: 1 },
      { type: "word", en: "receipt", ru: "чек", hint: "Рисит", difficulty: 2 },
      { type: "word", en: "tax", ru: "налог", hint: "Тэкс", difficulty: 2 },
      { type: "word", en: "loan", ru: "кредит", hint: "Лоун", difficulty: 2 },
      { type: "word", en: "savings", ru: "сбережения", hint: "Сэйвингз", difficulty: 2 },
      { type: "word", en: "size", ru: "размер", hint: "Сайз", difficulty: 1 },
      { type: "word", en: "brand", ru: "бренд", hint: "Брэнд", difficulty: 1 },
      { type: "word", en: "quality", ru: "качество", hint: "Кволити", difficulty: 2 },
      { type: "word", en: "delivery", ru: "доставка", hint: "Диливери", difficulty: 1 },
    ]
  },

  // ╔══════════════════════════════════════════════════════════════╗
  // ║  ОСТРОВ 8: ДОМ И БЫТ                                       ║
  // ║  Цель: описать жильё, обсудить бытовые вопросы              ║
  // ╚══════════════════════════════════════════════════════════════╝
  {
    island: "Дом и быт",
    icon: "🏠",
    items: [
      // === Уровень 1 ===
      { type: "phrase", en: "I live in an apartment", ru: "Я живу в квартире", hint: "Ай лив ин эн апартмэнт", difficulty: 1, context: "О жилье" },
      { type: "phrase", en: "I need to clean the house", ru: "Мне нужно убраться", hint: "Ай нид ту клин зэ хаус", difficulty: 1, context: "Домашние дела" },
      { type: "phrase", en: "The wifi doesn't work", ru: "Вайфай не работает", hint: "Зэ уайфай дазнт уорк", difficulty: 1, context: "Проблемы в доме" },

      // === Уровень 2 ===
      { type: "phrase", en: "We're looking for a new place", ru: "Мы ищем новое жильё", hint: "Уир лукинг фор э нью плэйс", difficulty: 2, context: "О жилье" },
      { type: "phrase", en: "The rent is too high", ru: "Аренда слишком высокая", hint: "Зэ рэнт из ту хай", difficulty: 2, context: "О жилье" },
      { type: "phrase", en: "We need to fix the plumbing", ru: "Нужно починить сантехнику", hint: "Уи нид ту фикс зэ пламбинг", difficulty: 2, context: "Ремонт" },
      { type: "phrase", en: "I'm moving to a new place", ru: "Я переезжаю", hint: "Айм мувинг ту э нью плэйс", difficulty: 2, context: "О переезде" },
      { type: "phrase", en: "The apartment is really cozy", ru: "Квартира очень уютная", hint: "Зэ апартмэнт из рили коузи", difficulty: 2, context: "Описать жильё" },
      { type: "phrase", en: "Can you turn off the lights?", ru: "Можешь выключить свет?", hint: "Кэн ю тёрн оф зэ лайтс?", difficulty: 2, context: "Домашние дела" },

      // === Уровень 3 ===
      { type: "phrase", en: "We're thinking about renovating", ru: "Думаем о ремонте", hint: "Уир синкинг эбаут рэновэйтинг", difficulty: 3, context: "О ремонте" },
      { type: "phrase", en: "The neighborhood is really quiet", ru: "Район очень тихий", hint: "Зэ нэйберхуд из рили куайэт", difficulty: 3, context: "О районе" },
      { type: "phrase", en: "It's within walking distance", ru: "Туда можно дойти пешком", hint: "Итс уизин уокинг дистэнс", difficulty: 3, context: "О расположении" },

      // Словарь
      { type: "word", en: "house", ru: "дом", hint: "Хаус", difficulty: 1 },
      { type: "word", en: "apartment", ru: "квартира", hint: "Апартмэнт", difficulty: 1 },
      { type: "word", en: "room", ru: "комната", hint: "Рум", difficulty: 1 },
      { type: "word", en: "kitchen", ru: "кухня", hint: "Китчен", difficulty: 1 },
      { type: "word", en: "bedroom", ru: "спальня", hint: "Бэдрум", difficulty: 1 },
      { type: "word", en: "bathroom", ru: "ванная", hint: "Басрум", difficulty: 1 },
      { type: "word", en: "balcony", ru: "балкон", hint: "Бэлкони", difficulty: 1 },
      { type: "word", en: "floor", ru: "пол / этаж", hint: "Флор", difficulty: 1 },
      { type: "word", en: "door", ru: "дверь", hint: "Дор", difficulty: 1 },
      { type: "word", en: "window", ru: "окно", hint: "Уиндоу", difficulty: 1 },
      { type: "word", en: "stairs", ru: "лестница", hint: "Стэрз", difficulty: 1 },
      { type: "word", en: "elevator", ru: "лифт", hint: "Элэвэйтор", difficulty: 1 },
      { type: "word", en: "rent", ru: "аренда", hint: "Рэнт", difficulty: 2 },
      { type: "word", en: "landlord", ru: "арендодатель", hint: "Лэндлорд", difficulty: 2 },
      { type: "word", en: "cozy", ru: "уютный", hint: "Коузи", difficulty: 1 },
      { type: "word", en: "spacious", ru: "просторный", hint: "Спэйшэс", difficulty: 2 },
      // Мебель и техника
      { type: "word", en: "bed", ru: "кровать", hint: "Бэд", difficulty: 1 },
      { type: "word", en: "sofa", ru: "диван", hint: "Соуфа", difficulty: 1 },
      { type: "word", en: "table", ru: "стол", hint: "Тэйбл", difficulty: 1 },
      { type: "word", en: "chair", ru: "стул", hint: "Чэр", difficulty: 1 },
      { type: "word", en: "fridge", ru: "холодильник", hint: "Фридж", difficulty: 1 },
      { type: "word", en: "washing machine", ru: "стиральная машина", hint: "Уошинг мэшин", difficulty: 1 },
      { type: "word", en: "oven", ru: "духовка", hint: "Авэн", difficulty: 2 },
      { type: "word", en: "microwave", ru: "микроволновка", hint: "Майкроувэйв", difficulty: 1 },
    ]
  },

  // ╔══════════════════════════════════════════════════════════════╗
  // ║  ОСТРОВ 9: ЗДОРОВЬЕ И ТЕЛО                                  ║
  // ║  Цель: описать симптомы, обратиться к врачу                 ║
  // ╚══════════════════════════════════════════════════════════════╝
  {
    island: "Здоровье",
    icon: "🏥",
    items: [
      // === Уровень 1 ===
      { type: "phrase", en: "I don't feel well", ru: "Мне нехорошо", hint: "Ай доунт фил уэл", difficulty: 1, context: "О самочувствии" },
      { type: "phrase", en: "I have a headache", ru: "У меня болит голова", hint: "Ай хэв э хэдэйк", difficulty: 1, context: "Описать симптом" },
      { type: "phrase", en: "I need to see a doctor", ru: "Мне нужен врач", hint: "Ай нид ту си э доктор", difficulty: 1, context: "Обратиться к врачу" },
      { type: "phrase", en: "It hurts here", ru: "Вот здесь болит", hint: "Ит хёртс хир", difficulty: 1, context: "Описать боль" },
      { type: "phrase", en: "I'm feeling better now", ru: "Мне уже лучше", hint: "Айм филинг бэтер нау", difficulty: 1, context: "О самочувствии" },

      // === Уровень 2 ===
      { type: "phrase", en: "I think I'm coming down with something", ru: "Кажется, я заболеваю", hint: "Ай синк айм каминг даун уиз самсинг", difficulty: 2, context: "О здоровье" },
      { type: "phrase", en: "I need a prescription for...", ru: "Мне нужен рецепт на...", hint: "Ай нид э прискрипшн фор...", difficulty: 2, context: "У врача" },
      { type: "phrase", en: "I'm allergic to...", ru: "У меня аллергия на...", hint: "Айм элёрджик ту...", difficulty: 2, context: "Об аллергии" },
      { type: "phrase", en: "How often should I take this?", ru: "Как часто это принимать?", hint: "Хау офэн шуд ай тэйк зис?", difficulty: 2, context: "У врача" },
      { type: "phrase", en: "I've been feeling tired lately", ru: "В последнее время чувствую усталость", hint: "Айв бин филинг тайэрд лэйтли", difficulty: 2, context: "О здоровье" },
      { type: "phrase", en: "I need to make an appointment", ru: "Мне нужно записаться на приём", hint: "Ай нид ту мэйк эн эпойнтмэнт", difficulty: 2, context: "Записаться к врачу" },

      // === Уровень 3 ===
      { type: "phrase", en: "The symptoms started a week ago", ru: "Симптомы начались неделю назад", hint: "Зэ симптомз стартед э уик эгоу", difficulty: 3, context: "У врача" },
      { type: "phrase", en: "I'm under the weather", ru: "Мне нездоровится", hint: "Айм андер зэ уэзер", difficulty: 3, context: "О самочувствии (идиома)" },
      { type: "phrase", en: "It runs in the family", ru: "Это передаётся в семье", hint: "Ит ранз ин зэ фэмили", difficulty: 3, context: "О генетике" },

      // Словарь
      { type: "word", en: "doctor", ru: "врач", hint: "Доктор", difficulty: 1 },
      { type: "word", en: "hospital", ru: "больница", hint: "Хоспитл", difficulty: 1 },
      { type: "word", en: "pharmacy", ru: "аптека", hint: "Фармаси", difficulty: 1 },
      { type: "word", en: "medicine", ru: "лекарство", hint: "Мэдисин", difficulty: 1 },
      { type: "word", en: "pill", ru: "таблетка", hint: "Пил", difficulty: 1 },
      { type: "word", en: "pain", ru: "боль", hint: "Пэйн", difficulty: 1 },
      { type: "word", en: "fever", ru: "температура", hint: "Фивер", difficulty: 1 },
      { type: "word", en: "cold", ru: "простуда", hint: "Коулд", difficulty: 1 },
      { type: "word", en: "cough", ru: "кашель", hint: "Коф", difficulty: 1 },
      { type: "word", en: "allergy", ru: "аллергия", hint: "Элерджи", difficulty: 2 },
      { type: "word", en: "injury", ru: "травма", hint: "Инджури", difficulty: 2 },
      { type: "word", en: "ambulance", ru: "скорая", hint: "Эмбьюлэнс", difficulty: 2 },
      { type: "word", en: "insurance", ru: "страховка", hint: "Иншурэнс", difficulty: 2 },
      // Части тела (базовые)
      { type: "word", en: "head", ru: "голова", hint: "Хэд", difficulty: 1 },
      { type: "word", en: "stomach", ru: "живот", hint: "Стамэк", difficulty: 1 },
      { type: "word", en: "back", ru: "спина", hint: "Бэк", difficulty: 1 },
      { type: "word", en: "throat", ru: "горло", hint: "Сроут", difficulty: 1 },
      { type: "word", en: "arm", ru: "рука", hint: "Арм", difficulty: 1 },
      { type: "word", en: "leg", ru: "нога", hint: "Лэг", difficulty: 1 },
      { type: "word", en: "knee", ru: "колено", hint: "Ни", difficulty: 1 },
    ]
  },

  // ╔══════════════════════════════════════════════════════════════╗
  // ║  ОСТРОВ 10: МНЕНИЯ, СПОРЫ И АРГУМЕНТАЦИЯ                    ║
  // ║  Цель: выразить мнение, согласиться, возразить               ║
  // ╚══════════════════════════════════════════════════════════════╝
  {
    island: "Мнения и споры",
    icon: "💬",
    items: [
      // === Уровень 1 ===
      { type: "phrase", en: "I think...", ru: "Я думаю...", hint: "Ай синк...", difficulty: 1, context: "Выразить мнение" },
      { type: "phrase", en: "I agree", ru: "Я согласен", hint: "Ай эгри", difficulty: 1, context: "Согласиться" },
      { type: "phrase", en: "I disagree", ru: "Я не согласен", hint: "Ай дисэгри", difficulty: 1, context: "Возразить" },
      { type: "phrase", en: "That's true", ru: "Это правда", hint: "Зэтс тру", difficulty: 1, context: "Согласиться" },
      { type: "phrase", en: "I'm not sure about that", ru: "Я не уверен насчёт этого", hint: "Айм нот шур эбаут зэт", difficulty: 1, context: "Выразить сомнение" },

      // === Уровень 2 ===
      { type: "phrase", en: "In my opinion...", ru: "По моему мнению...", hint: "Ин май опиньон...", difficulty: 2, context: "Выразить мнение" },
      { type: "phrase", en: "That's a good point", ru: "Хороший аргумент", hint: "Зэтс э гуд пойнт", difficulty: 2, context: "Признать правоту" },
      { type: "phrase", en: "I see your point, but...", ru: "Я понимаю тебя, но...", hint: "Ай си ёр пойнт, бат...", difficulty: 2, context: "Вежливо возразить" },
      { type: "phrase", en: "That makes sense", ru: "Это имеет смысл", hint: "Зэт мэйкс сэнс", difficulty: 2, context: "Согласиться" },
      { type: "phrase", en: "I feel the same way", ru: "Я чувствую то же самое", hint: "Ай фил зэ сэйм уэй", difficulty: 2, context: "Согласиться" },
      { type: "phrase", en: "Let me think about it", ru: "Дай мне подумать", hint: "Лэт ми синк эбаут ит", difficulty: 2, context: "Взять паузу" },
      { type: "phrase", en: "You have a point there", ru: "Тут ты прав", hint: "Ю хэв э пойнт зэр", difficulty: 2, context: "Признать правоту" },

      // === Уровень 3 ===
      { type: "phrase", en: "I totally see where you're coming from", ru: "Я полностью понимаю твою позицию", hint: "Ай тоутэли си уэр ёр каминг фром", difficulty: 3, context: "Показать понимание" },
      { type: "phrase", en: "With all due respect...", ru: "При всём уважении...", hint: "Уиз ол дью риспэкт...", difficulty: 3, context: "Вежливо возразить" },
      { type: "phrase", en: "That's debatable", ru: "Это спорно", hint: "Зэтс дибэйтэбл", difficulty: 3, context: "Выразить несогласие" },
      { type: "phrase", en: "Let's agree to disagree", ru: "Давай каждый останется при своём", hint: "Лэтс эгри ту дисэгри", difficulty: 3, context: "Закончить спор" },
      { type: "phrase", en: "The way I see it...", ru: "Как я это вижу...", hint: "Зэ уэй ай си ит...", difficulty: 3, context: "Выразить мнение" },
      { type: "phrase", en: "It depends on how you look at it", ru: "Зависит от того, как посмотреть", hint: "Ит дипэндз он хау ю лук эт ит", difficulty: 3, context: "Уточнить позицию" },

      // === Уровень 4 ===
      { type: "phrase", en: "I'd argue that...", ru: "Я бы привёл аргумент, что...", hint: "Айд аргью зэт...", difficulty: 4, context: "Аргументировать" },
      { type: "phrase", en: "On the flip side...", ru: "С другой стороны...", hint: "Он зэ флип сайд...", difficulty: 4, context: "Привести контраргумент" },
      { type: "phrase", en: "Playing devil's advocate...", ru: "Если посмотреть с другой стороны...", hint: "Плэйинг дэвлз эдвокэт...", difficulty: 4, context: "Аргументировать" },
    ]
  },

  // ╔══════════════════════════════════════════════════════════════╗
  // ║  ОСТРОВ 11: ПЛАНЫ И ДОГОВОРЁННОСТИ                          ║
  // ║  Цель: обсудить планы, назначить встречу, отменить          ║
  // ╚══════════════════════════════════════════════════════════════╝
  {
    island: "Планы и договорённости",
    icon: "📅",
    items: [
      // === Уровень 1 ===
      { type: "phrase", en: "What are you doing tonight?", ru: "Что делаешь сегодня вечером?", hint: "Вот ар ю дуинг тунайт?", difficulty: 1, context: "Узнать планы" },
      { type: "phrase", en: "Let's meet tomorrow", ru: "Давай встретимся завтра", hint: "Лэтс мит тумороу", difficulty: 1, context: "Назначить встречу" },
      { type: "phrase", en: "I'm busy today", ru: "Я сегодня занят", hint: "Айм бизи тудэй", difficulty: 1, context: "Отказать" },
      { type: "phrase", en: "Sounds good!", ru: "Звучит хорошо!", hint: "Саундз гуд!", difficulty: 1, context: "Согласиться" },
      { type: "phrase", en: "I'm free on Saturday", ru: "Я свободен в субботу", hint: "Айм фри он Сэтэрдэй", difficulty: 1, context: "Предложить время" },

      // === Уровень 2 ===
      { type: "phrase", en: "Why don't we go to...?", ru: "Почему бы нам не пойти в...?", hint: "Уай доунт уи гоу ту...?", difficulty: 2, context: "Предложить" },
      { type: "phrase", en: "I'm looking forward to it", ru: "С нетерпением жду", hint: "Айм лукинг форуэрд ту ит", difficulty: 2, context: "Выразить предвкушение" },
      { type: "phrase", en: "Something came up", ru: "Кое-что случилось (не могу прийти)", hint: "Самсинг кэйм ап", difficulty: 2, context: "Отменить планы" },
      { type: "phrase", en: "Can we reschedule?", ru: "Можем перенести?", hint: "Кэн уи рискэджул?", difficulty: 2, context: "Перенести встречу" },
      { type: "phrase", en: "I was thinking we could...", ru: "Я думал, мы могли бы...", hint: "Ай уоз синкинг уи куд...", difficulty: 2, context: "Предложить" },
      { type: "phrase", en: "Let me check my schedule", ru: "Дай проверю расписание", hint: "Лэт ми чек май скэджул", difficulty: 2, context: "Ответить на приглашение" },
      { type: "phrase", en: "I'm planning to go to Bali", ru: "Планирую поехать на Бали", hint: "Айм плэнинг ту гоу ту Бали", difficulty: 2, context: "О планах" },

      // === Уровень 3 ===
      { type: "phrase", en: "Rain check?", ru: "Перенесём на другой раз?", hint: "Рэйн чек?", difficulty: 3, context: "Отложить встречу" },
      { type: "phrase", en: "I'll pencil you in", ru: "Запишу тебя предварительно", hint: "Айл пэнсл ю ин", difficulty: 3, context: "О планах" },
      { type: "phrase", en: "Let's play it by ear", ru: "Давай по ситуации", hint: "Лэтс плэй ит бай ир", difficulty: 3, context: "Не фиксировать план" },
      { type: "phrase", en: "I'll make it work", ru: "Я найду способ (прийти/сделать)", hint: "Айл мэйк ит уорк", difficulty: 3, context: "Подтвердить" },

      // Словарь
      { type: "word", en: "today", ru: "сегодня", hint: "Тудэй", difficulty: 1 },
      { type: "word", en: "tomorrow", ru: "завтра", hint: "Тумороу", difficulty: 1 },
      { type: "word", en: "yesterday", ru: "вчера", hint: "Йестэрдэй", difficulty: 1 },
      { type: "word", en: "morning", ru: "утро", hint: "Морнинг", difficulty: 1 },
      { type: "word", en: "evening", ru: "вечер", hint: "Ивнинг", difficulty: 1 },
      { type: "word", en: "weekend", ru: "выходные", hint: "Уикэнд", difficulty: 1 },
      { type: "word", en: "schedule", ru: "расписание", hint: "Скэджул", difficulty: 2 },
    ]
  },

  // ╔══════════════════════════════════════════════════════════════╗
  // ║  ОСТРОВ 12: ТРАНСПОРТ И НАВИГАЦИЯ                           ║
  // ║  Цель: ориентироваться, вызвать такси, пользоваться ОТ      ║
  // ╚══════════════════════════════════════════════════════════════╝
  {
    island: "Транспорт и навигация",
    icon: "🚗",
    items: [
      { type: "phrase", en: "How far is it from here?", ru: "Как далеко отсюда?", hint: "Хау фар из ит фром хир?", difficulty: 1, context: "Спросить расстояние" },
      { type: "phrase", en: "Turn left / right", ru: "Поверните налево / направо", hint: "Тёрн лэфт / райт", difficulty: 1, context: "Направление" },
      { type: "phrase", en: "Go straight ahead", ru: "Идите прямо", hint: "Гоу стрэйт эхэд", difficulty: 1, context: "Направление" },
      { type: "phrase", en: "I'm lost", ru: "Я заблудился", hint: "Айм лост", difficulty: 1, context: "Попросить помощь" },
      { type: "phrase", en: "Can you drop me off here?", ru: "Высадите меня здесь", hint: "Кэн ю дроп ми оф хир?", difficulty: 2, context: "В такси" },
      { type: "phrase", en: "How long does it take to get there?", ru: "Сколько ехать?", hint: "Хау лонг даз ит тэйк ту гэт зэр?", difficulty: 2, context: "Узнать время" },
      { type: "phrase", en: "Is there a bus/train to...?", ru: "Есть автобус/поезд до...?", hint: "Из зэр э бас/трэйн ту...?", difficulty: 2, context: "Общественный транспорт" },
      { type: "phrase", en: "Where do I transfer?", ru: "Где мне пересесть?", hint: "Уэр ду ай трэнсфёр?", difficulty: 2, context: "Общественный транспорт" },
      { type: "phrase", en: "I missed my stop", ru: "Я проехал свою остановку", hint: "Ай мист май стоп", difficulty: 2, context: "В транспорте" },
      { type: "phrase", en: "We're stuck in traffic", ru: "Мы стоим в пробке", hint: "Уир стак ин трэфик", difficulty: 2, context: "О пробках" },
      { type: "phrase", en: "I'll take the subway", ru: "Я поеду на метро", hint: "Айл тэйк зэ сабуэй", difficulty: 2, context: "О транспорте" },

      // Словарь
      { type: "word", en: "car", ru: "машина", hint: "Кар", difficulty: 1 },
      { type: "word", en: "bus", ru: "автобус", hint: "Бас", difficulty: 1 },
      { type: "word", en: "train", ru: "поезд", hint: "Трэйн", difficulty: 1 },
      { type: "word", en: "subway", ru: "метро", hint: "Сабуэй", difficulty: 1 },
      { type: "word", en: "taxi", ru: "такси", hint: "Тэкси", difficulty: 1 },
      { type: "word", en: "traffic", ru: "пробка / движение", hint: "Трэфик", difficulty: 1 },
      { type: "word", en: "gas station", ru: "заправка", hint: "Гэс стэйшн", difficulty: 2 },
      { type: "word", en: "parking", ru: "парковка", hint: "Паркинг", difficulty: 1 },
      { type: "word", en: "road", ru: "дорога", hint: "Роуд", difficulty: 1 },
      { type: "word", en: "bridge", ru: "мост", hint: "Бридж", difficulty: 1 },
    ]
  },

  // ╔══════════════════════════════════════════════════════════════╗
  // ║  ОСТРОВ 13: СПОРТ И ФИТНЕС                                  ║
  // ╚══════════════════════════════════════════════════════════════╝
  {
    island: "Спорт и фитнес",
    icon: "🏋️",
    items: [
      { type: "phrase", en: "I work out three times a week", ru: "Я тренируюсь три раза в неделю", hint: "Ай уорк аут сри таймз э уик", difficulty: 1, context: "О спорте" },
      { type: "phrase", en: "Let's go for a run", ru: "Пойдём побегаем", hint: "Лэтс гоу фор э ран", difficulty: 1, context: "Предложить" },
      { type: "phrase", en: "I need to warm up first", ru: "Мне нужно сначала размяться", hint: "Ай нид ту уорм ап фёрст", difficulty: 2, context: "О тренировке" },
      { type: "phrase", en: "How many reps?", ru: "Сколько повторений?", hint: "Хау мэни рэпс?", difficulty: 2, context: "О тренировке" },
      { type: "phrase", en: "I'm so sore after yesterday", ru: "Всё болит после вчерашнего", hint: "Айм соу сор афтер йестэрдэй", difficulty: 2, context: "О самочувствии" },
      { type: "phrase", en: "I'm trying to lose weight", ru: "Пытаюсь сбросить вес", hint: "Айм трайинг ту луз уэйт", difficulty: 2, context: "О цели" },
      { type: "phrase", en: "Who won the game?", ru: "Кто выиграл?", hint: "Ху уан зэ гэйм?", difficulty: 1, context: "О спорте" },
      { type: "phrase", en: "What's the score?", ru: "Какой счёт?", hint: "Вотс зэ скор?", difficulty: 1, context: "О спорте" },
      { type: "phrase", en: "I've been making great progress", ru: "У меня отличный прогресс", hint: "Айв бин мэйкинг грэйт прогрэс", difficulty: 3, context: "О достижениях" },

      // Словарь
      { type: "word", en: "gym", ru: "спортзал", hint: "Джим", difficulty: 1 },
      { type: "word", en: "exercise", ru: "упражнение", hint: "Эксерсайз", difficulty: 1 },
      { type: "word", en: "muscle", ru: "мышца", hint: "Масл", difficulty: 2 },
      { type: "word", en: "coach", ru: "тренер", hint: "Коуч", difficulty: 2 },
      { type: "word", en: "team", ru: "команда", hint: "Тим", difficulty: 1 },
      { type: "word", en: "match", ru: "матч", hint: "Мэтч", difficulty: 1 },
      { type: "word", en: "score", ru: "счёт", hint: "Скор", difficulty: 1 },
    ]
  },

  // ╔══════════════════════════════════════════════════════════════╗
  // ║  ОСТРОВ 14: СЕМЬЯ И ОТНОШЕНИЯ                               ║
  // ╚══════════════════════════════════════════════════════════════╝
  {
    island: "Семья и отношения",
    icon: "👨‍👩‍👧",
    items: [
      { type: "phrase", en: "I'm married", ru: "Я женат / замужем", hint: "Айм мэрид", difficulty: 1, context: "О себе" },
      { type: "phrase", en: "We've been together for... years", ru: "Мы вместе уже... лет", hint: "Уив бин тугэзер фор... йирз", difficulty: 2, context: "Об отношениях" },
      { type: "phrase", en: "We get along really well", ru: "Мы отлично ладим", hint: "Уи гэт элонг рили уэл", difficulty: 2, context: "Об отношениях" },
      { type: "phrase", en: "We had an argument", ru: "Мы поссорились", hint: "Уи хэд эн аргьюмэнт", difficulty: 2, context: "О конфликте" },
      { type: "phrase", en: "Family means everything to me", ru: "Семья для меня всё", hint: "Фэмили минз эвритинг ту ми", difficulty: 2, context: "О ценностях" },
      { type: "phrase", en: "He/She takes after his/her mom", ru: "Он/она в маму", hint: "Хи/ши тэйкс афтер хиз/хёр мам", difficulty: 3, context: "О семье" },
      { type: "phrase", en: "We're expecting a baby", ru: "Мы ждём ребёнка", hint: "Уир экспэктинг э бэйби", difficulty: 2, context: "О семье" },

      // Словарь
      { type: "word", en: "family", ru: "семья", hint: "Фэмили", difficulty: 1 },
      { type: "word", en: "parents", ru: "родители", hint: "Пэрэнтс", difficulty: 1 },
      { type: "word", en: "husband", ru: "муж", hint: "Хазбэнд", difficulty: 1 },
      { type: "word", en: "wife", ru: "жена", hint: "Уайф", difficulty: 1 },
      { type: "word", en: "son", ru: "сын", hint: "Сан", difficulty: 1 },
      { type: "word", en: "daughter", ru: "дочь", hint: "Дотер", difficulty: 1 },
      { type: "word", en: "brother", ru: "брат", hint: "Бразер", difficulty: 1 },
      { type: "word", en: "sister", ru: "сестра", hint: "Систер", difficulty: 1 },
      { type: "word", en: "wedding", ru: "свадьба", hint: "Уэдинг", difficulty: 2 },
      { type: "word", en: "relationship", ru: "отношения", hint: "Рилэйшнщип", difficulty: 2 },
      { type: "word", en: "divorce", ru: "развод", hint: "Диворс", difficulty: 2 },
    ]
  },

  // ╔══════════════════════════════════════════════════════════════╗
  // ║  ОСТРОВ 15: ПОГОДА И ПРИРОДА                                ║
  // ╚══════════════════════════════════════════════════════════════╝
  {
    island: "Погода и природа",
    icon: "🌤️",
    items: [
      { type: "phrase", en: "What's the weather like?", ru: "Какая погода?", hint: "Вотс зэ уэзер лайк?", difficulty: 1, context: "О погоде" },
      { type: "phrase", en: "It's really hot today", ru: "Сегодня очень жарко", hint: "Итс рили хот тудэй", difficulty: 1, context: "О погоде" },
      { type: "phrase", en: "It looks like it's going to rain", ru: "Похоже, будет дождь", hint: "Ит лукс лайк итс гоуинг ту рэйн", difficulty: 2, context: "О погоде" },
      { type: "phrase", en: "The sunset is beautiful", ru: "Закат красивый", hint: "Зэ сансэт из бьютифул", difficulty: 1, context: "О природе" },
      { type: "phrase", en: "I love this time of year", ru: "Обожаю это время года", hint: "Ай лав зис тайм ов йир", difficulty: 2, context: "О сезоне" },
      { type: "phrase", en: "The humidity is killing me", ru: "Влажность меня убивает", hint: "Зэ хьюмидити из килинг ми", difficulty: 3, context: "О погоде" },

      // Словарь
      { type: "word", en: "weather", ru: "погода", hint: "Уэзер", difficulty: 1 },
      { type: "word", en: "sunny", ru: "солнечно", hint: "Сани", difficulty: 1 },
      { type: "word", en: "rainy", ru: "дождливо", hint: "Рэйни", difficulty: 1 },
      { type: "word", en: "cloudy", ru: "облачно", hint: "Клауди", difficulty: 1 },
      { type: "word", en: "windy", ru: "ветрено", hint: "Уинди", difficulty: 1 },
      { type: "word", en: "snow", ru: "снег", hint: "Сноу", difficulty: 1 },
      { type: "word", en: "hot", ru: "жарко", hint: "Хот", difficulty: 1 },
      { type: "word", en: "cold", ru: "холодно", hint: "Коулд", difficulty: 1 },
      { type: "word", en: "beach", ru: "пляж", hint: "Бич", difficulty: 1 },
      { type: "word", en: "mountain", ru: "гора", hint: "Маунтин", difficulty: 1 },
      { type: "word", en: "ocean", ru: "океан", hint: "Оушн", difficulty: 1 },
      { type: "word", en: "forest", ru: "лес", hint: "Форест", difficulty: 1 },
      { type: "word", en: "river", ru: "река", hint: "Ривер", difficulty: 1 },
      { type: "word", en: "lake", ru: "озеро", hint: "Лэйк", difficulty: 1 },
    ]
  },

  // ╔══════════════════════════════════════════════════════════════╗
  // ║  ОСТРОВ 16: ТЕХНОЛОГИИ                                      ║
  // ╚══════════════════════════════════════════════════════════════╝
  {
    island: "Технологии",
    icon: "📱",
    items: [
      { type: "phrase", en: "My phone died", ru: "Телефон сел", hint: "Май фоун дайд", difficulty: 1, context: "О технике" },
      { type: "phrase", en: "Can you send me a link?", ru: "Скинешь ссылку?", hint: "Кэн ю сэнд ми э линк?", difficulty: 1, context: "Попросить" },
      { type: "phrase", en: "The internet is really slow", ru: "Интернет очень медленный", hint: "Зэ интернэт из рили слоу", difficulty: 1, context: "О проблемах" },
      { type: "phrase", en: "Let me google it", ru: "Дай загуглю", hint: "Лэт ми гугл ит", difficulty: 1, context: "Найти информацию" },
      { type: "phrase", en: "Have you tried turning it off and on?", ru: "Ты пробовал перезагрузить?", hint: "Хэв ю трайд тёрнинг ит оф энд он?", difficulty: 2, context: "Помочь с техникой" },
      { type: "phrase", en: "I'll download the app", ru: "Скачаю приложение", hint: "Айл даунлоуд зэ эп", difficulty: 2, context: "О приложениях" },
      { type: "phrase", en: "My laptop keeps crashing", ru: "Ноутбук постоянно зависает", hint: "Май лэптоп кипс крэшинг", difficulty: 2, context: "О проблемах" },
      { type: "phrase", en: "I need to charge my phone", ru: "Мне нужно зарядить телефон", hint: "Ай нид ту чардж май фоун", difficulty: 1, context: "О технике" },

      // Словарь
      { type: "word", en: "phone", ru: "телефон", hint: "Фоун", difficulty: 1 },
      { type: "word", en: "laptop", ru: "ноутбук", hint: "Лэптоп", difficulty: 1 },
      { type: "word", en: "app", ru: "приложение", hint: "Эп", difficulty: 1 },
      { type: "word", en: "website", ru: "сайт", hint: "Уэбсайт", difficulty: 1 },
      { type: "word", en: "password", ru: "пароль", hint: "Пасуорд", difficulty: 1 },
      { type: "word", en: "update", ru: "обновление", hint: "Апдэйт", difficulty: 1 },
      { type: "word", en: "charger", ru: "зарядка", hint: "Чарджер", difficulty: 1 },
      { type: "word", en: "screen", ru: "экран", hint: "Скрин", difficulty: 1 },
    ]
  },

  // ╔══════════════════════════════════════════════════════════════╗
  // ║  ОСТРОВ 17: РАЗВЛЕЧЕНИЯ И ХОББИ                             ║
  // ╚══════════════════════════════════════════════════════════════╝
  {
    island: "Развлечения и хобби",
    icon: "🎬",
    items: [
      { type: "phrase", en: "What are you watching?", ru: "Что смотришь?", hint: "Вот ар ю уотчинг?", difficulty: 1, context: "О развлечениях" },
      { type: "phrase", en: "Have you seen...?", ru: "Ты видел / смотрел...?", hint: "Хэв ю син...?", difficulty: 1, context: "Обсудить фильм" },
      { type: "phrase", en: "I'm reading a great book", ru: "Читаю отличную книгу", hint: "Айм ридинг э грэйт бук", difficulty: 1, context: "О хобби" },
      { type: "phrase", en: "What kind of music do you like?", ru: "Какую музыку слушаешь?", hint: "Вот кайнд ов мьюзик ду ю лайк?", difficulty: 1, context: "О музыке" },
      { type: "phrase", en: "I'm really into...", ru: "Я очень увлекаюсь...", hint: "Айм рили инту...", difficulty: 2, context: "О хобби" },
      { type: "phrase", en: "You should check it out", ru: "Тебе стоит глянуть", hint: "Ю шуд чек ит аут", difficulty: 2, context: "Порекомендовать" },
      { type: "phrase", en: "No spoilers!", ru: "Без спойлеров!", hint: "Ноу спойлерз!", difficulty: 2, context: "О фильме/сериале" },
      { type: "phrase", en: "I binge-watched the whole season", ru: "Посмотрел весь сезон залпом", hint: "Ай биндж-уотчт зэ хоул сизон", difficulty: 3, context: "О сериале" },

      // Словарь
      { type: "word", en: "movie", ru: "фильм", hint: "Муви", difficulty: 1 },
      { type: "word", en: "music", ru: "музыка", hint: "Мьюзик", difficulty: 1 },
      { type: "word", en: "book", ru: "книга", hint: "Бук", difficulty: 1 },
      { type: "word", en: "game", ru: "игра", hint: "Гэйм", difficulty: 1 },
      { type: "word", en: "concert", ru: "концерт", hint: "Консерт", difficulty: 1 },
      { type: "word", en: "party", ru: "вечеринка", hint: "Парти", difficulty: 1 },
      { type: "word", en: "hobby", ru: "хобби", hint: "Хоби", difficulty: 1 },
      { type: "word", en: "camping", ru: "кемпинг", hint: "Кэмпинг", difficulty: 1 },
      { type: "word", en: "hiking", ru: "походы", hint: "Хайкинг", difficulty: 1 },
      { type: "word", en: "surfing", ru: "сёрфинг", hint: "Сёрфинг", difficulty: 1 },
    ]
  },

  // ╔══════════════════════════════════════════════════════════════╗
  // ║  ОСТРОВ 18: СВЯЗУЮЩАЯ ТКАНЬ ЯЗЫКА (FILLERS & GLUE)          ║
  // ║  Цель: сделать речь естественной и связной                  ║
  // ╚══════════════════════════════════════════════════════════════╝
  {
    island: "Связующие слова и филлеры",
    icon: "🧩",
    items: [
      // === Филлеры (делают речь натуральной) ===
      { type: "glue", en: "well...", ru: "ну...", hint: "Уэл...", difficulty: 1, context: "Начать мысль" },
      { type: "glue", en: "actually...", ru: "на самом деле...", hint: "Экчуэли...", difficulty: 1, context: "Уточнить" },
      { type: "glue", en: "I mean...", ru: "в смысле...", hint: "Ай мин...", difficulty: 1, context: "Пояснить" },
      { type: "glue", en: "you know...", ru: "знаешь...", hint: "Ю ноу...", difficulty: 1, context: "Филлер" },
      { type: "glue", en: "like...", ru: "типа...", hint: "Лайк...", difficulty: 1, context: "Филлер (разг.)" },
      { type: "glue", en: "so basically...", ru: "короче говоря...", hint: "Соу бэйсикэли...", difficulty: 2, context: "Подвести итог" },
      { type: "glue", en: "the thing is...", ru: "дело в том, что...", hint: "Зэ синг из...", difficulty: 2, context: "Объяснить суть" },
      { type: "glue", en: "by the way...", ru: "кстати...", hint: "Бай зэ уэй...", difficulty: 1, context: "Сменить тему" },
      { type: "glue", en: "anyway...", ru: "в любом случае...", hint: "Эниуэй...", difficulty: 1, context: "Вернуться к теме" },
      { type: "glue", en: "honestly...", ru: "честно говоря...", hint: "Онэстли...", difficulty: 2, context: "Быть откровенным" },
      { type: "glue", en: "to be honest...", ru: "если честно...", hint: "Ту би онэст...", difficulty: 2, context: "Быть откровенным" },
      { type: "glue", en: "speaking of which...", ru: "кстати об этом...", hint: "Спикинг ов уич...", difficulty: 3, context: "Связать темы" },
      { type: "glue", en: "as I was saying...", ru: "как я говорил...", hint: "Эз ай уоз сэйинг...", difficulty: 3, context: "Вернуться к теме" },
      { type: "glue", en: "let me put it this way...", ru: "скажу так...", hint: "Лэт ми пут ит зис уэй...", difficulty: 3, context: "Перефразировать" },

      // === Союзы и связки ===
      { type: "glue", en: "because", ru: "потому что", hint: "Бикоз", difficulty: 1 },
      { type: "glue", en: "but", ru: "но", hint: "Бат", difficulty: 1 },
      { type: "glue", en: "so", ru: "поэтому", hint: "Соу", difficulty: 1 },
      { type: "glue", en: "although", ru: "хотя", hint: "Олзоу", difficulty: 2 },
      { type: "glue", en: "however", ru: "однако", hint: "Хауэвер", difficulty: 2 },
      { type: "glue", en: "therefore", ru: "следовательно", hint: "Зэрфор", difficulty: 3 },
      { type: "glue", en: "moreover", ru: "более того", hint: "Мороувер", difficulty: 3 },
      { type: "glue", en: "nevertheless", ru: "тем не менее", hint: "Нэвэрзэлэс", difficulty: 3 },
      { type: "glue", en: "in addition", ru: "в дополнение", hint: "Ин эдишн", difficulty: 3 },
      { type: "glue", en: "on the other hand", ru: "с другой стороны", hint: "Он зэ азер хэнд", difficulty: 2 },
      { type: "glue", en: "for example", ru: "например", hint: "Фор игзампл", difficulty: 1 },
      { type: "glue", en: "in other words", ru: "другими словами", hint: "Ин азер уордз", difficulty: 2 },
      { type: "glue", en: "as a result", ru: "в результате", hint: "Эз э ризалт", difficulty: 3 },
      { type: "glue", en: "despite", ru: "несмотря на", hint: "Диспайт", difficulty: 3 },
      { type: "glue", en: "unless", ru: "если не", hint: "Анлэс", difficulty: 3 },
    ]
  },

  // ╔══════════════════════════════════════════════════════════════╗
  // ║  ОСТРОВ 19: ПОЛЕЗНЫЕ ИДИОМЫ И ФРАЗОВЫЕ ГЛАГОЛЫ              ║
  // ║  Цель: звучать естественно, понимать носителей               ║
  // ╚══════════════════════════════════════════════════════════════╝
  {
    island: "Идиомы и фразовые глаголы",
    icon: "🔥",
    items: [
      // Фразовые глаголы — уровень 2
      { type: "phrase", en: "I need to figure out...", ru: "Мне нужно разобраться с...", hint: "Ай нид ту фигер аут...", difficulty: 2, context: "О решении проблемы" },
      { type: "phrase", en: "I'll look into it", ru: "Я разберусь / посмотрю", hint: "Айл лук инту ит", difficulty: 2, context: "Пообещать разобраться" },
      { type: "phrase", en: "Can you pick me up?", ru: "Можешь меня забрать?", hint: "Кэн ю пик ми ап?", difficulty: 2, context: "Попросить" },
      { type: "phrase", en: "I gave up trying", ru: "Я бросил попытки", hint: "Ай гэйв ап трайинг", difficulty: 2, context: "О решении" },
      { type: "phrase", en: "Let's find out", ru: "Давай выясним", hint: "Лэтс файнд аут", difficulty: 2, context: "Предложить" },
      { type: "phrase", en: "I ran out of time", ru: "У меня закончилось время", hint: "Ай рэн аут ов тайм", difficulty: 2, context: "Объяснить" },
      { type: "phrase", en: "We ended up going home", ru: "В итоге мы поехали домой", hint: "Уи эндед ап гоуинг хоум", difficulty: 3, context: "Рассказать историю" },
      { type: "phrase", en: "I came up with an idea", ru: "Я придумал идею", hint: "Ай кэйм ап уиз эн айдиа", difficulty: 3, context: "О креативе" },
      { type: "phrase", en: "I can't keep up with...", ru: "Не успеваю за...", hint: "Ай кэнт кип ап уиз...", difficulty: 3, context: "О темпе" },
      { type: "phrase", en: "I need to get rid of this", ru: "Мне нужно от этого избавиться", hint: "Ай нид ту гэт рид ов зис", difficulty: 3, context: "О решении" },
      { type: "phrase", en: "I'll sort it out", ru: "Я разберусь", hint: "Айл сорт ит аут", difficulty: 3, context: "Пообещать" },

      // Идиомы — уровень 3-4
      { type: "phrase", en: "It's a piece of cake", ru: "Проще простого", hint: "Итс э пис ов кэйк", difficulty: 3, context: "О лёгкости" },
      { type: "phrase", en: "Break the ice", ru: "Растопить лёд (начать разговор)", hint: "Брэйк зэ айс", difficulty: 3, context: "О знакомстве" },
      { type: "phrase", en: "Hit the road", ru: "Отправиться в путь", hint: "Хит зэ роуд", difficulty: 3, context: "О поездке" },
      { type: "phrase", en: "It's up to you", ru: "Решать тебе", hint: "Итс ап ту ю", difficulty: 2, context: "Передать решение" },
      { type: "phrase", en: "Keep in mind", ru: "Имей в виду", hint: "Кип ин майнд", difficulty: 2, context: "Предупредить" },
      { type: "phrase", en: "Take your time", ru: "Не торопись", hint: "Тэйк ёр тайм", difficulty: 2, context: "Успокоить" },
      { type: "phrase", en: "Step by step", ru: "Шаг за шагом", hint: "Стэп бай стэп", difficulty: 2, context: "О процессе" },
      { type: "phrase", en: "Think outside the box", ru: "Мыслить нестандартно", hint: "Синк аутсайд зэ бокс", difficulty: 3, context: "О креативе" },
      { type: "phrase", en: "Cut to the chase", ru: "Перейти к делу", hint: "Кат ту зэ чэйс", difficulty: 4, context: "Ускорить разговор" },
      { type: "phrase", en: "Go the extra mile", ru: "Сделать больше, чем нужно", hint: "Гоу зэ экстра майл", difficulty: 4, context: "О старании" },
      { type: "phrase", en: "At the end of the day", ru: "В конечном счёте", hint: "Эт зэ энд ов зэ дэй", difficulty: 3, context: "Подвести итог" },
      { type: "phrase", en: "In the long run", ru: "В долгосрочной перспективе", hint: "Ин зэ лонг ран", difficulty: 3, context: "О будущем" },
      { type: "phrase", en: "Once in a while", ru: "Время от времени", hint: "Уанс ин э уайл", difficulty: 3, context: "О частоте" },
      { type: "phrase", en: "Better late than never", ru: "Лучше поздно, чем никогда", hint: "Бэтер лэйт зэн нэвер", difficulty: 3, context: "Идиома" },
      { type: "phrase", en: "The ball is in your court", ru: "Решение за тобой", hint: "Зэ бол из ин ёр корт", difficulty: 4, context: "Идиома" },
    ]
  },

  // ╔══════════════════════════════════════════════════════════════╗
  // ║  ОСТРОВ 20: ОПИСАНИЕ ЛЮДЕЙ                                  ║
  // ╚══════════════════════════════════════════════════════════════╝
  {
    island: "Описание людей",
    icon: "🧑",
    items: [
      { type: "phrase", en: "She's tall with dark hair", ru: "Она высокая с тёмными волосами", hint: "Шиз тол уиз дарк хэр", difficulty: 1, context: "Описать внешность" },
      { type: "phrase", en: "He looks like his dad", ru: "Он похож на отца", hint: "Хи лукс лайк хиз дэд", difficulty: 1, context: "О сходстве" },
      { type: "phrase", en: "She's really friendly", ru: "Она очень дружелюбная", hint: "Шиз рили фрэндли", difficulty: 1, context: "О характере" },
      { type: "phrase", en: "He's kind of shy", ru: "Он немного стеснительный", hint: "Хиз кайнд ов шай", difficulty: 2, context: "О характере" },
      { type: "phrase", en: "She's very down to earth", ru: "Она очень приземлённая", hint: "Шиз вэри даун ту ёрс", difficulty: 3, context: "О характере (идиома)" },
      { type: "phrase", en: "He's got a great sense of humor", ru: "У него отличное чувство юмора", hint: "Хиз гот э грэйт сэнс ов хьюмор", difficulty: 2, context: "О характере" },

      // Словарь внешности
      { type: "word", en: "tall", ru: "высокий", hint: "Тол", difficulty: 1 },
      { type: "word", en: "short", ru: "низкий", hint: "Шорт", difficulty: 1 },
      { type: "word", en: "slim", ru: "стройный", hint: "Слим", difficulty: 1 },
      { type: "word", en: "handsome", ru: "красивый (о мужчине)", hint: "Хэндсом", difficulty: 1 },
      { type: "word", en: "beautiful", ru: "красивая", hint: "Бьютифул", difficulty: 1 },
      { type: "word", en: "beard", ru: "борода", hint: "Бирд", difficulty: 1 },
      { type: "word", en: "glasses", ru: "очки", hint: "Гласэз", difficulty: 1 },
      // Словарь характера
      { type: "word", en: "kind", ru: "добрый", hint: "Кайнд", difficulty: 1 },
      { type: "word", en: "smart", ru: "умный", hint: "Смарт", difficulty: 1 },
      { type: "word", en: "funny", ru: "смешной", hint: "Фани", difficulty: 1 },
      { type: "word", en: "honest", ru: "честный", hint: "Онэст", difficulty: 1 },
      { type: "word", en: "lazy", ru: "ленивый", hint: "Лэйзи", difficulty: 1 },
      { type: "word", en: "generous", ru: "щедрый", hint: "Джэнэрэс", difficulty: 2 },
      { type: "word", en: "stubborn", ru: "упрямый", hint: "Стабэрн", difficulty: 2 },
      { type: "word", en: "ambitious", ru: "амбициозный", hint: "Эмбишэс", difficulty: 2 },
      { type: "word", en: "reliable", ru: "надёжный", hint: "Рилайэбл", difficulty: 2 },
    ]
  },

];


// ══════════════════════════════════════════════════════════════════
// ЭКСПОРТ И УТИЛИТЫ
// ══════════════════════════════════════════════════════════════════

// Собираем все айтемы в плоский массив (для совместимости)
const allItems = [];
const islandRanges = [];

islands.forEach((island, idx) => {
  const start = allItems.length;
  island.items.forEach(item => {
    allItems.push({
      ...item,
      island: island.island,
      islandIcon: island.icon,
    });
  });
  islandRanges.push({
    name: island.island,
    icon: island.icon,
    start: start,
    count: island.items.length,
    islandIndex: idx,
  });
});

// Для карточек: только фразы и glue
export const phrases = allItems.filter(i => i.type === "phrase" || i.type === "glue");

// Для словаря: только слова
export const vocabulary = allItems.filter(i => i.type === "word");

// Уровни сложности
export const DIFFICULTY_LABELS = {
  1: "Beginner",
  2: "Elementary",
  3: "Intermediate",
  4: "Upper-Intermediate",
};

// Получить айтемы по острову и уровню
export function getIslandItems(islandName, difficulty = null) {
  const island = islands.find(i => i.island === islandName);
  if (!island) return [];
  if (difficulty) return island.items.filter(i => i.difficulty === difficulty);
  return island.items;
}

// Получить фразы для конкретного острова
export function getIslandPhrases(islandName, difficulty = null) {
  return getIslandItems(islandName, difficulty).filter(i => i.type === "phrase" || i.type === "glue");
}

// Получить словарь для конкретного острова
export function getIslandVocabulary(islandName, difficulty = null) {
  return getIslandItems(islandName, difficulty).filter(i => i.type === "word");
}

// Совместимость со старым форматом + сохраняем метаданные для отображения
const words = allItems.map(item => ({
  en: item.en,
  ru: item.ru,
  hint: item.hint || `${item.en} — ${item.ru}`,
  type: item.type || 'word',
  context: item.context || '',
  island: item.island || '',
  islandIcon: item.islandIcon || '',
  difficulty: item.difficulty || 1,
}));

export const WORDS_PER_LEVEL = 10;
export const LEVELS = [];
for (let i = 0; i < words.length; i += WORDS_PER_LEVEL) {
  LEVELS.push(words.slice(i, i + WORDS_PER_LEVEL));
}

export const categoryRanges = islandRanges.map(r => ({
  name: r.name,
  start: r.start,
  count: r.count,
}));

export const LEVEL_NAMES = LEVELS.map((_, i) => {
  const wordStart = i * WORDS_PER_LEVEL;
  const cat = categoryRanges.find(c => wordStart >= c.start && wordStart < c.start + c.count);
  return cat ? cat.name : 'Уровень ' + (i + 1);
});

export function getSimilarWords(wordIndex, count, excludeRu) {
  const target = words[wordIndex];
  if (!target) return [];

  const getPunctuation = (str) => {
    if (str.endsWith('?')) return '?';
    if (str.endsWith('...')) return '...';
    if (str.endsWith('!')) return '!';
    return '';
  };

  const targetPunct = getPunctuation(target.ru);
  
  // Calculate scores for all other words
  const candidates = words.map((w, idx) => {
    if (idx === wordIndex || w.ru === excludeRu) return null;
    
    let score = 0;
    
    // Type match is very important (phrase vs word)
    if (w.type === target.type) score += 200;
    
    // Punctuation match (questions, ellipsis)
    if (getPunctuation(w.ru) === targetPunct) score += 150;
    
    // Island/Context match
    if (w.island === target.island) score += 50;
    if (w.context && target.context && w.context === target.context) score += 30;
    
    // Difficulty match
    if (w.difficulty === target.difficulty) score += 20;

    // Add more randomness to break ties and provide variety
    score += Math.random() * 80; 
    
    return { ru: w.ru, score };
  }).filter(Boolean);

  // Sort by score descending and take top candidates
  candidates.sort((a, b) => b.score - a.score);
  
  // Take a larger pool (increased from count*2 to count*5) for more variety
  const topPool = candidates.slice(0, count * 5);
  for (let i = topPool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [topPool[i], topPool[j]] = [topPool[j], topPool[i]];
  }

  return topPool.slice(0, count).map(c => c.ru);
}

export const TOTAL_WORDS = words.length;
export const TOTAL_ISLANDS = islands.length;
export { islands };
export default words;
