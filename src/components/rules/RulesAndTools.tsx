import React, { useState } from 'react';
import { Shield, Heart, Skull, AlertTriangle, BookOpen, Layers, Users, Zap, CheckCircle2 } from 'lucide-react';
import rulesData from '../../data/rules.json';
import { useRouter } from '../../router/RouterContext';
import { useTheme } from '../../theme/ThemeContext';

interface FalloutExample {
  name: string;
  rule: string;
  example: string;
}

const DETAILED_FALLOUTS: Record<string, Record<'minor' | 'major' | 'severe', FalloutExample[]>> = {
  blood: {
    minor: [
      {
        name: "Кровотечение (Bleeding)",
        rule: "Вы получаете 1 стресс по Крови каждый раз, когда совершаете тяжелое физическое усилие, пока рану не перевяжут.",
        example: "В перестрелке с патрулем осколок стекла рассек предплечье персонажа. Он может бежать, но рукав пропитан кровью, а каждое подтягивание на канате заставляет зубы сжиматься от боли."
      },
      {
        name: "Хромота (Limp)",
        rule: "Вы не можете использовать навык Преследование для получения бонусных d10 до конца сессии.",
        example: "При падении с крыши в Дереликтусе персонаж подвернул лодыжку. Теперь уйти от погони бегом невозможно — приходится полагаться на хитрость или помощь товарищей."
      },
      {
        name: "Контузия и Звон в ушах (Concussion)",
        rule: "Сложность всех проверок Внимательности и Скрытности увеличена на 1.",
        example: "Рядом взорвалась граната Городской Стражи. Перед глазами плывут цветные круги, уши заложило гулом, и персонаж не слышит шагов подкрадывающегося сзади офицера."
      }
    ],
    major: [
      {
        name: "Тяжёлое Ранение / Сломанные кости (Broken Bones)",
        rule: "Вы навсегда теряете 1 постоянную ячейку сопротивления Крови до длительного хирургического или сакрального лечения.",
        example: "Удар алебарды аэльфирского рыцаря раздробил ключицу. Персонаж больше не может удерживать двуручное оружие, а любая новая атака грозит стать фатальной."
      },
      {
        name: "Внутреннее кровоизлияние (Internal Bleeding)",
        rule: "Каждый раз при получении стресса любого типа (даже по Разуму или Серебру) вы получаете +1 стресс по Крови.",
        example: "Отбитые легкие дают о себе знать: персонаж кашляет кровью не только в бою, но и когда нервничает на допросе или спорит на бирже."
      },
      {
        name: "Потеря сознания (Unconscious)",
        rule: "Персонаж падает без чувств до конца сцены или пока соратник не потратит действие на реанимацию.",
        example: "Потеряв слишком много крови, персонаж оседает на холодную брусчатку переулка. Соратникам приходится тащить его на себе сквозь оцепление."
      }
    ],
    severe: [
      {
        name: "Смертельное ранение (Mortal Wound)",
        rule: "Персонаж умирает через d6 раундов, если не применить высшую сакральную медицину Ладжанов.",
        example: "Пуля пробила грудную клетку навылет. Герой успевает сказать последние слова товарищам по ячейке и передать шифрованные бумаги восстания."
      },
      {
        name: "Калечащее увечье (Permanent Crippling)",
        rule: "Потеря конечности, слепота или паралич. Персонаж выбывает из строя как боец.",
        example: "Взрыв мортиры лишил персонажа правой руки. Если он выживет, ему придется заново учиться жить и переходить на штабную работу в Министерстве."
      }
    ]
  },
  mind: {
    minor: [
      {
        name: "Паранойя (Paranoia)",
        rule: "Вы не можете получать бонусные кости от помощи союзников при групповых действиях.",
        example: "После допроса в застенках Совета персонажу кажется, что даже соратники по ячейке смотрят на него с подозрением и готовы сдать за серебро."
      },
      {
        name: "Нервная дрожь (Tremors)",
        rule: "Любое действие, требующее мелкой моторики (взлом замков, прицеливание), получает сложность 1.",
        example: "Руки предательски трясутся от пережитого ужаса при встрече с порождением Сердца. Отмычка выскальзывает из пальцев и со звоном падает на пол."
      },
      {
        name: "Навязчивый шёпот (Obsessive Whispers)",
        rule: "-1d10 на все проверки с использованием сфер Академия или Порядок.",
        example: "В голове персонажа непрерывно звучит насмешливый голос, повторяющий имена его погибших предков и заглушающий речь собеседников."
      }
    ],
    major: [
      {
        name: "Панический психоз (Hysteria)",
        rule: "При виде опасности персонаж обязан немедленно бежать или забиться в угол.",
        example: "Увидев маску высшего магистра аэльфиров, дроу теряет контроль над собой, роняет заряженный пистоль и с диким криком бросается прочь."
      },
      {
        name: "Искажение реальности (Sensory Warp)",
        rule: "Мастер имеет право искажать для игрока описание окружающего мира, запахов и слов НИПов.",
        example: "Персонаж видит вместо лиц прохожих ухмыляющиеся стервятничьи клювы, а в шелесте ветра слышит приказы поджечь собственный дом."
      },
      {
        name: "Ретроградная амнезия (Amnesia)",
        rule: "Вы забываете события последних дней, имя ключевого связного или пароль от ячейки.",
        example: "Очнувшись в сыром подвале, персонаж не может вспомнить, кому он передал пакет с ядом и где находится явочная квартира."
      }
    ],
    severe: [
      {
        name: "Необратимое безумие (Complete Breakdown)",
        rule: "Разум персонажа окончательно ломается. Он переходит под управление Мастера.",
        example: "Погрузившись слишком глубоко в тайны Сердца, Мудрец осознает бессмысленность борьбы и растворяется в бесконечных туннелях, бормоча забытые формулы."
      }
    ]
  },
  silver: {
    minor: [
      {
        name: "Пустой кошель (Penniless)",
        rule: "У вас нет ни гроша. Вы не можете ничего купить или подкупить стражника до отдыха.",
        example: "В давке на Красном Рынке карманник срезал последний кошель. Приходится клянчить хлеб или рисковать, воруя в лавках."
      },
      {
        name: "Долг ростовщику (In Debt)",
        rule: "К вам приходят вышибалы синдиката с требованием вернуть долг с грабительским процентом.",
        example: "Двое громил из Серебряного Квартала ловят персонажа у подъезда: 'Ты задолжал господину Стольцу 50 монет. Завтра проценты вырастут вдвое'."
      }
    ],
    major: [
      {
        name: "Крупный долг мафии / Охота коллекторов",
        rule: "За вашу голову или имущество назначена награда криминальными гильдиями.",
        example: "Ростовщики продали ваш вексель гильдии охотников за головами. Теперь в темных переулках за персонажем следят арбалетчики."
      },
      {
        name: "Конфискация убежища (Foreclosure)",
        rule: "Власти или кредиторы арестовывают тайное убежище ячейки и всё снаряжение внутри.",
        example: "Придя на конспиративную квартиру, повстанцы обнаруживают на двери железную печать суда и вооруженный караул стражи."
      }
    ],
    severe: [
      {
        name: "Полное банкротство и долговая кабала",
        rule: "Вы абсолютно разорены. Закон аэльфиров обращает вас в долговое рабство.",
        example: "Имущество продано с молотка, счета заблокированы, а магистрат выписывает ордер на отправку персонажа на пожизненные каторжные Заводы."
      }
    ]
  },
  shadow: {
    minor: [
      {
        name: "Подозрение (Suspicion)",
        rule: "Сложность проверок Скрытности в этом районе увеличена на 1.",
        example: "Бдительный дворник заметил подозрительного дроу в дорогом плаще и шепнул квартальному надзирателю. Патрули начинают приглядываться к прохожим."
      },
      {
        name: "Хвост (Tailed)",
        rule: "За вами следует шпион аэльфиров или осведомитель другого культа.",
        example: "В витринах магазинов персонаж то и дело замечает одного и того же человека в сером картузе, держащегося на расстоянии пятидесяти шагов."
      }
    ],
    major: [
      {
        name: "Штурм конспиративной квартиры (Raid)",
        rule: "Одно из убежищ вашей ячейки рассекречено и прямо сейчас штурмуется карателями.",
        example: "Звук выбиваемой двери и свист пуль: Багровая Стража ворвалась в подвал пекарни. Приходится сжигать архивы и прыгать в окно."
      },
      {
        name: "Ориентировка с портретом (Wanted Poster)",
        rule: "Ваш портрет расклеен на всех углах. Появление на улицах грозит немедленным задержанием.",
        example: "Городские глашатаи зачитывают описание внешности персонажа, обещая 100 серебряных монет за любую информацию о его местонахождении."
      }
    ],
    severe: [
      {
        name: "Провал ячейки (Burned Out)",
        rule: "Министерство официально объявляет вас скомпрометированным. Вас казнят власти либо устранят свои же.",
        example: "Все связи оборваны, явки закрыты. Связной оставляет в тайнике одну пулю с выгравированным знаком сойки: спасти организацию можно только молчанием."
      }
    ]
  },
  reputation: {
    minor: [
      {
        name: "Грязные слухи (Scandal)",
        rule: "Проверки Принуждения и Обмана получают сложность 1 в этом сообществе.",
        example: "По району разошелся слух, что персонаж присвоил общие деньги или струсил в решающей драке. Соседи отводят глаза при встрече."
      },
      {
        name: "Остракизм (Shunned)",
        rule: "Местные жители отказываются говорить с вами или пускать на порог.",
        example: "Хозяин трактира 'Убитый Вол' заявляет: 'Таким, как ты, здесь не наливают. Убирайся, пока парни не выкинули тебя через перила'."
      }
    ],
    major: [
      {
        name: "Клеймо предателя (Branded Traitor)",
        rule: "Вас официально изгоняют из общины, гильдии или ордена. Поддержка аннулирована.",
        example: "Рыцари Северных Доков ломают меч персонажа на турнирной площади и срезают родовые знаки с его лат. Путь в доки для него закрыт."
      }
    ],
    severe: [
      {
        name: "Проклятый народом (Pariah)",
        rule: "Любой дроу плюнет вам под ноги, а бывшие друзья готовы сдать вас стражникам.",
        example: "Ваше имя становится синонимом предательства. Даже родная семья публично отрекается от вас перед алтарем Лунной Богини."
      }
    ]
  }
};

export const RulesAndTools: React.FC = () => {
  const { route, navigate } = useRouter();
  const { isGoingDark } = useTheme();
  const selectedResistance = route.rulesResistance || 'blood';
  const [selectedSeverity, setSelectedSeverity] = useState<'minor' | 'major' | 'severe'>('minor');

  const resistances = rulesData.resistances;
  const currentFalloutList = DETAILED_FALLOUTS[selectedResistance]?.[selectedSeverity] || [];

  return (
    <div className={`space-y-10 ${isGoingDark ? 'text-[#e2e8f0]' : 'text-[#e0dacf]'}`}>
      {/* Intro Header */}
      <div
        className={`spire-banner relative overflow-hidden p-6 sm:p-8 ${
          isGoingDark
            ? 'bg-gradient-to-r from-[#0d1730] via-[#091124] to-[#060b17] border-2 border-black shadow-[6px_6px_0px_#000000]'
            : 'bg-gradient-to-r from-[#2a0e14] via-[#161622] to-[#0d0e14] border border-[#521c27] rounded-2xl shadow-xl'
        }`}
      >
        {isGoingDark && (
          <div className="spire-ink-hatch absolute inset-y-0 right-0 w-1/3 pointer-events-none opacity-45" />
        )}
        <div className="relative z-10">
          {isGoingDark && (
            <div className="flex flex-wrap items-center gap-2 mb-2.5">
              <span className="spire-archive-stamp">ПОЛЕВОЕ РУКОВОДСТВО</span>
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#7dd3fc]">
                ПРОТОКОЛЫ ОПЕРАТИВНИКА
              </span>
            </div>
          )}
          <div className="flex items-center gap-2 mb-2">
            <BookOpen className={isGoingDark ? 'text-[#38bdf8]' : 'text-[#e64c65]'} size={30} />
            <h2
              className={`text-2xl sm:text-3xl font-heading font-bold ${
                isGoingDark ? 'text-[#f0f6ff] tracking-wide' : 'text-[#e5b83b]'
              }`}
            >
              Справочник Механик, Сложности и Последствий
            </h2>
          </div>
          <p
            className={`text-sm sm:text-base max-w-3xl leading-relaxed ${
              isGoingDark ? 'text-[#cbd5e1]' : 'text-[#ccc5b8]'
            }`}
          >
            В Spire все проверки строятся на броске d10, где учитывается наивысшая кость. Когда персонаж рискует или терпит неудачу, он накапливает <strong>Стресс</strong> по одной из 5 характеристик сопротивления. Каждый раз при получении стресса Мастер бросает d10: если результат меньше накопленного стресса — наступает конкретное нарративное <strong>Последствие</strong>.
          </p>
        </div>
      </div>

      {/* 1. SECTION: DIFFICULTY & DICE RESOLUTION */}
      <div
        className={`p-6 sm:p-8 space-y-6 ${
          isGoingDark
            ? 'spire-card-shell bg-[#081022] border-2 border-black shadow-[6px_6px_0px_#000000]'
            : 'bg-[#12141c] border border-[#3d2b0e] rounded-2xl shadow-xl'
        }`}
      >
        <div className={`border-b pb-4 ${isGoingDark ? 'border-black' : 'border-[#252838]'}`}>
          <h3
            className={`text-xl font-heading font-bold flex items-center gap-2 ${
              isGoingDark ? 'text-[#f0f6ff]' : 'text-[#e5b83b]'
            }`}
          >
            <Layers className={isGoingDark ? 'text-[#38bdf8]' : 'text-[#c59b27]'} size={22} />
            1. Градация Сложности и Механика Броска
          </h3>
          <p className={`text-xs mt-1 ${isGoingDark ? 'text-[#94a3b8]' : 'text-[#959085]'}`}>
            Как рассчитывается пул костей и как сложность задачи меняет правила игры.
          </p>
        </div>

        {/* Difficulty Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div
            className={`p-4 space-y-2 ${
              isGoingDark
                ? 'bg-[#0b1326] border-2 border-black shadow-[4px_4px_0px_#000000]'
                : 'rounded-xl bg-[#161824] border border-[#262c3e]'
            }`}
          >
            <div className="flex items-center justify-between gap-2">
              <span className="font-heading font-bold text-sm text-[#86efac]">
                Сложность 0 (Стандартная)
              </span>
              <span
                className={`text-xs font-mono px-2 py-0.5 ${
                  isGoingDark
                    ? 'bg-[#062417] text-[#86efac] border border-black'
                    : 'rounded bg-[#14261b] text-[#86efac]'
                }`}
              >
                Без штрафов
              </span>
            </div>
            <p className={`text-xs leading-relaxed ${isGoingDark ? 'text-[#cbd5e1]' : 'text-[#c5beb3]'}`}>
              Обычная проверка в спокойной обстановке, где у персонажа есть базовые шансы на успех.
            </p>
            <div
              className={`text-[11px] border-t pt-2 ${
                isGoingDark ? 'text-[#94a3b8] border-black/80' : 'text-[#878072] border-[#222634]'
              }`}
            >
              <strong>Примеры:</strong> взлом хлипкого замка в Дереликтусе; покупка патронов у знакомого торговца; рукопашная драка один на один в переулке.
            </div>
          </div>

          <div
            className={`p-4 space-y-2 ${
              isGoingDark
                ? 'bg-[#0b1326] border-2 border-black shadow-[4px_4px_0px_#000000]'
                : 'rounded-xl bg-[#161824] border border-[#3d321b]'
            }`}
          >
            <div className="flex items-center justify-between gap-2">
              <span className="font-heading font-bold text-sm text-[#fcd34d]">
                Сложность 1 (Сложная)
              </span>
              <span
                className={`text-xs font-mono px-2 py-0.5 ${
                  isGoingDark
                    ? 'bg-[#241b08] text-[#fcd34d] border border-black'
                    : 'rounded bg-[#2b2413] text-[#fcd34d]'
                }`}
              >
                -1d10 из пула
              </span>
            </div>
            <p className={`text-xs leading-relaxed ${isGoingDark ? 'text-[#cbd5e1]' : 'text-[#c5beb3]'}`}>
              Действие совершается под давлением, против подготовленного врага или в неблагоприятных условиях.
            </p>
            <div
              className={`text-[11px] border-t pt-2 ${
                isGoingDark ? 'text-[#94a3b8] border-black/80' : 'text-[#878072] border-[#222634]'
              }`}
            >
              <strong>Примеры:</strong> взлом сейфа, когда по коридору приближаются шаги патруля; стрельба сквозь ядовитый дым Заводов; побег от стражи по скользким крышам во время дождя.
            </div>
          </div>

          <div
            className={`p-4 space-y-2 ${
              isGoingDark
                ? 'bg-[#0b1326] border-2 border-black shadow-[4px_4px_0px_#000000]'
                : 'rounded-xl bg-[#161824] border border-[#521c27]'
            }`}
          >
            <div className="flex items-center justify-between gap-2">
              <span className="font-heading font-bold text-sm text-[#fca5a5]">
                Сложность 2 (Крайне сложная)
              </span>
              <span
                className={`text-xs font-mono px-2 py-0.5 ${
                  isGoingDark
                    ? 'bg-[#280b16] text-[#fda4af] border border-black'
                    : 'rounded bg-[#2b1218] text-[#fca5a5]'
                }`}
              >
                -2d10 из пула
              </span>
            </div>
            <p className={`text-xs leading-relaxed ${isGoingDark ? 'text-[#cbd5e1]' : 'text-[#c5beb3]'}`}>
              Почти невозможная задача, сопротивление элитного противника или смертельно опасная среда.
            </p>
            <div
              className={`text-[11px] border-t pt-2 ${
                isGoingDark ? 'text-[#94a3b8] border-black/80' : 'text-[#878072] border-[#222634]'
              }`}
            >
              <strong>Примеры:</strong> попытка обмануть верховного судью аэльфиров в зале суда; прыжок через 15-метровую пропасть в Насесте при ураганном ветре; атака паладинов в лоб.
            </div>
          </div>
        </div>

        {/* Negative Pool Step Downgrade Rule */}
        <div
          className={`p-4 flex items-start gap-3 ${
            isGoingDark
              ? 'bg-[#140d24] border-2 border-black shadow-[4px_4px_0px_#000000]'
              : 'bg-[#1a141e] rounded-xl border border-[#482b40]'
          }`}
        >
          <AlertTriangle
            className={`mt-0.5 flex-shrink-0 ${isGoingDark ? 'text-[#38bdf8]' : 'text-[#e5b83b]'}`}
            size={20}
          />
          <div className="text-xs space-y-1">
            <h4
              className={`font-bold uppercase tracking-wider ${
                isGoingDark ? 'font-mono text-[#7dd3fc]' : 'font-heading text-[#e5b83b]'
              }`}
            >
              Важнейшее правило: Отрицательный пул костей
            </h4>
            <p className={`leading-relaxed ${isGoingDark ? 'text-[#cbd5e1]' : 'text-[#c5beb3]'}`}>
              Если штраф за сложность опускает ваш пул до 0 или ниже, <strong>вы всё равно бросаете 1 кость d10</strong>. Однако за каждое очко сложности ниже нуля результат сдвигается на одну ступень вниз в таблице исходов:
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-2 text-[11px] font-mono">
              <span
                className={`px-2 py-0.5 ${
                  isGoingDark
                    ? 'bg-[#040812] text-[#7dd3fc] border border-black'
                    : 'rounded bg-[#261f12] text-[#f0cb78]'
                }`}
              >
                Выпало 10 ➔ Считается как 8-9 (Успех)
              </span>
              <span>➔</span>
              <span
                className={`px-2 py-0.5 ${
                  isGoingDark
                    ? 'bg-[#040812] text-[#fdba74] border border-black'
                    : 'rounded bg-[#261d12] text-[#fdba74]'
                }`}
              >
                Выпало 8-9 ➔ Считается как 6-7 (Успех ценой)
              </span>
              <span>➔</span>
              <span
                className={`px-2 py-0.5 ${
                  isGoingDark
                    ? 'bg-[#1a0a16] text-[#fda4af] border border-black'
                    : 'rounded bg-[#291218] text-[#fca5a5]'
                }`}
              >
                Выпало 6-7 ➔ Считается как 2-5 (Провал)
              </span>
            </div>
          </div>
        </div>

        {/* Table of Results */}
        <div className="overflow-x-auto">
          <table
            className={`w-full text-left text-xs overflow-hidden ${
              isGoingDark
                ? 'border-2 border-black shadow-[4px_4px_0px_#000000]'
                : 'border border-[#252838] rounded-xl'
            }`}
          >
            <thead
              className={`uppercase text-[10px] ${
                isGoingDark
                  ? 'bg-[#03050b] text-[#7dd3fc] font-mono'
                  : 'bg-[#161824] text-[#c59b27] font-heading'
              }`}
            >
              <tr>
                <th className={`p-3 border-b ${isGoingDark ? 'border-b-2 border-black' : 'border-[#252838]'}`}>
                  Наивысшая кость
                </th>
                <th className={`p-3 border-b ${isGoingDark ? 'border-b-2 border-black' : 'border-[#252838]'}`}>
                  Исход проверки
                </th>
                <th className={`p-3 border-b ${isGoingDark ? 'border-b-2 border-black' : 'border-[#252838]'}`}>
                  Стресс персонажу
                </th>
                <th className={`p-3 border-b ${isGoingDark ? 'border-b-2 border-black' : 'border-[#252838]'}`}>
                  Описание результата
                </th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isGoingDark ? 'divide-black' : 'divide-[#222536]'}`}>
              <tr className={isGoingDark ? 'bg-[#081022]' : 'bg-[#12141c]'}>
                <td className="p-3 font-mono font-bold text-[#f87171]">1</td>
                <td className="p-3 font-heading font-semibold text-[#f87171]">Критический провал</td>
                <td className="p-3 font-bold text-[#f87171]">ДВОЙНОЙ стресс</td>
                <td className={`p-3 ${isGoingDark ? 'text-[#cbd5e1]' : 'text-[#c5beb3]'}`}>
                  Катастрофическая неудача. Оружие ломается, позиция раскрыта, урон удваивается.
                </td>
              </tr>
              <tr className={isGoingDark ? 'bg-[#0b152c]' : 'bg-[#141620]'}>
                <td className="p-3 font-mono font-bold text-[#fca5a5]">2 – 5</td>
                <td className="p-3 font-heading font-semibold text-[#fca5a5]">Провал</td>
                <td className="p-3 text-[#fca5a5]">Обычный стресс</td>
                <td className={`p-3 ${isGoingDark ? 'text-[#cbd5e1]' : 'text-[#c5beb3]'}`}>
                  Действие не удалось. Вы получаете стресс от текущей ситуации или врага.
                </td>
              </tr>
              <tr className={isGoingDark ? 'bg-[#081022]' : 'bg-[#12141c]'}>
                <td className="p-3 font-mono font-bold text-[#fcd34d]">6 – 7</td>
                <td className="p-3 font-heading font-semibold text-[#fcd34d]">Успех, но ценой</td>
                <td className="p-3 text-[#fcd34d]">Обычный стресс</td>
                <td className={`p-3 ${isGoingDark ? 'text-[#cbd5e1]' : 'text-[#c5beb3]'}`}>
                  Вы добиваетесь цели, но платите за это: получаете стресс от напряжения или врага.
                </td>
              </tr>
              <tr className={isGoingDark ? 'bg-[#0b152c]' : 'bg-[#141620]'}>
                <td className="p-3 font-mono font-bold text-[#86efac]">8 – 9</td>
                <td className="p-3 font-heading font-semibold text-[#86efac]">Чистый успех</td>
                <td className="p-3 text-[#86efac]">Без стресса</td>
                <td className={`p-3 ${isGoingDark ? 'text-[#cbd5e1]' : 'text-[#c5beb3]'}`}>
                  Безупречный результат. Задача выполнена, стресса нет.
                </td>
              </tr>
              <tr className={isGoingDark ? 'bg-[#081022]' : 'bg-[#12141c]'}>
                <td className={`p-3 font-mono font-bold ${isGoingDark ? 'text-[#38bdf8]' : 'text-[#e5b83b]'}`}>10</td>
                <td className={`p-3 font-heading font-semibold ${isGoingDark ? 'text-[#38bdf8]' : 'text-[#e5b83b]'}`}>
                  Критический успех
                </td>
                <td className={`p-3 ${isGoingDark ? 'text-[#7dd3fc]' : 'text-[#e5b83b]'}`}>Без стресса (+1 цели)</td>
                <td className={`p-3 ${isGoingDark ? 'text-[#cbd5e1]' : 'text-[#c5beb3]'}`}>
                  Триумф. Если вы наносите урон врагу, добавьте +1 стресс за каждую 10 на костях.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 2. SECTION: INTERACTIVE FALLOUT ATLAS */}
      <div
        className={`p-6 sm:p-8 space-y-6 ${
          isGoingDark
            ? 'spire-card-shell bg-[#081022] border-2 border-black shadow-[6px_6px_0px_#000000]'
            : 'bg-[#12141c] border border-[#521c27] rounded-2xl shadow-xl'
        }`}
      >
        <div
          className={`border-b pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 ${
            isGoingDark ? 'border-black' : 'border-[#252838]'
          }`}
        >
          <div>
            <h3
              className={`text-xl font-heading font-bold flex items-center gap-2 ${
                isGoingDark ? 'text-[#f0f6ff]' : 'text-[#e5b83b]'
              }`}
            >
              <Skull className={isGoingDark ? 'text-[#f43f5e]' : 'text-[#e64c65]'} size={22} />
              2. Интерактивный Атлас Последствий
            </h3>
            <p className={`text-xs mt-1 ${isGoingDark ? 'text-[#94a3b8]' : 'text-[#959085]'}`}>
              Выберите характеристику сопротивления и степень тяжести, чтобы увидеть правила и нарративные примеры из игры.
            </p>
          </div>

          {/* Severity selector */}
          <div
            className={`flex p-1 flex-shrink-0 ${
              isGoingDark
                ? 'bg-[#03050b] border-2 border-black shadow-[3px_3px_0px_#000000]'
                : 'bg-[#0b0c10] rounded-xl border border-[#2e3346]'
            }`}
          >
            {(['minor', 'major', 'severe'] as const).map(sev => (
              <button
                key={sev}
                onClick={() => setSelectedSeverity(sev)}
                className={`px-3 py-1.5 text-xs font-semibold transition-colors ${
                  isGoingDark
                    ? selectedSeverity === sev
                      ? 'font-mono bg-[#b91c1c] text-white border border-black'
                      : 'font-mono text-[#94a3b8] hover:text-white'
                    : selectedSeverity === sev
                      ? 'rounded-lg font-heading bg-[#780016] text-white shadow'
                      : 'rounded-lg font-heading text-[#959085] hover:text-[#e0dacf]'
                }`}
              >
                {sev === 'minor' ? 'Лёгкое (-3 стресса)' : sev === 'major' ? 'Среднее (-5 стресса)' : 'Критическое (-7)'}
              </button>
            ))}
          </div>
        </div>

        {/* Resistance Tabs */}
        <div className="flex flex-wrap gap-2">
          {resistances.map(res => (
            <button
              key={res.id}
              onClick={() => navigate({ tab: 'rules', rulesResistance: res.id }, { replace: true })}
              className={`px-4 py-2 text-xs font-semibold transition-all border ${
                isGoingDark
                  ? selectedResistance === res.id
                    ? 'font-mono bg-[#b91c1c] text-white border-2 border-black shadow-[3px_3px_0px_#000000]'
                    : 'font-mono bg-[#0b152c] text-[#94a3b8] border-2 border-black hover:text-white hover:border-[#38bdf8]'
                  : selectedResistance === res.id
                    ? 'rounded-xl font-heading bg-[#2b1016] text-[#f2aab8] border-[#780016] shadow-md'
                    : 'rounded-xl font-heading bg-[#151722] text-[#959085] border-[#25293b] hover:text-[#e0dacf] hover:bg-[#1b1f2e]'
              }`}
            >
              {res.nameRu} ({res.nameEn})
            </button>
          ))}
        </div>

        {/* Fallout Cards Grid with Narrative Examples */}
        <div className="space-y-4">
          <div
            className={`flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs ${
              isGoingDark ? 'text-[#94a3b8]' : 'text-[#959085]'
            }`}
          >
            <span>
              Тип сопротивления:{' '}
              <strong className="text-white">{resistances.find(r => r.id === selectedResistance)?.nameRu}</strong> —{' '}
              {resistances.find(r => r.id === selectedResistance)?.desc}
            </span>
            <span className={`font-mono ${isGoingDark ? 'text-[#7dd3fc]' : 'text-[#e5b83b]'}`}>
              {selectedSeverity === 'minor' ? 'Снимает 3 стресса' : selectedSeverity === 'major' ? 'Снимает 5 стресса' : 'Снимает 7 стресса / выбывание'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {currentFalloutList.map((fo, idx) => (
              <div
                key={idx}
                className={`p-5 transition-colors flex flex-col justify-between space-y-3 ${
                  isGoingDark
                    ? 'bg-[#0b1326] border-2 border-black hover:border-[#e11d48] shadow-[4px_4px_0px_#000000]'
                    : 'rounded-2xl bg-[#161824] border border-[#2b2f42] hover:border-[#780016]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <h4
                      className={`font-heading font-bold text-sm ${
                        isGoingDark ? 'text-[#fda4af]' : 'text-[#f2aab8]'
                      }`}
                    >
                      {fo.name}
                    </h4>
                    <span
                      className={`text-[10px] uppercase font-mono px-1.5 py-0.5 ${
                        isGoingDark
                          ? 'bg-[#b91c1c] text-white border border-black'
                          : 'rounded bg-[#2a1016] text-[#e66a7b]'
                      }`}
                    >
                      {selectedSeverity}
                    </span>
                  </div>

                  <div
                    className={`text-xs sm:text-sm font-medium mb-3 pb-2 border-b ${
                      isGoingDark ? 'text-[#e2e8f0] border-black' : 'text-[#e0dacf] border-[#232738]'
                    }`}
                  >
                    {fo.rule}
                  </div>

                  <div
                    className={`p-3.5 text-sm sm:text-base font-flavor italic leading-relaxed ${
                      isGoingDark
                        ? 'bg-[#040812] border-2 border-black border-l-4 border-l-[#38bdf8] text-[#e2e8f0]'
                        : 'bg-[#0f1118] rounded-xl border border-[#222638] text-[#e8e2d5]'
                    }`}
                  >
                    <span
                      className={`block not-italic text-xs uppercase tracking-wider mb-1.5 font-semibold ${
                        isGoingDark ? 'font-mono text-[#7dd3fc]' : 'font-heading text-[#c59b27]'
                      }`}
                    >
                      Пример за столом:
                    </span>
                    «{fo.example}»
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. SECTION: STRESS REMOVAL & BONDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div
          className={`p-6 space-y-4 ${
            isGoingDark
              ? 'spire-card-shell bg-[#081022] border-2 border-black shadow-[6px_6px_0px_#000000]'
              : 'bg-[#12141c] border border-[#3d2b0e] rounded-2xl shadow-xl'
          }`}
        >
          <h3
            className={`text-lg font-heading font-bold flex items-center gap-2 ${
              isGoingDark ? 'text-[#f0f6ff]' : 'text-[#e5b83b]'
            }`}
          >
            <Heart className={isGoingDark ? 'text-[#f43f5e]' : 'text-[#e64c65]'} size={20} />
            Снятие Стресса (Stress Relief)
          </h3>
          <p className={`text-xs leading-relaxed ${isGoingDark ? 'text-[#cbd5e1]' : 'text-[#ccc5b8]'}`}>
            Стресс — это абстрактное давление, которое превращается в конкретные травмы при наступлении Последствий. Персонажи могут целенаправленно избавляться от стресса тремя путями:
          </p>
          <ul className="space-y-3 text-xs">
            <li
              className={`p-3 ${
                isGoingDark
                  ? 'bg-[#040812] border-2 border-black shadow-[3px_3px_0px_#000000]'
                  : 'bg-[#181a24] rounded-xl border border-[#25293b]'
              }`}
            >
              <strong
                className={`font-heading block mb-1 ${isGoingDark ? 'text-[#7dd3fc]' : 'text-[#e5b83b]'}`}
              >
                1. Залечь на дно (Lie Low)
              </strong>
              Снимает <strong>весь</strong> накопленный стресс. Однако персонаж полностью выпадает из сюжета на несколько дней, а враги и сюжет развиваются бесконтрольно.
            </li>
            <li
              className={`p-3 ${
                isGoingDark
                  ? 'bg-[#040812] border-2 border-black shadow-[3px_3px_0px_#000000]'
                  : 'bg-[#181a24] rounded-xl border border-[#25293b]'
              }`}
            >
              <strong
                className={`font-heading block mb-1 ${isGoingDark ? 'text-[#7dd3fc]' : 'text-[#e5b83b]'}`}
              >
                2. Сброс напряжения (Blow Off Steam)
              </strong>
              Посещение подпольного доктора (Кровь), ростовщика (Серебро) или церковной исповедальни (Разум). Снимает <strong>d3, d6 или d8</strong> стресса в зависимости от потраченных ресурсов.
            </li>
            <li
              className={`p-3 ${
                isGoingDark
                  ? 'bg-[#040812] border-2 border-black shadow-[3px_3px_0px_#000000]'
                  : 'bg-[#181a24] rounded-xl border border-[#25293b]'
              }`}
            >
              <strong
                className={`font-heading block mb-1 ${isGoingDark ? 'text-[#7dd3fc]' : 'text-[#e5b83b]'}`}
              >
                3. Отдушина (Refresh)
              </strong>
              Совершение действия, уникального для вашего класса или дополнительного продвижения (например, пьяный дебош Рыцаря или выгодная сделка Азурита). Снимает <strong>d3, d6 или d8</strong> стресса.
            </li>
          </ul>
        </div>

        <div
          className={`p-6 space-y-4 ${
            isGoingDark
              ? 'spire-card-shell bg-[#081022] border-2 border-black shadow-[6px_6px_0px_#000000]'
              : 'bg-[#12141c] border border-[#3d2b0e] rounded-2xl shadow-xl'
          }`}
        >
          <h3
            className={`text-lg font-heading font-bold flex items-center gap-2 ${
              isGoingDark ? 'text-[#f0f6ff]' : 'text-[#e5b83b]'
            }`}
          >
            <Users className={isGoingDark ? 'text-[#38bdf8]' : 'text-[#c59b27]'} size={20} />
            Связи, Группы и Типы Магии
          </h3>
          
          <div className="space-y-3 text-xs">
            <div
              className={`p-3 ${
                isGoingDark
                  ? 'bg-[#040812] border-2 border-black shadow-[3px_3px_0px_#000000]'
                  : 'bg-[#181a24] rounded-xl border border-[#25293b]'
              }`}
            >
              <h4 className={`font-heading font-bold mb-1 ${isGoingDark ? 'text-[#7dd3fc]' : 'text-[#e5b83b]'}`}>
                Групповые Проверки
              </h4>
              <p className={`leading-relaxed ${isGoingDark ? 'text-[#cbd5e1]' : 'text-[#c5beb3]'}`}>
                За каждого напарника с подходящим навыком или сферой добавьте +1d10 к пулу. Но в случае неудачи напарники получают такой же стресс! При скрытных операциях выбирается Лидер группы: его успех дарует остальным Мастерство.
              </p>
            </div>

            <div
              className={`p-3 ${
                isGoingDark
                  ? 'bg-[#040812] border-2 border-black shadow-[3px_3px_0px_#000000]'
                  : 'bg-[#181a24] rounded-xl border border-[#25293b]'
              }`}
            >
              <h4 className={`font-heading font-bold mb-1 ${isGoingDark ? 'text-[#7dd3fc]' : 'text-[#e5b83b]'}`}>
                Сакральная vs Оккультная Магия
              </h4>
              <p className={`leading-relaxed ${isGoingDark ? 'text-[#cbd5e1]' : 'text-[#c5beb3]'}`}>
                <strong>Сакральная магия (Divine)</strong> санкционирована богами и не требует броска на сотворение: вы просто отмечаете стресс и применяете эффект. <br />
                <strong>Оккультная магия (Occult)</strong> взламывает ткань реальности: требует броска d10, а при неудаче наносит минимум d6 стресса.
              </p>
            </div>

            <div
              className={`p-3 ${
                isGoingDark
                  ? 'bg-[#040812] border-2 border-black shadow-[3px_3px_0px_#000000]'
                  : 'bg-[#181a24] rounded-xl border border-[#25293b]'
              }`}
            >
              <h4 className={`font-heading font-bold mb-1 ${isGoingDark ? 'text-[#7dd3fc]' : 'text-[#e5b83b]'}`}>
                Уровни Связей (Bonds)
              </h4>
              <p className={`leading-relaxed ${isGoingDark ? 'text-[#cbd5e1]' : 'text-[#c5beb3]'}`}>
                • <strong>Личные (Individual):</strong> конкретный союзник, друг или должник.<br />
                • <strong>Уличные (Street):</strong> банда, цех или община района.<br />
                • <strong>Городские (City):</strong> синдикат, влиятельная гильдия или фракция Совета.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
